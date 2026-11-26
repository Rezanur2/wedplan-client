'use server'
import { revalidatePath } from "next/cache";
import { ServiceFormData } from "@/types";
import { authFetch, protectedMutation } from "../core/server";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

export const createService = async (data: ServiceFormData) => {
    const api = `${BASE_URL}/services`;
    const response = await protectedMutation(api, "POST", data);
    const result = await response.json();
    if (response.ok) {
        revalidatePath("/dashboard/vendor/my-services");
        revalidatePath("/dashboard/vendor");
        revalidatePath("/dashboard/vendor/add-service");
    }
    return result;
}

export const deleteService = async (serviceId: string) => {
    const api = `${BASE_URL}/services/${serviceId}`;
    const response = await protectedMutation(api, "DELETE");
    const result = await response.json();
    if (response.ok) {
        revalidatePath("/dashboard/vendor/my-services");
        revalidatePath("/dashboard/vendor");
        revalidatePath("/services");
    }
    return result;
}

export const updateService = async (serviceId: string, data: Partial<ServiceFormData>) => {
    const api = `${BASE_URL}/services/${serviceId}`;
    const response = await protectedMutation(api, "PATCH", data);
    const result = await response.json();
    if (response.ok) {
        revalidatePath("/dashboard/vendor/my-services");
        revalidatePath("/dashboard/vendor");
        revalidatePath("/dashboard/admin/manage-services");
        revalidatePath("/services");
    }
    return result;
}

export const getServicesCount = async (query = ""): Promise<{ count: number }> => {
    const url = query ? `${BASE_URL}/services/count?${query}` : `${BASE_URL}/services/count`;
    const res = await authFetch(url);
    if (!res.ok) return { count: 0 };
    return res.json();
}

// Get all services for Admin (includes pending, active, rejected)
export const getAdminServices = async () => {
    try {
        const api = `${BASE_URL}/admin/services`;
        const res = await authFetch(api);
        if (!res.ok) return [];
        return await res.json();
    } catch (error) {
        console.error("Error fetching admin services:", error);
        return [];
    }
}
