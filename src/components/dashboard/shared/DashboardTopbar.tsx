"use client";

import React from "react";
import Link from "next/link";
import { useSidebar, SidebarTrigger } from "@/components/ui/sidebar";
import { Sparkles, Home, Compass, ShieldCheck, Store, User, Crown } from "lucide-react";
import UserDropdown from "@/components/shared/UserDropdown";
import { IDashboardUser } from "@/types";

interface DashboardTopbarProps {
  user?: IDashboardUser | null;
}

export function DashboardTopbar({ user }: DashboardTopbarProps) {
  const { state, isMobile } = useSidebar();

  const userRole = (user?.role || "").toLowerCase();
  const isAdmin = userRole === "admin";
  const isVendor = userRole === "vendor";
  const isCustomer = userRole === "customer";

  const isPremiumVendor =
    isVendor &&
    (user?.subscriptionPlan?.toLowerCase() === "premium" || Boolean(user?.premium));

  const title = isAdmin
    ? "Admin Dashboard"
    : isCustomer
    ? "Customer Dashboard"
    : "Vendor Dashboard";

  return (
    <header className="sticky top-0 z-20 flex h-14 w-full items-center justify-between border-b border-[#EFE5E9] bg-[#FCFBF9]/90 px-2 sm:px-6 backdrop-blur-md">
      {/* Left: Sidebar Trigger & Dashboard Title */}
      <div className="flex items-center gap-1 sm:gap-2.5 shrink-0">
        {(state === "collapsed" || isMobile) && (
          <>
            <SidebarTrigger className="h-8 w-8 rounded-lg text-stone-600 hover:bg-[#F3E8EC] hover:text-stone-900 border-none shadow-none cursor-pointer shrink-0" />
            <div className="h-4 w-px bg-[#EFE5E9] mx-0.5" />
          </>
        )}

        {isPremiumVendor ? (
          <div className="inline-flex items-center gap-1 sm:gap-2 rounded-full border border-amber-300 bg-linear-to-r from-amber-50 via-yellow-50 to-amber-100/90 px-2 sm:px-3 py-0.5 sm:py-1 shadow-2xs whitespace-nowrap shrink-0 ring-1 ring-amber-400/40">
            <div className="relative flex items-center justify-center shrink-0">
              <Store className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-amber-700" />
              <Crown className="h-1.5 w-1.5 sm:h-2 sm:w-2 text-amber-500 fill-amber-500 absolute -top-1 -right-1" />
            </div>
            <span className="text-[10px] sm:text-[13px] font-bold text-amber-900 tracking-wide whitespace-nowrap">
              Vendor Dashboard
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
          </div>
        ) : (
          <div className="inline-flex items-center gap-1 sm:gap-2 rounded-full border border-rose-200/80 bg-[#FAF5F7] px-2 sm:px-3 py-0.5 sm:py-1 shadow-2xs whitespace-nowrap shrink-0">
            {isAdmin ? (
              <ShieldCheck className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-[#844353] shrink-0" />
            ) : isVendor ? (
              <Store className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-[#844353] shrink-0" />
            ) : isCustomer ? (
              <User className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-[#844353] shrink-0" />
            ) : (
              <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-[#844353] shrink-0" />
            )}
            <span className="text-[10px] sm:text-[13px] font-semibold text-[#844353] tracking-wide whitespace-nowrap">
              {title}
            </span>
          </div>
        )}
      </div>

      {/* Right: Quick Navigation & User Profile */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        <nav className="flex items-center gap-1 sm:gap-2 shrink-0">
          <Link
            href="/"
            title="Go to Home"
            aria-label="Home"
            className="inline-flex items-center justify-center h-8 w-8 sm:h-auto sm:w-auto sm:gap-1.5 rounded-lg border border-stone-200/70 bg-white sm:px-2.5 sm:py-1.5 text-xs font-medium text-stone-600 shadow-2xs transition-all hover:border-stone-300 hover:bg-stone-50 hover:text-stone-900 shrink-0"
          >
            <Home className="h-3.5 w-3.5 text-stone-500" />
            <span className="hidden sm:inline">Home</span>
          </Link>

          <Link
            href="/services"
            title="Browse Wedding Services"
            aria-label="Browse Services"
            className="inline-flex items-center justify-center h-8 w-8 sm:h-auto sm:w-auto sm:gap-1.5 rounded-lg border border-rose-200/80 bg-[#FAF5F7] sm:px-2.5 sm:py-1.5 text-xs font-medium text-[#844353] shadow-2xs transition-all hover:border-rose-300 hover:bg-[#F3E8EC] hover:text-[#6e3745] shrink-0"
          >
            <Compass className="h-3.5 w-3.5 text-[#844353]" />
            <span className="hidden sm:inline">Browse Services</span>
          </Link>
        </nav>

        <div className="h-4 w-px bg-[#EFE5E9] shrink-0" />

        <div className="shrink-0">
          <UserDropdown user={user} />
        </div>
      </div>
    </header>
  );
}
