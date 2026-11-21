import { ServiceFormData } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

// 1. Public Browse Services (with search, category, location, sort)
export const getServices = async (query?: string): Promise<ServiceFormData[]> => {
  try {
    const url = query ? `${BASE_URL}/services?${query}` : `${BASE_URL}/services`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Error fetching public services:", error);
    return [];
  }
};

// 2. Vendor's Own Services (for Vendor Dashboard My Services)
export const getMyServices = async (vendorId?: string): Promise<ServiceFormData[]> => {
  try {
    const url = vendorId
      ? `${BASE_URL}/my-services?vendorId=${vendorId}`
      : `${BASE_URL}/my-services`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Error fetching my services:", error);
    return [];
  }
};

// Get Service By Id
export const getServiceById = async (serviceId: string) => {
  try {
    const res = await fetch(`${BASE_URL}/services/${serviceId}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Error fetching service by id:", error);
    return null;
  }
};

export const createService = async (data: ServiceFormData) => {
  const res = await fetch(`${BASE_URL}/services`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return res.json();
};
