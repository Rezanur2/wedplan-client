"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Calendar as CalendarIcon,
  MapPin,
  Clock,
  ShieldCheck,
  Send,
  Store,
  ShieldAlert,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { IVendorService, IDashboardUser } from "@/types";

interface BookingCardProps {
  service: IVendorService;
  currentUser?: IDashboardUser | null;
}

export default function BookingCard({ service, currentUser }: BookingCardProps) {
  const [eventDate, setEventDate] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [message, setMessage] = useState("");

  const priceNumber = Number(service.price) || 0;

  // Check if current user is the owner of this service
  const isOwnService = Boolean(
    currentUser?.id &&
      service.vendorId &&
      String(currentUser.id) === String(service.vendorId)
  ) || Boolean(
    currentUser?.email &&
      service.vendorEmail &&
      currentUser.email.toLowerCase() === service.vendorEmail.toLowerCase()
  );

  // Check if current user is an admin
  const isAdmin = currentUser?.role?.toLowerCase() === "admin";

  // Check if service is approved and active
  const serviceStatus = (service.status || "Pending").toLowerCase();
  const isServiceAvailable =
    serviceStatus === "active" || serviceStatus === "approved";

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting booking request:", {
      serviceId: service._id || service.id,
      vendorId: service.vendorId,
      customerId: currentUser?.id,
      customerEmail: currentUser?.email,
      eventDate,
      eventLocation,
      message,
    });
  };

  return (
    <div className="sticky top-24 rounded-2xl sm:rounded-3xl border border-stone-200/90 bg-white p-5 sm:p-7 shadow-xs">
      
      {/*  Vendor cannot book their own service */}
      {isOwnService ? (
        <div className="py-4 text-center space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-[#844353] border border-rose-100">
            <Store className="h-7 w-7" />
          </div>
          <div>
            <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-[11px] font-semibold text-[#844353] border border-rose-200">
              Your Listing
            </span>
            <h3 className="mt-2 font-serif text-lg font-bold text-stone-900">
              Own Service Restriction
            </h3>
            <p className="mt-1.5 text-xs text-stone-500 leading-relaxed max-w-xs mx-auto">
              Vendors cannot submit booking requests for their own wedding services. You can manage or update this listing from your dashboard.
            </p>
          </div>
          <Link
            href="/dashboard/vendor/my-services"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#844353] hover:bg-[#6e3745] text-white py-2.5 text-xs font-semibold shadow-xs transition-colors"
          >
            <span>Manage in My Services</span>
          </Link>
        </div>
      ) : isAdmin ? (
        /*  Admin cannot submit customer booking requests */
        <div className="py-4 text-center space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-700 border border-amber-200">
            <ShieldAlert className="h-7 w-7" />
          </div>
          <div>
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-semibold text-amber-800 border border-amber-200">
              Administrator View
            </span>
            <h3 className="mt-2 font-serif text-lg font-bold text-stone-900">
              Booking Restricted
            </h3>
            <p className="mt-1.5 text-xs text-stone-500 leading-relaxed max-w-xs mx-auto">
              You are logged in as an Administrator. Admins oversee the platform and cannot submit customer booking requests.
            </p>
          </div>
          <Link
            href="/dashboard/admin"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white py-2.5 text-xs font-semibold shadow-xs transition-colors"
          >
            <span>Go to Admin Dashboard</span>
          </Link>
        </div>
      ) : !isServiceAvailable ? (
        /*  Service is not yet approved/active */
        <div className="py-4 text-center space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-100 text-stone-600 border border-stone-200">
            <Clock className="h-7 w-7" />
          </div>
          <div>
            <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-[11px] font-semibold text-[#844353] border border-rose-200">
              Status: {service.status || "Pending Review"}
            </span>
            <h3 className="mt-2 font-serif text-lg font-bold text-stone-900">
              Not Available for Booking
            </h3>
            <p className="mt-1.5 text-xs text-stone-500 leading-relaxed max-w-xs mx-auto">
              Only approved and active services can accept booking requests. This service is currently under review by our curation team.
            </p>
          </div>
          <Link
            href="/services"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 py-2.5 text-xs font-semibold transition-colors"
          >
            <span>Browse Active Services</span>
          </Link>
        </div>
      ) : (
        /*  Customer Booking Form */
        <div>
          {/* Header */}
          <div className="border-b border-stone-100 pb-4">
            <h3 className="font-serif text-xl font-bold text-stone-900">
              Reserve Your Date
            </h3>
            <p className="mt-0.5 text-xs text-stone-500">
              Select your wedding date and venue to check vendor availability.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleBookingSubmit} className="mt-5 space-y-4">
            {/* Event Date */}
            <div>
              <Label htmlFor="eventDate" className="text-xs font-semibold text-stone-700">
                Wedding / Event Date <span className="text-rose-600">*</span>
              </Label>
              <div className="relative mt-1.5">
                <CalendarIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                <Input
                  id="eventDate"
                  name="eventDate"
                  type="date"
                  required
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="h-10 pl-9.5 text-xs rounded-xl bg-stone-50/60 border-stone-200 focus-visible:ring-[#844353]"
                />
              </div>
            </div>

            {/* Event Location */}
            <div>
              <Label htmlFor="eventLocation" className="text-xs font-semibold text-stone-700">
                Event Venue / Location <span className="text-rose-600">*</span>
              </Label>
              <div className="relative mt-1.5">
                <MapPin className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                <Input
                  id="eventLocation"
                  name="eventLocation"
                  type="text"
                  required
                  placeholder="e.g. The Driskill, Austin, TX"
                  value={eventLocation}
                  onChange={(e) => setEventLocation(e.target.value)}
                  className="h-10 pl-9.5 text-xs rounded-xl bg-stone-50/60 border-stone-200 focus-visible:ring-[#844353]"
                />
              </div>
            </div>

            {/* Message / Special Requests */}
            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="message" className="text-xs font-semibold text-stone-700">
                  Special Requests or Questions
                </Label>
                <span className="text-[10px] text-stone-400">Optional</span>
              </div>
              <Textarea
                id="message"
                name="message"
                rows={3}
                placeholder="Tell the vendor about your wedding theme, guest count, or preferred timings..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="mt-1.5 text-xs rounded-xl bg-stone-50/60 border-stone-200 focus-visible:ring-[#844353] resize-none"
              />
            </div>

            {/* Summary */}
            <div className="rounded-2xl bg-stone-50 p-4 text-xs space-y-2 border border-stone-100">
              <div className="flex justify-between text-stone-600">
                <span>Base Package Investment</span>
                <span className="font-medium text-stone-800">
                  ${priceNumber.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Platform Concierge & Protection</span>
                <span className="font-semibold text-emerald-600">Free</span>
              </div>
              <div className="pt-2 border-t border-stone-200 flex justify-between font-bold text-stone-900 text-sm">
                <span>Estimated Total</span>
                <span>${priceNumber.toLocaleString()}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#844353] hover:bg-[#6e3745] text-white py-3 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Request Booking</span>
            </button>
          </form>

          {/* Trust Notes */}
          <div className="mt-4 space-y-2 pt-4 border-t border-stone-100 text-[11px] text-stone-500">
            <div className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-stone-400 shrink-0" />
              <span>No payment required now. Vendor confirms within 24–48h.</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              <span>Backed by WedPlan Customer Satisfaction Guarantee.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
