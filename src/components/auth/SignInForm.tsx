"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Eye, EyeOff, Shield, ArrowRight, ArrowLeft, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import GoogleButton from "@/components/auth/GoogleButton";
import { authClient } from "@/lib/auth-client";
import { toast } from "../ui/toast";
import { useRouter, useSearchParams } from "next/navigation";

export default function SignInForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || searchParams.get("callbackUrl") || "/";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setEmailError(null);
    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "").trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    Object.fromEntries(formData.entries());

    const formElement = e.currentTarget;

    try {
      const { data, error } = await authClient.signIn.email({
          email: email,
          password: password,
          rememberMe: true,
          callbackURL: redirectTo,
      });
      if (error) {
        const msg = error.message ?? "Invalid email or password.";
        setError(msg);
        toast.add({
          title: "Sign In Failed",
          description: msg,
          type: "error",
        });
        return;
      }

      formElement.reset();

      toast.add({
        title: "Signed In",
        description: `Welcome back, ${data?.user?.name || "User"}!`,
        type: "success",
      });
      if (!data.redirect) {        
        router.push(redirectTo);
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md">
      {/* Mobile Branding (Visible only on mobile/tablet, hidden on desktop lg) */}
      <div className="mb-4 flex items-center justify-between lg:hidden">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative h-8 w-8 overflow-hidden rounded-xl border border-stone-200 bg-stone-50 shadow-2xs">
            <Image
              src="/images/logo.png"
              alt="WedPlan"
              width={32}
              height={32}
              className="object-contain"
            />
          </div>
          <span className="font-serif text-lg font-bold tracking-tight text-stone-900">
            WedPlan
          </span>
        </Link>
        <Link
          href="/"
          className="group inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-[#FAF6F7] px-2.5 py-1 text-[11px] font-medium text-stone-700 shadow-2xs transition-all hover:border-[#844353]/40 hover:bg-white hover:text-[#844353]"
        >
          <ArrowLeft className="h-3 w-3 text-stone-500 transition-transform group-hover:-translate-x-0.5 group-hover:text-[#844353]" />
          Home
        </Link>
      </div>

      {/* Header Badge & Back to Home Link */}
      <div className="flex items-center justify-center lg:justify-between">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-stone-200/90 bg-[#FAF6F7] px-3.5 py-1 text-[11px] font-medium text-stone-600 shadow-2xs">
          <span className="h-1.5 w-1.5 rounded-full bg-[#844353]" />
          Customer &amp; Vendor Access
        </span>
        <Link
          href="/"
          className="hidden group lg:inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-[#FAF6F7] px-3 py-1 text-[11px] font-medium text-stone-700 shadow-2xs transition-all hover:border-[#844353]/40 hover:bg-white hover:text-[#844353]"
        >
          <ArrowLeft className="h-3 w-3 text-stone-500 transition-transform group-hover:-translate-x-0.5 group-hover:text-[#844353]" />
          Back to Home
        </Link>
      </div>

      <h2 className="mt-3.5 text-center font-serif text-2xl font-medium tracking-tight text-stone-900 sm:text-3xl lg:text-left leading-snug">
        Welcome Back<span className="hidden sm:inline"> to WedPlan</span>
      </h2>
      <p className="mt-1.5 text-center text-xs sm:text-[13px] leading-relaxed text-stone-500 lg:text-left">
        Sign in to manage your wedding plans or vendor services.
      </p>

      {/* Reusable Google Button */}
      <div className="mt-5">
        <GoogleButton
          label="Continue with Google"
          callbackURL={redirectTo}
        />
      </div>

      {/* Divider */}
      <div className="relative my-5 flex items-center justify-center">
        <div className="w-full border-t border-stone-200" />
        <span className="absolute bg-white px-3 text-[10px] font-semibold tracking-wider text-stone-400 uppercase">
          or sign in with email
        </span>
      </div>

      {/* Sign In Form */}
      <form onSubmit={handleSubmit} className="space-y-3.5">

        {/* Email Address */}
        <div className="space-y-1.5 text-left">
          <Label htmlFor="signin-email" className="text-xs font-medium text-stone-700">
            Email Address
          </Label>
          <div className="relative flex items-center">
            <Input
              id="signin-email"
              name="email"
              type="email"
              required
              onChange={() => {
                if (emailError) setEmailError(null);
                if (error) setError(null);
              }}
              placeholder="name@example.com"
              className={`h-10 rounded-xl pr-9 text-xs placeholder:text-stone-400 focus-visible:ring-[#844353]/20 ${
                emailError
                  ? "border-rose-400 bg-rose-50/20 focus-visible:border-rose-500"
                  : "border-stone-200 bg-stone-50/50 focus-visible:border-[#844353]"
              }`}
            />
            <Mail className="absolute right-3 h-4 w-4 text-stone-400 pointer-events-none" />
          </div>
          {emailError && (
            <div className="flex items-center gap-1.5 text-rose-600 pt-0.5 text-left">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              <p className="text-[11px] font-medium leading-tight">{emailError}</p>
            </div>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1.5 text-left">
          <div className="flex items-center justify-between">
            <Label htmlFor="signin-password" className="text-xs font-medium text-stone-700">
              Password
            </Label>
            <button
              type="button"
              className="text-[11px] font-medium text-stone-500 hover:text-[#844353] hover:underline"
            >
              Forgot Password?
            </button>
          </div>
          <div className="relative flex items-center">
            <Input
              id="signin-password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              onChange={() => {
                if (error) setError(null);
              }}
              placeholder="••••••••"
              className="h-10 rounded-xl border-stone-200 bg-stone-50/50 pr-9 text-xs placeholder:text-stone-400 focus-visible:border-[#844353] focus-visible:ring-[#844353]/20"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 text-stone-400 hover:text-stone-600 focus:outline-none cursor-pointer"
              aria-label="Toggle password visibility"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Remember Me Checkbox */}
        <div className="flex items-center gap-2 pt-1 text-left">
          <input
            id="remember"
            name="remember"
            type="checkbox"
            className="h-3.5 w-3.5 rounded border-stone-300 text-[#844353] focus:ring-[#844353]"
          />
          <Label htmlFor="remember" className="text-xs font-normal text-stone-600 cursor-pointer">
            Remember this device
          </Label>
        </div>

        {/* Form Error Alert */}
        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50/70 p-3 text-left text-rose-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <p className="text-xs font-medium leading-tight">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#844353] py-2.5 text-xs font-semibold text-white shadow-xs transition-all hover:bg-[#723645] active:scale-[0.99] cursor-pointer"
        >
          Sign In to WedPlan
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </form>

      {/* Footer Navigation */}
      <p className="mt-5 text-center text-xs text-stone-600">
        Don&apos;t have an account yet?{" "}
        <Link
          href="/signup"
          className="font-semibold text-stone-900 hover:text-[#844353] hover:underline"
        >
          Sign up here &rarr;
        </Link>
      </p>

      {/* Security Notice */}
      <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-stone-200 bg-[#FAF6F7] p-3 text-left">
        <Shield className="mt-0.5 h-4 w-4 shrink-0 text-[#844353]" />
        <p className="text-[11px] leading-relaxed text-stone-500">
          Protected by secure encryption. Customer and vendor accounts are private, encrypted, and secure.
        </p>
      </div>

      {/* Bottom Fine Print */}
      <div className="mt-6 flex flex-wrap items-center justify-between text-[11px] text-stone-400">
        <span>&copy; 2026 WedPlan Inc.</span>
        <div className="flex gap-3">
          <Link href="#" className="hover:underline">Privacy</Link>
          <span>&bull;</span>
          <Link href="#" className="hover:underline">Terms</Link>
          <span>&bull;</span>
          <Link href="#" className="hover:underline">Support</Link>
        </div>
      </div>
    </div>
  );
}
