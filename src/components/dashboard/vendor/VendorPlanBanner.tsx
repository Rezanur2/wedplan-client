import React from "react";
import Link from "next/link";
import { PieChart } from "lucide-react";

interface VendorPlanBannerProps {
  activeCount?: number;
  isPremium?: boolean;
}

export default function VendorPlanBanner({
  activeCount = 0,
  isPremium = false,
}: VendorPlanBannerProps) {
  // Hide banner completely for premium vendors
  if (isPremium) return null;

  const maxLimit = 3;
  const remaining = Math.max(0, maxLimit - activeCount);
  const progressPercent = Math.min(100, (activeCount / maxLimit) * 100);

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-stone-200 bg-white p-4 sm:p-5 shadow-2xs md:flex-row md:items-center md:justify-between">
      {/* Plan Details & Icon */}
      <div className="flex items-start gap-3.5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-stone-100">
          <PieChart className="h-5 w-5 text-[#844353]" />
        </div>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-sm font-semibold text-stone-900">
              {isPremium
                ? "Premium Plan: Unlimited"
                : `Free Plan: ${activeCount} of ${maxLimit} services used`}
            </h2>
            {!isPremium && (
              <span className="rounded-full bg-pink-100/80 px-2 py-0.5 text-[10px] font-semibold text-pink-700">
                {remaining} slot left
              </span>
            )}
          </div>
          <p className="mt-0.5 text-xs text-stone-500">
            Free accounts can list up to 3 services. Upgrade to Premium for
            unlimited listings and priority display.
          </p>
        </div>
      </div>

      {/* Usage Progress Bar & Upgrade Button */}
      <div className="flex items-center gap-3.5 shrink-0 self-end md:self-center">
        {!isPremium && (
          <div className="h-2 w-24 rounded-full bg-stone-100 overflow-hidden">
            <div
              className="h-full bg-[#844353] transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}

        <Link
          href="/dashboard/vendor/subscription"
          className="inline-flex items-center justify-center rounded-lg border border-[#844353] px-3.5 py-1.5 text-xs font-semibold text-[#844353] hover:bg-rose-50 transition"
        >
          Upgrade Plan
        </Link>
      </div>
    </div>
  );
}
