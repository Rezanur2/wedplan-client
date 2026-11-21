"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Plus,
  BarChart3,
  PieChart,
  ShieldCheck,
} from "lucide-react";
import { IVendorService } from "@/types";
import ServiceCard from "./ServiceCard";
import EmptySlotCard from "./EmptySlotCard";

type FilterTab = "all" | "active" | "review";

interface MyServicesListProps {
  services?: IVendorService[];
}

export default function MyServicesList({
  services = [],
}: MyServicesListProps) {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  // Tab counts
  const totalCount = services.length;
  const activeCount = services.filter((s) => s.status === "Active").length;
  const reviewCount = services.filter(
    (s) => s.status === "Pending" || s.status === "Under Review"
  ).length;

  // Filtered services based on current active tab
  const filteredServices = services.filter((s) => {
    if (activeTab === "active") return s.status === "Active";
    if (activeTab === "review")
      return s.status === "Pending" || s.status === "Under Review";
    return true;
  });

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-12">
      {/* 1. Header Row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-500">
            <span>VENDOR / Services</span>
          </div>
          <h1 className="mt-1 font-serif text-3xl sm:text-4xl text-stone-900">
            My Services
          </h1>
          <p className="mt-1 text-xs text-stone-500">
            Manage your wedding listings, track views and booking inquiries, or add new services.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/dashboard/vendor"
            className="inline-flex h-9 items-center justify-center rounded-lg border border-stone-200 px-3 text-xs font-medium text-stone-700 hover:bg-stone-50 transition"
          >
            <BarChart3 className="mr-1.5 h-3.5 w-3.5" />
            View Analytics
          </Link>

          <Link
            href="/dashboard/vendor/add-service"
            className="inline-flex h-9 items-center justify-center rounded-lg bg-[#844353] px-3.5 text-xs font-medium text-white hover:bg-[#6e3745] transition"
          >
            <Plus className="mr-1.5 h-4 w-4" />
            Add New Service
          </Link>
        </div>
      </div>

      {/* 2. Plan Banner */}
      <div className="flex flex-col gap-4 rounded-2xl border border-stone-200 bg-white p-4 sm:p-5 shadow-2xs md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-stone-100">
            <PieChart className="h-5 w-5 text-[#844353]" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-sm font-semibold text-stone-900">
                Free Plan: {services.length} of 3 services used
              </h2>
              <span className="rounded-full bg-pink-100/80 px-2 py-0.5 text-[10px] font-semibold text-pink-700">
                {Math.max(0, 3 - services.length)} slot left
              </span>
            </div>
            <p className="mt-0.5 text-xs text-stone-500">
              Free accounts can list up to 3 services. Upgrade to Premium for unlimited listings and priority display.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3.5 shrink-0 self-end md:self-center">
          <div className="h-2 w-24 rounded-full bg-stone-100 overflow-hidden">
            <div
              className="h-full bg-[#844353] transition-all"
              style={{ width: `${(services.length / 3) * 100}%` }}
            />
          </div>

          <Link
            href="/dashboard/vendor/subscription"
            className="inline-flex items-center justify-center rounded-lg border border-[#844353] px-3.5 py-1.5 text-xs font-semibold text-[#844353] hover:bg-rose-50 transition"
          >
            Upgrade Plan
          </Link>
        </div>
      </div>

      {/* 3. Filter Tabs & Accreditation */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-1">
        {/* Filter Pills */}
        <div className="inline-flex rounded-xl bg-stone-100 p-1">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition cursor-pointer ${
              activeTab === "all"
                ? "bg-white text-stone-900 shadow-2xs"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <span>All Services</span>
            <span className="rounded-full bg-stone-100 px-1.5 py-0.2 text-[10px] text-stone-500 font-semibold">
              {totalCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("active")}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition cursor-pointer ${
              activeTab === "active"
                ? "bg-white text-stone-900 shadow-2xs"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <span>Active</span>
            <span className="rounded-full bg-stone-100 px-1.5 py-0.2 text-[10px] text-stone-500 font-semibold">
              {activeCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("review")}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition cursor-pointer ${
              activeTab === "review"
                ? "bg-white text-stone-900 shadow-2xs"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <span>Under Review</span>
            <span className="rounded-full bg-amber-100 px-1.5 py-0.2 text-[10px] text-amber-700 font-semibold">
              {reviewCount}
            </span>
          </button>
        </div>

        {/* Accreditation Badge */}
        <div className="flex items-center gap-1.5 text-xs text-stone-500">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span>Verified Vendor Accreditation</span>
        </div>
      </div>

      {/* 4. Responsive Grid of Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredServices.map((service) => (
          <ServiceCard
            key={service.id || service._id || service.serviceName}
            service={service}
          />
        ))}

        {/* Show Empty Slot Card when on All tab and under 3 services */}
        {activeTab === "all" && services.length < 3 && (
          <EmptySlotCard remainingSlots={Math.max(1, 3 - services.length)} />
        )}
      </div>

      {/* 5. Pagination / Footer Info */}
      <div className="flex items-center justify-between border-t border-stone-200 pt-4 text-xs text-stone-500">
        <div>
          Showing <span className="font-medium text-stone-800">1–{filteredServices.length}</span> of{" "}
          <span className="font-medium text-stone-800">{totalCount}</span> services
        </div>

        <div className="flex items-center gap-1">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-stone-900 text-xs font-medium text-white shadow-2xs">
            1
          </span>
        </div>
      </div>
    </div>
  );
}
