'use server'
import { IBookingPayload } from "@/types";
import { authFetch, protectedMutation } from "../core/server";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

// Post a new booking
export async function bookingToAService(data: IBookingPayload) {
  const api = `${BASE_URL}/bookings`;
  const res = await protectedMutation(api, "POST", data)
  return res.json();
}

// Get bookings (supports ?email=... or ?vendorEmail=...)
export async function getBookings(query = ""): Promise<IBookingPayload[]> {
  try {
    const api = `${BASE_URL}/bookings?${query}`
    const res = await authFetch(api);
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return [];
  }
}

// Update / Cancel booking status
export async function updateBookingStatus(bookingId: string, status: string) {
  const api = `${BASE_URL}/bookings/${bookingId}`;
  const response = await protectedMutation(api, "PATCH", { status });
  return response.json();
}
