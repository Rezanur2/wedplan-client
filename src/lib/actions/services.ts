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