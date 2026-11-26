import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/core/server";
import { IDashboardUser } from "@/types";
import { getAllUsers } from "@/lib/api/user";
import { getAdminServices } from "@/lib/actions/services";
import { getAdminTransactions } from "@/lib/actions/transactions";
import AdminOverview from "@/components/dashboard/admin/AdminOverview";

export const metadata = {
  title: "Admin Overview | WedPlan",
  description: "Monitor platform users, services, and transactions.",
};

export default async function AdminDashboardPage() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/signin?redirectTo=/dashboard/admin");
  }

  const currentUser = session.user as IDashboardUser;
  const userRole = (currentUser.role || "").toLowerCase();

  if (userRole !== "admin") {
    redirect(`/dashboard/${userRole || "customer"}`);
  }

  const [userData, servicesData, transactionsData] = await Promise.all([
    getAllUsers().catch(() => []),
    getAdminServices().catch(() => []),
    getAdminTransactions().catch(() => []),
  ]);

  const usersList = Array.isArray(userData) ? userData : [];
  const servicesList = Array.isArray(servicesData) ? servicesData : [];
  const transactionsList = Array.isArray(transactionsData) ? transactionsData : [];

  return (
    <AdminOverview
      currentUser={currentUser}
      usersList={usersList}
      servicesList={servicesList}
      transactionsList={transactionsList}
    />
  );
}
