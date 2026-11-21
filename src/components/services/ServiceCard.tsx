"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight, MapPin, Heart } from "lucide-react";
import { IVendorService } from "@/types";
import { useSession } from "@/lib/auth-client";

interface ServiceCardProps {
  service: IVendorService;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);
  const { data: session } = useSession();
  const user = session?.user;

  const fallbackImage =
    "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800";
  const imageUrl = service.images?.[0] || fallbackImage;
  const serviceId = service._id || service.id || "";
  const priceNumber = Number(service.price) || 0;

  const vendorName = service.vendorName || "Hearth & Vine";
  const companyName = service.businessName || service.vendorSubtitle || "Wedding Specialists";

  const handleViewServiceDetails = (id: string) => {
    if (!user) {
      router.push(`/signin?redirectTo=/services/${id}`);
      return;
    }
    router.push(`/services/${id}`);
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 p-3.5 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full group">
      
      {/* 1. Top Section: Image, Category Badge, Wishlist & Price Badge */}
      <div>
        <div className="relative w-full h-44 sm:h-48 rounded-xl overflow-hidden bg-stone-100">
          {/* Main Service Image */}
          <Image
            src={imageUrl}
            alt={service.serviceName || "Wedding Service"}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Top-Left Category Badge */}
          <span className="absolute top-2.5 left-2.5 text-[10px] font-bold tracking-wider uppercase bg-[#FBF4F5]/95 backdrop-blur-xs text-[#844353] px-2.5 py-0.5 rounded-full shadow-2xs border border-[#E8D1D5]">
            {service.category || "Wedding"}
          </span>

          {/* Top-Right Favorite / Wishlist Button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsFavorite(!isFavorite);
            }}
            aria-label="Add to favorites"
            className="absolute top-2.5 right-2.5 flex h-7 w-7 items-center justify-center rounded-full border border-white/60 bg-white/90 text-stone-600 shadow-2xs backdrop-blur-xs transition-all hover:scale-110 hover:bg-white hover:text-rose-600 cursor-pointer"
          >
            <Heart
              className={`h-3.5 w-3.5 transition-colors ${
                isFavorite ? "fill-rose-500 text-rose-500" : "text-stone-600"
              }`}
            />
          </button>

          {/* Bottom Gradient Overlay: Location & Price Badge */}
          <div className="absolute inset-x-0 bottom-0 h-10 bg-linear-to-t from-black/75 via-black/35 to-transparent flex items-end justify-between px-3 pb-1.5 text-white/90">
            <div className="flex items-center gap-1 text-[11px] font-medium truncate max-w-[60%]">
              <MapPin className="w-3 h-3 text-stone-200 shrink-0" />
              <span className="truncate">{service.location || "On Request"}</span>
            </div>

            <span className="rounded-lg bg-stone-900/85 px-2.5 py-0.5 text-xs font-bold text-white shadow-xs backdrop-blur-xs shrink-0">
              ${priceNumber.toLocaleString()}
            </span>
          </div>
        </div>

        {/* 2. Middle Section: Pricing Type, Title, Description */}
        <div className="mt-3 space-y-1">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#844353] truncate">
              {service.pricingType || "Per Event"}
            </p>
            <span className="text-[10px] text-stone-400 font-medium uppercase tracking-wider">
              Verified Atelier
            </span>
          </div>

          <button
            type="button"
            onClick={() => handleViewServiceDetails(serviceId)}
            className="text-left w-full cursor-pointer block"
          >
            <h3
              className="font-serif text-base font-bold text-stone-900 leading-snug line-clamp-1 group-hover:text-[#844353] transition-colors"
              title={service.serviceName}
            >
              {service.serviceName || "Wedding Service"}
            </h3>
          </button>

          <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
            {service.description || "A curated wedding service tailored to elevate your special day."}
          </p>
        </div>
      </div>

      {/* 3. Bottom Section: Vendor Profile & View Details Button */}
      <div className="mt-3.5">
        {/* Vendor Profile Row */}
        <div className="pt-3 border-t border-stone-100 flex items-center gap-2.5 mb-3">
          {service.vendorAvatar ? (
            <Image
              src={service.vendorAvatar}
              alt={vendorName}
              width={34}
              height={34}
              className="h-8.5 w-8.5 rounded-full object-cover shrink-0 ring-1 ring-stone-200"
            />
          ) : (
            <div className="flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-full bg-[#844353]/10 text-xs font-bold text-[#844353]">
              {vendorName.charAt(0).toUpperCase()}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-stone-800 truncate leading-tight">
              {vendorName}
            </p>
            <p className="text-[10.5px] text-stone-400 truncate mt-0.5">
              {companyName}
            </p>
          </div>
        </div>

        {/* View Details Button */}
        <button
          type="button"
          onClick={() => handleViewServiceDetails(serviceId)}
          className="w-full inline-flex items-center justify-center space-x-2 bg-[#844353] hover:bg-[#723645] text-white text-xs font-semibold py-2.5 rounded-xl shadow-2xs transition-all duration-200 group-hover:shadow-xs cursor-pointer"
        >
          <span>View Details</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
}
