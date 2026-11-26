import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/core/server";
import ManageServices from "@/components/dashboard/admin/ManageServices";
import { getAdminServices } from "@/lib/actions/services";

export const metadata = {
  title: "Manage Services | Admin Dashboard | WedPlan",
  description: "Review pending vendor submissions and manage live wedding services catalog.",
};

export default async function ManageServicesPage() {
  const session = await getSession();

  // Protect Admin route
  if (!session?.user) {
    redirect("/signin?redirectTo=/dashboard/admin/manage-services");
  }

  const role = (session.user.role || "").toLowerCase();
  if (role !== "admin") {
    redirect(`/dashboard/${role || "customer"}`);
  }

  // Fetch all services for admin (includes pending, rejected, active)
  const submittedServices = await getAdminServices();
  const initialServices = Array.isArray(submittedServices)
    ? submittedServices
    : [];

  return <ManageServices initialServices={initialServices} />;
}
