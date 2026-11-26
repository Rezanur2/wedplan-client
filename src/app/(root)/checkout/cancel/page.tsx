import React from "react";
import Link from "next/link";
import {
  XCircle,
  RotateCcw,
  LayoutDashboard,
  Crown,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  CreditCard,
  HelpCircle,
} from "lucide-react";
import { requireRole } from "@/lib/core/server";

export const metadata = {
  title: "Payment Cancelled | WedPlan Vendor Studio",
  description:
    "Your payment was cancelled and no charges were made. You can retry checkout anytime.",
};

export default async function CheckoutCancelPage() {
  await requireRole("vendor");
  return (
    <div className="min-h-[80vh] bg-[#FCFBF9] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-xl w-full space-y-6">
        {/* Main Cancellation Card */}
        <div className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm text-center relative overflow-hidden">
          {/* Top Decorative Glow */}
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-100/50 rounded-full blur-2xl pointer-events-none" />

          {/* Cancellation Icon */}
          <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-100 shadow-2xs">
            <XCircle className="h-9 w-9 stroke-[2.2]" />
            <div className="absolute -top-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-stone-100 border border-stone-200 text-stone-600 shadow-2xs">
              <ShieldAlert className="h-3.5 w-3.5" />
            </div>
          </div>

          {/* Header & Explanation */}
          <div className="mt-5 space-y-1">
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-3 py-0.5 text-[11px] font-semibold text-amber-800">
              <ShieldAlert className="h-3 w-3" />
              No Charges Made
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 pt-1">
              Payment Cancelled
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto">
              Your Stripe checkout session was cancelled. No money was deducted
              from your account, and your current vendor plan remains unchanged.
            </p>
          </div>

          {/* Order Summary Box */}
          <div className="mt-6 rounded-2xl bg-stone-50 border border-stone-200/80 p-4 sm:p-5 text-left space-y-3">
            <div className="flex items-center justify-between border-b border-stone-200/60 pb-2.5">
              <span className="text-xs font-semibold text-stone-700 flex items-center gap-1.5">
                <CreditCard className="h-3.5 w-3.5 text-stone-500" />
                Checkout Summary
              </span>
              <span className="inline-flex items-center rounded-full bg-stone-200/70 px-2 py-0.5 text-[10px] font-bold text-stone-700">
                Incomplete
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-stone-500">Intended Plan</span>
                <span className="font-semibold text-stone-900 flex items-center gap-1">
                  <Crown className="h-3 w-3 text-amber-500 fill-amber-500" />
                  Premium Vendor (Lifetime)
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-500">Upgrade Price</span>
                <span className="font-bold text-stone-900">$49.00 USD</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-500">Transaction Status</span>
                <span className="text-amber-700 font-medium">Cancelled by user</span>
              </div>
            </div>
          </div>

          {/* Features Reminder */}
          <div className="mt-6 rounded-2xl border border-stone-200/90 bg-stone-50/50 p-4 text-left space-y-2">
            <p className="text-[11px] font-semibold text-stone-700 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-amber-500" />
              Benefits Waiting For You:
            </p>
            <ul className="text-xs text-stone-600 space-y-1.5 pl-1">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#844353]" />
                <span>Publish unlimited wedding service listings</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#844353]" />
                <span>Display a verified Golden Crown badge on your profile</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#844353]" />
                <span>Get priority ranking across search and browse listings</span>
              </li>
            </ul>
          </div>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
            <Link
              href="/dashboard/vendor/subscription/checkout"
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#844353] px-5 py-3 text-xs font-semibold text-white shadow-xs hover:bg-[#6e3745] transition-all"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Retry Upgrade Checkout</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>

            <Link
              href="/dashboard/vendor"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl border border-stone-300 bg-white px-4 py-3 text-xs font-semibold text-stone-700 shadow-2xs hover:bg-stone-50 transition-colors whitespace-nowrap"
            >
              <LayoutDashboard className="h-3.5 w-3.5 text-stone-600" />
              <span>Vendor Dashboard</span>
            </Link>
          </div>
        </div>

        {/* Support Note */}
        <div className="flex items-center justify-center gap-1.5 text-center text-[11px] text-stone-400">
          <HelpCircle className="h-3.5 w-3.5" />
          <span>Need help or having trouble with payment? Contact support@wedplan.com</span>
        </div>
      </div>
    </div>
  );
}
