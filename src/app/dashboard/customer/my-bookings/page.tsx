import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/core/server";
import MyBookingsList from "@/components/dashboard/customer/MyBookingsList";
import { getBookings } from "@/lib/actions/bookings";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "My Bookings | Customer Dashboard | WedPlan",
  description: "View and manage your wedding booking requests and celebration reservations.",
};

export default async function MyBookingsPage() {
  const session = await getSession();

  if (!session) {
    redirect("/signin?redirectTo=/dashboard/customer/my-bookings");
  }

  const bookings = await getBookings(`email=${encodeURIComponent(session.user.email)}`);

  return <MyBookingsList bookings={bookings} />;
}
