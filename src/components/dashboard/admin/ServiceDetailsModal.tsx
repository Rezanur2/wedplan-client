"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Tag,
  DollarSign,
  Store,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  User,
  Crown,
  ExternalLink,
} from "lucide-react";
import { IVendorService } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface ServiceDetailsModalProps {
  selectedService: IVendorService | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange?: (serviceId: string, newStatus: string) => void;
}

export default function ServiceDetailsModal({
  selectedService,
  isOpen,
  onClose,
  onStatusChange,
}: ServiceDetailsModalProps) {
  if (!selectedService) return null;

  const serviceId = selectedService._id || selectedService.id || "";
  const serviceStatus = (selectedService.status || "Pending").toLowerCase();
  const serviceImage =
    selectedService.images?.[0] ||
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80";

  const formattedPrice =
    typeof selectedService.price === "number"
      ? selectedService.price.toLocaleString()
      : selectedService.price;

  const isVendorPremium = Boolean(selectedService.isPremium);

  // Reusable metrics list
  const serviceMetrics = [
    { label: "Category", value: selectedService.category || "Wedding", icon: Tag, color: "text-[#844353]" },
    { label: "Pricing", value: `$${formattedPrice} / ${selectedService.pricingType || "event"}`, icon: DollarSign, color: "text-emerald-600" },
    { label: "Location", value: selectedService.location || "Online", icon: MapPin, color: "text-rose-500" },
    { label: "Business Name", value: selectedService.businessName || "Wedding Studio", icon: Store, color: "text-sky-600" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(openState) => !openState && onClose()}>
      <DialogContent className="sm:max-w-lg bg-white border border-stone-200 rounded-2xl p-5 sm:p-6 shadow-xl max-h-[92vh] overflow-y-auto no-scrollbar">
        <DialogHeader className="space-y-1">
          <span className="text-[10px] sm:text-[11px] font-bold tracking-wider uppercase text-[#844353] bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-100 w-fit">
            Service Catalog Review
          </span>
          <DialogTitle className="font-serif text-lg sm:text-xl font-bold text-stone-900 pt-0.5">
            {selectedService.serviceName}
          </DialogTitle>
          <DialogDescription className="text-xs text-stone-500">
            Complete details and moderation actions for this wedding service.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 pt-1">
          {/* Service Banner Image */}
          <div className="relative h-36 sm:h-40 w-full overflow-hidden rounded-xl border border-stone-200 bg-stone-100">
            <Image
              src={serviceImage}
              alt={selectedService.serviceName}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 480px"
            />
            <div className="absolute top-2.5 right-2.5">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold shadow-xs backdrop-blur-md ${
                  serviceStatus === "active"
                    ? "bg-emerald-500/90 text-white"
                    : serviceStatus === "rejected"
                    ? "bg-rose-500/90 text-white"
                    : "bg-amber-500/90 text-white"
                }`}
              >
                {serviceStatus === "active" && <CheckCircle2 className="h-3.5 w-3.5" />}
                {serviceStatus === "rejected" && <XCircle className="h-3.5 w-3.5" />}
                {serviceStatus === "pending" && <Clock className="h-3.5 w-3.5" />}
                <span className="capitalize">{selectedService.status || "Pending"}</span>
              </span>
            </div>
          </div>

          {/* Quick Metrics Grid (reusable loop) */}
          <div className="grid grid-cols-2 gap-2.5">
            {serviceMetrics.map((metricItem) => {
              const IconComponent = metricItem.icon;
              return (
                <div key={metricItem.label} className="rounded-xl border border-stone-100 bg-stone-50/80 p-3 space-y-0.5">
                  <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-stone-400">
                    <IconComponent className={`h-3 w-3 ${metricItem.color}`} />
                    <span>{metricItem.label}</span>
                  </div>
                  <p className="font-medium text-stone-900 text-xs truncate">
                    {metricItem.value}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Vendor Ownership & Membership Badge */}
          <div className="rounded-xl border border-stone-100 bg-stone-50/80 p-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="h-8 w-8 rounded-lg bg-white border border-stone-200 flex items-center justify-center shrink-0">
                <User className="h-4 w-4 text-stone-600" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">
                  Vendor
                </p>
                <p className="text-xs font-bold text-stone-900 truncate">
                  {selectedService.vendorName || "Verified Vendor"}
                </p>
              </div>
            </div>

            {/* Compact Plan Badge */}
            {isVendorPremium ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-amber-300 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-800 shrink-0">
                <Crown className="h-3 w-3 text-amber-600 fill-amber-600" />
                Premium
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full border border-stone-200 bg-white px-2 py-0.5 text-[10px] font-medium text-stone-600 shrink-0">
                Free
              </span>
            )}
          </div>

          {/* Service Description */}
          <div className="rounded-xl border border-stone-100 bg-white p-3.5 space-y-1.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400 flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-[#844353]" />
              <span>Description</span>
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              {selectedService.description || "No detailed description provided for this wedding service."}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-50 transition cursor-pointer"
              >
                Close
              </button>

              <Link
                href={`/services/${serviceId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-lg border border-stone-200 bg-stone-50/80 px-2.5 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-100 transition"
              >
                <ExternalLink className="h-3 w-3 text-stone-500" />
                <span>View</span>
              </Link>
            </div>

            <div className="flex items-center gap-2">
              {serviceStatus !== "rejected" && (
                <button
                  type="button"
                  onClick={() => {
                    onStatusChange?.(serviceId, "Rejected");
                    onClose();
                  }}
                  className="rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition cursor-pointer"
                >
                  Reject
                </button>
              )}

              {serviceStatus !== "active" && (
                <button
                  type="button"
                  onClick={() => {
                    onStatusChange?.(serviceId, "Active");
                    onClose();
                  }}
                  className="rounded-lg bg-stone-900 hover:bg-stone-800 px-4 py-1.5 text-xs font-semibold text-white transition cursor-pointer shadow-xs"
                >
                  Approve
                </button>
              )}

              {serviceStatus === "active" && (
                <button
                  type="button"
                  onClick={() => {
                    onStatusChange?.(serviceId, "Paused");
                    onClose();
                  }}
                  className="rounded-lg border border-amber-200 bg-amber-50 px-3.5 py-1.5 text-xs font-semibold text-amber-800 hover:bg-amber-100 transition cursor-pointer"
                >
                  Pause
                </button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
