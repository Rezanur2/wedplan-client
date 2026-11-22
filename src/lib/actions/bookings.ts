import { IBookingPayload } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

// Post a new booking
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

// Get bookings (supports ?email=... or ?vendorEmail=...)
export async function getBookings(query = ""): Promise<IBookingPayload[]> {
  try {
    const res = await fetch(`${BASE_URL}/bookings?${query}`, { cache: "no-store" });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return [];
  }
}

// Update / Cancel booking status
export async function updateBookingStatus(bookingId: string, status: string) {
  const response = await fetch(`${BASE_URL}/bookings/${bookingId}`, {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ status }),
  });
  return response.json();
}
