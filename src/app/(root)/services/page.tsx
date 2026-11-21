import React from "react";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import ServiceFilters from "@/components/services/ServiceFilters";
import ServiceList from "@/components/services/ServiceList";
import { getServices } from "@/lib/api/services";
import { IVendorService } from "@/types";

export const metadata = {
  title: "Browse Services | WedPlan",
  description: "Explore verified wedding venues, photographers, florists, caterers, and stylists.",
};

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function BrowseServicesPage({ searchParams }: PageProps) {
  const search = await searchParams;
  const urlSearch = new URLSearchParams(search as Record<string, string>);
  const query = urlSearch.toString();

  // 1. Fetch data directly from backend
  const services = (await getServices(query)) as IVendorService[];

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

        {/* Search & Filter Controls */}
        <ServiceFilters
          initialSearch={currentSearch}
          initialCategory={currentCategory}
          initialLocation={currentLocation}
          initialSort={currentSort}
        />

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

        {/* Services List */}
        <ServiceList services={services} />

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
