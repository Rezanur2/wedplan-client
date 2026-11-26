import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";


export const getSession = async () => {
    "use server";
    const session = await auth.api.getSession({
        headers: await headers(),
        query: { disableCookieCache: true },
    })
    return session;
}

export const getToken = async () => {
    const session = await getSession();
    if (!session) {
        redirect("/signin");
    }
    const requestHeaders = await headers();
    const tokenResponse = await auth.api.getToken({
        headers: requestHeaders,
    });
    if (!tokenResponse?.token) {
        redirect("/unauthorized");
    }
    return tokenResponse.token;
}

export const authFetch = async (api: string) => {
    const token = await getToken();
    const res = await fetch(api, {
        headers: {
            authorization: `Bearer ${token}`
        },
        cache: "no-store",
    })
    return res;
}

export const protectedMutation = async (api: string, method: string, data?: unknown) => {
    const token = await getToken();
    const res = await fetch(api, {
        method: method,
        headers: {
            'content-type': 'application/json',
            authorization: `Bearer ${token}`
        },
        body: data ? JSON.stringify(data) : null
    })
    if (res.status === 401) {
        redirect("/signin");
    }
    return res;
}

export const requireRole = async (role: string) => {
    const session = await getSession();
    if (!session?.user) {
        redirect("/signin");
    }
    const userRole = (session.user.role || "").toLowerCase();
    if (userRole !== role.toLowerCase() || session?.user.isBlocked) {
        redirect("/unauthorized");
    }
    return session;
}