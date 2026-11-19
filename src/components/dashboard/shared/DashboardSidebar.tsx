"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  CalendarDays,
  Tag,
  SlidersHorizontal,
  CalendarCheck,
  Users,
  Layers,
  Receipt,
  LogOut,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/toast";

export interface MenuItem {
  id: string;
  name: string;
  url: string;
  icon: LucideIcon;
  badge?: string;
  badgeVariant?: "pink" | "gray";
}

export type UserRole = "customer" | "vendor" | "admin";

const menuItemsByRole: Record<UserRole, MenuItem[]> = {
  customer: [
    {
      id: "customer-overview",
      name: "Overview",
      url: "/customer",
      icon: LayoutDashboard,
    },
    {
      id: "customer-bookings",
      name: "My Bookings",
      url: "/customer/my-bookings",
      icon: CalendarCheck,
    },
    {
      id: "customer-profile",
      name: "Profile Settings",
      url: "/customer/profile",
      icon: SlidersHorizontal,
    },
  ],
  vendor: [
    {
      id: "vendor-overview",
      name: "Overview",
      url: "/vendor",
      icon: LayoutDashboard,
    },
    {
      id: "vendor-my-services",
      name: "My Services",
      url: "/vendor/my-services",
      icon: Package,
    },
    {
      id: "vendor-add-service",
      name: "Add Service",
      url: "/vendor/add-service",
      icon: PlusCircle,
    },
    {
      id: "vendor-bookings",
      name: "Booking Requests",
      url: "/vendor/booking-requests",
      icon: CalendarDays,
      badge: "3 pending",
      badgeVariant: "pink",
    },
    {
      id: "vendor-subscription",
      name: "Subscription",
      url: "/vendor/subscription",
      icon: Tag,
      badge: "Free Tier",
      badgeVariant: "gray",
    },
    {
      id: "vendor-profile",
      name: "Profile Settings",
      url: "/vendor/profile",
      icon: SlidersHorizontal,
    },
  ],
  admin: [
    {
      id: "admin-overview",
      name: "Overview",
      url: "/admin",
      icon: LayoutDashboard,
    },
    {
      id: "admin-users",
      name: "Manage Users",
      url: "/admin/manage-users",
      icon: Users,
    },
    {
      id: "admin-services",
      name: "Manage Services",
      url: "/admin/manage-services",
      icon: Layers,
    },
    {
      id: "admin-transactions",
      name: "Transactions",
      url: "/admin/transactions",
      icon: Receipt,
    },
  ],
};

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;

  // Detect role from current route or session
  const role: UserRole = pathname.startsWith("/customer")
    ? "customer"
    : pathname.startsWith("/admin")
    ? "admin"
    : ((user?.role as UserRole) || "vendor");

  const currentMenu = menuItemsByRole[role] || menuItemsByRole.vendor;

  const portalTitle =
    role === "vendor"
      ? "Vendor Portal"
      : role === "admin"
      ? "Admin Portal"
      : "Customer Portal";

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : role === "customer" ? "C" : "V";
  const displayName = user?.name || (role === "customer" ? "Customer" : "Vendor Studio");

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.add({
        title: "Signed Out",
        description: "You have been logged out safely.",
        type: "info",
      });
      router.push("/signin");
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Sidebar
      collapsible="icon"
      className="top-16! h-[calc(100svh-4rem)]! border-r border-[#EFE5E9] bg-[#FAF5F7]!"
    >
      {/* Sidebar Header */}
      <SidebarHeader className="border-b border-[#EFE5E9] p-3 bg-[#FAF5F7]">
        {/* Expanded View */}
        <div className="group-data-[collapsible=icon]:hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold tracking-wider text-stone-400 uppercase">
              Workspace
            </span>
            <SidebarTrigger className="h-6 w-6 rounded-md text-stone-500 hover:bg-[#F3E8EC] hover:text-stone-900 border-none shadow-none cursor-pointer" />
          </div>
          <div className="flex items-center gap-2 mt-1">
            <h3 className="font-serif text-sm font-bold text-stone-900 truncate">
              {portalTitle}
            </h3>
            {role === "vendor" && (
              <span className="rounded-full border border-rose-200/80 bg-[#FCECEE] px-2 py-0.5 text-[10px] font-semibold text-[#844353]">
                Free
              </span>
            )}
          </div>
          {role === "vendor" && (
            <p className="text-[10px] text-stone-400 font-medium mt-0.5">VIP</p>
          )}
        </div>

        {/* Collapsed View (Just the toggle trigger centered) */}
        <div className="hidden group-data-[collapsible=icon]:flex items-center justify-center py-0.5">
          <SidebarTrigger className="h-7 w-7 rounded-lg text-stone-600 hover:bg-[#F3E8EC] hover:text-stone-900 border-none shadow-none cursor-pointer" />
        </div>
      </SidebarHeader>

      {/* Navigation Menu (Content) */}
      <SidebarContent className="p-2.5 bg-[#FAF5F7]">
        <SidebarMenu className="gap-1.5">
          {currentMenu.map((item) => {
            const isActive = pathname === item.url;
            return (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton
                  isActive={isActive}
                  tooltip={item.name}
                  render={<Link href={item.url} />}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium transition-all cursor-pointer",
                    isActive
                      ? "bg-[#844353]! text-white! hover:bg-[#844353]! hover:text-white! font-bold shadow-xs data-[active=true]:bg-[#844353]! data-[active=true]:text-white!"
                      : "text-stone-700 hover:bg-[#F3E8EC] hover:text-stone-900"
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-4 w-4 shrink-0 transition-colors",
                      isActive ? "text-white!" : "text-stone-700 group-hover/menu-button:text-stone-900"
                    )}
                  />
                  <span
                    className={cn(
                      "truncate group-data-[collapsible=icon]:hidden",
                      isActive ? "text-white font-semibold" : "text-stone-700"
                    )}
                  >
                    {item.name}
                  </span>

                  {item.badge && (
                    <span
                      className={cn(
                        "ml-auto shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold tracking-wide group-data-[collapsible=icon]:hidden",
                        isActive
                          ? "bg-white/20 text-white"
                          : item.badgeVariant === "pink"
                          ? "bg-[#FCD8E2] text-[#844353]"
                          : "bg-[#EFEBED] text-stone-600"
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      {/* Sidebar Footer */}
      <SidebarFooter className="border-t border-[#EFE5E9] p-3 bg-[#FAF5F7]">
        {/* Expanded View */}
        <div className="group-data-[collapsible=icon]:hidden space-y-2.5">
          {/* Current Plan Card (only for Vendor) */}
          {role === "vendor" && (
            <div className="rounded-xl border border-[#F0E0E6] bg-white/70 p-2.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold tracking-wider text-stone-400 uppercase">
                  Current Plan
                </span>
                <Link
                  href="/vendor/subscription"
                  className="text-[10px] font-bold text-[#844353] hover:underline"
                >
                  Upgrade
                </Link>
              </div>
              <p className="mt-1 text-xs font-semibold text-stone-800">
                Free Plan{" "}
                <span className="text-[11px] text-stone-400 font-normal">
                  (2/3 Active)
                </span>
              </p>
            </div>
          )}

          {/* User Profile Bar */}
          <div className="flex items-center justify-between rounded-xl border border-[#EFE5E9] bg-white p-2 shadow-2xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#844353] text-xs font-bold text-white shadow-2xs">
                {userInitial}
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-stone-800">
                  {displayName}
                </p>
                <p className="truncate text-[10px] text-stone-400 capitalize font-medium">
                  {role} Account
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSignOut}
              title="Sign out"
              className="rounded-lg p-1.5 text-stone-400 hover:bg-rose-50 hover:text-[#844353] transition-colors cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Collapsed Icon-Only View */}
        <div className="hidden group-data-[collapsible=icon]:flex flex-col items-center gap-2 py-1">
          <Tooltip>
            <TooltipTrigger
              render={
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#844353] text-xs font-bold text-white shadow-2xs cursor-pointer">
                  {userInitial}
                </div>
              }
            />
            <TooltipContent side="right">
              <p className="font-semibold">{displayName}</p>
              <p className="text-[10px] text-stone-400 capitalize">{role} Account</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger
              render={
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-stone-400 hover:bg-rose-50 hover:text-[#844353] transition-colors cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              }
            />
            <TooltipContent side="right">
              Sign out
            </TooltipContent>
          </Tooltip>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
