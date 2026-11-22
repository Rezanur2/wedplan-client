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
  const pendingCount = bookings.filter(
    (b) => b.status?.toLowerCase() === "pending"
  ).length;
  const acceptedCount = bookings.filter(
    (b) => b.status?.toLowerCase() === "accepted"
  ).length;
  const rejectedCount = bookings.filter(
    (b) =>
      b.status?.toLowerCase() === "rejected" ||
      b.status?.toLowerCase() === "cancelled"
  ).length;

  // Filtered list based on active tab
  const filteredBookings = bookings.filter((b) => {
    if (activeTab === "all") return true;
    if (activeTab === "pending") return b.status?.toLowerCase() === "pending";
    if (activeTab === "accepted") return b.status?.toLowerCase() === "accepted";
    if (activeTab === "rejected")
      return (
        b.status?.toLowerCase() === "rejected" ||
        b.status?.toLowerCase() === "cancelled"
      );
    return true;
  });

  // Handle Accept Booking
  const handleAccept = async (bookingId: string) => {
    setLoadingId(bookingId);
    try {
      const res = await updateBookingStatus(bookingId, "Accepted");
      if (res?.modifiedCount > 0 || res?.matchedCount > 0) {
        setBookings((prev) =>
          prev.map((b) => (b._id === bookingId ? { ...b, status: "Accepted" } : b))
        );
        toast.add({
          title: "Booking Accepted",
          description: "You have accepted this wedding booking request.",
          type: "success",
        });
      } else {
        toast.add({
          title: "Update Failed",
          description: res?.message || "Could not accept booking.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error accepting booking:", error);
      toast.add({
        title: "Error",
        description: "Something went wrong while accepting.",
        type: "error",
      });
    } finally {
      setLoadingId(null);
    }
  };

  // Handle Confirm Reject Booking
  const handleConfirmReject = async () => {
    if (!bookingToReject?._id) return;
    const bookingId = bookingToReject._id;
    setLoadingId(bookingId);

    try {
      const res = await updateBookingStatus(bookingId, "Rejected");
      if (res?.modifiedCount > 0 || res?.matchedCount > 0) {
        setBookings((prev) =>
          prev.map((b) => (b._id === bookingId ? { ...b, status: "Rejected" } : b))
        );
        toast.add({
          title: "Booking Declined",
          description: "You have declined this booking request.",
          type: "success",
        });
        setBookingToReject(null);
      } else {
        toast.add({
          title: "Update Failed",
          description: res?.message || "Could not decline booking.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error rejecting booking:", error);
      toast.add({
        title: "Error",
        description: "Something went wrong while declining.",
        type: "error",
      });
    } finally {
      setLoadingId(null);
    }
  };

  const fallbackImage =
    "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800";

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
        <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-2xs">
          <div className="text-[11px] font-medium text-stone-500 uppercase tracking-wider">
            Total Requests
          </div>
          <div className="mt-1 font-serif text-2xl font-bold text-stone-900">
            {totalCount}
          </div>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 shadow-2xs">
          <div className="text-[11px] font-medium text-amber-800 uppercase tracking-wider">
            Pending Review
          </div>
          <div className="mt-1 font-serif text-2xl font-bold text-amber-900">
            {pendingCount}
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 shadow-2xs">
          <div className="text-[11px] font-medium text-emerald-800 uppercase tracking-wider">
            Accepted
          </div>
          <div className="mt-1 font-serif text-2xl font-bold text-emerald-900">
            {acceptedCount}
          </div>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4 shadow-2xs">
          <div className="text-[11px] font-medium text-stone-600 uppercase tracking-wider">
            Declined / Cancelled
          </div>
          <div className="mt-1 font-serif text-2xl font-bold text-stone-700">
            {rejectedCount}
          </div>
        </div>
      </div>

      {/* 3. Filter Tabs */}
      <div className="flex items-center gap-1.5 rounded-xl bg-stone-100 p-1 w-fit">
        <button
          type="button"
          onClick={() => setActiveTab("all")}
          className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition cursor-pointer ${
            activeTab === "all"
              ? "bg-white text-stone-900 shadow-2xs"
              : "text-stone-600 hover:text-stone-900"
          }`}
        >
          <span>All</span>
          <span className="rounded-full bg-stone-200/70 px-1.5 py-0.2 text-[10px] text-stone-600">
            {totalCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("pending")}
          className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition cursor-pointer ${
            activeTab === "pending"
              ? "bg-white text-stone-900 shadow-2xs"
              : "text-stone-600 hover:text-stone-900"
          }`}
        >
          <span>Pending</span>
          <span className="rounded-full bg-amber-100 px-1.5 py-0.2 text-[10px] font-semibold text-amber-800">
            {pendingCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("accepted")}
          className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition cursor-pointer ${
            activeTab === "accepted"
              ? "bg-white text-stone-900 shadow-2xs"
              : "text-stone-600 hover:text-stone-900"
          }`}
        >
          <span>Accepted</span>
          <span className="rounded-full bg-emerald-100 px-1.5 py-0.2 text-[10px] font-semibold text-emerald-800">
            {acceptedCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("rejected")}
          className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition cursor-pointer ${
            activeTab === "rejected"
              ? "bg-white text-stone-900 shadow-2xs"
              : "text-stone-600 hover:text-stone-900"
          }`}
        >
          <span>Declined</span>
          <span className="rounded-full bg-rose-100 px-1.5 py-0.2 text-[10px] font-semibold text-rose-800">
            {rejectedCount}
          </span>
        </button>
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
                        src={booking.serviceImage || fallbackImage}
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
                      {isPending && (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 sm:px-3 py-1 text-xs font-medium text-amber-800">
                          <Clock className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                          <span>Pending Review</span>
                        </span>
                      )}

                      {isAccepted && (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 sm:px-3 py-1 text-xs font-medium text-emerald-800">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                          <span>Accepted</span>
                        </span>
                      )}

                      {isRejected && (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-2.5 sm:px-3 py-1 text-xs font-medium text-rose-800">
                          <XCircle className="h-3.5 w-3.5 text-rose-600 shrink-0" />
                          <span>Declined</span>
                        </span>
                      )}

                      {isCancelled && (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-stone-100 px-2.5 sm:px-3 py-1 text-xs font-medium text-stone-600">
                          <Ban className="h-3.5 w-3.5 text-stone-500 shrink-0" />
                          <span>Cancelled by Customer</span>
                        </span>
                      )}
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
                            onClick={() => booking._id && handleAccept(booking._id)}
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
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-50 text-rose-600 mb-2">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <DialogTitle className="font-serif text-lg text-stone-900">
              Decline Booking Request?
            </DialogTitle>
            <DialogDescription className="text-xs text-stone-500 leading-relaxed">
              Are you sure you want to decline the request for{" "}
              <strong>{bookingToReject?.serviceName}</strong> on{" "}
              <strong>{bookingToReject?.eventDate}</strong> by{" "}
              <strong>{bookingToReject?.customerName}</strong>? Once declined, this
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setBookingToReject(null)}
              className="inline-flex h-9 items-center justify-center rounded-lg border border-stone-200 px-3.5 text-xs font-medium text-stone-700 hover:bg-stone-50 transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={Boolean(loadingId)}
              onClick={handleConfirmReject}
              className="inline-flex h-9 items-center justify-center rounded-lg bg-rose-600 px-4 text-xs font-medium text-white hover:bg-rose-700 transition disabled:opacity-50 cursor-pointer"
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
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif text-lg text-stone-900">
              Booking Request Details
            </DialogTitle>
            <DialogDescription className="text-xs text-stone-500">
              Complete reservation information submitted by the customer.
            </DialogDescription>
          </DialogHeader>

          {selectedBooking && (
            <div className="space-y-4 pt-1">
              {/* Service Quick Banner */}
              <div className="flex items-center gap-3 rounded-xl border border-stone-200 bg-stone-50/70 p-3">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-stone-200">
                  <Image
                    src={selectedBooking.serviceImage || fallbackImage}
                    alt={selectedBooking.serviceName || "Service"}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-serif text-sm font-semibold text-stone-900 truncate">
                    {selectedBooking.serviceName}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-stone-500 mt-0.5">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Customer */}
                <div className="rounded-xl border border-stone-200/80 bg-white p-3 space-y-1">
                  <div className="flex items-center gap-1.5 text-stone-400 font-medium text-[11px] uppercase tracking-wider">
                    <User className="h-3.5 w-3.5 text-stone-500" />
                    <span>Customer</span>
                  </div>
                  <div className="font-semibold text-stone-900">
                    {selectedBooking.customerName || "Customer"}
                  </div>
                  <div className="text-stone-500 truncate">
                    {selectedBooking.customerEmail || "No email"}
                  </div>
                </div>

                {/* Event Schedule */}
                <div className="rounded-xl border border-stone-200/80 bg-white p-3 space-y-1">
                  <div className="flex items-center gap-1.5 text-stone-400 font-medium text-[11px] uppercase tracking-wider">
                    <Calendar className="h-3.5 w-3.5 text-[#844353]" />
                    <span>Event Schedule</span>
                  </div>
                  <div className="font-semibold text-stone-900">
                    {selectedBooking.eventDate}
                  </div>
                  <div className="text-stone-500 truncate">
                    {selectedBooking.eventLocation}
                  </div>
                </div>
              </div>

              {/* Status Row */}
              <div className="flex items-center justify-between rounded-xl border border-stone-200/80 bg-white px-3.5 py-2.5 text-xs">
                <span className="text-stone-500 font-medium">Request Status:</span>
                <div>
                  {selectedBooking.status?.toLowerCase() === "pending" && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-800">
                      <Clock className="h-3 w-3 text-amber-600" />
                      Pending Review
                    </span>
                  )}
                  {selectedBooking.status?.toLowerCase() === "accepted" && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-800">
                      <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                      Accepted
                    </span>
                  )}
                  {selectedBooking.status?.toLowerCase() === "rejected" && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-2.5 py-0.5 text-[11px] font-semibold text-rose-800">
                      <XCircle className="h-3 w-3 text-rose-600" />
                      Declined
                    </span>
                  )}
                  {selectedBooking.status?.toLowerCase() === "cancelled" && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-stone-100 px-2.5 py-0.5 text-[11px] font-semibold text-stone-600">
                      <Ban className="h-3 w-3 text-stone-500" />
                      Cancelled
                    </span>
                  )}
                </div>
              </div>

              {/* Customer Message */}
              <div className="rounded-xl border border-stone-200/80 bg-white p-3 text-xs space-y-1">
                <div className="flex items-center gap-1.5 text-stone-500 font-medium text-[11px]">
                  <MessageSquare className="h-3.5 w-3.5 text-stone-400" />
                  <span>Customer Message</span>
                </div>
                <p className="text-stone-700 leading-relaxed italic bg-stone-50 rounded-lg p-2.5 border border-stone-100">
                  {selectedBooking.message
                    ? `“${selectedBooking.message}”`
                    : "No message was included with this booking request."}
                </p>
              </div>

              {/* Dialog Footer Actions */}
              <div className="flex items-center justify-between pt-2">
                <Link
                  href={`/services/${selectedBooking.serviceId}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#844353] hover:underline"
                >
                  <span>View Public Service Page</span>
                  <ExternalLink className="h-3 w-3" />
                </Link>

                <button
                  type="button"
                  onClick={() => setSelectedBooking(null)}
                  className="inline-flex h-8 items-center justify-center rounded-lg border border-stone-200 bg-white px-3 text-xs font-medium text-stone-700 hover:bg-stone-50 transition cursor-pointer"
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
