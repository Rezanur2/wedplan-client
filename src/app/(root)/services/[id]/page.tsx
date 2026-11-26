import React from "react";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import {
  MapPin,
  CheckCircle2,
  ArrowLeft,
  Mail,
  Building2,
  SearchX,
  Sparkles,
} from "lucide-react";
import { getServiceById } from "@/lib/api/services";
import { getBookings } from "@/lib/actions/bookings";
import { getSession } from "@/lib/core/server";
import { IDashboardUser } from "@/types";
import ServiceGallery from "@/components/services/ServiceGallery";
import BookingCard from "@/components/services/BookingCard";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ServiceDetailsPage({ params }: Props) {
  const { id } = await params;

  const session = await getSession();
  if (!session?.user) {
    redirect(`/signin?redirectTo=/services/${id}`);
  }
  if (session.user.isBlocked) {
    redirect("/unauthorized");
  }
    
  const service = await getServiceById(id);

  let isAlreadyBooked = false;
  if (session?.user?.role?.toLowerCase() === "customer") {
    const userBookings = await getBookings();
    if (Array.isArray(userBookings)) {
      isAlreadyBooked = userBookings.some(
        (bookingItem) =>
          bookingItem.serviceId === id &&
          (bookingItem.status === "Pending" || bookingItem.status === "Accepted")
      );
    }
  }

  if (!service) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-[#844353]">
          <SearchX className="h-8 w-8" />
        </div>
        <h1 className="mt-6 font-serif text-3xl font-bold text-stone-900">
          Service Not Found
        </h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-stone-500">
          We couldn&apos;t locate the wedding service you requested. It may have
          been removed, unlisted, or the link is incorrect.
        </p>
        <div className="mt-8">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 rounded-xl bg-[#844353] px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-[#6e3745] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Browse Services</span>
          </Link>
        </div>
      </div>
    );
  }

  const vendorName = service.vendorName || "Verified Vendor";
  const businessName = service.businessName || "Wedding Specialist";
  const vendorEmail = service.vendorEmail || "";
  const vendorAvatar = service.vendorAvatar || "";

  return (
    <div className="min-h-screen bg-[#FCFBF9] pb-24 pt-6 max-w-full overflow-x-clip">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs & Back Link (Responsive, single-line on mobile) */}
        <div className="mb-5 flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 min-w-0 overflow-hidden">
            <Link
              href="/services"
              className="inline-flex items-center gap-1.5 font-medium text-stone-600 hover:text-[#844353] transition-colors shrink-0 whitespace-nowrap"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Browse Services</span>
              <span className="sm:hidden">Back</span>
            </Link>
            <span className="text-stone-300 shrink-0">/</span>
            <span className="text-stone-400 shrink-0 whitespace-nowrap hidden sm:inline">
              {service.category || "General"}
            </span>
            <span className="text-stone-300 shrink-0 hidden sm:inline">/</span>
            <span className="truncate font-medium text-stone-800">
              {service.serviceName}
            </span>
          </div>

          <span className="rounded-full bg-rose-50 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-[11px] font-semibold text-[#844353] border border-rose-200/60 shrink-0 whitespace-nowrap">
            {service.category || "Wedding"}
          </span>
        </div>

        {/* Main 2-Column Grid */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Left Column: Image Gallery, Info, Details & Vendor Profile */}
          <div className="min-w-0 lg:col-span-7 xl:col-span-8 space-y-8">
            {/*  Photo Gallery (Active Image + Thumbnail Strip) */}
            <ServiceGallery
              images={service.images}
              serviceName={service.serviceName}
            />

            {/* 2. Service Header & Basic Details */}
            <div className="space-y-3 border-b border-stone-200/80 pb-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#844353] bg-[#FBF4F5] px-2.5 py-0.5 rounded-full border border-[#E8D1D5]">
                  {service.category || "Wedding Service"}
                </span>
                <span className="text-stone-300">•</span>
                <span className="text-xs font-semibold text-stone-500">
                  {service.pricingType || "Per Event"}
                </span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 leading-tight wrap-break-word">
                {service.serviceName}
              </h1>

              <div className="flex items-center gap-1.5 text-xs text-stone-600">
                <MapPin className="h-4 w-4 text-[#844353] shrink-0" />
                <span>{service.location || "Available Nationwide"}</span>
              </div>
            </div>

            {/* 3. Prominent Pricing & Investment Banner */}
            <div className="rounded-2xl border border-[#E8D1D5]/80 bg-linear-to-r from-[#FDF8F9] via-[#FAF3F5] to-white p-4 sm:p-6 shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#844353]">
                    Starting Investment
                  </span>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
                      ${Number(service.price || 0).toLocaleString()}
                    </span>
                    <span className="text-sm font-semibold text-stone-500">
                      / {service.pricingType || "Per Event"}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-stone-500">
                    Transparent wedding pricing with platform concierge & protection included.
                  </p>
                </div>

                <div className="flex flex-wrap items-center sm:items-end justify-between sm:justify-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E8D1D5]/40">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#844353] px-3 py-1 text-xs font-semibold text-white shadow-2xs shrink-0">
                    <Sparkles className="h-3.5 w-3.5 text-rose-200" />
                    Verified Rate
                  </span>
                  <span className="text-[11px] text-stone-400 font-medium">
                    No hidden service charges
                  </span>
                </div>
              </div>
            </div>

            {/* 4. Description Section */}
            <div className="space-y-3">
              <h2 className="font-serif text-xl font-bold text-stone-900">
                About this Service
              </h2>
              <div className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-2xs">
                <p className="text-sm leading-relaxed text-stone-600 whitespace-pre-line">
                  {service.description ||
                    "No detailed description provided for this service."}
                </p>
              </div>
            </div>

            {/* Vendor Information Profile Card */}
            <div className="space-y-3">
              <h2 className="font-serif text-xl font-bold text-stone-900">
                Meet the Vendor
              </h2>
              <div className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {vendorAvatar ? (
                      <Image
                        src={vendorAvatar}
                        alt={vendorName}
                        width={56}
                        height={56}
                        className="h-14 w-14 rounded-full object-cover ring-2 ring-stone-200 shrink-0"
                      />
                    ) : (
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#844353]/10 font-serif text-lg font-bold text-[#844353] ring-1 ring-[#844353]/20">
                        {vendorName.charAt(0).toUpperCase()}
                      </div>
                    )}

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-stone-900">
                          {vendorName}
                        </h3>
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="h-3 w-3" />
                          Verified
                        </span>
                      </div>

                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-stone-500">
                        <span className="inline-flex items-center gap-1">
                          <Building2 className="h-3.5 w-3.5 text-stone-400" />
                          {businessName}
                        </span>
                        {vendorEmail && (
                          <>
                            <span>•</span>
                            <span className="inline-flex items-center gap-1 truncate max-w-50 sm:max-w-none">
                              <Mail className="h-3.5 w-3.5 text-stone-400 shrink-0" />
                              <span className="truncate">{vendorEmail}</span>
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <span className="text-xs font-semibold text-stone-500 bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-200/70 w-fit">
                    Professional Atelier
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Booking Request Card */}
          <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-24 self-start">
            <BookingCard
              service={service}
              currentUser={session.user as IDashboardUser}
              isAlreadyBooked={isAlreadyBooked}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
