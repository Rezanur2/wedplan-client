import React from "react";

export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-12 animate-pulse">
      {/* 1. Top Header Skeleton */}
      <div className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 space-y-3 shadow-2xs">
        <div className="h-6 w-36 rounded-full bg-rose-100/70" />
        <div className="h-8 w-64 rounded-xl bg-stone-200" />
        <div className="h-4 w-96 max-w-full rounded-md bg-stone-100" />
      </div>

      {/* 2. Stats Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((statIndex) => (
          <div
            key={statIndex}
            className="rounded-2xl border border-stone-200 bg-white p-5 space-y-4 shadow-2xs"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="h-3.5 w-24 rounded bg-stone-200" />
                <div className="h-7 w-16 rounded bg-stone-300" />
              </div>
              <div className="h-10 w-10 rounded-xl bg-rose-50" />
            </div>
            <div className="h-3 w-32 rounded bg-stone-100" />
          </div>
        ))}
      </div>

      {/* 3. Table / Cards Section Skeleton */}
      <div className="rounded-2xl border border-stone-200 bg-white p-6 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="h-5 w-48 rounded bg-stone-200" />
          <div className="h-8 w-28 rounded-xl bg-stone-100" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((rowIndex) => (
            <div
              key={rowIndex}
              className="flex items-center justify-between py-3 border-b border-stone-100 last:border-0"
            >
              <div className="space-y-1.5">
                <div className="h-4 w-48 rounded bg-stone-200" />
                <div className="h-3 w-32 rounded bg-stone-100" />
              </div>
              <div className="h-6 w-20 rounded-full bg-stone-100" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
