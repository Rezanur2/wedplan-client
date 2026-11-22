import React from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import AddServiceForm from "@/components/dashboard/vendor/AddServiceForm";
import { getServicesCount } from "@/lib/actions/services";
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
  const countData = await getServicesCount(
    user?.id ? `vendorId=${encodeURIComponent(user.id)}` : ""
  );

  return (
    <div className="w-full">
      <AddServiceForm
        user={user}
        vendorId={user?.id}
        subscriptionPlan={user?.subscriptionPlan || "free"}
        activeServiceCount={countData?.count || 0}
      />
    </div>
  );
}
