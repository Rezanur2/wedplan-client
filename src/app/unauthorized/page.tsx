import React from "react";
import Link from "next/link";
import { ShieldAlert, Home, LogIn } from "lucide-react";

export const metadata = {
  title: "Access Restricted | WedPlan",
  description: "You do not have permission to view this section of the WedPlan dashboard.",
};

export default function UnauthorizedPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      {/* Unauthorized Access Card */}
      <div className="w-full max-w-md rounded-2xl border border-stone-200 bg-white p-6 sm:p-8 text-center shadow-sm">
        {/* Shield Icon */}
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-[#844353] border border-rose-100 shadow-2xs">
          <ShieldAlert className="h-7 w-7" />
        </div>

        {/* Status Badge */}
        <div className="mt-4 inline-flex items-center rounded-full bg-stone-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-stone-600">
          403 / Access Restricted
        </div>

        {/* Heading and Description */}
        <h1 className="mt-3 font-serif text-2xl sm:text-3xl font-bold text-stone-900">
          Permission Denied
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-stone-500 leading-relaxed">
          You do not have the required role or permissions to view this section of the WedPlan dashboard.
        </p>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2.5">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#844353] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#6f3745] shadow-2xs"
          >
            <Home className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>

          <Link
            href="/signin"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white px-5 py-2.5 text-xs font-semibold text-stone-700 transition hover:bg-stone-50 shadow-2xs"
          >
            <LogIn className="h-4 w-4" />
            <span>Sign In Differently</span>
          </Link>
        </div>
      </div>
    </div>
  );
}