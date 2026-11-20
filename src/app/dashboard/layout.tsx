import React from "react";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import Navbar from "@/components/shared/Navbar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { auth } from "@/lib/auth";
import { IDashboardUser } from "@/types";
import { DashboardSidebar } from "@/components/dashboard/shared/DashboardSidebar";
import { DashboardTopbar } from "@/components/dashboard/shared/DashboardTopbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cookieStore, session] = await Promise.all([
    cookies(),
    auth.api.getSession({ headers: await headers() }),
  ]);

  if (!session?.user) {
    redirect("/signin");
  }

  // The shadcn sidebar stores its open/collapsed state in this cookie.
  const defaultOpen = cookieStore.get("sidebar_state")?.value !== "false";

  const user: IDashboardUser = {
    name: session.user.name,
    email: session.user.email,
    image: session.user.image,
    role: session.user.role,
    businessName: (session.user as { businessName?: string })?.businessName,
    subscriptionPlan: (session.user as { subscriptionPlan?: string })?.subscriptionPlan,
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FCFBF9]">
      <Navbar />
      <TooltipProvider delay={0}>
        <SidebarProvider defaultOpen={defaultOpen}>
          <div className="flex flex-1 w-full relative">
            <DashboardSidebar user={user} />
            <SidebarInset className="flex flex-1 flex-col min-w-0 bg-[#FCFBF9]">
              <DashboardTopbar />
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
