import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/core/server";
import { getBookings } from "@/lib/actions/bookings";
import VendorBookingRequests from "@/components/dashboard/vendor/VendorBookingRequests";

export const metadata = {
  title: "Booking Requests | Vendor Studio | WedPlan",
  description: "Manage wedding booking inquiries and reservations from couples.",
};

interface BookingRequestsPageProps {
  searchParams?: Promise<{ serviceId?: string }>;
}

export default async function BookingRequestsPage({
  searchParams,
}: BookingRequestsPageProps) {
  const session = await getSession();

  if (!session?.user) {
    redirect("/signin?redirectTo=/dashboard/vendor/booking-requests");
  }

  // Role security check
  if (session.user.role && session.user.role.toLowerCase() !== "vendor") {
    redirect(`/dashboard/${session.user.role}`);
  }

  const resolvedParams = searchParams ? await searchParams : undefined;
  const filterServiceId = resolvedParams?.serviceId;

  // Fetch bookings for this vendor
  const query = filterServiceId ? `serviceId=${encodeURIComponent(filterServiceId)}` : "";
  const bookings = await getBookings(query);

  return (
    <VendorBookingRequests
      key={filterServiceId || "all"}
      initialBookings={bookings}
      filterServiceId={filterServiceId}
    />
  );
}
