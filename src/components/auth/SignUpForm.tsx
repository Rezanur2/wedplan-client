"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Store,
  User,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import GoogleButton from "@/components/auth/GoogleButton";
import ProfileImageUpload from "@/components/auth/ProfileImageUpload";
import PasswordRules from "@/components/auth/PasswordRules";
import { authClient } from "@/lib/auth-client";
import { queueToast, toast } from "../ui/toast";

interface SignUpFormProps {
  initialRole?: "customer" | "vendor";
}

export default function SignUpForm({ initialRole = "customer" }: SignUpFormProps) {

  const [role, setRole] = useState<"customer" | "vendor">(initialRole);
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Password validation rules
  const hasMinLength = password.length >= 6;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const isPasswordValid = hasMinLength && hasUppercase && hasLowercase;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const businessName = role === "vendor" ? String(formData.get("businessName") ?? "").trim() : undefined;
    const email = String(formData.get("email") ?? "").trim();
    const image = String(formData.get("image") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    setEmailError(null);

    if (!isPasswordValid) {
      setPasswordError("Must be at least 6 characters with 1 uppercase and 1 lowercase letter.");
      return;
    }
    setPasswordError(null);

    const formElement = e.currentTarget;
    setIsSubmitting(true);
    let isRedirecting = false;

    try {
      const { data, error } = await authClient.signUp.email({
        name: name,
        email: email,
        password: password,
        image: image.startsWith("http") || image.startsWith("/") ? image : undefined,
        role: role,
        ...(businessName ? { businessName } : {}),
      } as Parameters<typeof authClient.signUp.email>[0]);
      if (error) {
        const msg = error.message ?? "Could not create your account.";
        setError(msg);
        toast.add({
          title: "Registration Failed",
          description: msg,
          type: "error",
        });
        return;
      }
      
      formElement.reset();
      setName("");
      setPassword("");
      setFileName(null);

      queueToast({
        title: "Account Created",
        description: `Welcome to WedPlan, ${data?.user?.name || "Member"}!`,
        type: "success",
      });
      const registeredRole = ((data?.user as { role?: string } | undefined)?.role || role).toLowerCase();
      const destination = registeredRole === "vendor" ? "/dashboard/vendor" : "/dashboard/customer";
      isRedirecting = true;
      window.location.assign(destination);
    } catch (err) {
      console.error(err);
      const message = "Unable to connect to the server. Please try again.";
      setError(message);
      toast.add({
        title: "Connection Error",
        description: message,
        type: "error",
      });
    } finally {
      if (!isRedirecting) {
        setIsSubmitting(false);
      }
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
      <div className="relative flex items-center justify-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-stone-200/90 bg-[#FAF6F7] px-3.5 py-1 text-[11px] font-medium text-stone-600 shadow-2xs">
          <span className="h-1.5 w-1.5 rounded-full bg-[#844353]" />
          Membership Registration
        </span>
        <Link
          href="/"
          className="hidden absolute right-0 group lg:inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-[#FAF6F7] px-2.5 py-1 text-[11px] font-medium text-stone-700 shadow-2xs transition-all hover:border-[#844353]/40 hover:bg-white hover:text-[#844353]"
        >
          <ArrowLeft className="h-3 w-3 text-stone-500 transition-transform group-hover:-translate-x-0.5 group-hover:text-[#844353]" />
          Home
        </Link>
      </div>

      <h2 className="mt-2.5 text-center font-serif text-2xl font-medium tracking-tight text-stone-900 sm:text-3xl leading-snug">
        Create Your <span className="hidden sm:inline">WedPlan </span>Account
      </h2>
      <p className="mt-1 text-center text-xs sm:text-[13px] leading-relaxed text-stone-500">
        Join WedPlan to plan your wedding or grow your wedding business.
      </p>

      {/* Role Selection */}
      <div className="mt-3.5 text-left">
        <span className="text-[10px] font-bold tracking-wider text-stone-500 uppercase">
          I Am Joining As:
        </span>
        <div className="mt-1.5 grid grid-cols-2 gap-2 rounded-xl border border-stone-200 bg-[#FAF6F7] p-1 text-xs font-medium">
          <button
            type="button"
            onClick={() => setRole("customer")}
            className={`flex items-center justify-center gap-2 rounded-lg py-1.5 transition-colors cursor-pointer ${
              role === "customer"
                ? "bg-[#844353] text-white shadow-xs font-semibold"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <User className="h-3.5 w-3.5" />
            Customer
          </button>
          <button
            type="button"
            onClick={() => setRole("vendor")}
            className={`flex items-center justify-center gap-2 rounded-lg py-1.5 transition-colors cursor-pointer ${
              role === "vendor"
                ? "bg-[#844353] text-white shadow-xs font-semibold"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <Store className="h-3.5 w-3.5" />
            Vendor
          </button>
        </div>
      </div>

      {/* Sign Up Form */}
      <form onSubmit={handleSubmit} autoComplete="off" className="space-y-2.5 mt-3.5">
        <input type="hidden" name="role" value={role} />

        {/* Profile Image Upload with live initials / preview */}
        <ProfileImageUpload
          name={name}
          fileName={fileName}
          onFileChange={(name) => setFileName(name)}
        />

        {/* Full Name */}
        <div className="space-y-1 text-left">
          <Label
            htmlFor="signup-name"
            className="text-xs font-medium text-stone-700"
          >
            Full Name
          </Label>
          <div className="relative flex items-center">
            <Input
              id="signup-name"
              name="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Eleanor Vance"
              className="h-9 sm:h-9.5 rounded-xl border-stone-200 bg-stone-50/50 pr-9 text-xs placeholder:text-stone-400 focus-visible:border-[#844353] focus-visible:ring-[#844353]/20"
            />
            <User className="absolute right-3 h-4 w-4 text-stone-400 pointer-events-none" />
          </div>
        </div>

        {/* Business / Studio Name (Conditional for Vendor) */}
        {role === "vendor" && (
          <div className="space-y-1 text-left">
            <Label
              htmlFor="signup-business"
              className="text-xs font-medium text-stone-700"
            >
              Business / Studio Name
            </Label>
            <div className="relative flex items-center">
              <Input
                id="signup-business"
                name="businessName"
                type="text"
                required
                placeholder="Rosewood Wedding Studio"
                className="h-9 sm:h-9.5 rounded-xl border-stone-200 bg-stone-50/50 pr-9 text-xs placeholder:text-stone-400 focus-visible:border-[#844353] focus-visible:ring-[#844353]/20"
              />
              <Store className="absolute right-3 h-4 w-4 text-stone-400 pointer-events-none" />
            </div>
          </div>
        )}

        {/* Email Address */}
        <div className="space-y-1 text-left">
          <Label
            htmlFor="signup-email"
            className="text-xs font-medium text-stone-700"
          >
            Email Address
          </Label>
          <div className="relative flex items-center">
            <Input
              id="signup-email"
              name="email"
              type="email"
              required
              onChange={() => {
                if (emailError) setEmailError(null);
              }}
              placeholder="you@example.com"
              className={`h-9 sm:h-9.5 rounded-xl pr-9 text-xs placeholder:text-stone-400 focus-visible:ring-[#844353]/20 ${
                emailError
                  ? "border-rose-400 bg-rose-50/20 focus-visible:border-rose-500"
                  : "border-stone-200 bg-stone-50/50 focus-visible:border-[#844353]"
              }`}
            />
            <Mail className="absolute right-3 h-4 w-4 text-stone-400 pointer-events-none" />
          </div>
          {emailError && (
            <div className="flex items-center gap-1.5 text-rose-600 pt-0.5">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              <p className="text-[11px] font-medium leading-tight">
                {emailError}
              </p>
            </div>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1 text-left">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="signup-password"
              className="text-xs font-medium text-stone-700"
            >
              Password
            </Label>
            <span className="text-[10px] text-stone-400 uppercase tracking-wider">
              Required
            </span>
          </div>
          <div className="relative flex items-center">
            <Input
              id="signup-password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (passwordError) setPasswordError(null);
              }}
              placeholder="••••••••"
              className={`h-9 sm:h-9.5 rounded-xl pr-9 text-xs placeholder:text-stone-400 focus-visible:ring-[#844353]/20 ${
                passwordError
                  ? "border-rose-400 bg-rose-50/20 focus-visible:border-rose-500"
                  : "border-stone-200 bg-stone-50/50 focus-visible:border-[#844353]"
              }`}
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

          {/* Validation Error Message */}
          {passwordError && (
            <div className="flex items-center gap-1.5 text-rose-600 pt-0.5">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              <p className="text-[11px] font-medium leading-tight">
                {passwordError}
              </p>
            </div>
          )}

          {/* Password Requirements Checklist */}
          <PasswordRules
            hasMinLength={hasMinLength}
            hasUppercase={hasUppercase}
            hasLowercase={hasLowercase}
            hasError={Boolean(passwordError)}
          />
        </div>

        {/* Form Error Alert */}
        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50/70 p-2.5 text-left text-rose-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <p className="text-xs font-medium leading-tight">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#844353] py-2.5 text-xs font-semibold text-white shadow-xs transition-all hover:bg-[#723645] active:scale-[0.99] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>Creating Account...</span>
            </>
          ) : (
            <>
              <span>Create Account</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </>
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="relative my-3 flex items-center justify-center">
        <div className="w-full border-t border-stone-200" />
        <span className="absolute bg-white px-3 text-[10px] font-semibold tracking-wider text-stone-400 uppercase">
          or continue with
        </span>
      </div>

      {/* Google Authentication */}
      <div>
        <GoogleButton
          label={
            role === "vendor"
              ? "Sign up with Google (Vendor)"
              : "Sign up with Google (Customer)"
          }
          role={role}
        />
      </div>

      {/* Footer Navigation */}
      <p className="mt-3.5 text-center text-xs text-stone-600">
        Already have an account?{" "}
        <Link
          href="/signin"
          className="font-semibold text-stone-900 hover:text-[#844353] hover:underline"
        >
          Sign in here &rarr;
        </Link>
      </p>
    </div>
  );
}
