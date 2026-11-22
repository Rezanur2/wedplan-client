import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/core/server";
import ProfileSettingsForm from "@/components/dashboard/shared/ProfileSettingsForm";

export default async function VendorProfilePage() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/signin?redirectTo=/dashboard/vendor/profile");
  }

  return (
    <div className="w-full">
      <ProfileSettingsForm user={session.user} />
    </div>
  );
}
