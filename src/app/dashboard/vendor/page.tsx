import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/core/server";
import { IDashboardUser } from "@/types";
import { getMyServices } from "@/lib/api/services";
import { getBookings } from "@/lib/actions/bookings";
import { getUserPremiumById } from "@/lib/api/user";
import VendorOverview from "@/components/dashboard/vendor/VendorOverview";

export const metadata = {
  title: "Vendor Studio Overview | WedPlan",
  description: "Monitor services, booking requests, and membership statistics.",
};

export default async function VendorDashboardPage() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/signin?redirectTo=/dashboard/vendor");
  }

  const user = session.user as IDashboardUser;

  // Role security check
  if (user?.role && user.role.toLowerCase() !== "vendor") {
    redirect(`/dashboard/${user.role}`);
  }

  // 1. Fetch vendor's services
  const services = await getMyServices(user?.id);

  // 2. Fetch vendor's booking requests
  const bookings = await getBookings();

  // 3. Fetch live premium membership status
  const premiumData = await getUserPremiumById(user?.id || "");
  const isPremium = Boolean(
    premiumData?.premium || user?.subscriptionPlan?.toLowerCase() === "premium"
  );

  return (
    <div className="w-full">
      <VendorOverview
        user={user}
        services={services}
        bookings={bookings}
        isPremium={isPremium}
      />
    </div>
  );
}
