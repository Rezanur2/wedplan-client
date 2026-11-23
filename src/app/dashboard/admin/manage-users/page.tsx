import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/core/server";
import { getAllUsers } from "@/lib/api/user";
import ManageUsers from "@/components/dashboard/admin/ManageUsers";

export const metadata = {
  title: "Manage Users | Admin Dashboard | WedPlan",
  description: "View, search, filter, and manage platform users, vendors, and roles.",
};

export default async function ManageUsersPage() {
  const session = await getSession();

  // Protect Admin route
  if (!session?.user) {
    redirect("/signin?redirectTo=/dashboard/admin/manage-users");
  }

  const role = (session.user.role || "").toLowerCase();
  if (role !== "admin") {
    redirect(`/dashboard/${role || "customer"}`);
  }

  // Fetch all registered users
  const users = await getAllUsers();

  return <ManageUsers initialUsers={users} />;
}
