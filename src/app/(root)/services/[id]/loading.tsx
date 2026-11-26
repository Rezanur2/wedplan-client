import React from "react";
import { Loader2 } from "lucide-react";

export default function ServiceDetailsLoading() {
  return (
    <div className="min-h-screen bg-[#FCFBF9] pb-24 pt-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* 1. Breadcrumb Skeleton */}
        <div className="mb-5 flex items-center justify-between gap-2">
          <div className="h-4 w-48 rounded-md bg-stone-200/70 animate-pulse" />
          <div className="h-6 w-28 rounded-full bg-rose-100/70 animate-pulse" />
        </div>

        {/* 2. Two-Column Layout Skeleton */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Left Column: Gallery, Title, Price, Description */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            <div className="aspect-16/10 sm:aspect-video w-full rounded-2xl sm:rounded-3xl bg-stone-100 border border-stone-200 animate-pulse flex items-center justify-center">
              <Loader2 className="h-7 w-7 text-stone-300 animate-spin" />
            </div>

            <div className="space-y-3 border-b border-stone-200/80 pb-6">
              <div className="h-5 w-32 rounded-full bg-rose-100/60 animate-pulse" />
              <div className="h-9 w-3/4 rounded-xl bg-stone-200 animate-pulse" />
              <div className="h-4 w-44 rounded-md bg-stone-100 animate-pulse" />
            </div>

            <div className="h-28 w-full rounded-2xl border border-stone-200 bg-white animate-pulse" />
            <div className="h-40 w-full rounded-2xl border border-stone-200 bg-white animate-pulse" />
          </div>

          {/* Right Column: Booking Card Skeleton */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="rounded-2xl sm:rounded-3xl border border-stone-200 bg-white p-6 space-y-4 shadow-2xs">
              <div className="h-6 w-44 rounded-lg bg-stone-200 animate-pulse" />
              <div className="h-4 w-60 rounded-md bg-stone-100 animate-pulse" />
              <div className="space-y-3 pt-2">
                <div className="h-10 w-full rounded-xl bg-stone-100 animate-pulse" />
                <div className="h-10 w-full rounded-xl bg-stone-100 animate-pulse" />
                <div className="h-24 w-full rounded-xl bg-stone-100 animate-pulse" />
                <div className="h-11 w-full rounded-xl bg-rose-100/70 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
