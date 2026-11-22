import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getSession } from "@/lib/core/server";
import { IDashboardUser } from "@/types";
import { getBookings } from "@/lib/actions/bookings";
import { getUserPremiumById } from "@/lib/api/user";
import { DashboardSidebar } from "@/components/dashboard/shared/DashboardSidebar";
import { DashboardTopbar } from "@/components/dashboard/shared/DashboardTopbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const session = await getSession();

  if (!session?.user) {
    redirect("/signin");
  }

  // The shadcn sidebar stores its open/collapsed state in this cookie.
  const defaultOpen = cookieStore.get("sidebar_state")?.value !== "false";

  const user = session.user as IDashboardUser;
  const isVendor = user?.role?.toLowerCase() === "vendor";

  let pendingCount = 0;
  let isPremium = (user?.subscriptionPlan || "free").toLowerCase() === "premium";

  if (isVendor && user?.id) {
    try {
      const [bookings, premiumData] = await Promise.all([
        getBookings(
          user.email
            ? `vendorEmail=${encodeURIComponent(user.email)}`
            : `vendorId=${encodeURIComponent(user.id)}`
        ),
        getUserPremiumById(user.id),
      ]);

      pendingCount = (bookings || []).filter(
        (b) => (b.status || "").toLowerCase() === "pending"
      ).length;

      if (premiumData?.premium !== undefined) {
        isPremium = Boolean(premiumData.premium);
      }
    } catch (err) {
      console.error("Failed to load vendor sidebar metrics:", err);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FCFBF9]">
      <TooltipProvider delay={0}>
        <SidebarProvider defaultOpen={defaultOpen}>
          <div className="flex flex-1 w-full relative">
            <DashboardSidebar
              user={user}
              pendingCount={pendingCount}
              isPremium={isPremium}
            />
            <SidebarInset className="flex flex-1 flex-col min-w-0 bg-[#FCFBF9]">
              <DashboardTopbar user={user} />
              <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
                {children}
              </main>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </TooltipProvider>
    </div>
  );
}
