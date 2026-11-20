import React from "react";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import AddServiceForm from "@/components/dashboard/vendor/AddServiceForm";

export const metadata = {
  title: "Add New Service | WedPlan Vendor Studio",
  description: "Submit a new wedding service listing for platform curation and review.",
};

export default async function AddServicePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const vendorId = session?.user?.id;
  const subscriptionPlan =
    (session?.user as { subscriptionPlan?: string })?.subscriptionPlan || "free";

  return (
    <div className="w-full">
      <AddServiceForm
        vendorId={vendorId}
        subscriptionPlan={subscriptionPlan}
        activeServiceCount={2} // Default demo count, can be loaded dynamically from services collection
      />
    </div>
  );
}
