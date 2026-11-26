'use server'
import { revalidatePath } from "next/cache";
import { protectedMutation } from "../core/server";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export const updateUserRole = async (userId: string, role: "customer" | "vendor" | "admin") => {
    const api = `${BASE_URL}/users/${userId}/role`;
    const response = await protectedMutation(api, "PATCH", { role });
    return response.json();
}

export const toggleUserBlock = async (userId: string, isBlocked: boolean) => {
    const api = `${BASE_URL}/users/${userId}/block`;
    const response = await protectedMutation(api, "PATCH", { isBlocked });
    return response.json();
}

export const syncVendorServicesProfile = async () => {
    const api = `${BASE_URL}/users/profile/sync`;
    const response = await protectedMutation(api, "PATCH");
    if (response.ok) {
        revalidatePath("/services");
        revalidatePath("/dashboard/vendor/my-services");
    }
    return response.json();
}