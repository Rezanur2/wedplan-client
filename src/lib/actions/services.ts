import { ServiceFormData } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

export const createService = async (data: ServiceFormData) => {
    const res = await fetch(`${BASE_URL}/services`, {
        method: "POST",
        headers: {
            'content-type':'application/json',
        },
        body: JSON.stringify(data),
    })
    return res.json();
}

export const deleteService = async (serviceId: string) => {
    const res = await fetch(`${BASE_URL}/services/${serviceId}`, {
        method: "DELETE"
    })
    return res.json();
}

export const updateService = async (serviceId: string, data: Partial<ServiceFormData>) => {
    const res = await fetch(`${BASE_URL}/services/${serviceId}`, {
        method: "PATCH",
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    return res.json();
}