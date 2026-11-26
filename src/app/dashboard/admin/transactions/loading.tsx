import React from "react";

export default function TransactionsLoading() {
  return (
    <div className="space-y-6 pb-12 animate-pulse">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <div className="h-7 w-56 rounded-lg bg-stone-200" />
        <div className="h-4 w-72 rounded-lg bg-stone-100" />
      </div>

      {/* Search Input Skeleton */}
      <div className="h-9 w-full sm:w-80 rounded-xl bg-stone-100" />

      {/* Table Skeleton */}
      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-2xs">
        <div className="h-10 bg-stone-50 border-b border-stone-200" />
        <div className="divide-y divide-stone-100 p-4 space-y-4">
          {[1, 2, 3, 4, 5].map((skeletonIndex) => (
            <div
              key={skeletonIndex}
              className="flex items-center justify-between py-2 gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-stone-200 shrink-0" />
                <div className="space-y-1.5">
                  <div className="h-3.5 w-36 rounded bg-stone-200" />
                  <div className="h-2.5 w-24 rounded bg-stone-100" />
                </div>
              </div>
              <div className="h-5 w-28 rounded-full bg-stone-100" />
              <div className="h-4 w-16 rounded bg-stone-200" />
              <div className="h-5 w-16 rounded-full bg-stone-100" />
              <div className="h-3.5 w-20 rounded bg-stone-100" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
