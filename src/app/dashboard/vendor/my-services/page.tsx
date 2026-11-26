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

  const [services, premiumData, bookings] = await Promise.all([
    getMyServices(userId),
    getUserPremiumById(userId),
    userId ? getBookings() : Promise.resolve([]),
  ]);
  const isPremium = Boolean(
    premiumData?.premium || session?.user?.subscriptionPlan?.toLowerCase() === "premium"
  );

  return (
    <MyServicesList
      services={services}
      bookings={bookings}
      isPremium={isPremium}
    />
  );
}
