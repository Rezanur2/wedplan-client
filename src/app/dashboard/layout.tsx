import React from "react";
import Navbar from "@/components/shared/Navbar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DashboardSidebar } from "@/components/dashboard/shared/DashboardSidebar";
import { DashboardTopbar } from "@/components/dashboard/shared/DashboardTopbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#FCFBF9]">
      <Navbar />
      <TooltipProvider delay={0}>
        <SidebarProvider defaultOpen={true}>
          <div className="flex flex-1 w-full relative">
            <DashboardSidebar />
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
