import React from "react";
import type { Metadata } from "next";
import AuthSidebar from "@/components/auth/AuthSidebar";
import SignUpForm from "@/components/auth/SignUpForm";

export const metadata: Metadata = {
  title: "Create Account — WedPlan",
  description: "Join WedPlan to plan your wedding or grow your wedding business.",
};

export default function SignUpPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-[#FAF6F7] p-4 sm:p-6 lg:p-8">
      <div className="grid w-full max-w-5xl items-stretch overflow-hidden rounded-3xl border border-stone-200/80 bg-white shadow-2xl lg:grid-cols-12">
        {/* Reusable Left Column Panel */}
        <AuthSidebar
          imageSrc="/images/hero.png"
          edition="Edition 2026"
          badge="Wedding Platform"
          quote="Where timeless celebrations meet exceptional wedding experts."
          description="A complete wedding planning platform for couples and verified wedding vendors."
          stats={[
            { value: "2,400+", label: "Verified Vendors" },
            { value: "100%", label: "Secure Payment" },
            { value: "48hr", label: "Quick Booking" },
          ]}
          footerLeft="Verified Vendor Network"
          footerRight="Est. 2024"
        />

        {/* Right Column: Sign Up Form */}
        <div className="flex flex-col justify-center p-6 sm:p-10 lg:col-span-7 lg:p-12">
          <SignUpForm />
        </div>
      </div>
    </div>
  );
}
