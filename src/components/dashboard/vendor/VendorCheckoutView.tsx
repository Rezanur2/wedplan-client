"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Crown,
  ShieldCheck,
  CheckCircle2,
  Lock,
  CreditCard,
  Sparkles,
  HelpCircle,
  Building2,
  Mail,
  User,
  Loader2,
} from "lucide-react";
import { toast } from "@/components/ui/toast";
import { IDashboardUser } from "@/types";
import { createCheckoutSession } from "@/lib/actions/payments";
import DashboardBreadcrumb from "@/components/dashboard/shared/DashboardBreadcrumb";

interface VendorCheckoutViewProps {
  user?: IDashboardUser | null;
}

export default function VendorCheckoutView({ user }: VendorCheckoutViewProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCheckout = async () => {
    setIsSubmitting(true);
    try {
      const data = await createCheckoutSession();
      if (data?.url) {
        window.location.href = data.url;
      } else {
        toast.add({
          title: "Checkout Error",
          description: data?.error || "Unable to start Stripe checkout session.",
          type: "error",
        });
        setIsSubmitting(false);
      }
    } catch (err: unknown) {
      console.error("Checkout submission failed:", err);
      toast.add({
        title: "Connection Error",
        description: "Failed to connect to checkout server. Please try again.",
        type: "error",
      });
      setIsSubmitting(false);
    }
  };

  const planFeatures = [
    "Unlimited active wedding service listings",
    "Verified Premium Vendor crown badge",
    "Priority placement on couple search & categories",
    "Full access to vendor dashboard and booking tools",
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* 1. Breadcrumbs & Back Navigation */}
      <div className="flex items-center justify-between text-xs">
        <Link
          href="/dashboard/vendor/subscription"
          className="inline-flex items-center gap-1.5 font-medium text-stone-600 hover:text-[#844353] transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Plans</span>
        </Link>
        <span className="text-stone-400">Step 2 of 2: Checkout Review</span>
      </div>

      {/* 2. Page Title */}
      <div>
        <DashboardBreadcrumb section="VENDOR STUDIO" page="CHECKOUT" />
        <h1 className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-stone-900">
          Complete Your Premium Upgrade
        </h1>
        <p className="mt-1 text-xs text-stone-500">
          Review your order details below and proceed to the secure Stripe
          payment gateway.
        </p>
      </div>

      {/* 3. Main 2-Column Checkout Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-1">
        {/* Left 2 Columns: Plan Details & Vendor Account Info */}
        <div className="lg:col-span-2 space-y-5">
          {/* Plan Highlight Card */}
          <div className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6 shadow-2xs space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-[#844353] border border-rose-100">
                  <Crown className="h-5 w-5 text-amber-500 fill-amber-500" />
                </div>
                <div>
                  <h2 className="font-serif text-lg font-bold text-stone-900">
                    Premium Vendor Membership
                  </h2>
                  <p className="text-xs text-stone-500">
                    Lifetime Unlimited Access
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 border border-rose-200 px-2.5 py-0.5 text-[10px] font-semibold text-[#844353]">
                <Sparkles className="h-3 w-3" />
                One-Time Pass
              </span>
            </div>

            <div className="border-t border-stone-100 pt-3.5 space-y-2.5">
              <p className="text-xs font-semibold text-stone-800">
                What&apos;s included in this upgrade:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-600">
                {planFeatures.map((feat) => (
                  <div key={feat} className="flex items-start gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-[11px] leading-tight">{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Billing Account Info Card */}
          <div className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6 shadow-2xs space-y-3.5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Vendor Account Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl bg-stone-50 border border-stone-100 p-3 space-y-1">
                <span className="text-[10px] text-stone-400 uppercase font-semibold flex items-center gap-1">
                  <User className="h-3 w-3" />
                  Account Holder
                </span>
                <p className="font-semibold text-stone-800 truncate">
                  {user?.name || "Vendor"}
                </p>
              </div>

              <div className="rounded-xl bg-stone-50 border border-stone-100 p-3 space-y-1">
                <span className="text-[10px] text-stone-400 uppercase font-semibold flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  Billing Email
                </span>
                <p className="font-semibold text-stone-800 truncate">
                  {user?.email || "vendor@wedplan.com"}
                </p>
              </div>

              {user?.businessName && (
                <div className="rounded-xl bg-stone-50 border border-stone-100 p-3 space-y-1 sm:col-span-2">
                  <span className="text-[10px] text-stone-400 uppercase font-semibold flex items-center gap-1">
                    <Building2 className="h-3 w-3" />
                    Business / Studio
                  </span>
                  <p className="font-semibold text-stone-800">
                    {user.businessName}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Trust & Guarantee Banner */}
          <div className="rounded-2xl border border-stone-200 bg-stone-50/70 p-4 text-xs text-stone-500 flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-stone-800">
                Encrypted & Verified Checkout
              </p>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Your payment is handled through Stripe&apos;s PCI-compliant
                infrastructure. WedPlan does not store sensitive card
                information.
              </p>
            </div>
          </div>
        </div>

        {/* Right 1 Column: Order Summary & Checkout Button */}
        <div className="lg:col-span-1 space-y-4">
          <div className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6 shadow-2xs space-y-4">
            <h3 className="font-serif text-base font-bold text-stone-900 border-b border-stone-100 pb-3">
              Order Summary
            </h3>

            <div className="space-y-2.5 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Premium Membership</span>
                <span className="font-medium text-stone-900">$49.00</span>
              </div>
              <div className="flex justify-between text-stone-400">
                <span>Platform Fee</span>
                <span className="text-emerald-600 font-medium">
                  $0.00 (Free)
                </span>
              </div>
              <div className="flex justify-between text-stone-400">
                <span>Estimated Tax</span>
                <span>$0.00</span>
              </div>

              <div className="border-t border-stone-100 pt-3 flex justify-between items-baseline">
                <div>
                  <span className="text-xs font-bold text-stone-900">
                    Total Due
                  </span>
                  <p className="text-[10px] text-stone-400">One-time payment</p>
                </div>
                <span className="font-serif text-2xl font-bold text-[#844353]">
                  $49.00
                </span>
              </div>
            </div>

            {/* Payment Method Preview */}
            <div className="rounded-xl bg-stone-50 border border-stone-200/80 p-3 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-semibold text-stone-700">
                <span className="flex items-center gap-1.5">
                  <CreditCard className="h-3.5 w-3.5 text-[#844353]" />
                  Pay with Card
                </span>
                <span className="text-[10px] text-stone-400 font-normal">
                  Stripe Secure
                </span>
              </div>
              <p className="text-[10px] text-stone-400">
                Visa, MasterCard, American Express accepted in Test Mode.
              </p>
            </div>

            <button
              type="button"
              onClick={handleCheckout}
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#844353] py-3 px-4 text-xs font-semibold text-white shadow-xs hover:bg-[#6e3745] transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Connecting to Stripe...</span>
                </>
              ) : (
                <>
                  <Lock className="h-3.5 w-3.5" />
                  <span>Checkout $49</span>
                </>
              )}
            </button>

            <p className="text-[10px] text-stone-400 text-center leading-tight">
              By proceeding, you will be redirected to the secure Stripe
              checkout page.
            </p>
          </div>

          {/* Quick FAQ / Assistance Card */}
          <div className="rounded-xl border border-stone-100 bg-stone-50 p-3 text-[11px] text-stone-500 space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-stone-700">
              <HelpCircle className="h-3 w-3 text-stone-400" />
              <span>Questions?</span>
            </div>
            <p className="text-[10px] text-stone-400">
              Upgrades activate instantly after payment confirmation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
