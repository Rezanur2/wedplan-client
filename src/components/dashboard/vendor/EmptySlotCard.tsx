import React from "react";
import Link from "next/link";
import { Store, Plus } from "lucide-react";

interface EmptySlotCardProps {
  remainingSlots?: number;
}

export default function EmptySlotCard({ remainingSlots = 1 }: EmptySlotCardProps) {

  const serviceOrder = remainingSlots === 3 ? "1st" : remainingSlots === 2 ? "2nd" : "3rd";

  return (
    <div className="flex min-h-95 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-stone-200 bg-white/60 p-6 text-center transition hover:border-stone-300">
      {/* Icon */}
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-700 shadow-2xs mb-3">
        <Store className="h-6 w-6" />
      </div>

      {/* Badge */}
      <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-600">
        <span className="h-1.5 w-1.5 rounded-full bg-stone-400" />
        {remainingSlots} {remainingSlots === 1 ? "Free Slot" : "Free Slots"} Remaining
      </span>

      {/* Heading */}
      <h3 className="mt-3 font-serif text-xl font-medium text-stone-900">
        Add Your {serviceOrder} Service
      </h3>

      {/* Description */}
      <p className="mt-1.5 max-w-xs text-xs text-stone-500 leading-relaxed">
        You have {remainingSlots} free {remainingSlots === 1 ? "listing" : "listings"} remaining. Showcase another venue
        space, catering, or photography package.
      </p>

      {/* Action Buttons */}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
        <Link
          href="/dashboard/vendor/add-service"
          className="inline-flex h-9 items-center justify-center rounded-lg bg-[#844353] px-4 text-xs font-medium text-white hover:bg-[#6e3745] transition"
        >
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          Add Service
        </Link>

        <Link
          href="/dashboard/vendor/subscription"
          className="inline-flex h-9 items-center justify-center rounded-lg border border-stone-200 px-3.5 text-xs font-medium text-stone-700 hover:bg-stone-50 transition"
        >
          View Tier Limits
        </Link>
      </div>

      {/* Bottom Note */}
      <span className="mt-4 text-[11px] text-stone-400">
        No fee required to activate this slot.
      </span>
    </div>
  );
}
