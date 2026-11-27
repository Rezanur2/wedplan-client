import { APIError, betterAuth } from "better-auth";
import { getOAuthState } from "better-auth/api";
import { MongoClient, ObjectId } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";

const client = new MongoClient(process.env.BETTER_AUTH_DB_URI as string, {
    maxPoolSize: 10,
    minPoolSize: 0,
    maxIdleTimeMS: 15000,
    serverSelectionTimeoutMS: 10000,
});
const db = client.db('wedplandb');

export async function connectAuthDB() {
    await client.connect();
}

export const auth = betterAuth({
    emailAndPassword: {
        enabled: true,
        minPasswordLength: 6,
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },
    plugins: [jwt()],
    session: {
        cookieCache: {
            enabled: true,
            strategy: "jwt",
            maxAge: 60,
        },
    },

    user: {
        additionalFields: {
            role: {
                type: ['customer', 'vendor', 'admin'],
                input: true,
                defaultValue: 'customer'
            },
            businessName: {
                type: 'string',
                input: true,
                required: false,
            },
            isBlocked: {
                type: 'boolean',
                defaultValue: false,
                input: false,
            },
            subscriptionPlan: {
                type: 'string',
                defaultValue: 'free',
                input: false,
            },
            subscriptionExpiresAt: {
                type: 'date',
                required: false,
                input: false,
            },
        }
    },
    databaseHooks: {
        user: {
            create: {
                before: async (newUser) => {
                    const oauthState = await getOAuthState().catch(() => null);
                    const oauthRole =
                        typeof oauthState?.role === "string"
                            ? oauthState.role.toLowerCase()
                            : undefined;
                    const resolvedRole = oauthRole ?? newUser.role;

                    if (resolvedRole !== "customer" && resolvedRole !== "vendor") {
                        throw new APIError("FORBIDDEN", {
                            message: "Only customer or vendor accounts can be created.",
                        });
                    }

                    if (oauthRole) {
                        return {
                            data: {
                                ...newUser,
                                role: resolvedRole,
                            },
                        };
                    }
                },
            },

            update: {
                before: async (updatedFields) => {
                    const isTryingToChangeRole = updatedFields.role !== undefined;

                    if (isTryingToChangeRole) {
                        throw new APIError("FORBIDDEN", {
                            message: "You cannot change your own role.",
                        });
                    }
                },
            },
        },

        session: {
            create: {
                before: async (newSession) => {
                    if (!ObjectId.isValid(newSession.userId)) return;
                    const userId = new ObjectId(newSession.userId);
                    const userRecord = await db.collection("user").findOne({ _id: userId });

                    if (userRecord?.isBlocked) {
                        throw new APIError("FORBIDDEN", {
                            code: "ACCOUNT_BLOCKED",
                            message: "Your account has been blocked by an administrator.",
                        });
                    }
                },
            },
        },
    },
    database: mongodbAdapter(db, {
        client,
    }),
});