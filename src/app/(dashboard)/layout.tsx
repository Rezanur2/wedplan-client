import React from "react";
import Navbar from "@/components/shared/Navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DashboardSidebar } from "@/components/dashboard/shared/DashboardSidebar";

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
          <div className="flex flex-1 w-full">
            <DashboardSidebar />
            <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
              {children}
            </main>
          </div>
        </SidebarProvider>
      </TooltipProvider>
    </div>
  );
}
