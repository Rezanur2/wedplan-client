import React from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import ProfileSettingsForm from "@/components/dashboard/shared/ProfileSettingsForm";

export default async function AdminProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/signin?redirectTo=/dashboard/admin/profile");
  }

  return (
    <div className="w-full">
      <ProfileSettingsForm user={session.user} />
    </div>
  );
}
