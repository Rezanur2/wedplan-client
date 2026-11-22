import React from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getUserPremiumById } from "@/lib/api/user";
import { IDashboardUser } from "@/types";
import VendorCheckoutView from "@/components/dashboard/vendor/VendorCheckoutView";

export const metadata = {
  title: "Checkout & Upgrade | WedPlan Vendor Studio",
  description: "Complete your upgrade to WedPlan Premium Vendor Membership.",
};

export default async function VendorCheckoutPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/signin?redirectTo=/dashboard/vendor/subscription/checkout");
  }

  const user = session.user as IDashboardUser;

  // If vendor is already premium, no need to checkout again
  const premiumResult = await getUserPremiumById(user.id || "");
  if (premiumResult?.premium) {
    redirect("/dashboard/vendor/subscription");
  }

  return (
    <div className="w-full">
      <VendorCheckoutView user={user} />
    </div>
  );
}
