"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { toast } from "@/components/ui/toast";
import Logo from "./Logo";
import UserDropdown from "./UserDropdown";
import { IDashboardUser } from "@/types";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Browse Services", href: "/services" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const { data: session } = useSession();
  const user = session?.user as IDashboardUser | undefined;

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

  return (
    <header className="sticky top-0 z-50 w-full border-b border-stone-200 bg-[#FAF6F7]/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        
        {/* Brand / Logo */}
        <Logo />

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
            <UserDropdown user={user} />
          ) : (
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
          {user && <UserDropdown user={user} />}

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-md p-2 text-stone-700 hover:bg-stone-200/50 cursor-pointer"
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
