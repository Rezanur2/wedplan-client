import React from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import AddServiceForm from "@/components/dashboard/vendor/AddServiceForm";
import { getServicesCount } from "@/lib/actions/services";
import { getUserPremiumById } from "@/lib/api/user";
import { IDashboardUser } from "@/types";

export const metadata = {
  title: "Add New Service | WedPlan Vendor Studio",
  description: "Submit a new wedding service listing for platform curation and review.",
};

export default async function AddServicePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/signin?redirectTo=/dashboard/vendor/add-service");
  }

  const user = session.user as IDashboardUser;

  // 1. Get user premium status and total services count
  const premiumResult = await getUserPremiumById(user.id || "");
  const countResult = await getServicesCount(`vendorId=${user.id}`);

  // 2. If vendor has 3 or more services and is not premium, send to checkout
  if (!premiumResult?.premium && countResult.count >= 3) {
    redirect("/dashboard/vendor/subscription/checkout");
  }

  return (
    <div className="w-full">
      <AddServiceForm
        user={user}
        vendorId={user?.id}
        subscriptionPlan={premiumResult?.premium ? "premium" : "free"}
        activeServiceCount={countResult.count}
      />
    </div>
  );
}
