import React from "react";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import MyServicesList from "@/components/dashboard/vendor/MyServicesList";
import { getServices } from "@/lib/api/services";

export const metadata = {
  title: "My Services | Vendor Dashboard | WedPlan",
  description: "Manage your wedding services, availability, and listings on WedPlan.",
};

export default async function MyServicesPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const services = await getServices(session?.user?.id);

  return <MyServicesList services={services} />;
}
