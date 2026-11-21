import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ExternalLink,
  Pencil,
  Clock,
  Lock,
  Info,
  Users,
  Sparkles,
} from "lucide-react";
import { IVendorService } from "@/types";
import { Button } from "@/components/ui/button";
import { DeleteServiceDialog } from "./DeleteServiceDialog";
import { EditServiceDialog } from "./EditServiceDialog";

export interface ServiceCardProps {
  service: IVendorService;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  // Toggle availability state
  const [isAvailable, setIsAvailable] = useState<boolean>(
    service.isAvailable ?? true,
  );

  const isPending =
    service.status === "Pending" || service.status === "Under Review";

  const displayImage =
    service.images && service.images.length > 0
      ? service.images[0]
      : "No Image";

  return (
    <div className="flex flex-col justify-between overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-xs transition hover:shadow-md">
      {/* 1. Card Top: Image & Overlay Badges */}
      <div className="relative h-56 w-full overflow-hidden bg-stone-100">
        <Image
          src={displayImage}
          alt={service.serviceName}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        {/* Subtle dark gradient overlay for text readability */}
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-black/30" />

        {/* Top Badges Row */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-1.5">
          <div className="flex items-center gap-1.5 min-w-0">
            {isPending ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/90 backdrop-blur-xs px-2.5 py-1 text-[10px] sm:text-[11px] font-medium text-white shadow-xs whitespace-nowrap shrink-0">
                <Clock className="h-3 w-3 shrink-0" />
                Pending Approval
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 backdrop-blur-xs px-2.5 py-1 text-[10px] sm:text-[11px] font-medium text-stone-800 shadow-xs whitespace-nowrap shrink-0">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                Active
              </span>
            )}

            {/* Category Badge */}
            <span className="inline-flex items-center rounded-full bg-black/40 backdrop-blur-xs px-2.5 py-1 text-[10px] sm:text-[11px] font-medium text-white/90 whitespace-nowrap truncate">
              {service.category}
            </span>
          </div>

          {/* Right badge / action */}
          {isPending ? (
            <span className="hidden sm:inline-flex items-center rounded-full bg-stone-900/80 backdrop-blur-xs px-2.5 py-1 text-[10px] sm:text-[11px] font-medium text-stone-200 whitespace-nowrap shrink-0">
              Under Review
            </span>
          ) : (
            <Link
              href={`/services/${service._id || service.id}`}
              title="View Service Details"
              className="rounded-lg bg-black/40 backdrop-blur-xs p-1.5 text-white transition hover:bg-black/60 cursor-pointer shrink-0 inline-flex items-center justify-center"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>

        {/* Bottom Details Over Image */}
        <div className="absolute bottom-3 inset-x-3 flex items-end justify-between text-white">
          <div className="text-[11px] font-semibold tracking-wider uppercase text-white/90 drop-shadow-xs">
            {service.location}
          </div>
          <div className="text-right">
            <span className="text-lg font-bold">
              ${Number(service.price).toLocaleString()}
            </span>
            <span className="text-[11px] font-normal text-white/80">
              {" "}
              / {service.pricingType || "event"}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Card Body: Title, ID, Description, Stats */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {/* Title and ID */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-serif text-lg font-semibold text-stone-900 line-clamp-1">
            {service.serviceName}
          </h3>
          {(service.id || service._id) && (
            <span className="shrink-0 rounded bg-stone-100 px-2 py-0.5 text-[11px] font-mono text-stone-500">
              ID {service.id || `#${service._id?.slice(-4)}`}
            </span>
          )}
        </div>

        {/* Description */}
        <p className="mt-1.5 text-xs text-stone-500 line-clamp-2">
          {service.description}
        </p>

        {/* Pending Service: Review Notice Box */}
        {isPending && (
          <div className="my-3.5 rounded-xl border border-amber-200 bg-amber-50/70 p-3 text-xs text-amber-900">
            <div className="flex items-center gap-1.5 font-semibold">
              <Info className="h-4 w-4 shrink-0 text-amber-600" />
              <span>Submitted for Review</span>
            </div>
            <p className="mt-1 text-[11px] text-amber-800 leading-relaxed">
              {service.reviewNotice ||
                "The WedPlan team reviews new listings within 24–48 hours to confirm photos and license details."}
            </p>
          </div>
        )}

        {/* Features / Highlights */}
        {service.features && service.features.length > 0 && (
          <div className="mt-auto flex flex-wrap items-center gap-2 pt-2 text-[11px] text-stone-500">
            {service.features.map((feat, idx) => (
              <span key={idx} className="inline-flex items-center gap-1">
                {idx === 0 ? (
                  <Users className="h-3 w-3 text-stone-400" />
                ) : (
                  <Sparkles className="h-3 w-3 text-stone-400" />
                )}
                <span>{feat}</span>
                {idx < service.features!.length - 1 && (
                  <span className="text-stone-300 ml-1">·</span>
                )}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 3. Card Footer: Availability Switch & Actions */}
      <div className="border-t border-stone-100 bg-stone-50/50 px-4 py-3 sm:px-5">
        {isPending ? (
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs italic text-stone-400">
              <Lock className="h-3.5 w-3.5" />
              Hidden from public search
            </span>

            <div className="flex items-center gap-2">
              <EditServiceDialog service={service} />
              <DeleteServiceDialog service={service} />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-2">
            {/* Availability Toggle Switch */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                role="switch"
                aria-checked={isAvailable}
                onClick={() => setIsAvailable(!isAvailable)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  isAvailable ? "bg-[#844353]" : "bg-stone-300"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
                    isAvailable ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
              <span className="text-xs font-medium text-stone-600">
                {isAvailable ? "Accepting Inquiries" : "Paused"}
              </span>
            </div>

            {/* Actions: Edit & Delete */}
            <div className="flex items-center gap-1.5">
              <EditServiceDialog service={service} />
              <DeleteServiceDialog service={service} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
