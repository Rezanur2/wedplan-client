'use server'
import { ServiceFormData } from "@/types";
import { protectedMutation } from "../core/server";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

export const createService = async (data: ServiceFormData) => {
    const api = `${BASE_URL}/services`;
    const response = await protectedMutation(api, "POST", data)
    return response.json();
}

export const deleteService = async (serviceId: string) => {
    const api = `${BASE_URL}/services/${serviceId}`;
    const response = await protectedMutation(api, "DELETE");
    return response.json();
}

export const updateService = async (serviceId: string, data: Partial<ServiceFormData>) => {
    const api = `${BASE_URL}/services/${serviceId}`;
    const response = await protectedMutation(api, "PATCH", data)
    return response.json();
}

export const getServicesCount = async (query = ""): Promise<{ count: number }> => {
    const url = query ? `${BASE_URL}/services/count?${query}` : `${BASE_URL}/services/count`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return { count: 0 };
    return res.json();
}
