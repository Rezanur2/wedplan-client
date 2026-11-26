"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Clock,
  CheckCircle2,
  XCircle,
  Store,
  Sparkles,
  Heart,
  Calendar,
  MapPin,
  Eye,
  ArrowRight,
  Home,
} from "lucide-react";
import { IDashboardUser, IBookingPayload } from "@/types";
import EmptyState from "@/components/dashboard/shared/EmptyState";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";

interface CustomerOverviewProps {
  user?: IDashboardUser | null;
  bookings?: IBookingPayload[];
}

const STATUS_STYLES: Record<string, string> = {
  Accepted: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Pending: "bg-amber-50 text-amber-800 border-amber-200",
  Rejected: "bg-rose-50 text-rose-700 border-rose-200",
  Cancelled: "bg-stone-100 text-stone-600 border-stone-200",
};

export default function CustomerOverview({
  user,
  bookings = [],
}: CustomerOverviewProps) {
  const [selectedBooking, setSelectedBooking] = useState<IBookingPayload | null>(null);

  //  Metric counts from bookings
  const totalBookingsCount = bookings.length;
  const pendingBookingsCount = bookings.filter(
    (bookingItem) => (bookingItem.status || "").toLowerCase() === "pending"
  ).length;
  const acceptedBookingsCount = bookings.filter(
    (bookingItem) => (bookingItem.status || "").toLowerCase() === "accepted"
  ).length;
  const rejectedBookingsCount = bookings.filter((bookingItem) => {
    const statusText = (bookingItem.status || "").toLowerCase();
    return statusText === "rejected" || statusText === "cancelled";
  }).length;

  // Calculate planning progress percentage
  const planningProgressPercentage =
    totalBookingsCount > 0
      ? Math.round((acceptedBookingsCount / totalBookingsCount) * 100)
      : 0;

  // 4 Metric stat cards
  const stats = [
    {
      id: "all",
      title: "Total Inquiries",
      countText: `${totalBookingsCount} Inquiries`,
      tagline: "All submitted requests",
      icon: Heart,
      bg: "bg-stone-50",
      text: "text-stone-700",
      border: "border-stone-200",
    },
    {
      id: "pending",
      title: "Pending Bookings",
      countText: `${pendingBookingsCount} Waiting`,
      tagline: "Awaiting vendor reply",
      icon: Clock,
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-200/80",
    },
    {
      id: "accepted",
      title: "Confirmed Bookings",
      countText: `${acceptedBookingsCount} Confirmed`,
      tagline: "Deposit paid & dates locked",
      icon: CheckCircle2,
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200/80",
    },
    {
      id: "rejected",
      title: "Declined / Cancelled",
      countText: `${rejectedBookingsCount} Cancelled`,
      tagline: "Dates unavailable",
      icon: XCircle,
      bg: "bg-rose-50",
      text: "text-rose-700",
      border: "border-rose-200/80",
    },
  ];

  const customerName = user?.name || "Bride & Groom";
  const recentBookings = bookings.slice(0, 3);
  const fallbackImage =
    "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800";

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-16">
      {/* 1. Welcome Banner with Browse Services Button on Top Right */}
      <div className="rounded-3xl border border-[#EFE5E9] bg-linear-to-br from-rose-50/50 via-white to-amber-50/30 p-6 sm:p-8 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-[#844353]" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                WEDDING PLANNING SUITE
              </span>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-900 tracking-tight">
              Good day, {customerName}
            </h1>

            <p className="text-xs sm:text-sm text-stone-500 max-w-xl">
              Track your dream celebration inquiries, locked vendor dates, and reservation quotes.
            </p>

            {/* Planning Progress Bar */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs">
              <span className="font-medium text-stone-700 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-[#844353]" />
                Planning Health:
              </span>
              <div className="flex items-center gap-2.5 flex-1 max-w-xs">
                <div className="h-2 w-full overflow-hidden rounded-full bg-stone-100 border border-stone-200/60">
                  <div
                    className="h-full rounded-full bg-[#844353] transition-all duration-500"
                    style={{
                      width: `${Math.max(
                        planningProgressPercentage,
                        totalBookingsCount > 0 ? 10 : 0
                      )}%`,
                    }}
                  />
                </div>
                <span className="text-[11px] font-semibold text-stone-600 shrink-0">
                  {planningProgressPercentage}% Secured
                </span>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons on Top Right */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-start sm:self-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-stone-200/90 bg-white hover:bg-stone-50 px-3.5 py-2.5 text-xs font-semibold text-stone-700 shadow-2xs transition-colors cursor-pointer"
            >
              <Home className="h-4 w-4 text-stone-500" />
              <span>Home</span>
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#844353] hover:bg-[#6e3745] px-4 py-2.5 text-xs font-semibold text-white shadow-2xs transition-colors cursor-pointer"
            >
              <Store className="h-4 w-4" />
              <span>Browse Services</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Metric Stat Cards (Responsive 2 cols on mobile/tablet, 4 cols on desktop) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((statItem) => {
          const Icon = statItem.icon;
          return (
            <div
              key={statItem.id}
              className={`rounded-2xl border ${statItem.border} bg-white p-4 sm:p-5 shadow-2xs flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between w-full gap-2">
                <span className="text-xs font-medium text-stone-600 truncate">
                  {statItem.title}
                </span>
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${statItem.bg} ${statItem.text}`}
                >
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-3">
                <span className="font-serif text-lg sm:text-xl lg:text-2xl font-bold text-stone-900 block">
                  {statItem.countText}
                </span>
                <p className="text-[11px] text-stone-400 mt-1 truncate">
                  {statItem.tagline}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Recent Bookings (BookNook Compact Table on Large Desktop / Sleek List on Tablet & Mobile) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-xl font-bold text-stone-900">
              Recent Bookings & Requests
            </h2>
            <p className="text-xs text-stone-500">
              Your active wedding celebration reservations and quotes.
            </p>
          </div>
          {bookings.length > 0 && (
            <Link
              href="/dashboard/customer/my-bookings"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#844353] hover:underline cursor-pointer"
            >
              <span>View All ({bookings.length})</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          )}
        </div>

        {bookings.length === 0 ? (
          <EmptyState
            title="No Booking Requests Yet"
            description="You have not submitted any wedding booking requests yet. Explore our verified vendors and venues to book your dream celebration."
            actionLabel="Browse Wedding Services"
            actionHref="/services"
          />
        ) : (
          <div className="rounded-2xl border border-stone-200 bg-white overflow-hidden shadow-2xs">
            {/* Desktop Table View (>= lg) */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left text-xs min-w-170">
                <thead>
                  <tr className="border-b border-stone-100 bg-[#FAF8F5]/80 text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                    <th className="py-3.5 pl-5 pr-3 w-20">Image</th>
                    <th className="py-3.5 px-3">Service & Vendor</th>
                    <th className="py-3.5 px-3">Event Date</th>
                    <th className="py-3.5 px-3">Location</th>
                    <th className="py-3.5 px-3">Status</th>
                    <th className="py-3.5 pl-3 pr-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {recentBookings.map((bookingItem) => {
                    const priceValue = Number(bookingItem.servicePrice || 0).toLocaleString();

                    return (
                      <tr
                        key={bookingItem._id || bookingItem.serviceId}
                        className="group hover:bg-stone-50/70 transition-colors"
                      >
                        {/* Image */}
                        <td className="py-3.5 pl-5 pr-3">
                          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-stone-100 shadow-2xs">
                            <Image
                              src={bookingItem.serviceImage || fallbackImage}
                              alt={bookingItem.serviceName || "Service"}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-200"
                              sizes="56px"
                            />
                          </div>
                        </td>

                        {/* Title, Category & Fee */}
                        <td className="py-3.5 px-3">
                          <Link
                            href={`/services/${bookingItem.serviceId}`}
                            className="font-serif text-sm font-bold text-stone-900 hover:text-[#844353] transition-colors line-clamp-1 block"
                          >
                            {bookingItem.serviceName || "Wedding Service"}
                          </Link>
                          <div className="flex items-center gap-1.5 text-[11px] text-stone-500 mt-0.5">
                            {bookingItem.serviceCategory && (
                              <span className="font-medium text-stone-600">
                                {bookingItem.serviceCategory}
                              </span>
                            )}
                            {bookingItem.businessName && (
                              <>
                                <span>•</span>
                                <span className="font-medium text-stone-600 truncate max-w-40">
                                  {bookingItem.businessName}
                                </span>
                              </>
                            )}
                          </div>
                          <div className="text-xs font-bold text-stone-900 mt-1">
                            ${priceValue}
                          </div>
                        </td>

                        {/* Event Date */}
                        <td className="py-3.5 px-3">
                          <div className="inline-flex items-center gap-1.5 text-xs text-stone-700 font-medium whitespace-nowrap">
                            <Calendar className="h-3.5 w-3.5 text-[#844353]" />
                            <span>{bookingItem.eventDate || "Date TBD"}</span>
                          </div>
                        </td>

                        {/* Location */}
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-1.5 text-xs text-stone-700 font-medium">
                            <MapPin className="h-3.5 w-3.5 text-stone-400 shrink-0" />
                            <span className="truncate max-w-37.5">
                              {bookingItem.eventLocation || "Location TBD"}
                            </span>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold border ${
                              STATUS_STYLES[bookingItem.status || "Pending"] || STATUS_STYLES.Pending
                            }`}
                          >
                            {bookingItem.status || "Pending"}
                          </span>
                        </td>

                        {/* Action */}
                        <td className="py-3.5 pl-3 pr-5 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => setSelectedBooking(bookingItem)}
                            className="inline-flex items-center gap-1 rounded-xl bg-[#844353] hover:bg-[#6e3745] text-white px-3.5 py-1.5 text-xs font-semibold shadow-2xs transition cursor-pointer"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            <span>View Details</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Tablet & Mobile Responsive List View (< lg) */}
            <div className="lg:hidden divide-y divide-stone-100">
              {recentBookings.map((bookingItem) => {
                const priceValue = Number(bookingItem.servicePrice || 0).toLocaleString();

                return (
                  <div
                    key={bookingItem._id || bookingItem.serviceId}
                    className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-stone-50/70 transition-colors"
                  >
                    {/* Left: Thumbnail & Info */}
                    <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-stone-100 shadow-2xs">
                        <Image
                          src={bookingItem.serviceImage || fallbackImage}
                          alt={bookingItem.serviceName || "Service"}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Link
                            href={`/services/${bookingItem.serviceId}`}
                            className="font-serif text-sm font-bold text-stone-900 hover:text-[#844353] transition-colors line-clamp-1"
                          >
                            {bookingItem.serviceName || "Wedding Service"}
                          </Link>
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.2 text-[9px] font-semibold border shrink-0 sm:hidden ${
                              STATUS_STYLES[bookingItem.status || "Pending"] || STATUS_STYLES.Pending
                            }`}
                          >
                            {bookingItem.status || "Pending"}
                          </span>
                        </div>

                        <div className="text-[11px] text-stone-500 mt-0.5 flex items-center gap-1.5 flex-wrap">
                          <span>{bookingItem.serviceCategory || "Service"}</span>
                          {bookingItem.businessName && (
                            <>
                              <span>•</span>
                              <span className="font-medium text-stone-600 truncate max-w-35">
                                {bookingItem.businessName}
                              </span>
                            </>
                          )}
                        </div>

                        <div className="flex items-center gap-2.5 text-[11px] text-stone-600 mt-1 flex-wrap">
                          <span className="font-bold text-stone-900">${priceValue}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-stone-500">
                            <Calendar className="h-3 w-3 text-[#844353]" />
                            {bookingItem.eventDate || "TBD"}
                          </span>
                          {bookingItem.eventLocation && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1 text-stone-500">
                                <MapPin className="h-3 w-3 text-stone-400" />
                                <span className="truncate max-w-30">
                                  {bookingItem.eventLocation}
                                </span>
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Status Pill & View Details Button */}
                    <div className="flex items-center justify-between sm:justify-end gap-2.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                      <span
                        className={`hidden sm:inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold border shrink-0 ${
                          STATUS_STYLES[bookingItem.status || "Pending"] || STATUS_STYLES.Pending
                        }`}
                      >
                        {bookingItem.status || "Pending"}
                      </span>

                      <button
                        type="button"
                        onClick={() => setSelectedBooking(bookingItem)}
                        className="inline-flex items-center gap-1 rounded-xl bg-[#844353] hover:bg-[#6e3745] text-white px-3 py-1.5 text-xs font-semibold shadow-2xs transition cursor-pointer"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>View Details</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 4. Details Dialog */}
      {selectedBooking && (
        <Dialog open={Boolean(selectedBooking)} onOpenChange={() => setSelectedBooking(null)}>
          <DialogContent className="max-w-xs sm:max-w-md rounded-2xl bg-white p-5 shadow-xl border border-stone-200">
            <DialogHeader>
              <DialogTitle className="font-serif text-lg font-bold text-stone-900">
                {selectedBooking.serviceName}
              </DialogTitle>
              <DialogDescription className="text-xs text-stone-500">
                Wedding reservation details and vendor information.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-3 space-y-2.5 text-xs">
              <div className="flex justify-between rounded-lg bg-stone-50 p-2 border border-stone-100">
                <span className="text-stone-500">Status</span>
                <span className="font-semibold text-stone-900">{selectedBooking.status}</span>
              </div>

              <div className="space-y-1.5 rounded-xl border border-stone-200 p-3 text-stone-700">
                <div className="flex justify-between border-b border-stone-100 pb-1.5">
                  <span className="text-stone-400">Vendor Name</span>
                  <span className="font-medium text-stone-900 capitalize">
                    {selectedBooking.vendorName}
                  </span>
                </div>
                {selectedBooking.businessName && (
                  <div className="flex justify-between border-b border-stone-100 pb-1.5">
                    <span className="text-stone-400">Business Name</span>
                    <span className="font-medium text-stone-900">
                      {selectedBooking.businessName}
                    </span>
                  </div>
                )}
                <div className="flex justify-between border-b border-stone-100 pb-1.5">
                  <span className="text-stone-400">Contact</span>
                  <span className="font-medium text-stone-700">
                    {selectedBooking.vendorEmail}
                  </span>
                </div>
                <div className="flex justify-between border-b border-stone-100 pb-1.5">
                  <span className="text-stone-400">Event Date</span>
                  <span className="font-medium">{selectedBooking.eventDate}</span>
                </div>
                <div className="flex justify-between border-b border-stone-100 pb-1.5">
                  <span className="text-stone-400">Location</span>
                  <span className="font-medium">{selectedBooking.eventLocation}</span>
                </div>
                <div className="flex justify-between pt-0.5">
                  <span className="text-stone-400">Price</span>
                  <span className="font-bold text-stone-900">
                    ${Number(selectedBooking.servicePrice || 0).toLocaleString()}
                  </span>
                </div>
              </div>

              {selectedBooking.message && (
                <div className="rounded-lg bg-stone-50 p-2.5 border border-stone-100 text-stone-600 italic">
                  &quot;{selectedBooking.message}&quot;
                </div>
              )}
            </div>

            <div className="mt-4 flex items-center justify-between gap-2 pt-2 border-t border-stone-100">
              <Link
                href={`/services/${selectedBooking.serviceId}`}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#844353] hover:bg-[#6e3745] text-white px-3 py-1.5 text-xs font-semibold shadow-2xs transition cursor-pointer"
              >
                <span>View Service Listing</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>

              <DialogClose className="rounded-lg bg-stone-100 px-3.5 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-200 cursor-pointer">
                Close
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
