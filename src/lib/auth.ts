import { APIError, betterAuth } from "better-auth";
import { MongoClient, ObjectId } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";

const client = new MongoClient(process.env.BETTER_AUTH_DB_URI as string);
const db = client.db('wedplandb');

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
                    const isCustomer = newUser.role === "customer";
                    const isVendor = newUser.role === "vendor";

                    if (!isCustomer && !isVendor) {
                        throw new APIError("FORBIDDEN", {
                            message: "Only customer or vendor accounts can be created.",
                        });
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