"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Heart, 
  Store, 
  User, 
  Mail, 
  Eye, 
  EyeOff, 
  Camera, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2
} from "lucide-react";
import AuthSidebar from "@/components/auth/AuthSidebar";
import GoogleButton from "@/components/auth/GoogleButton";

export default function SignUpPage() {
  const [role, setRole] = useState<"customer" | "vendor">("customer");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    console.log("Sign Up Form Data:", data);
  };

  // Password criteria checklist (PR requirements)
  const hasMinLength = password.length >= 6;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

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
          <div className="mx-auto w-full max-w-md">
            
            {/* Header Badge & Back to Home Link */}
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-[#FAF6F7] px-3 py-1 text-[11px] font-medium text-stone-600">
              <span className="h-1.5 w-1.5 rounded-full bg-[#844353]" />
              Membership Registration
            </span>
            <Link
              href="/"
              className="group inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-[#FAF6F7] px-3 py-1 text-[11px] font-medium text-stone-700 shadow-2xs transition-all hover:border-[#844353]/40 hover:bg-white hover:text-[#844353]"
            >
              <ArrowLeft className="h-3 w-3 text-stone-500 transition-transform group-hover:-translate-x-0.5 group-hover:text-[#844353]" />
              Back to Home
            </Link>
          </div>
            
            <h2 className="mt-3 font-serif text-2xl font-normal text-stone-900 sm:text-3xl text-left">
              Create Your WedPlan Account
            </h2>
            <p className="mt-1 text-xs text-stone-500 text-left">
              Join WedPlan to plan your wedding or grow your wedding business.
            </p>

            {/* Role Cards: I AM JOINING AS */}
            <div className="mt-5 text-left">
              <span className="text-[10px] font-bold tracking-wider text-stone-500 uppercase">
                I Am Joining As:
              </span>
              <div className="mt-2 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setRole("customer")}
                  className={`flex flex-col items-start rounded-xl border p-3 text-left transition-colors cursor-pointer ${
                    role === "customer"
                      ? "border-[#844353] bg-[#FAF6F7] ring-1 ring-inset ring-[#844353]"
                      : "border-stone-200 bg-white hover:border-stone-300"
                  }`}
                >
                  <div className="flex w-full items-center justify-between">
                    <span className="text-xs font-semibold text-stone-900">
                      Planning My Wedding
                    </span>
                    <Heart className={`h-3.5 w-3.5 ${role === "customer" ? "text-[#844353] fill-[#844353]" : "text-stone-400"}`} />
                  </div>
                  <p className="mt-1 text-[10px] text-stone-500 leading-tight">
                    Couple looking for vendors and planning tools
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setRole("vendor")}
                  className={`flex flex-col items-start rounded-xl border p-3 text-left transition-colors cursor-pointer ${
                    role === "vendor"
                      ? "border-[#844353] bg-[#FAF6F7] ring-1 ring-inset ring-[#844353]"
                      : "border-stone-200 bg-white hover:border-stone-300"
                  }`}
                >
                  <div className="flex w-full items-center justify-between">
                    <span className="text-xs font-semibold text-stone-900">
                      Wedding Service Provider
                    </span>
                    <Store className={`h-3.5 w-3.5 ${role === "vendor" ? "text-[#844353]" : "text-stone-400"}`} />
                  </div>
                  <p className="mt-1 text-[10px] text-stone-500 leading-tight">
                    Venue, photography, catering, or decor company
                  </p>
                </button>
              </div>
            </div>

            {/* Reusable Google Button */}
            <div className="mt-5">
              <GoogleButton
                label="Sign up with Google"
                onClick={() => console.log("Google Sign Up clicked for role:", role)}
              />
            </div>

            {/* Divider */}
            <div className="relative my-4 flex items-center justify-center">
              <div className="w-full border-t border-stone-200" />
              <span className="absolute bg-white px-3 text-[10px] font-semibold tracking-wider text-stone-400 uppercase">
                or register with email
              </span>
            </div>

            {/* Sign Up Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <input type="hidden" name="role" value={role} />

              {/* Profile Image Upload Box */}
              <div className="rounded-xl border border-stone-200 bg-stone-50/50 p-2.5 text-left">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Camera className="h-4 w-4 text-[#844353]" />
                    <div>
                      <p className="text-xs font-semibold text-stone-800">
                        Profile Photo or Logo <span className="text-[10px] font-normal text-stone-400">(Optional)</span>
                      </p>
                      <p className="text-[10px] text-stone-500 truncate max-w-50">
                        {fileName || "Upload profile picture or company logo"}
                      </p>
                    </div>
                  </div>
                  <label
                    htmlFor="signup-image"
                    className="cursor-pointer rounded-lg border border-stone-300 bg-white px-2.5 py-1 text-[11px] font-semibold text-stone-700 shadow-xs hover:bg-stone-50"
                  >
                    Browse
                  </label>
                  <input
                    id="signup-image"
                    name="image"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setFileName(e.target.files[0].name);
                      }
                    }}
                  />
                </div>
              </div>

              {/* Full Name or Company Name */}
              <div className="space-y-1 text-left">
                <label
                  htmlFor="signup-name"
                  className="text-xs font-medium text-stone-700"
                >
                  Full Name or Company Name
                </label>
                <div className="relative flex items-center">
                  <input
                    id="signup-name"
                    name="name"
                    type="text"
                    required
                    placeholder="e.g. John Doe or Grand Wedding Venue"
                    className="w-full rounded-xl border border-stone-200 bg-stone-50/50 py-2.5 pr-9 pl-3 text-xs text-stone-900 placeholder:text-stone-400 focus:border-[#844353] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#844353]"
                  />
                  <User className="absolute right-3 h-4 w-4 text-stone-400" />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-1 text-left">
                <label
                  htmlFor="signup-email"
                  className="text-xs font-medium text-stone-700"
                >
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <input
                    id="signup-email"
                    name="email"
                    type="email"
                    required
                    placeholder="name@example.com"
                    className="w-full rounded-xl border border-stone-200 bg-stone-50/50 py-2.5 pr-9 pl-3 text-xs text-stone-900 placeholder:text-stone-400 focus:border-[#844353] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#844353]"
                  />
                  <Mail className="absolute right-3 h-4 w-4 text-stone-400" />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1 text-left">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="signup-password"
                    className="text-xs font-medium text-stone-700"
                  >
                    Password
                  </label>
                  <span className="text-[10px] text-stone-400 uppercase tracking-wider">
                    Required
                  </span>
                </div>
                <div className="relative flex items-center">
                  <input
                    id="signup-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-stone-200 bg-stone-50/50 py-2.5 pr-9 pl-3 text-xs text-stone-900 placeholder:text-stone-400 focus:border-[#844353] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#844353]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-stone-400 hover:text-stone-600 focus:outline-none"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>

                {/* Password Requirements */}
                <div className="mt-2 rounded-xl border border-stone-200/80 bg-stone-50/50 p-2.5">
                  <span className="text-[10px] font-bold tracking-wider text-stone-500 uppercase">
                    Password Requirements
                  </span>
                  <div className="mt-1.5 grid grid-cols-2 gap-1.5 text-[11px]">
                    <div className={`flex items-center gap-1.5 ${hasMinLength ? "text-emerald-700 font-medium" : "text-stone-400"}`}>
                      <CheckCircle2 className="h-3 w-3" />
                      <span>6+ Characters</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${hasUppercase ? "text-emerald-700 font-medium" : "text-stone-400"}`}>
                      <CheckCircle2 className="h-3 w-3" />
                      <span>Uppercase Letter</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${hasLowercase ? "text-emerald-700 font-medium" : "text-stone-400"}`}>
                      <CheckCircle2 className="h-3 w-3" />
                      <span>Lowercase Letter</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${hasNumber ? "text-emerald-700 font-medium" : "text-stone-400"}`}>
                      <CheckCircle2 className="h-3 w-3" />
                      <span>Contains Number</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start gap-2 pt-1 text-left">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="mt-0.5 h-3.5 w-3.5 rounded border-stone-300 text-[#844353] focus:ring-[#844353]"
                />
                <label htmlFor="terms" className="text-[11px] text-stone-600 leading-snug cursor-pointer">
                  I accept WedPlan&apos;s Terms of Service and Privacy Policy.
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#844353] py-2.5 text-xs font-semibold text-white shadow-xs transition-all hover:bg-[#723645] active:scale-[0.99] cursor-pointer"
              >
                Create WedPlan Account
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </form>

            {/* Footer Navigation */}
            <p className="mt-5 text-center text-xs text-stone-600">
              Already have an account?{" "}
              <Link
                href="/signin"
                className="font-semibold text-stone-900 hover:text-[#844353] hover:underline"
              >
                Sign in here &rarr;
              </Link>
            </p>

          </div>
        </div>

      </div>
    </div>
  );
}
