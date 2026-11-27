import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/core/server";
import { IDashboardUser } from "@/types";
import { getServicesCount } from "@/lib/actions/services";
import { getUserPremiumById } from "@/lib/api/user";
import { getMyTransactions } from "@/lib/actions/transactions";
import SubscriptionPlans from "@/components/dashboard/vendor/SubscriptionPlans";

export const metadata = {
  title: "Subscription & Plans | WedPlan Vendor Studio",
  description: "Manage your vendor membership and upgrade to Premium for unlimited service listings.",
};

export default async function VendorSubscriptionPage() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/signin?redirectTo=/dashboard/vendor/subscription");
  }

  const user = session.user as IDashboardUser;

  const [countResult, premiumResult, paymentHistory] = await Promise.all([
    getServicesCount(`vendorId=${user.id}`),
    getUserPremiumById(user.id || ""),
    getMyTransactions(),
  ]);

  return (
    <div className="w-full">
      <SubscriptionPlans
        user={{
          ...user,
          subscriptionPlan: premiumResult?.premium ? "premium" : "free",
          subscriptionExpiresAt: premiumResult?.subscriptionExpiresAt || null,
        }}
        activeServiceCount={countResult.count}
        cancelAtPeriodEnd={Boolean(premiumResult?.cancelAtPeriodEnd)}
        paymentHistory={paymentHistory}
      />
    </div>
  );
}
