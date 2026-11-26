import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/core/server";
import AdminTransactions from "@/components/dashboard/admin/AdminTransactions";
import { getAdminTransactions } from "@/lib/actions/transactions";

export const metadata = {
  title: "Platform Transactions | Admin Dashboard | WedPlan",
  description: "Audit platform revenue, vendor subscription payments, and Stripe checkout logs.",
};

export default async function TransactionsPage() {
  const session = await getSession();

  // Protect Admin route
  if (!session?.user) {
    redirect("/signin?redirectTo=/dashboard/admin/transactions");
  }

  const role = (session.user.role || "").toLowerCase();
  if (role !== "admin") {
    redirect(`/dashboard/${role || "customer"}`);
  }

  // Fetch transactions from server
  const transactionData = await getAdminTransactions();
  const initialTransactions = Array.isArray(transactionData)
    ? transactionData
    : [];

  return <AdminTransactions initialTransactions={initialTransactions} />;
}
