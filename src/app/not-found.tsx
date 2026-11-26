import React from "react";
import Link from "next/link";
import { SearchX, ArrowLeft, Home, Sparkles } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAF6F7] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6">
        
        {/* Decorative Badge & Icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-rose-50 text-[#844353] border border-rose-100 shadow-2xs">
          <SearchX className="h-10 w-10 text-[#844353]" />
        </div>

        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200/80 bg-rose-50/70 px-3 py-1 text-[11px] font-bold tracking-wider text-[#844353] uppercase shadow-2xs">
            <Sparkles className="h-3.5 w-3.5" />
            <span>404 • Page Not Found</span>
          </span>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
            Lost Your Way to the Celebration?
          </h1>

          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-sm mx-auto">
            The wedding page, service listing, or reservation you are looking for doesn&apos;t exist or may have been relocated.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#844353] px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-[#6e3745] transition cursor-pointer"
          >
            <Home className="h-4 w-4" />
            <span>Return to Home</span>
          </Link>

          <Link
            href="/services"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white px-5 py-2.5 text-xs font-semibold text-stone-700 shadow-2xs hover:bg-stone-50 transition cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4 text-stone-500" />
            <span>Browse Services</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
