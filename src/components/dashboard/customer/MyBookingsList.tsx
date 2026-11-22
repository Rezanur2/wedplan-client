"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Calendar,
  MapPin,
  Clock,
  Eye,
  Store,
  DollarSign,
  ArrowRight,
  Inbox,
  XCircle,
  AlertTriangle,
  Loader2,
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
  DialogClose,
} from "@/components/ui/dialog";

const STATUS_STYLES: Record<string, string> = {
  Accepted: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Pending: "bg-amber-50 text-amber-800 border-amber-200",
  Rejected: "bg-rose-50 text-rose-700 border-rose-200",
  Cancelled: "bg-stone-100 text-stone-600 border-stone-200",
};

export default function MyBookingsList({
  bookings: initialData = [],
}: {
  bookings?: IBookingPayload[];
}) {
  const router = useRouter();
  const [bookings, setBookings] = useState<IBookingPayload[]>(initialData);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState<IBookingPayload | null>(null);
  const [bookingToCancel, setBookingToCancel] = useState<IBookingPayload | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  // Tab Filtering
  const filteredBookings = bookings.filter((b) => {
    if (activeTab === "all") return true;
    return b.status?.toLowerCase() === activeTab.toLowerCase();
  });

  // Confirm and Cancel Booking
  const handleConfirmCancel = async () => {
    if (!bookingToCancel?._id) return;

    setIsCancelling(true);
    try {
      const res = await updateBookingStatus(bookingToCancel._id, "Cancelled");
      if (res?.modifiedCount > 0) {
        setBookings((prev) =>
          prev.map((b) =>
            b._id === bookingToCancel._id ? { ...b, status: "Cancelled" } : b
          )
        );
        toast.add({
          title: "Booking Cancelled",
          description: "Your booking request was cancelled successfully.",
          type: "success",
        });
        setBookingToCancel(null);
      } else {
        toast.add({
          title: "Action Failed",
          description: res?.message || "Could not cancel booking.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Cancel booking error:", error);
      toast.add({
        title: "Error",
        description: "Something went wrong while cancelling.",
        type: "error",
      });
    } finally {
      setIsCancelling(false);
    }
  };

  const tabs = ["all", "pending", "accepted", "rejected", "cancelled"];
  const fallbackImage =
    "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800";

  return (
    <div className="mx-auto max-w-5xl space-y-5 pb-16">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-stone-200 pb-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            My Bookings
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            View and manage your celebration bookings and status updates.
          </p>
        </div>
        <div className="text-xs text-stone-600 bg-white border border-stone-200 rounded-xl px-3.5 py-1.5 shadow-2xs self-start">
          Total Bookings: <span className="font-bold text-stone-900">{bookings.length}</span>
        </div>
      </div>

      {/* 2. Filter Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {tabs.map((tab) => {
          const count =
            tab === "all"
              ? bookings.length
              : bookings.filter((b) => b.status?.toLowerCase() === tab).length;
          const isActive = activeTab === tab;

          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`capitalize px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                isActive
                  ? "bg-[#844353] text-white shadow-2xs font-semibold"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              <span>{tab}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive ? "bg-white/20 text-white" : "bg-stone-200 text-stone-600"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. Bookings List or Empty State */}
      {filteredBookings.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-[#844353]">
            <Inbox className="h-6 w-6" />
          </div>
          <h3 className="mt-3 font-serif text-base font-bold text-stone-900">
            {activeTab === "all" ? "No Bookings Found" : `No ${activeTab} bookings`}
          </h3>
          <p className="mt-1 text-xs text-stone-500 max-w-sm mx-auto">
            You have not made any booking requests under this category yet.
          </p>
          <div className="mt-4">
            <Link
              href="/services"
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#844353] hover:bg-[#6e3745] px-3.5 py-1.5 text-xs font-semibold text-white transition shadow-2xs"
            >
              <span>Browse Services</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredBookings.map((booking) => {
            const isPending = booking.status === "Pending";
            const dateFormatted = booking.createdAt
              ? new Date(booking.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "";

            return (
              <div
                key={booking._id}
                className="flex flex-col sm:flex-row rounded-2xl border border-stone-200 bg-white overflow-hidden shadow-xs hover:shadow-sm transition"
              >
                {/* Image */}
                <div className="relative h-36 sm:h-auto sm:w-52 shrink-0 bg-stone-100">
                  <Image
                    src={booking.serviceImage || fallbackImage}
                    alt={booking.serviceName || "Service"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 208px"
                  />
                  <span className="absolute top-2 left-2 rounded-md bg-white/90 backdrop-blur-xs px-2 py-0.5 text-[10px] font-semibold text-stone-800 shadow-2xs">
                    {booking.serviceCategory || "Service"}
                  </span>
                </div>

                {/* Info */}
                <div className="flex flex-1 flex-col justify-between p-4 space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-xs text-stone-500">
                      <Store className="h-3.5 w-3.5 text-stone-400" />
                      <span className="font-medium text-stone-700 truncate max-w-xs">
                        {booking.vendorEmail || "Vendor"}
                      </span>
                    </div>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold border ${
                        STATUS_STYLES[booking.status || "Pending"] || STATUS_STYLES.Pending
                      }`}
                    >
                      {booking.status || "Pending"}
                    </span>
                  </div>

                  <Link
                    href={`/services/${booking.serviceId}`}
                    className="hover:text-[#844353] transition-colors"
                  >
                    <h3 className="font-serif text-base sm:text-lg font-bold text-stone-900 line-clamp-1">
                      {booking.serviceName || "Wedding Service"}
                    </h3>
                  </Link>

                  {/* Metadata Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 rounded-xl bg-stone-50 border border-stone-100 px-3 py-2 text-xs">
                    <div className="flex items-center gap-1.5 font-medium text-stone-700">
                      <Calendar className="h-3.5 w-3.5 text-[#844353]" />
                      <span>{booking.eventDate || "Date TBD"}</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-medium text-stone-700 truncate">
                      <MapPin className="h-3.5 w-3.5 text-[#844353] shrink-0" />
                      <span className="truncate">{booking.eventLocation || "Location TBD"}</span>
                    </div>
                    <div className="flex items-center gap-1 font-semibold text-stone-800">
                      <DollarSign className="h-3.5 w-3.5 text-[#844353]" />
                      <span>{Number(booking.servicePrice ?? (booking as unknown as { price?: number | string }).price ?? 0).toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Footer & Actions */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-1 border-t border-stone-100">
                    <div className="flex items-center gap-1 text-[11px] text-stone-400">
                      <Clock className="h-3 w-3" />
                      <span>Requested: {dateFormatted || "Recently"}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedBooking(booking)}
                        className="inline-flex items-center gap-1 rounded-lg bg-[#844353] hover:bg-[#6e3745] text-white px-3 py-1.5 text-xs font-semibold shadow-2xs transition cursor-pointer"
                      >
                        <Eye className="h-3 w-3" />
                        <span>View Details</span>
                      </button>

                      {isPending && booking._id && (
                        <button
                          type="button"
                          onClick={() => setBookingToCancel(booking)}
                          className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-white hover:bg-rose-50 text-rose-700 px-2.5 py-1.5 text-xs font-semibold transition cursor-pointer"
                        >
                          <XCircle className="h-3 w-3" />
                          <span>Cancel</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. Details Dialog */}
      {selectedBooking && (
        <Dialog open={Boolean(selectedBooking)} onOpenChange={() => setSelectedBooking(null)}>
          <DialogContent className="max-w-md rounded-2xl bg-white p-5 shadow-xl border border-stone-200">
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
                  <span className="text-stone-400">Vendor</span>
                  <span className="font-medium">{selectedBooking.vendorEmail}</span>
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
                    ${Number(selectedBooking.servicePrice ?? (selectedBooking as unknown as { price?: number | string }).price ?? 0).toLocaleString()}
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
              <button
                type="button"
                onClick={() => {
                  const serviceId = selectedBooking.serviceId;
                  setSelectedBooking(null);
                  if (serviceId) {
                    router.push(`/services/${serviceId}`);
                  } else {
                    router.push("/services");
                  }
                }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#844353] hover:bg-[#6e3745] text-white px-3 py-1.5 text-xs font-semibold shadow-2xs transition cursor-pointer"
              >
                <span>View Service Listing</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>

              <DialogClose className="rounded-lg bg-stone-100 px-3.5 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-200 cursor-pointer">
                Close
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* 5. Custom UI Cancel Confirmation Dialog */}
      {bookingToCancel && (
        <Dialog open={Boolean(bookingToCancel)} onOpenChange={() => setBookingToCancel(null)}>
          <DialogContent className="max-w-sm rounded-2xl bg-white p-5 shadow-xl border border-stone-200">
            <DialogHeader>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600 mb-2 border border-rose-100">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <DialogTitle className="font-serif text-lg font-bold text-stone-900">
                Cancel Booking Request?
              </DialogTitle>
              <DialogDescription className="text-xs text-stone-500 mt-1 leading-relaxed">
                Are you sure you want to cancel your booking request for{" "}
                <span className="font-semibold text-stone-800">
                  {bookingToCancel.serviceName}
                </span>
                ? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-5 flex items-center justify-end gap-2.5">
              <button
                type="button"
                disabled={isCancelling}
                onClick={() => setBookingToCancel(null)}
                className="rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 px-3.5 py-2 text-xs font-semibold transition cursor-pointer disabled:opacity-50"
              >
                Keep Booking
              </button>
              <button
                type="button"
                disabled={isCancelling}
                onClick={handleConfirmCancel}
                className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white px-3.5 py-2 text-xs font-semibold shadow-xs transition cursor-pointer disabled:opacity-50"
              >
                {isCancelling ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Cancelling...</span>
                  </>
                ) : (
                  <span>Confirm Cancel</span>
                )}
              </button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
