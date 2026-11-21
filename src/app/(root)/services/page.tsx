import React, { Suspense } from "react";
import Link from "next/link";
import { CheckCircle2, ShieldCheck, RotateCcw, SearchX } from "lucide-react";
import ServiceCard from "@/components/services/ServiceCard";
import ServiceFilters from "@/components/services/ServiceFilters";
import ResetFiltersButton from "@/components/services/ResetFiltersButton";
import { getServices } from "@/lib/api/services";
import { IVendorService } from "@/types";

export const metadata = {
  title: "Browse Services | WedPlan",
  description: "Explore verified wedding venues, photographers, florists, caterers, and stylists.",
};

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// 1. Skeleton loader for the services grid
function ServicesLoadingSkeleton() {
  return (
    <div className="mt-8">
      <p className="text-xs text-stone-500 mb-4 animate-pulse">Loading services...</p>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col overflow-hidden rounded-2xl border border-stone-200/70 bg-white p-3.5 shadow-xs"
          >
            <div className="h-44 sm:h-48 w-full rounded-xl bg-stone-200/80 animate-pulse" />
            <div className="mt-3 space-y-2">
              <div className="h-3 w-20 rounded bg-stone-200 animate-pulse" />
              <div className="h-4 w-3/4 rounded bg-stone-200 animate-pulse" />
              <div className="h-3 w-full rounded bg-stone-200/70 animate-pulse" />
              <div className="pt-3 border-t border-stone-100 flex justify-between items-center">
                <div className="h-7 w-20 rounded bg-stone-200 animate-pulse" />
                <div className="h-9 w-full rounded-xl bg-stone-200 animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 2. Async Services Grid that fetches data independently inside Suspense
async function ServicesGrid({ query }: { query: string }) {
  const services = (await getServices(query)) as IVendorService[];

  if (services.length === 0) {
    return (
      <div className="mt-12 flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-white p-12 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-[#844353]">
          <SearchX className="h-6 w-6" />
        </div>
        <h3 className="mt-4 font-serif text-lg font-bold text-stone-900">
          No Wedding Services Found
        </h3>
        <p className="mt-1 max-w-sm text-xs text-stone-500">
          We couldn&apos;t find any vendors matching your current search or category filter. Try clearing your search or adjusting the location.
        </p>
        <ResetFiltersButton />
      </div>
    );
  }

  return (
    <>
      {/* Status Sub-bar */}
      <div className="mt-4 flex flex-col gap-2 text-xs text-stone-500 sm:flex-row sm:items-center sm:justify-between px-1">
        <div className="flex items-start sm:items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-[#844353] mt-0.5 sm:mt-0" />
          <span className="leading-relaxed">
            Every vendor is personally vetted for safety, style, and responsiveness.
          </span>
        </div>

        <div className="shrink-0 text-stone-600 pl-6 sm:pl-0">
          Showing <span className="font-semibold text-stone-900">{services.length}</span> verified services
        </div>
      </div>

      {/* Cards Grid */}
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <ServiceCard
            key={service._id || service.id}
            service={service}
          />
        ))}
      </div>
    </>
  );
}

// 3. Main Page
export default async function BrowseServicesPage({ searchParams }: PageProps) {
  const search = await searchParams;
  const urlSearch = new URLSearchParams(search as Record<string, string>);
  const query = urlSearch.toString();

  const currentSearch = (search.search as string) || "";
  const currentCategory = (search.category as string) || "All";
  const currentLocation = (search.location as string) || "";
  const currentSort = (search.sort as string) || "recommended";

  return (
    <div className="min-h-screen bg-[#FAF6F7] pb-20 pt-8 sm:pt-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Top Header Section */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2.5">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-rose-200/80 bg-rose-50/70 px-3 py-1 text-[11px] font-bold tracking-wider text-[#844353] uppercase shadow-2xs">
              <CheckCircle2 className="h-3.5 w-3.5 text-[#844353]" />
              <span>Discover Wedding Vendors</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-stone-900">
              Find Your Perfect Wedding Team
            </h1>

            <p className="max-w-2xl text-xs sm:text-sm text-stone-600 leading-relaxed">
              Browse verified venues, photographers, florists, caterers, and stylists for your special day.
            </p>
          </div>
        </div>

        {/* Search & Filter Bar*/}
        <ServiceFilters
          initialSearch={currentSearch}
          initialCategory={currentCategory}
          initialLocation={currentLocation}
          initialSort={currentSort}
        />

        {/* Suspense Boundary ONLY for the cards grid */}
        <Suspense key={query} fallback={<ServicesLoadingSkeleton />}>
          <ServicesGrid query={query} />
        </Suspense>

        {/* Strict Atelier Standard Banner */}
        <div className="mt-16 flex items-center justify-center px-2">
          <div className="inline-flex items-start sm:items-center gap-2.5 rounded-2xl sm:rounded-full border border-stone-200/80 bg-white/80 px-4 py-2.5 sm:py-2 text-xs text-stone-600 shadow-2xs backdrop-blur-xs max-w-xl">
            <ShieldCheck className="h-4 w-4 shrink-0 text-[#844353] mt-0.5 sm:mt-0" />
            <span className="leading-relaxed">
              Strict Atelier Standard: Only approved and active services appear in the public marketplace.
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
