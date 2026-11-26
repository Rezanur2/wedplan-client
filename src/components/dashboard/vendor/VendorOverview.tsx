"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
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
  Eye,
} from "lucide-react";
import { IDashboardUser, IBookingPayload, ServiceFormData } from "@/types";
import VendorPlanBanner from "./VendorPlanBanner";
import DashboardBreadcrumb from "@/components/dashboard/shared/DashboardBreadcrumb";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800";

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
  const usedServicesCount = services.filter(
    (serviceItem) => (serviceItem.status || "").toLowerCase() !== "rejected"
  ).length;
  const activeServices = services.filter((serviceItem) => {
    const status = (serviceItem.status || "").toLowerCase();
    return status === "active" || status === "approved";
  }).length;

  const pendingBookings = bookings.filter(
    (bookingItem) => (bookingItem.status || "").toLowerCase() === "pending"
  ).length;

  const acceptedBookings = bookings.filter(
    (bookingItem) => (bookingItem.status || "").toLowerCase() === "accepted"
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
    <div className="mx-auto max-w-5xl space-y-6 pb-12">
      {/* 1. Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <DashboardBreadcrumb
            section="VENDOR STUDIO"
            page="OVERVIEW"
            badge={
              isPremium ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-300 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
                  <Crown className="h-3 w-3 text-amber-600 fill-amber-600" />
                  Premium Vendor
                </span>
              ) : undefined
            }
          />
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
      <VendorPlanBanner activeCount={usedServicesCount} isPremium={isPremium} />

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
          <div>
            {/* Desktop & Tablet: Elegant Table Layout */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-stone-100 text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                    <th className="pb-3 font-medium">Service</th>
                    <th className="pb-3 font-medium">Customer</th>
                    <th className="pb-3 font-medium">Event Date</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 text-right font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {recentBookings.map((bookingItem) => (
                    <tr
                      key={bookingItem._id || bookingItem.serviceId}
                      className="group transition-colors hover:bg-stone-50/70"
                    >
                      <td className="py-3.5 pr-4">
                        <div className="flex items-center gap-3">
                          <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-stone-200/80 bg-stone-100 shadow-2xs">
                            <Image
                              src={bookingItem.serviceImage || FALLBACK_IMAGE}
                              alt={bookingItem.serviceName || "Service"}
                              fill
                              unoptimized
                              className="object-cover"
                              sizes="44px"
                              onError={(e) => {
                                const target = e.currentTarget as HTMLImageElement;
                                if (target.src !== FALLBACK_IMAGE) {
                                  target.srcset = "";
                                  target.src = FALLBACK_IMAGE;
                                }
                              }}
                            />
                          </div>
                          <div>
                            <div className="font-semibold text-stone-900 group-hover:text-[#844353] transition-colors line-clamp-1">
                              {bookingItem.serviceName || "Wedding Service"}
                            </div>
                            {bookingItem.serviceCategory && (
                              <span className="text-[10px] text-stone-400">
                                {bookingItem.serviceCategory}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 pr-4">
                        <div className="flex items-center gap-1.5 font-medium text-stone-800">
                          <User className="h-3.5 w-3.5 text-stone-400" />
                          <span>{bookingItem.customerName || "Customer"}</span>
                        </div>
                        {bookingItem.customerEmail && (
                          <div className="text-[11px] text-stone-400">
                            {bookingItem.customerEmail}
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 pr-4">
                        <div className="inline-flex items-center gap-1.5 rounded-md bg-stone-100/80 px-2 py-0.5 text-[11px] font-medium text-stone-700">
                          <Calendar className="h-3 w-3 text-[#844353]" />
                          <span>{bookingItem.eventDate || "Date TBD"}</span>
                        </div>
                      </td>

                      <td className="py-3.5 pr-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold border ${
                            bookingItem.status === "Accepted"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : bookingItem.status === "Rejected"
                              ? "bg-rose-50 text-rose-700 border-rose-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              bookingItem.status === "Accepted"
                                ? "bg-emerald-500"
                                : bookingItem.status === "Rejected"
                                ? "bg-rose-500"
                                : "bg-amber-500"
                            }`}
                          />
                          {bookingItem.status || "Pending"}
                        </span>
                      </td>

                      <td className="py-3.5 text-right">
                        <Link
                          href="/dashboard/vendor/booking-requests"
                          className="inline-flex items-center gap-1 rounded-lg border border-stone-200 bg-white px-2.5 py-1 text-xs font-medium text-stone-700 shadow-2xs hover:bg-[#844353] hover:text-white hover:border-[#844353] transition-all"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>View</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile: Styled Cards Layout */}
            <div className="block sm:hidden space-y-3">
              {recentBookings.map((bookingItem) => (
                <div
                  key={bookingItem._id || bookingItem.serviceId}
                  className="rounded-xl border border-stone-200/80 bg-stone-50/50 p-3 space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2.5">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-stone-200/80 bg-stone-100 shadow-2xs">
                        <Image
                          src={bookingItem.serviceImage || FALLBACK_IMAGE}
                          alt={bookingItem.serviceName || "Service"}
                          fill
                          unoptimized
                          className="object-cover"
                          sizes="44px"
                          onError={(e) => {
                            const target = e.currentTarget as HTMLImageElement;
                            if (target.src !== FALLBACK_IMAGE) {
                              target.srcset = "";
                              target.src = FALLBACK_IMAGE;
                            }
                          }}
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-stone-900 text-xs truncate">
                          {bookingItem.serviceName || "Wedding Service"}
                        </div>
                        {bookingItem.serviceCategory && (
                          <span className="text-[10px] text-stone-400 block truncate">
                            {bookingItem.serviceCategory}
                          </span>
                        )}
                      </div>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold border shrink-0 ${
                        bookingItem.status === "Accepted"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : bookingItem.status === "Rejected"
                          ? "bg-rose-50 text-rose-700 border-rose-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          bookingItem.status === "Accepted"
                            ? "bg-emerald-500"
                            : bookingItem.status === "Rejected"
                            ? "bg-rose-500"
                            : "bg-amber-500"
                        }`}
                      />
                      {bookingItem.status || "Pending"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1 border-t border-stone-100">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3 text-stone-400" />
                        {bookingItem.customerName || "Customer"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-stone-400" />
                        {bookingItem.eventDate || "TBD"}
                      </span>
                    </div>

                    <Link
                      href="/dashboard/vendor/booking-requests"
                      className="inline-flex items-center gap-1 rounded-lg border border-stone-200 bg-white px-2 py-0.5 text-[11px] font-medium text-stone-700 shadow-2xs hover:bg-[#844353] hover:text-white hover:border-[#844353] transition-all"
                    >
                      <Eye className="h-3 w-3" />
                      <span>View</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
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
