import React from "react";
import { Loader2 } from "lucide-react";

export default function ServicesLoading() {
  const skeletonCards = Array.from({ length: 6 });

  return (
    <div className="min-h-screen bg-[#FAF6F7] pb-20 pt-8 sm:pt-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Skeleton */}
        <div className="space-y-3">
          <div className="h-6 w-44 rounded-full bg-rose-100/70 animate-pulse" />
          <div className="h-10 w-80 sm:w-96 rounded-xl bg-stone-200/80 animate-pulse" />
          <div className="h-4 w-64 sm:w-80 rounded-md bg-stone-200/60 animate-pulse" />
        </div>

        {/* Filter Controls Skeleton */}
        <div className="mt-8 rounded-2xl border border-stone-200 bg-white p-4 shadow-2xs">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="h-10 rounded-xl bg-stone-100 animate-pulse sm:col-span-2" />
            <div className="h-10 rounded-xl bg-stone-100 animate-pulse" />
            <div className="h-10 rounded-xl bg-stone-100 animate-pulse" />
          </div>
        </div>

        {/* Status Bar Skeleton */}
        <div className="mt-4 flex items-center justify-between px-1">
          <div className="h-4 w-48 rounded-md bg-stone-200/50 animate-pulse" />
          <div className="h-4 w-32 rounded-md bg-stone-200/50 animate-pulse" />
        </div>

        {/* Services Cards Grid Skeleton */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skeletonCards.map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-2xs"
            >
              <div className="relative h-56 w-full bg-stone-100 animate-pulse flex items-center justify-center">
                <Loader2 className="h-6 w-6 text-stone-300 animate-spin" />
              </div>
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="h-4 w-24 rounded-full bg-stone-100 animate-pulse" />
                  <div className="h-4 w-16 rounded-md bg-stone-100 animate-pulse" />
                </div>
                <div className="h-5 w-3/4 rounded-md bg-stone-200 animate-pulse" />
                <div className="h-4 w-1/2 rounded-md bg-stone-100 animate-pulse" />
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  <div className="h-6 w-20 rounded-md bg-stone-200 animate-pulse" />
                  <div className="h-9 w-28 rounded-xl bg-rose-100/60 animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
