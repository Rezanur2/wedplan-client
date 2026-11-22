import React from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { IDashboardUser } from "@/types";
import { getServicesCount } from "@/lib/actions/services";
import SubscriptionPlans from "@/components/dashboard/vendor/SubscriptionPlans";

export const metadata = {
  title: "Subscription & Plans | WedPlan Vendor Studio",
  description: "Manage your vendor membership and upgrade to Premium for unlimited service listings.",
};

export default async function VendorSubscriptionPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/signin?redirectTo=/dashboard/vendor/subscription");
  }

  const user = session.user as IDashboardUser;
  const countData = await getServicesCount(
    user?.id ? `vendorId=${encodeURIComponent(user.id)}` : ""
  );

  return (
    <div className="w-full">
      <SubscriptionPlans
        user={user}
        activeServiceCount={countData?.count || 0}
      />
    </div>
  );
}
