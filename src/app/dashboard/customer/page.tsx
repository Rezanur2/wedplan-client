import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/core/server";
import { getBookings } from "@/lib/actions/bookings";
import CustomerOverview from "@/components/dashboard/customer/CustomerOverview";
import { IDashboardUser } from "@/types";

export const metadata = {
  title: "Customer Dashboard | WedPlan",
  description: "Wedding planning overview, booking inquiries, and celebration reservations.",
};

export default async function CustomerDashboardPage() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/signin?redirectTo=/dashboard/customer");
  }

  const currentUser = session.user as IDashboardUser;
  const userBookings = await getBookings(
    `email=${encodeURIComponent(currentUser.email || "")}`
  );

  return (
    <CustomerOverview
      user={currentUser}
      bookings={userBookings || []}
    />
  );
}
