import React from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import MyBookingsList from "@/components/dashboard/customer/MyBookingsList";
import { getBookings } from "@/lib/actions/bookings";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "My Bookings | Customer Dashboard | WedPlan",
  description: "View and manage your wedding booking requests and celebration reservations.",
};

export default async function MyBookingsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/signin?redirectTo=/dashboard/customer/my-bookings");
  }

  const bookings = await getBookings(`email=${encodeURIComponent(session.user.email)}`);

  return <MyBookingsList bookings={bookings} />;
}
