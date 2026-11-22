import React from "react";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import AddServiceForm from "@/components/dashboard/vendor/AddServiceForm";
import { getMyServices } from "@/lib/api/services";
import { IDashboardUser } from "@/types";

export const metadata = {
  title: "Add New Service | WedPlan Vendor Studio",
  description: "Submit a new wedding service listing for platform curation and review.",
};

export default async function AddServicePage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });
  const user = session?.user as IDashboardUser;
  const services = await getMyServices(user?.id);

  return (
    <div className="w-full">
      <AddServiceForm
        user={user}
        vendorId={user?.id}
        subscriptionPlan={user?.subscriptionPlan || "free"}
        activeServiceCount={services.length}
      />
    </div>
  );
}
