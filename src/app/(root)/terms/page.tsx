import React from "react";
import Link from "next/link";
import { FileText, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Terms of Service | WedPlan",
  description: "Read the terms and guidelines for using the WedPlan wedding planning platform.",
};

export default function TermsOfServicePage() {
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
            <FileText className="h-3.5 w-3.5" />
            Platform Guidelines
          </span>
          <h1 className="font-serif text-3xl font-bold text-stone-900">
            Terms of Service
          </h1>
          <p className="text-xs text-stone-500">
            Last updated: November 2026
          </p>
        </div>

        <div className="space-y-5 text-xs sm:text-sm leading-relaxed text-stone-600">
          <section className="space-y-1.5">
            <h2 className="font-serif text-base font-bold text-stone-900">
              1. Customer Bookings
            </h2>
            <p>
              Customers may submit booking requests for approved and active wedding
              services. Pending requests can be cancelled from your Customer Dashboard
              before a vendor accepts or declines them.
            </p>
          </section>

          <section className="space-y-1.5">
            <h2 className="font-serif text-base font-bold text-stone-900">
              2. Vendor Listings &amp; Subscriptions
            </h2>
            <p>
              New vendor services are reviewed by administrators before going live.
              Free vendor accounts may list up to 3 active services, while Premium
              vendors enjoy unlimited service listings.
            </p>
          </section>

          <section className="space-y-1.5">
            <h2 className="font-serif text-base font-bold text-stone-900">
              3. Acceptable Use
            </h2>
            <p>
              All users must provide accurate information and respect platform rules.
              Accounts violating platform standards may be paused or blocked by
              administrators.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
