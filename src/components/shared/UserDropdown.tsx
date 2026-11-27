"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronDown, LayoutDashboard, Settings, LogOut, User } from "lucide-react";
import { signOut } from "@/lib/auth-client";
import { toast } from "@/components/ui/toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IDashboardUser } from "@/types";

interface UserDropdownProps {
  user?: IDashboardUser | null;
}

export default function UserDropdown({ user }: UserDropdownProps) {
  const router = useRouter();

  if (!user) return null;

  const hasValidImage = Boolean(
    user.image &&
      (user.image.startsWith("http://") ||
        user.image.startsWith("https://") ||
        user.image.startsWith("/"))
  );
  const userInitial = user.name ? user.name.charAt(0).toUpperCase() : null;

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
      toast.add({
        title: "Sign Out Failed",
        description: "Could not sign out right now. Please try again.",
        type: "error",
      });
    }
  };

  const renderAvatar = (size: number, textClass = "text-xs") => (
    <div
      style={{ width: size, height: size }}
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#844353] ${textClass} font-bold text-white shadow-2xs`}
    >
      {hasValidImage ? (
        <Image
          src={user.image!}
          alt={user.name || "User"}
          width={size}
          height={size}
          className="h-full w-full object-cover"
        />
      ) : userInitial ? (
        <span className="font-semibold uppercase select-none">{userInitial}</span>
      ) : (
        <User className="h-3.5 w-3.5 text-white" />
      )}
    </div>
  );

  const dashboardHref = `/dashboard/${user.role || "customer"}`;
  const profileHref = `${dashboardHref}/profile`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 rounded-full border border-stone-200/90 bg-white p-1 pr-2.5 shadow-2xs hover:bg-[#FAF5F7] transition-colors cursor-pointer outline-none">
        {renderAvatar(28)}
        <ChevronDown className="h-3.5 w-3.5 text-stone-500" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-52 rounded-xl border border-stone-200 bg-white p-1.5 shadow-lg">
        <div className="flex items-center gap-2.5 border-b border-stone-100 px-2.5 py-2">
          {renderAvatar(32)}
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-stone-800">
              {user.name || "User"}
            </p>
            <p className="truncate text-[11px] text-stone-500">
              {user.email || ""}
            </p>
          </div>
        </div>

        <div className="pt-1">
          <DropdownMenuItem
            render={<Link href={dashboardHref} />}
            className="flex items-center gap-2 rounded-md px-3 py-2 text-xs text-stone-700 hover:bg-stone-100 cursor-pointer"
          >
            <LayoutDashboard className="h-3.5 w-3.5" />
            Dashboard
          </DropdownMenuItem>
          <DropdownMenuItem
            render={<Link href={profileHref} />}
            className="flex items-center gap-2 rounded-md px-3 py-2 text-xs text-stone-700 hover:bg-stone-100 cursor-pointer"
          >
            <Settings className="h-3.5 w-3.5" />
            Profile Settings
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleSignOut}
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs text-red-600 hover:bg-red-50 cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            Logout
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
