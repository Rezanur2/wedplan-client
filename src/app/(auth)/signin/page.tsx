import React, { Suspense } from "react";
import type { Metadata } from "next";
import AuthSidebar from "@/components/auth/AuthSidebar";
import SignInForm from "@/components/auth/SignInForm";

export const metadata: Metadata = {
  title: "Sign In — WedPlan",
  description: "Sign in to manage your wedding plans or vendor services on WedPlan.",
};

export default function SignInPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-[#FAF6F7] p-4 sm:p-6 lg:p-8">
      <div className="grid w-full max-w-5xl items-stretch overflow-hidden rounded-3xl border border-stone-200/80 bg-white shadow-2xl lg:grid-cols-12">
        {/* Reusable Left Column Panel */}
        <AuthSidebar
          imageSrc="/images/heroImage.png"
          edition="Edition 2026"
          badge="Welcome Back"
          quote="Every gathering is an unrepeatable work of art, orchestrated down to the softest taper light."
          description="Discover verified vendors, historic venues, and wedding experts all in one place."
          stats={[
            { value: "3,400+", label: "Verified Vendors" },
            { value: "99.8%", label: "Satisfaction Rate" },
          ]}
          footerLeft="Secure Platform"
          footerRight="Est. 2024"
        />

        {/* Right Column: Sign In Form (Client Component) */}
        <div className="flex flex-col justify-center p-6 sm:p-10 lg:col-span-7 lg:p-12">
          <Suspense fallback={<div className="h-96 animate-pulse rounded-2xl bg-stone-100" />}>
            <SignInForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
