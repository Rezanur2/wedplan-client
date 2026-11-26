"use client";

import React from "react";
import Image from "next/image";
import {
  Mail,
  Shield,
  Crown,
  Fingerprint,
  Calendar,
  Store,
} from "lucide-react";
import { IDashboardUser } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface UserDetailsModalProps {
  selectedUser: IDashboardUser | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function UserDetailsModal({
  selectedUser,
  isOpen,
  onClose,
}: UserDetailsModalProps) {
  if (!selectedUser) return null;

  const userId = selectedUser._id || selectedUser.id || "";
  const userRole = (selectedUser.role || "customer").toLowerCase();
  const isUserBlocked = Boolean(selectedUser.isBlocked);
  const isVendorPremium = Boolean(
    selectedUser.premium || selectedUser.subscriptionPlan?.toLowerCase() === "premium"
  );
  const userInitials = (selectedUser.name || "U").slice(0, 2).toUpperCase();
  const registrationDate = selectedUser.createdAt
    ? new Date(selectedUser.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Registered Member";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-white border border-stone-200 rounded-2xl p-6 shadow-xl">
        <DialogHeader>
          <DialogTitle className="font-serif text-lg font-bold text-stone-900">
            User Profile Details
          </DialogTitle>
          <DialogDescription className="text-xs text-stone-500">
            Complete account and authentication information.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-1 text-xs">
          {/* Profile Card Header */}
          <div className="flex items-center gap-3.5 rounded-xl bg-stone-50 p-3.5 border border-stone-100">
            <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-stone-200 bg-stone-100 font-serif text-lg font-bold text-stone-700 shadow-2xs">
              {selectedUser.image ? (
                <Image
                  src={selectedUser.image}
                  alt={selectedUser.name || "User"}
                  fill
                  className="object-cover"
                />
              ) : (
                userInitials
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-serif font-bold text-stone-900 text-base truncate">
                {selectedUser.name || "Unnamed User"}
              </h4>
              <div className="flex items-center gap-1.5 text-stone-500 text-xs mt-0.5">
                <Mail className="h-3 w-3 text-stone-400 shrink-0" />
                <span className="truncate">{selectedUser.email}</span>
              </div>
              <div className="flex items-center gap-2 mt-1.5">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold border capitalize ${
                    userRole === "admin"
                      ? "bg-purple-50 text-purple-700 border-purple-200"
                      : userRole === "vendor"
                      ? "bg-rose-50 text-[#844353] border-rose-200"
                      : "bg-sky-50 text-sky-700 border-sky-200"
                  }`}
                >
                  <Shield className="h-2.5 w-2.5" />
                  <span>{selectedUser.role || "Customer"}</span>
                </span>

                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold border ${
                    isUserBlocked
                      ? "bg-rose-50 text-rose-700 border-rose-200"
                      : "bg-emerald-50 text-emerald-700 border-emerald-200"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      isUserBlocked ? "bg-rose-500" : "bg-emerald-500"
                    }`}
                  />
                  <span>{isUserBlocked ? "Blocked" : "Active"}</span>
                </span>
              </div>
            </div>
          </div>

          {/* 2x2 Info Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="rounded-xl border border-stone-100 bg-white p-3 space-y-0.5 shadow-2xs">
              <div className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-stone-400">
                <Fingerprint className="h-3 w-3" />
                <span>User ID</span>
              </div>
              <p
                className="font-mono text-stone-700 text-[11px] truncate"
                title={userId}
              >
                {userId || "N/A"}
              </p>
            </div>

            <div className="rounded-xl border border-stone-100 bg-white p-3 space-y-0.5 shadow-2xs">
              <div className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-stone-400">
                <Calendar className="h-3 w-3 text-[#844353]" />
                <span>Registered On</span>
              </div>
              <p className="font-medium text-stone-800 text-[11px]">
                {registrationDate}
              </p>
            </div>
          </div>

          {/* Vendor Details */}
          {userRole === "vendor" && (
            <div className="rounded-xl border border-stone-100 bg-stone-50/60 p-3 space-y-2">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                <Store className="h-3.5 w-3.5 text-[#844353]" />
                <span>Vendor Information</span>
              </div>
              <div className="flex items-center justify-between text-xs border-t border-stone-100 pt-1.5">
                <span className="text-stone-500">Business Name:</span>
                <span className="font-semibold text-stone-800">
                  {selectedUser.businessName || selectedUser.name || "Wedding Specialist"}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-500">Subscription Tier:</span>
                <span
                  className={`inline-flex items-center gap-1 font-semibold capitalize ${
                    isVendorPremium ? "text-amber-700" : "text-stone-600"
                  }`}
                >
                  {isVendorPremium && <Crown className="h-3 w-3 text-amber-600" />}
                  {isVendorPremium ? "Premium" : "Free Plan"}
                </span>
              </div>
            </div>
          )}

          {/* Modal Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-stone-100">
            <span className="text-[11px] text-stone-400">
              {isUserBlocked ? "Account is restricted" : "Account in good standing"}
            </span>

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-stone-200 bg-white px-4 py-1.5 font-medium text-stone-700 hover:bg-stone-50 shadow-2xs transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
