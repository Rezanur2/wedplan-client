import React from "react";

export default function AdminOverviewLoading() {
  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-12 animate-pulse">
      {/* Header Skeleton */}
      <div className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 space-y-3">
        <div className="h-6 w-36 rounded-full bg-stone-200" />
        <div className="h-8 w-64 rounded-lg bg-stone-200" />
        <div className="h-4 w-96 max-w-full rounded bg-stone-100" />
      </div>

      {/* Cards Skeleton */}
      <div className="space-y-3">
        <div className="h-4 w-40 rounded bg-stone-200" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {[1, 2, 3, 4, 5, 6].map((skeletonIndex) => (
            <div
              key={skeletonIndex}
              className="rounded-2xl border border-stone-200 bg-white p-5 space-y-4"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="h-3.5 w-28 rounded bg-stone-200" />
                  <div className="h-7 w-16 rounded bg-stone-300" />
                </div>
                <div className="h-10 w-10 rounded-xl bg-stone-100" />
              </div>
              <div className="h-3 w-40 rounded bg-stone-100" />
            </div>
          ))}
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="rounded-2xl border border-stone-200 bg-white p-6 space-y-4">
        <div className="h-5 w-48 rounded bg-stone-200" />
        <div className="space-y-3">
          {[1, 2, 3].map((skeletonIndex) => (
            <div
              key={skeletonIndex}
              className="flex items-center justify-between py-2 border-b border-stone-100"
            >
              <div className="space-y-1.5">
                <div className="h-4 w-40 rounded bg-stone-200" />
                <div className="h-3 w-28 rounded bg-stone-100" />
              </div>
              <div className="h-6 w-20 rounded-full bg-stone-100" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
