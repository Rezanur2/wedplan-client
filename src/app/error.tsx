"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Platform application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#FAF6F7] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6">
        
        {/* Error Icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-rose-50 text-rose-600 border border-rose-100 shadow-2xs">
          <AlertTriangle className="h-10 w-10 text-rose-600" />
        </div>

        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200/80 bg-rose-50/70 px-3 py-1 text-[11px] font-bold tracking-wider text-rose-700 uppercase shadow-2xs">
            <span>Something Went Wrong</span>
          </span>

          <h1 className="font-serif text-3xl font-bold text-stone-900 tracking-tight">
            We Hit an Unexpected Snag
          </h1>

          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-sm mx-auto">
            We encountered a temporary issue while fetching your wedding planning data. You can try refreshing the action or head back to the home page.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#844353] px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-[#6e3745] transition cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Try Again</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white px-5 py-2.5 text-xs font-semibold text-stone-700 shadow-2xs hover:bg-stone-50 transition cursor-pointer"
          >
            <Home className="h-4 w-4 text-stone-500" />
            <span>Return to Home</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
