"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useSidebar, SidebarTrigger } from "@/components/ui/sidebar";
import { Sparkles } from "lucide-react";
import UserDropdown from "@/components/shared/UserDropdown";
import { IDashboardUser } from "@/types";

interface DashboardTopbarProps {
  user?: IDashboardUser | null;
}

export function DashboardTopbar({ user }: DashboardTopbarProps) {
  const pathname = usePathname();
  const { state, isMobile } = useSidebar();

  const title = pathname.startsWith("/dashboard/admin")
    ? "Admin Dashboard"
    : pathname.startsWith("/dashboard/customer")
    ? "Customer Dashboard"
    : "Vendor Dashboard";

  return (
    <header className="sticky top-0 z-20 flex h-14 w-full items-center justify-between border-b border-[#EFE5E9] bg-[#FCFBF9]/90 px-4 backdrop-blur-md sm:px-6">
      <div className="flex items-center gap-3">
        {(state === "collapsed" || isMobile) && (
          <>
            <SidebarTrigger className="h-8 w-8 rounded-lg text-stone-600 hover:bg-[#F3E8EC] hover:text-stone-900 border-none shadow-none cursor-pointer" />
            <div className="h-4 w-px bg-[#EFE5E9]" />
          </>
        )}

        <div className="inline-flex items-center gap-2 rounded-full border border-rose-200/80 bg-[#FAF5F7] px-3.5 py-1 shadow-2xs">
          <Sparkles className="h-3.5 w-3.5 text-[#844353]" />
          <span className="text-xs sm:text-[13px] font-semibold text-[#844353] tracking-wide">
            {title}
          </span>
        </div>
      </div>

      <UserDropdown user={user} />
    </header>
  );
}
