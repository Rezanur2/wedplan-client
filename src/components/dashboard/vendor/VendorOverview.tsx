"use client";

import React from "react";
import Link from "next/link";
import {
  Store,
  CheckCircle2,
  Clock,
  CalendarCheck,
  Crown,
  PlusCircle,
  ArrowRight,
  Sparkles,
  Inbox,
  Calendar,
  User,
} from "lucide-react";
import { IDashboardUser, IBookingPayload, ServiceFormData } from "@/types";
import VendorPlanBanner from "./VendorPlanBanner";

interface VendorOverviewProps {
  user?: IDashboardUser | null;
  services: ServiceFormData[];
  bookings: IBookingPayload[];
  isPremium: boolean;
}

export default function VendorOverview({
  user,
  services = [],
  bookings = [],
  isPremium = false,
}: VendorOverviewProps) {
  // Metric calculations
  const totalServices = services.length;
  const activeServices = services.filter((s) => {
    const st = (s.status || "").toLowerCase();
    return st === "active" || st === "approved";
  }).length;

  const pendingBookings = bookings.filter(
    (b) => (b.status || "").toLowerCase() === "pending"
  ).length;

  const acceptedBookings = bookings.filter(
    (b) => (b.status || "").toLowerCase() === "accepted"
  ).length;

  // Recent 3 bookings for preview
  const recentBookings = bookings.slice(0, 3);

  const stats = [
    {
      title: "Total Services",
      value: totalServices,
      desc: "All submitted listings",
      icon: Store,
      bg: "bg-stone-50",
      text: "text-stone-700",
      border: "border-stone-200",
    },
    {
      title: "Active Services",
      value: activeServices,
      desc: "Published & live for couples",
      icon: CheckCircle2,
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200/80",
    },
    {
      title: "Pending Requests",
      value: pendingBookings,
      desc: "Awaiting your review",
      icon: Clock,
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-200/80",
    },
    {
      title: "Accepted Bookings",
      value: acceptedBookings,
      desc: "Confirmed wedding dates",
      icon: CalendarCheck,
      bg: "bg-rose-50",
      text: "text-[#844353]",
      border: "border-rose-200/80",
    },
  ];

  return (
    <div className="max-w-5xl space-y-6 pb-12">
      {/* 1. Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
              VENDOR STUDIO / OVERVIEW
            </span>
            {isPremium && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-300 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
                <Crown className="h-3 w-3 text-amber-600 fill-amber-600" />
                Premium Vendor
              </span>
            )}
          </div>
          <h1 className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            Welcome back, {user?.name || "Vendor"}
          </h1>
          <p className="mt-0.5 text-xs text-stone-500">
            Monitor your services, review incoming couple bookings, and manage your wedding portfolio.
          </p>
        </div>

        {/* Quick Action Button */}
        <Link
          href="/dashboard/vendor/add-service"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#844353] px-4 py-2.5 text-xs font-semibold text-white shadow-2xs hover:bg-[#6e3745] transition-colors self-start sm:self-auto"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Add New Service</span>
        </Link>
      </div>

      {/* 2. Subscription Slot Usage Banner (shown only for free tier) */}
      <VendorPlanBanner activeCount={totalServices} isPremium={isPremium} />

      {/* 3. Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className={`rounded-2xl border ${item.border} bg-white p-4 sm:p-5 shadow-2xs flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-stone-500 line-clamp-1">
                  {item.title}
                </span>
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg ${item.bg} ${item.text}`}
                >
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-3">
                <span className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                  {item.value}
                </span>
                <p className="text-[10px] text-stone-400 mt-0.5 truncate">
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Recent Booking Requests */}
      <div className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div>
            <h2 className="font-serif text-base font-bold text-stone-900">
              Recent Booking Requests
            </h2>
            <p className="text-[11px] text-stone-400">
              Couples who recently submitted reservation requests for your services.
            </p>
          </div>
          <Link
            href="/dashboard/vendor/booking-requests"
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#844353] hover:underline"
          >
            <span>View All</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {recentBookings.length === 0 ? (
          <div className="rounded-xl border border-dashed border-stone-200 bg-stone-50/50 p-8 text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-[#844353]">
              <Inbox className="h-5 w-5" />
            </div>
            <h3 className="mt-2 text-xs font-semibold text-stone-800">
              No Booking Requests Yet
            </h3>
            <p className="text-[11px] text-stone-400 max-w-xs mx-auto mt-0.5">
              As couples discover and book your services, their inquiries will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {recentBookings.map((b) => (
              <div
                key={b._id || b.serviceId}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div className="space-y-0.5">
                  <p className="font-semibold text-stone-900">
                    {b.serviceName || "Wedding Service"}
                  </p>
                  <div className="flex items-center gap-3 text-[11px] text-stone-500">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3 text-stone-400" />
                      {b.customerName || b.customerEmail || "Client"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-stone-400" />
                      {b.eventDate || "Date TBD"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold border ${
                      b.status === "Accepted"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : b.status === "Rejected"
                        ? "bg-rose-50 text-rose-700 border-rose-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}
                  >
                    {b.status || "Pending"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Link
          href="/dashboard/vendor/my-services"
          className="flex items-center justify-between rounded-2xl border border-stone-200 bg-white p-4 shadow-2xs hover:border-[#844353] hover:shadow-xs transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-stone-100 text-stone-700 group-hover:bg-rose-50 group-hover:text-[#844353] transition-colors">
              <Store className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-stone-900">Manage Services</p>
              <p className="text-[10px] text-stone-400">Edit or review your listings</p>
            </div>
          </div>
          <ArrowRight className="h-3.5 w-3.5 text-stone-400 group-hover:text-[#844353] transition-colors" />
        </Link>

        <Link
          href="/dashboard/vendor/booking-requests"
          className="flex items-center justify-between rounded-2xl border border-stone-200 bg-white p-4 shadow-2xs hover:border-[#844353] hover:shadow-xs transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-stone-100 text-stone-700 group-hover:bg-rose-50 group-hover:text-[#844353] transition-colors">
              <CalendarCheck className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-stone-900">Booking Requests</p>
              <p className="text-[10px] text-stone-400">Accept or decline dates</p>
            </div>
          </div>
          <ArrowRight className="h-3.5 w-3.5 text-stone-400 group-hover:text-[#844353] transition-colors" />
        </Link>

        <Link
          href="/dashboard/vendor/subscription"
          className="flex items-center justify-between rounded-2xl border border-stone-200 bg-white p-4 shadow-2xs hover:border-[#844353] hover:shadow-xs transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-stone-100 text-stone-700 group-hover:bg-rose-50 group-hover:text-[#844353] transition-colors">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-stone-900">Membership Tier</p>
              <p className="text-[10px] text-stone-400">{isPremium ? "Active Lifetime" : "Upgrade to Unlimited"}</p>
            </div>
          </div>
          <ArrowRight className="h-3.5 w-3.5 text-stone-400 group-hover:text-[#844353] transition-colors" />
        </Link>
      </div>
    </div>
  );
}
