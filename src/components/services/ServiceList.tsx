"use client";

import React from "react";
import ServiceCard from "./ServiceCard";
import ResetFiltersButton from "./ResetFiltersButton";
import { SearchX } from "lucide-react";
import { IVendorService } from "@/types";

interface ServiceListProps {
  services: IVendorService[];
}

export default function ServiceList({ services }: ServiceListProps) {
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
    <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((service) => (
        <ServiceCard
          key={service._id || service.id}
          service={service}
        />
      ))}
    </div>
  );
}
