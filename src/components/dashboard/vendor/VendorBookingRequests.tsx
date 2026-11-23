"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  Clock,
  Check,
  X,
  Mail,
  User,
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Ban,
  Inbox,
  Loader2,
  ExternalLink,
  Eye,
} from "lucide-react";
import { IBookingPayload } from "@/types";
import { updateBookingStatus } from "@/lib/actions/bookings";
import { toast } from "@/components/ui/toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface VendorBookingRequestsProps {
  initialBookings?: IBookingPayload[];
  filterServiceId?: string;
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800";

// Reusable Status Badge Component
function BookingStatusBadge({ status, compact = false }: { status?: string; compact?: boolean }) {
  const currentStatus = status?.toLowerCase();

  if (currentStatus === "accepted") {
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-800 font-medium ${compact ? "px-2.5 py-0.5 text-[11px] font-semibold" : "px-2.5 sm:px-3 py-1 text-xs"}`}>
        <CheckCircle2 className={`${compact ? "h-3 w-3" : "h-3.5 w-3.5"} text-emerald-600 shrink-0`} />
        <span>Accepted</span>
      </span>
    );
  }

  if (currentStatus === "rejected") {
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 text-rose-800 font-medium ${compact ? "px-2.5 py-0.5 text-[11px] font-semibold" : "px-2.5 sm:px-3 py-1 text-xs"}`}>
        <XCircle className={`${compact ? "h-3 w-3" : "h-3.5 w-3.5"} text-rose-600 shrink-0`} />
        <span>Declined</span>
      </span>
    );
  }

  if (currentStatus === "cancelled") {
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-stone-100 text-stone-600 font-medium ${compact ? "px-2.5 py-0.5 text-[11px] font-semibold" : "px-2.5 sm:px-3 py-1 text-xs"}`}>
        <Ban className={`${compact ? "h-3 w-3" : "h-3.5 w-3.5"} text-stone-500 shrink-0`} />
        <span>{compact ? "Cancelled" : "Cancelled by Customer"}</span>
      </span>
    );
  }

  // Default: Pending
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 text-amber-800 font-medium ${compact ? "px-2.5 py-0.5 text-[11px] font-semibold" : "px-2.5 sm:px-3 py-1 text-xs"}`}>
      <Clock className={`${compact ? "h-3 w-3" : "h-3.5 w-3.5"} text-amber-600 shrink-0`} />
      <span>Pending Review</span>
    </span>
  );
}

export default function VendorBookingRequests({
  initialBookings = [],
  filterServiceId,
}: VendorBookingRequestsProps) {
  const [bookings, setBookings] = useState<IBookingPayload[]>(initialBookings);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [bookingToReject, setBookingToReject] = useState<IBookingPayload | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<IBookingPayload | null>(null);

  // Tab counts
  const totalCount = bookings.length;
  const pendingCount = bookings.filter((b) => b.status?.toLowerCase() === "pending").length;
  const acceptedCount = bookings.filter((b) => b.status?.toLowerCase() === "accepted").length;
  const rejectedCount = bookings.filter((b) => {
    const status = b.status?.toLowerCase();
    return status === "rejected" || status === "cancelled";
  }).length;

  // Filtered list based on active tab
  const filteredBookings = bookings.filter((b) => {
    const status = b.status?.toLowerCase();
    if (activeTab === "all") return true;
    if (activeTab === "pending") return status === "pending";
    if (activeTab === "accepted") return status === "accepted";
    if (activeTab === "rejected") return status === "rejected" || status === "cancelled";
    return true;
  });

  // Metric summary stats for the overview bar
  const metricSummaryStats = [
    { label: "Total Requests", value: totalCount, cardBg: "bg-white border-stone-200", labelColor: "text-stone-500", valColor: "text-stone-900" },
    { label: "Pending Review", value: pendingCount, cardBg: "bg-amber-50/50 border-amber-200", labelColor: "text-amber-800", valColor: "text-amber-900" },
    { label: "Accepted", value: acceptedCount, cardBg: "bg-emerald-50/50 border-emerald-200", labelColor: "text-emerald-800", valColor: "text-emerald-900" },
    { label: "Declined / Cancelled", value: rejectedCount, cardBg: "bg-stone-50 border-stone-200", labelColor: "text-stone-600", valColor: "text-stone-700" },
  ];

  // Filter tabs configuration
  const filterTabs = [
    { id: "all", label: "All", count: totalCount, badgeStyle: "bg-stone-200/70 text-stone-600" },
    { id: "pending", label: "Pending", count: pendingCount, badgeStyle: "bg-amber-100 font-semibold text-amber-800" },
    { id: "accepted", label: "Accepted", count: acceptedCount, badgeStyle: "bg-emerald-100 font-semibold text-emerald-800" },
    { id: "rejected", label: "Declined", count: rejectedCount, badgeStyle: "bg-rose-100 font-semibold text-rose-800" },
  ];

  // Unified Accept / Decline Handler
  const handleUpdateStatus = async (bookingId: string, status: "Accepted" | "Rejected") => {
    setLoadingId(bookingId);
    try {
      const res = await updateBookingStatus(bookingId, status);
      if (res?.modifiedCount > 0 || res?.matchedCount > 0) {
        setBookings((prev) =>
          prev.map((b) => (b._id === bookingId ? { ...b, status } : b))
        );
        toast.add({
          title: status === "Accepted" ? "Booking Accepted" : "Booking Declined",
          description:
            status === "Accepted"
              ? "You have accepted this wedding booking request."
              : "You have declined this booking request.",
          type: "success",
        });
        if (status === "Rejected") setBookingToReject(null);
      } else {
        toast.add({
          title: "Update Failed",
          description: res?.message || `Could not ${status.toLowerCase()} booking.`,
          type: "error",
        });
      }
    } catch (error) {
      console.error(`Error updating booking:`, error);
      toast.add({
        title: "Error",
        description: "Something went wrong while processing the request.",
        type: "error",
      });
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-16">
      {/* 1. Header */}
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-stone-500">
          VENDOR / Booking Requests
        </div>
        <h1 className="mt-1 font-serif text-3xl sm:text-4xl text-stone-900">
          Booking Requests
        </h1>
        <p className="mt-1 text-xs text-stone-500">
          Review customer wedding inquiries, accept reservations, or decline scheduling conflicts.
        </p>
      </div>

      {/* Filter by Service Notice */}
      {filterServiceId && (
        <div className="flex items-center justify-between rounded-xl border border-[#844353]/20 bg-[#844353]/5 px-4 py-2.5 text-xs text-stone-700">
          <div className="flex items-center gap-2">
            <span className="font-medium text-[#844353]">Filtered by Service:</span>
            <span className="font-mono bg-white px-2 py-0.5 rounded border border-stone-200 text-stone-800">
              {filterServiceId}
            </span>
          </div>
          <Link
            href="/dashboard/vendor/booking-requests"
            className="text-xs font-semibold text-[#844353] hover:underline"
          >
            Clear Filter (Show All)
          </Link>
        </div>
      )}

      {/* 2. Metric Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {metricSummaryStats.map((stat) => (
          <div key={stat.label} className={`rounded-2xl border p-4 shadow-2xs ${stat.cardBg}`}>
            <div className={`text-[11px] font-medium uppercase tracking-wider ${stat.labelColor}`}>
              {stat.label}
            </div>
            <div className={`mt-1 font-serif text-2xl font-bold ${stat.valColor}`}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* 3. Filter Tabs */}
      <div className="flex items-center gap-1.5 rounded-xl bg-stone-100 p-1 w-fit max-w-full overflow-x-auto no-scrollbar">
        {filterTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition cursor-pointer ${
                isActive
                  ? "bg-white text-stone-900 shadow-2xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <span>{tab.label}</span>
              <span className={`rounded-full px-1.5 py-0.2 text-[10px] ${tab.badgeStyle}`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 4. Booking Requests List */}
      {filteredBookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-200 bg-white p-12 text-center shadow-2xs">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-100 text-stone-400 mb-3">
            <Inbox className="h-6 w-6" />
          </div>
          <h3 className="font-serif text-lg font-semibold text-stone-900">
            No booking requests found
          </h3>
          <p className="mt-1 max-w-sm text-xs text-stone-500">
            {activeTab === "all"
              ? "When couples request bookings for your wedding services, their inquiries will appear here."
              : `There are currently no requests under the "${activeTab}" filter.`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => {
            const isPending = booking.status?.toLowerCase() === "pending";
            const isAccepted = booking.status?.toLowerCase() === "accepted";
            const isRejected = booking.status?.toLowerCase() === "rejected";
            const isCancelled = booking.status?.toLowerCase() === "cancelled";
            const isLoading = loadingId === booking._id;

            return (
              <div
                key={booking._id}
                className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-2xs transition hover:shadow-sm"
              >
                <div className="p-4 sm:p-5 flex flex-col md:flex-row gap-4 sm:gap-5 justify-between">
                  {/* Left Column: Service Details & Customer Info */}
                  <div className="flex flex-col sm:flex-row gap-4 flex-1">
                    {/* Service Thumbnail */}
                    <div className="relative h-28 w-full sm:w-36 shrink-0 overflow-hidden rounded-xl bg-stone-100">
                      <Image
                        src={booking.serviceImage || FALLBACK_IMAGE}
                        alt={booking.serviceName || "Service"}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, 150px"
                      />
                      {booking.serviceCategory && (
                        <span className="absolute top-2 left-2 rounded-md bg-black/60 backdrop-blur-xs px-2 py-0.5 text-[10px] font-medium text-white">
                          {booking.serviceCategory}
                        </span>
                      )}
                    </div>

                    {/* Middle Info */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <Link
                            href={`/services/${booking.serviceId}`}
                            className="group inline-flex items-center gap-1 font-serif text-base sm:text-lg font-semibold text-stone-900 hover:text-[#844353] transition"
                          >
                            <span>{booking.serviceName || "Wedding Service"}</span>
                            <ExternalLink className="h-3.5 w-3.5 text-stone-400 group-hover:text-[#844353]" />
                          </Link>
                          {booking.servicePrice && (
                            <div className="text-xs font-semibold text-stone-700">
                              ${Number(booking.servicePrice).toLocaleString()}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Customer Info Box */}
                      <div className="flex flex-wrap items-center gap-3 text-xs text-stone-600 pt-1">
                        <div className="inline-flex items-center gap-1.5 font-medium text-stone-900">
                          <User className="h-3.5 w-3.5 text-stone-400" />
                          <span>{booking.customerName || "Customer"}</span>
                        </div>
                        {booking.customerEmail && (
                          <div className="inline-flex items-center gap-1.5 text-stone-500">
                            <Mail className="h-3.5 w-3.5 text-stone-400" />
                            <span>{booking.customerEmail}</span>
                          </div>
                        )}
                      </div>

                      {/* Event Date & Location */}
                      <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500">
                        <div className="inline-flex items-center gap-1.5 rounded-md bg-stone-100 px-2 py-0.5 text-stone-700 font-medium">
                          <Calendar className="h-3.5 w-3.5 text-[#844353]" />
                          <span>Event: {booking.eventDate}</span>
                        </div>
                        <div className="inline-flex items-center gap-1.5 text-stone-600">
                          <MapPin className="h-3.5 w-3.5 text-stone-400" />
                          <span>{booking.eventLocation}</span>
                        </div>
                      </div>

                      {/* Customer Message */}
                      {booking.message && (
                        <div className="mt-2 rounded-xl bg-stone-50 p-3 text-xs text-stone-600 border border-stone-100">
                          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-stone-700 mb-0.5">
                            <MessageSquare className="h-3 w-3 text-stone-400" />
                            <span>Customer Note:</span>
                          </div>
                          <p className="italic text-stone-600 leading-relaxed">
                            &ldquo;{booking.message}&rdquo;
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Status & Action Buttons */}
                  <div className="flex flex-wrap sm:flex-nowrap md:flex-col justify-between md:justify-center items-center md:items-end gap-2.5 sm:gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-stone-100">
                    {/* Status Badge */}
                    <div className="shrink-0">
                      <BookingStatusBadge status={booking.status} />
                    </div>

                    {/* Actions: View Details (Always available) + Accept/Decline for Pending */}
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedBooking(booking)}
                        className="inline-flex h-8 sm:h-9 items-center justify-center rounded-lg border border-stone-200 bg-white px-2.5 sm:px-3 text-xs font-medium text-stone-700 hover:bg-stone-50 hover:text-stone-900 transition cursor-pointer"
                        title="View Details"
                      >
                        <Eye className="h-3.5 w-3.5 text-stone-500 sm:mr-1.5" />
                        <span className="hidden sm:inline">Details</span>
                      </button>

                      {isPending && (
                        <>
                          <button
                            type="button"
                            disabled={isLoading}
                            onClick={() => setBookingToReject(booking)}
                            className="inline-flex h-8 sm:h-9 items-center justify-center rounded-lg border border-stone-200 bg-white px-2.5 sm:px-3 text-xs font-medium text-stone-700 hover:bg-stone-50 hover:text-rose-600 transition disabled:opacity-50 cursor-pointer"
                            title="Decline"
                          >
                            <X className="h-3.5 w-3.5 sm:mr-1" />
                            <span className="hidden sm:inline">Decline</span>
                          </button>

                          <button
                            type="button"
                            disabled={isLoading}
                            onClick={() => booking._id && handleUpdateStatus(booking._id, "Accepted")}
                            className="inline-flex h-8 sm:h-9 items-center justify-center rounded-lg bg-[#844353] px-2.5 sm:px-3.5 text-xs font-medium text-white hover:bg-[#6e3745] transition disabled:opacity-50 cursor-pointer shadow-2xs"
                            title="Accept"
                          >
                            {isLoading ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin sm:mr-1.5" />
                            ) : (
                              <Check className="h-3.5 w-3.5 sm:mr-1" />
                            )}
                            <span className="hidden sm:inline">Accept</span>
                          </button>
                        </>
                      )}
                    </div>

                    {!isPending && (
                      <div className="text-[11px] text-stone-400 italic">
                        {isAccepted && "Confirmed reservation"}
                        {isRejected && "Booking request closed"}
                        {isCancelled && "Cancelled by couple"}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Decline Confirmation Dialog */}
      <Dialog
        open={Boolean(bookingToReject)}
        onOpenChange={(open) => !open && setBookingToReject(null)}
      >
        <DialogContent className="sm:max-w-md p-4 sm:p-6 overflow-x-hidden">
          <DialogHeader className="pr-6 text-left">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-50 text-rose-600 mb-2">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <DialogTitle className="font-serif text-lg text-stone-900">
              Decline Booking Request?
            </DialogTitle>
            <DialogDescription className="text-xs text-stone-500 leading-relaxed break-words">
              Are you sure you want to decline the request for{" "}
              <strong className="text-stone-800">{bookingToReject?.serviceName}</strong> on{" "}
              <strong className="text-stone-800">{bookingToReject?.eventDate}</strong> by{" "}
              <strong className="text-stone-800">{bookingToReject?.customerName}</strong>? Once declined, this
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2">
            <button
              type="button"
              onClick={() => setBookingToReject(null)}
              className="inline-flex h-9 w-full sm:w-auto items-center justify-center rounded-lg border border-stone-200 px-3.5 text-xs font-medium text-stone-700 hover:bg-stone-50 transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={Boolean(loadingId)}
              onClick={() => bookingToReject?._id && handleUpdateStatus(bookingToReject._id, "Rejected")}
              className="inline-flex h-9 w-full sm:w-auto items-center justify-center rounded-lg bg-rose-600 px-4 text-xs font-medium text-white hover:bg-rose-700 transition disabled:opacity-50 cursor-pointer"
            >
              {loadingId ? (
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              ) : null}
              Confirm Decline
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Booking Details Dialog */}
      <Dialog
        open={Boolean(selectedBooking)}
        onOpenChange={(open) => !open && setSelectedBooking(null)}
      >
        <DialogContent className="sm:max-w-lg p-4 sm:p-6 overflow-x-hidden">
          <DialogHeader className="pr-6 text-left">
            <DialogTitle className="font-serif text-lg sm:text-xl text-stone-900">
              Booking Request Details
            </DialogTitle>
            <DialogDescription className="text-xs text-stone-500">
              Complete reservation information submitted by the customer.
            </DialogDescription>
          </DialogHeader>

          {selectedBooking && (
            <div className="space-y-3 sm:space-y-4 pt-1">
              {/* Service Quick Banner */}
              <div className="flex items-center gap-3 rounded-xl border border-stone-200 bg-stone-50/70 p-2.5 sm:p-3">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-stone-200">
                  <Image
                    src={selectedBooking.serviceImage || FALLBACK_IMAGE}
                    alt={selectedBooking.serviceName || "Service"}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-serif text-sm font-semibold text-stone-900 truncate">
                    {selectedBooking.serviceName}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 mt-0.5">
                    {selectedBooking.serviceCategory && (
                      <span className="rounded bg-stone-200/80 px-1.5 py-0.2 text-[10px] font-medium text-stone-700">
                        {selectedBooking.serviceCategory}
                      </span>
                    )}
                    {selectedBooking.servicePrice && (
                      <span className="font-semibold text-stone-800">
                        ${Number(selectedBooking.servicePrice).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Grid of Details: Customer & Event Schedule */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 text-xs">
                {/* Customer */}
                <div className="rounded-xl border border-stone-200/80 bg-white p-3 space-y-1">
                  <div className="flex items-center gap-1.5 text-stone-400 font-medium text-[11px] uppercase tracking-wider">
                    <User className="h-3.5 w-3.5 text-stone-500" />
                    <span>Customer</span>
                  </div>
                  <div className="font-semibold text-stone-900 truncate">
                    {selectedBooking.customerName || "Customer"}
                  </div>
                  <div className="text-stone-500 break-all text-[11px]">
                    {selectedBooking.customerEmail || "No email"}
                  </div>
                </div>

                {/* Event Schedule */}
                <div className="rounded-xl border border-stone-200/80 bg-white p-3 space-y-1">
                  <div className="flex items-center gap-1.5 text-stone-400 font-medium text-[11px] uppercase tracking-wider">
                    <Calendar className="h-3.5 w-3.5 text-[#844353]" />
                    <span>Event Schedule</span>
                  </div>
                  <div className="font-semibold text-stone-900 truncate">
                    {selectedBooking.eventDate}
                  </div>
                  <div className="text-stone-500 break-words text-[11px]">
                    {selectedBooking.eventLocation}
                  </div>
                </div>
              </div>

              {/* Status Row */}
              <div className="flex items-center justify-between rounded-xl border border-stone-200/80 bg-white px-3.5 py-2.5 text-xs">
                <span className="text-stone-500 font-medium">Request Status:</span>
                <div>
                  <BookingStatusBadge status={selectedBooking.status} compact />
                </div>
              </div>

              {/* Customer Message */}
              <div className="rounded-xl border border-stone-200/80 bg-white p-3 text-xs space-y-1">
                <div className="flex items-center gap-1.5 text-stone-500 font-medium text-[11px]">
                  <MessageSquare className="h-3.5 w-3.5 text-stone-400" />
                  <span>Customer Message</span>
                </div>
                <p className="text-stone-700 leading-relaxed italic bg-stone-50 rounded-lg p-2.5 border border-stone-100 break-words text-[11px] sm:text-xs">
                  {selectedBooking.message
                    ? `“${selectedBooking.message}”`
                    : "No message was included with this booking request."}
                </p>
              </div>

              {/* Dialog Footer Actions */}
              <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-2.5 pt-2 border-t border-stone-100">
                <Link
                  href={`/services/${selectedBooking.serviceId}`}
                  className="inline-flex items-center justify-center sm:justify-start gap-1 text-xs font-semibold text-[#844353] hover:underline py-1"
                >
                  <span>View Public Service Page</span>
                  <ExternalLink className="h-3 w-3" />
                </Link>

                <button
                  type="button"
                  onClick={() => setSelectedBooking(null)}
                  className="inline-flex h-9 sm:h-8 w-full sm:w-auto items-center justify-center rounded-lg border border-stone-200 bg-white px-4 text-xs font-medium text-stone-700 hover:bg-stone-50 transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
