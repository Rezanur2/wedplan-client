"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, User, LogOut, LayoutDashboard, Settings, ChevronDown } from "lucide-react";
import { signOut, useSession } from "@/lib/auth-client";
import { toast } from "@/components/ui/toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Browse Services", href: "/services" },
  { name: "Categories", href: "/#categories" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter()

  // Authentication state
  const { data: session } = useSession();
  const user = session?.user;
  const hasValidImage = Boolean(
    user?.image &&
      (user.image.startsWith("http://") ||
        user.image.startsWith("https://") ||
        user.image.startsWith("/"))
  );
  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : null;

  const renderUserAvatar = (size: number, textClass = "text-xs") => (
    <div
      style={{ width: size, height: size }}
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#844353] ${textClass} font-bold text-white shadow-2xs`}
    >
      {hasValidImage ? (
        <Image
          src={user!.image!}
          alt={user?.name || "User Avatar"}
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

  // Show toast when returning from Google OAuth redirect
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("auth") === "google_success" && user) {
      toast.add({
        title: "Signed In",
        description: `Welcome to WedPlan, ${user.name || "User"}!`,
        type: "success",
      });
      const url = new URL(window.location.href);
      url.searchParams.delete("auth");
      window.history.replaceState({}, "", url.pathname + (url.search ? url.search : ""));
    }
  }, [user]);

  const handleSignOut = async () => {
    setIsOpen(false);
    await signOut();
    toast.add({
      title: "Signed Out",
      description: "You have been logged out safely.",
      type: "info",
    });
    router.push("/signin");
    router.refresh();
  };

  const dashboardHref = `/dashboard/${user?.role || "customer"}`;
  const profileHref = `${dashboardHref}/profile`;

  const profileMenuContent = (
    <DropdownMenuContent align="end" className="w-52 rounded-xl border border-stone-200 bg-white p-1.5 shadow-lg">
      <div className="flex items-center gap-2.5 border-b border-stone-100 px-2.5 py-2">
        {renderUserAvatar(32)}
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold text-stone-800">
            {user?.name}
          </p>
          <p className="truncate text-[11px] text-stone-500">
            {user?.email}
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
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-stone-200 bg-[#FAF6F7]/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        
        {/* Brand / Logo */}
        <Link href="/" className="group flex items-center gap-2.5">
          <div className="relative h-10 w-10 overflow-hidden rounded-xl shadow-xs transition-transform duration-200 group-hover:scale-105">
            <Image
              src="/images/logo.png"
              alt="WedPlan Logo"
              fill
              sizes="40px"
              className="object-contain"
              priority
            />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-serif text-2xl font-bold tracking-tight text-stone-900">
              Wed <span className="text-[#844353]">Plan</span>
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`relative py-1 text-sm font-medium transition-colors ${
                  isActive
                    ? "font-semibold text-stone-900 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-stone-900"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Auth Controls */}
        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            /* User Avatar and Dropdown */
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 rounded-full border border-stone-200/90 bg-white p-1 pr-2.5 shadow-2xs hover:bg-[#FAF5F7] transition-colors cursor-pointer outline-none">
                {renderUserAvatar(28)}
                <ChevronDown className="h-3.5 w-3.5 text-stone-500" />
              </DropdownMenuTrigger>
              {profileMenuContent}
            </DropdownMenu>
          ) : (
            /* Sign In and Sign Up */
            <>
              <Link
                href="/signin"
                className="px-3 py-1.5 text-sm font-medium text-stone-700 hover:text-stone-950"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="rounded-md bg-[#844353] px-4 py-2 text-sm font-medium text-white hover:bg-[#723645]"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Header Controls */}
        <div className="flex items-center gap-2 md:hidden">
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1.5 rounded-full border border-stone-200/90 bg-white p-1 pr-2 shadow-2xs hover:bg-[#FAF5F7] transition-colors cursor-pointer outline-none">
                {renderUserAvatar(24, "text-[11px]")}
                <ChevronDown className="h-3 w-3 text-stone-500" />
              </DropdownMenuTrigger>
              {profileMenuContent}
            </DropdownMenu>
          )}

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-md p-2 text-stone-700 hover:bg-stone-200/50"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="border-t border-stone-200 bg-[#FAF6F7] px-4 py-4 md:hidden">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`rounded-md px-3 py-2 text-sm font-medium ${
                  pathname === link.href
                    ? "bg-white font-semibold text-stone-900"
                    : "text-stone-600 hover:bg-white/60"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {!user && (
            <div className="mt-4 border-t border-stone-200 pt-3 flex flex-col gap-2">
              <Link
                href="/signin"
                onClick={() => setIsOpen(false)}
                className="w-full rounded-md border border-stone-200 bg-white py-2 text-center text-sm font-medium text-stone-800"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                onClick={() => setIsOpen(false)}
                className="w-full rounded-md bg-[#844353] py-2 text-center text-sm font-medium text-white"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
