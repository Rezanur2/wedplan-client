import React from "react";
import Link from "next/link";
import { ShieldCheck, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | WedPlan",
  description: "Learn how WedPlan collects, uses, and protects your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#FAF6F7] py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-6 rounded-3xl border border-stone-200 bg-white p-6 sm:p-10 shadow-2xs">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-600 hover:text-[#844353] transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Home</span>
        </Link>

        <div className="space-y-2 border-b border-stone-100 pb-5">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-[11px] font-semibold text-[#844353]">
            <ShieldCheck className="h-3.5 w-3.5" />
            Privacy &amp; Data Protection
          </span>
          <h1 className="font-serif text-3xl font-bold text-stone-900">
            Privacy Policy
          </h1>
          <p className="text-xs text-stone-500">
            Last updated: November 2026
          </p>
        </div>

        <div className="space-y-5 text-xs sm:text-sm leading-relaxed text-stone-600">
          <section className="space-y-1.5">
            <h2 className="font-serif text-base font-bold text-stone-900">
              1. Information We Collect
            </h2>
            <p>
              We collect basic account information such as your name, email address,
              profile photo, and wedding booking details so couples and vendors can
              coordinate events smoothly on WedPlan.
            </p>
          </section>

          <section className="space-y-1.5">
            <h2 className="font-serif text-base font-bold text-stone-900">
              2. How We Use Your Data
            </h2>
            <p>
              Your information is used strictly to manage authentication, display
              approved vendor listings, process booking requests, and verify vendor
              subscription payments via Stripe.
            </p>
          </section>

          <section className="space-y-1.5">
            <h2 className="font-serif text-base font-bold text-stone-900">
              3. Payment &amp; Account Security
            </h2>
            <p>
              Payments are processed securely by Stripe. WedPlan never stores your
              card details, and all private routes are protected with JWT verification
              and role-based access controls.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
