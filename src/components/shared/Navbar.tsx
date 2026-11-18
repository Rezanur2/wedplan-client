"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, User, LogOut, LayoutDashboard, Settings } from "lucide-react";
import { authClient } from "@/lib/auth-client";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Browse Services", href: "/services" },
  { name: "Categories", href: "/#categories" },
  { name: "Become a Vendor", href: "/sign-up?role=vendor" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // Authentication state
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const handleSignOut = async () => {
    setProfileOpen(false);
    setIsOpen(false);
    await authClient.signOut();
  };

  const dropLinks = (
    <>
      <Link
        href="/dashboard"
        onClick={() => setProfileOpen(false)}
        className="flex items-center gap-2 rounded-md px-3 py-2 text-xs text-stone-700 hover:bg-stone-100"
      >
        <LayoutDashboard className="h-3.5 w-3.5" />
        Dashboard
      </Link>
      <Link
        href="/dashboard/profile"
        onClick={() => setProfileOpen(false)}
        className="flex items-center gap-2 rounded-md px-3 py-2 text-xs text-stone-700 hover:bg-stone-100"
      >
        <Settings className="h-3.5 w-3.5" />
        Profile Settings
      </Link>
      <button
        type="button"
        onClick={handleSignOut}
        className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs text-red-600 hover:bg-red-50"
      >
        <LogOut className="h-3.5 w-3.5" />
        Logout
      </button>
    </>
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

        {/* Desktop Auth Controls & Avatar */}
        <div className="hidden items-center gap-3 md:flex">
          {!user && (
            <>
              <Link
                href="/sign-in"
                className="px-3 py-1.5 text-sm font-medium text-stone-700 hover:text-stone-950"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="rounded-md bg-[#844353] px-4 py-2 text-sm font-medium text-white hover:bg-[#723645]"
              >
                Get Started
              </Link>
            </>
          )}

          {/* User Avatar & Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-stone-900 text-white shadow-xs hover:bg-stone-800 transition-colors"
              aria-label="User profile"
            >
              {user?.image ? (
                <Image
                  src={user.image}
                  alt={user.name || "User Avatar"}
                  width={36}
                  height={36}
                  className="h-full w-full object-cover"
                />
              ) : (
                <User className="h-4 w-4 text-white" />
              )}
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-lg border border-stone-200 bg-white p-1.5 shadow-md">
                <div className="border-b border-stone-100 px-3 py-2">
                  <p className="truncate text-xs font-semibold text-stone-800">
                    {user?.name || "Demo User"}
                  </p>
                  <p className="truncate text-[11px] text-stone-500">
                    {user?.email || "user@wedplan.com"}
                  </p>
                </div>
                {dropLinks}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center md:hidden">
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

          <div className="mt-4 border-t border-stone-200 pt-3">
            {user ? (
              <div className="space-y-1">
                <div className="px-3 py-1">
                  <p className="text-sm font-semibold text-stone-800">{user.name}</p>
                  <p className="text-xs text-stone-500">{user.email}</p>
                </div>
                {dropLinks}
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href="/sign-in"
                  onClick={() => setIsOpen(false)}
                  className="w-full rounded-md border border-stone-200 bg-white py-2 text-center text-sm font-medium text-stone-800"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  onClick={() => setIsOpen(false)}
                  className="w-full rounded-md bg-[#844353] py-2 text-center text-sm font-medium text-white"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
