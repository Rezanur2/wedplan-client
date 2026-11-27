"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Users,
  Store,
  Heart,
  Layers,
  Clock,
  Receipt,
  ArrowRight,
  MapPin,
  Eye,
} from "lucide-react";
import { IDashboardUser, IVendorService, ITransaction } from "@/types";
import { getPaidRevenueSummary } from "@/lib/utils";
import StatCard from "@/components/dashboard/shared/StatCard";
import EmptyState from "@/components/dashboard/shared/EmptyState";

interface AdminOverviewProps {
  currentUser?: IDashboardUser | null;
  usersList?: IDashboardUser[];
  servicesList?: IVendorService[];
  transactionsList?: ITransaction[];
}

const FALLBACK_SERVICE_IMAGE =
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80";

const SERVICE_STATUS_STYLES: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  "under review": "bg-amber-50 text-amber-700 border-amber-200",
  paused: "bg-stone-100 text-stone-700 border-stone-200",
  rejected: "bg-rose-50 text-rose-700 border-rose-200",
};

export default function AdminOverview({
  currentUser,
  usersList = [],
  servicesList = [],
  transactionsList = [],
}: AdminOverviewProps) {
  const totalUsersCount = usersList.length;
  const totalVendorsCount = usersList.filter(
    (userItem) => (userItem.role || "").toLowerCase() === "vendor"
  ).length;
  const totalCustomersCount = usersList.filter(
    (userItem) => (userItem.role || "").toLowerCase() === "customer"
  ).length;
  const totalServicesCount = servicesList.length;
  const pendingServicesCount = servicesList.filter((serviceItem) => {
    const status = (serviceItem.status || "pending").toLowerCase();
    return status === "pending" || status === "under review";
  }).length;
  const totalTransactionsCount = transactionsList.length;
  const { totalRevenue } = getPaidRevenueSummary(transactionsList);

  // Prioritize pending services first, limit overview preview to 5 items
  const recentServices = [...servicesList]
    .sort((firstService, secondService) => {
      const firstIsPending = (firstService.status || "pending").toLowerCase() === "pending";
      const secondIsPending = (secondService.status || "pending").toLowerCase() === "pending";
      if (firstIsPending === secondIsPending) return 0;
      return firstIsPending ? -1 : 1;
    })
    .slice(0, 5);

  const renderServiceStatusBadge = (statusText?: string) => {
    const label = statusText || "Pending";
    const styleClass =
      SERVICE_STATUS_STYLES[label.toLowerCase()] || SERVICE_STATUS_STYLES.pending;
    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold border ${styleClass}`}
      >
        {label}
      </span>
    );
  };

  const stats = [
    {
      title: "Total Registered Users",
      value: totalUsersCount,
      description: "All registered accounts",
      icon: Users,
      href: "/dashboard/admin/manage-users",
      iconBgColor: "bg-stone-100",
      iconTextColor: "text-stone-700",
    },
    {
      title: "Total Vendors",
      value: totalVendorsCount,
      description: "Registered service providers",
      icon: Store,
      href: "/dashboard/admin/manage-users",
      iconBgColor: "bg-rose-50",
      iconTextColor: "text-[#844353]",
    },
    {
      title: "Total Customers",
      value: totalCustomersCount,
      description: "Couples planning celebrations",
      icon: Heart,
      href: "/dashboard/admin/manage-users",
      iconBgColor: "bg-pink-50",
      iconTextColor: "text-pink-600",
    },
    {
      title: "Total Services",
      value: totalServicesCount,
      description: "Total catalog listings",
      icon: Layers,
      href: "/dashboard/admin/manage-services",
      iconBgColor: "bg-emerald-50",
      iconTextColor: "text-emerald-700",
    },
    {
      title: "Pending Services",
      value: pendingServicesCount,
      description:
        pendingServicesCount > 0
          ? "Awaiting your approval"
          : "All submissions reviewed",
      icon: Clock,
      href: "/dashboard/admin/manage-services",
      iconBgColor: pendingServicesCount > 0 ? "bg-amber-100" : "bg-stone-100",
      iconTextColor:
        pendingServicesCount > 0 ? "text-amber-800" : "text-stone-600",
    },
    {
      title: "Total Transactions",
      value: totalTransactionsCount,
      description: `Revenue: $${totalRevenue.toFixed(2)} USD`,
      icon: Receipt,
      href: "/dashboard/admin/transactions",
      iconBgColor: "bg-sky-50",
      iconTextColor: "text-sky-700",
    },
  ];

  const adminName = currentUser?.name || "Platform Admin";

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-12">
      {/* 1. Header Banner */}
      <div className="rounded-3xl border border-[#EFE5E9] bg-linear-to-br from-rose-50/60 via-white to-amber-50/30 p-6 sm:p-8 shadow-2xs">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200/80 bg-rose-50/80 px-2.5 py-0.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#844353] whitespace-nowrap shrink-0 shadow-2xs">
              <span className="h-1.5 w-1.5 rounded-full bg-[#844353]" />
              Admin Center • Platform Overview
            </span>
          </div>

          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Welcome back, {adminName}
          </h1>

          <p className="text-xs sm:text-sm text-stone-500 max-w-2xl">
            Monitor real-time platform statistics for registered users, services, and transactions.
          </p>
        </div>
      </div>

      {/* 2. Statistics Cards */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-500">
          Platform Overview
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {stats.map((statItem) => (
            <StatCard
              key={statItem.title}
              title={statItem.title}
              value={statItem.value}
              description={statItem.description}
              icon={statItem.icon}
              href={statItem.href}
              iconBgColor={statItem.iconBgColor}
              iconTextColor={statItem.iconTextColor}
            />
          ))}
        </div>
      </section>

      {/* 3. Recent Service Submissions */}
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 className="font-serif text-xl font-bold text-stone-900">
              Recent Service Submissions
            </h2>
            <p className="text-xs text-stone-500">
              Pending listings awaiting approval and latest vendor catalog submissions.
            </p>
          </div>
          {servicesList.length > 0 && (
            <Link
              href="/dashboard/admin/manage-services"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#844353] hover:underline whitespace-nowrap shrink-0"
            >
              <span>View All ({servicesList.length})</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          )}
        </div>

        {servicesList.length === 0 ? (
          <EmptyState
            icon={Layers}
            title="No Service Submissions Yet"
            description="Once vendors submit wedding services for review, they will appear here for moderation."
          />
        ) : (
          <div className="rounded-2xl border border-stone-200 bg-white overflow-hidden shadow-2xs">
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left text-xs min-w-170">
                <thead>
                  <tr className="border-b border-stone-100 bg-[#FAF8F5]/80 text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                    <th className="py-3.5 pl-5 pr-3 w-20">Image</th>
                    <th className="py-3.5 px-3">Service & Vendor</th>
                    <th className="py-3.5 px-3">Location</th>
                    <th className="py-3.5 px-3">Status</th>
                    <th className="py-3.5 pl-3 pr-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {recentServices.map((serviceItem) => {
                    const serviceId = serviceItem._id || serviceItem.id || "";
                    const serviceImage = serviceItem.images?.[0] || FALLBACK_SERVICE_IMAGE;
                    const vendorLabel =
                      serviceItem.businessName || serviceItem.vendorName || "Vendor";

                    return (
                      <tr
                        key={serviceId}
                        className="group hover:bg-stone-50/70 transition-colors"
                      >
                        <td className="py-3.5 pl-5 pr-3">
                          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-stone-100 shadow-2xs">
                            <Image
                              src={serviceImage}
                              alt={serviceItem.serviceName || "Service"}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-200"
                              sizes="56px"
                            />
                          </div>
                        </td>
                        <td className="py-3.5 px-3">
                          <Link
                            href="/dashboard/admin/manage-services"
                            className="font-serif text-sm font-bold text-stone-900 hover:text-[#844353] transition-colors line-clamp-1 block"
                          >
                            {serviceItem.serviceName}
                          </Link>
                          <div className="flex items-center gap-1.5 text-[11px] text-stone-500 mt-0.5">
                            <span className="font-medium text-stone-600">
                              {serviceItem.category || "Wedding"}
                            </span>
                            <span>•</span>
                            <span className="font-medium text-stone-600 truncate max-w-44">
                              {vendorLabel}
                            </span>
                          </div>
                          <div className="text-xs font-bold text-stone-900 mt-1">
                            ${Number(serviceItem.price || 0).toLocaleString()}
                          </div>
                        </td>
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-1.5 text-xs text-stone-700 font-medium">
                            <MapPin className="h-3.5 w-3.5 text-stone-400 shrink-0" />
                            <span className="truncate max-w-40">
                              {serviceItem.location || "N/A"}
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          {renderServiceStatusBadge(serviceItem.status)}
                        </td>
                        <td className="py-3.5 pl-3 pr-5 text-right whitespace-nowrap">
                          <Link
                            href="/dashboard/admin/manage-services"
                            className="inline-flex items-center gap-1 rounded-xl bg-[#844353] hover:bg-[#6e3745] text-white px-3.5 py-1.5 text-xs font-semibold shadow-2xs transition"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            <span>Review</span>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile & Tablet List */}
            <div className="lg:hidden divide-y divide-stone-100">
              {recentServices.map((serviceItem) => {
                const serviceId = serviceItem._id || serviceItem.id || "";
                const serviceImage = serviceItem.images?.[0] || FALLBACK_SERVICE_IMAGE;
                const vendorLabel =
                  serviceItem.businessName || serviceItem.vendorName || "Vendor";

                return (
                  <div
                    key={serviceId}
                    className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-stone-100 shadow-2xs">
                        <Image
                          src={serviceImage}
                          alt={serviceItem.serviceName || "Service"}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-serif text-sm font-bold text-stone-900 line-clamp-1">
                            {serviceItem.serviceName}
                          </span>
                          <span className="sm:hidden">
                            {renderServiceStatusBadge(serviceItem.status)}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-500 mt-0.5 truncate">
                          {serviceItem.category || "Wedding"} • {vendorLabel}
                        </p>
                        <div className="flex items-center gap-2.5 text-[11px] text-stone-600 mt-1 flex-wrap">
                          <span className="font-bold text-stone-900">
                            ${Number(serviceItem.price || 0).toLocaleString()}
                          </span>
                          {serviceItem.location && (
                            <>
                              <span>•</span>
                              <span className="inline-flex items-center gap-1 text-stone-500">
                                <MapPin className="h-3 w-3 text-stone-400" />
                                {serviceItem.location}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-2.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                      <span className="hidden sm:inline-flex">
                        {renderServiceStatusBadge(serviceItem.status)}
                      </span>
                      <Link
                        href="/dashboard/admin/manage-services"
                        className="inline-flex items-center gap-1 rounded-xl bg-[#844353] hover:bg-[#6e3745] text-white px-3 py-1.5 text-xs font-semibold shadow-2xs transition"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>Review</span>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
