import { IBookingPayload } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";


export async function bookingToAService(data: IBookingPayload) {
  const response = await fetch(`${BASE_URL}/bookings`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function getCustomerBookings(customerEmail: string, serviceId?: string) {
  try {
    let url = `${BASE_URL}/my-bookings?customerEmail=${encodeURIComponent(customerEmail)}`;
    if (serviceId) {
      url += `&serviceId=${encodeURIComponent(serviceId)}`;
    }
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error("Error fetching customer bookings:", error);
    return [];
  }
}
