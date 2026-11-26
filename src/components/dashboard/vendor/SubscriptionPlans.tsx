"use client";

import React from "react";
import Link from "next/link";
import {
  Check,
  Crown,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  CalendarCheck,
  LayoutDashboard,
  Layers,
  TrendingUp,
  BadgeCheck,
} from "lucide-react";
import DashboardBreadcrumb from "@/components/dashboard/shared/DashboardBreadcrumb";
import { IDashboardUser } from "@/types";

interface SubscriptionPlansProps {
  user?: IDashboardUser | null;
  activeServiceCount?: number;
}

export default function SubscriptionPlans({
  user,
  activeServiceCount = 0,
}: SubscriptionPlansProps) {
  const isPremium = user?.subscriptionPlan?.toLowerCase() === "premium";

  const freeFeatures = [
    {
      title: "Maximum 3 Active Services",
      desc: "List up to 3 core packages simultaneously",
      icon: Layers,
    },
    {
      title: "Basic Vendor Dashboard",
      desc: "Standard analytics, views & service stats",
      icon: LayoutDashboard,
    },
    {
      title: "Booking Request Management",
      desc: "Review, accept, or decline client bookings",
      icon: CalendarCheck,
    },
  ];

  const premiumFeatures = [
    {
      title: "Unlimited Active Services",
      desc: "Zero limits on wedding packages published",
      icon: Sparkles,
      highlight: true,
    },
    {
      title: "Premium Vendor Badge",
      desc: "Exclusive crown badge to build couple trust",
      icon: BadgeCheck,
      highlight: true,
    },
    {
      title: "Featured Service Placement",
      desc: "Priority positioning on browse & search results",
      icon: TrendingUp,
      highlight: true,
    },
    {
      title: "All Free Plan Features",
      desc: "Complete access to all vendor management tools",
      icon: Check,
      highlight: false,
    },
  ];

  const maxFreeLimit = 3;
  const remainingFreeSlots = Math.max(0, maxFreeLimit - activeServiceCount);
  const freeUsagePercent = Math.min(100, (activeServiceCount / maxFreeLimit) * 100);

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* 1. Header with Responsive Breadcrumb */}
      <div>
        <DashboardBreadcrumb
          section="VENDOR STUDIO"
          page="SUBSCRIPTION"
          badge={
            isPremium ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-300 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
                <Crown className="h-3 w-3 text-amber-600 fill-amber-600" />
                Premium Vendor
              </span>
            ) : undefined
          }
        />
        <h1 className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-stone-900">
          Vendor Membership Plans
        </h1>
        <p className="mt-0.5 text-xs text-stone-500">
          Manage your subscription tier and upgrade for unlimited wedding service listings.
        </p>
      </div>

      {/* 2. Current Membership Status Card */}
      {isPremium ? (
        <div className="rounded-2xl border border-amber-200 bg-linear-to-br from-amber-50/70 via-white to-amber-50/40 p-4 sm:p-5 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100/90 text-amber-700 shadow-2xs">
                <Crown className="h-6 w-6 fill-amber-500 text-amber-600" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-sm sm:text-base font-bold text-stone-900">
                    Lifetime Premium Vendor
                  </h2>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                    <ShieldCheck className="h-3 w-3" />
                    Active Plan
                  </span>
                </div>
                <p className="mt-1 text-xs text-stone-600 leading-relaxed">
                  You have unlocked <strong className="font-semibold text-stone-900">unlimited service listings</strong>, verified premium crown badge, and priority search placement.
                </p>
              </div>
            </div>

            <div className="flex sm:flex-col items-center sm:items-end justify-between border-t border-amber-100 sm:border-0 pt-3 sm:pt-0 shrink-0">
              <span className="text-[11px] font-medium text-stone-500">Published Listings</span>
              <span className="text-sm font-bold text-stone-900">
                {activeServiceCount} Active Services
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-stone-200 bg-white p-4 sm:p-5 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-stone-100 text-stone-600">
                <Layers className="h-5 w-5 text-[#844353]" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-sm sm:text-base font-bold text-stone-900">
                    Free Plan: {activeServiceCount} of {maxFreeLimit} Services Used
                  </h2>
                  <span className="rounded-full bg-pink-50 border border-pink-200 px-2 py-0.5 text-[10px] font-semibold text-pink-700">
                    {remainingFreeSlots} slot{remainingFreeSlots === 1 ? "" : "s"} left
                  </span>
                </div>
                <p className="mt-1 text-xs text-stone-500 leading-relaxed">
                  Free accounts can list up to 3 services. Upgrade to Premium for unlimited service listings.
                </p>
              </div>
            </div>

            <Link
              href="/dashboard/vendor/subscription/checkout"
              className="inline-flex h-9 items-center justify-center rounded-xl bg-[#844353] px-4 text-xs font-semibold text-white shadow-xs hover:bg-[#6e3745] transition shrink-0 self-start sm:self-center"
            >
              Upgrade to Premium
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 pt-3 border-t border-stone-100">
            <div className="flex items-center justify-between text-[11px] text-stone-500 mb-1.5">
              <span>Service Listing Capacity</span>
              <span className="font-medium text-stone-700">{activeServiceCount} / {maxFreeLimit}</span>
            </div>
            <div className="h-2 w-full rounded-full bg-stone-100 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  activeServiceCount >= maxFreeLimit ? "bg-amber-500" : "bg-[#844353]"
                }`}
                style={{ width: `${freeUsagePercent}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* 3. Compact Pricing Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 pt-1">
        {/* Card 1: Free Plan */}
        <div
          className={`flex flex-col justify-between rounded-2xl border bg-white p-4 sm:p-5 shadow-2xs transition-all ${
            !isPremium
              ? "border-stone-300 ring-1 ring-stone-200/80"
              : "border-stone-200 opacity-90"
          }`}
        >
          <div>
            <div className="flex items-center justify-between gap-1.5">
              <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-[10px] font-semibold text-stone-600">
                Starter Tier
              </span>
              {!isPremium && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                  <ShieldCheck className="h-3 w-3" />
                  Current Plan
                </span>
              )}
            </div>

            <h3 className="mt-3 font-serif text-lg font-bold text-stone-900">
              Free Plan
            </h3>
            <p className="mt-0.5 text-[11px] text-stone-500 leading-snug">
              Essential features for new wedding vendors.
            </p>

            <div className="mt-3 flex items-baseline gap-1">
              <span className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">$0</span>
              <span className="text-[11px] text-stone-400">/ forever</span>
            </div>

            {/* Feature List */}
            <div className="mt-4 space-y-2.5 border-t border-stone-100 pt-3.5">
              {freeFeatures.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex items-start gap-2.5">
                    <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-md bg-stone-100 text-stone-600">
                      <Icon className="h-2.5 w-2.5" />
                    </div>
                    <div className="text-left leading-tight">
                      <p className="text-xs font-semibold text-stone-800">{item.title}</p>
                      <p className="text-[10px] text-stone-400 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-stone-100">
            <button
              type="button"
              disabled
              className="w-full rounded-xl border border-stone-200 bg-stone-50 py-2 px-3 text-xs font-semibold text-stone-500 cursor-default"
            >
              {!isPremium ? "Active Plan" : "Included"}
            </button>
          </div>
        </div>

        {/* Card 2: Premium Plan */}
        <div
          className={`flex flex-col justify-between rounded-2xl border-2 bg-linear-to-b from-[#FFFDFD] to-white p-4 sm:p-5 shadow-xs transition-all relative ${
            isPremium
              ? "border-amber-400 ring-1 ring-amber-200"
              : "border-[#844353] hover:shadow-sm"
          }`}
        >
          {/* Highlight Badge */}
          <div className="absolute -top-2.5 right-4 rounded-full bg-[#844353] px-2.5 py-0.5 text-[9px] font-bold text-white shadow-2xs flex items-center gap-1">
            <Sparkles className="h-2.5 w-2.5" />
            POPULAR
          </div>

          <div>
            <div className="flex items-center justify-between gap-1.5">
              <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 border border-rose-200 px-2.5 py-0.5 text-[10px] font-semibold text-[#844353]">
                <Crown className="h-3 w-3 text-amber-500 fill-amber-500" />
                Premium Tier
              </span>
              {isPremium && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-300 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
                  <Crown className="h-3 w-3 text-amber-600 fill-amber-600" />
                  Active
                </span>
              )}
            </div>

            <h3 className="mt-3 font-serif text-lg font-bold text-stone-900">
              Premium Plan
            </h3>
            <p className="mt-0.5 text-[11px] text-stone-500 leading-snug">
              Unlimited growth & top ranking for professionals.
            </p>

            <div className="mt-3 flex items-baseline gap-1">
              <span className="font-serif text-2xl sm:text-3xl font-bold text-[#844353]">$49</span>
              <span className="text-[11px] text-stone-400">/ one-time</span>
            </div>

            {/* Feature List */}
            <div className="mt-4 space-y-2.5 border-t border-rose-100 pt-3.5">
              {premiumFeatures.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex items-start gap-2.5">
                    <div
                      className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-md ${
                        item.highlight
                          ? "bg-rose-100 text-[#844353]"
                          : "bg-stone-100 text-stone-600"
                      }`}
                    >
                      <Icon className="h-2.5 w-2.5 stroke-[2.5]" />
                    </div>
                    <div className="text-left leading-tight">
                      <p className="text-xs font-semibold text-stone-900">{item.title}</p>
                      <p className="text-[10px] text-stone-500 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-5 pt-3 border-t border-stone-100">
            {isPremium ? (
              <div className="flex items-center justify-center gap-1.5 w-full rounded-xl bg-amber-50 border border-amber-200 py-2 px-3 text-xs font-semibold text-amber-900">
                <Crown className="h-3.5 w-3.5 text-amber-600 fill-amber-600" />
                <span>Lifetime Access Active</span>
              </div>
            ) : (
              <Link
                href="/dashboard/vendor/subscription/checkout"
                className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#844353] py-2 px-4 text-xs font-semibold text-white shadow-2xs hover:bg-[#6e3745] transition-all cursor-pointer"
              >
                <span>Upgrade to Premium ($49)</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
