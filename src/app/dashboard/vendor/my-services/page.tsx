import React from "react";
import MyServicesList from "@/components/dashboard/vendor/MyServicesList";
import { getMyServices } from "@/lib/api/services";
import { getUserPremiumById } from "@/lib/api/user";
import { getBookings } from "@/lib/actions/bookings";
import { getSession } from "@/lib/core/server";

export const metadata = {
  title: "My Services | Vendor Dashboard | WedPlan",
  description: "Manage your wedding services, availability, and listings on WedPlan.",
};

export default async function MyServicesPage() {
  const session = await getSession();
  const userId = session?.user?.id || "";
  const userEmail = session?.user?.email || "";

  const services = await getMyServices(userId);
  const premiumData = await getUserPremiumById(userId);
  const isPremium = Boolean(
    premiumData?.premium || session?.user?.subscriptionPlan?.toLowerCase() === "premium"
  );

  // Fetch vendor bookings to count requests per service
  const bookingsQuery = userEmail
    ? `vendorEmail=${encodeURIComponent(userEmail)}`
    : userId
      ? `vendorId=${encodeURIComponent(userId)}`
      : "";
  const bookings = bookingsQuery ? await getBookings(bookingsQuery) : [];

  return (
    <MyServicesList
      services={services}
      bookings={bookings}
      isPremium={isPremium}
    />
  );
}
