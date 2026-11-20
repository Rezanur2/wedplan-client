"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Store,
  Camera,
  UploadCloud,
  X,
  HelpCircle,
  MapPin,
  ArrowRight,
  CheckCircle2,
  PieChart,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/toast";
import { uploadImageToImgBB } from "@/lib/uploadImage";
import { ServiceFormData } from "@/types";
import { createService } from "@/lib/actions/services";


const CATEGORIES = [
  "Photography & Videography",
  "Wedding Venues",
  "Decoration & Florist",
  "Catering Services",
  "Makeup & Styling",
  "Wedding Fashion",
];

const PRICING_TYPES = [
  "Per Day / Event",
  "Per Hour",
  "Per Person",
  "Fixed Package",
];

interface AddServiceFormProps {
  vendorId?: string;
  subscriptionPlan?: string;
  activeServiceCount?: number;
}

export default function AddServiceForm({
  vendorId = "vendor_id",
  subscriptionPlan = "free",
  activeServiceCount = 2,
}: AddServiceFormProps) {
  const router = useRouter();

  // Form inputs
  const [form, setForm] = useState({
    serviceName: "",
    category: "",
    pricingType: "Per Day / Event",
    price: "",
    location: "",
    description: "",
  });

  // Single image state
  const [image, setImage] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isPremium = subscriptionPlan?.toLowerCase() === "premium";
  const isLimitReached = !isPremium && activeServiceCount >= 3;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Upload single image
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (errors.image) {
      setErrors((prev) => ({ ...prev, image: "" }));
    }

    setIsUploading(true);
    try {
      const imageURL = await uploadImageToImgBB(file);
      setImage(imageURL);
    } catch (err) {
      console.error("Image upload failed:", err);
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  // Required field validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!form.serviceName.trim()) {
      newErrors.serviceName = "Service name is required.";
    }
    if (!form.category) {
      newErrors.category = "Please select a service category.";
    }
    if (!form.price || Number(form.price) <= 0) {
      newErrors.price = "Valid starting price is required.";
    }
    if (!form.location.trim()) {
      newErrors.location = "Location / address is required.";
    }
    if (!form.description.trim()) {
      newErrors.description = "Service description is required.";
    }
    if (!image) {
      newErrors.image = "Please upload a service image.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLimitReached) {
      toast.add({
        title: "Limit Reached",
        description: "Upgrade to Premium for unlimited listings.",
        type: "error",
      });
      return;
    }

    // Validate required fields
    if (!validateForm()) {
      toast.add({
        title: "Required Fields Missing",
        description: "Please fill out all required fields marked with (*).",
        type: "error",
      });
      return;
    }

    setIsSubmitting(true);

    const serviceData: ServiceFormData = {
      ...form,
      price: Number(form.price),
      images: [image],
      vendorId,
      status: "Pending",
      createdAt: new Date().toISOString(),
    };

    await createService(serviceData);

    await new Promise((res) => setTimeout(res, 500));
    setIsSubmitting(false);

    toast.add({
      title: "Success",
      description: "Service submitted for review.",
      type: "success",
    });
    router.push("/dashboard/vendor/my-services");
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="mx-auto max-w-4xl space-y-6 pb-12"
    >
      {/* 1. Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            VENDOR / Add Service
          </div>
          <h1 className="mt-1 font-serif text-3xl text-stone-900">
            Add a New Service
          </h1>
          <p className="text-xs text-stone-500">
            List what you offer on WedPlan. New services are reviewed by our
            team before going live.
          </p>
        </div>
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-[11px] font-medium text-rose-700 border border-rose-200">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-600" />
          Status: Pending Review
        </span>
      </div>

      {/* 2. Plan Banner */}
      <div className="flex flex-col gap-4 rounded-2xl border border-stone-200 bg-white p-4 shadow-2xs sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-stone-100">
            <PieChart className="h-5 w-5 text-[#844353]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold text-stone-900">
                {isPremium
                  ? "Premium Plan: Unlimited"
                  : `Free Plan: ${activeServiceCount} of 3 services used`}
              </h4>
              {!isPremium && (
                <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-semibold text-rose-700">
                  {Math.max(0, 3 - activeServiceCount)} slot left
                </span>
              )}
            </div>
            <p className="text-[11px] text-stone-500">
              Free accounts can list up to 3 services. Upgrade to Premium for
              unlimited listings.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {!isPremium && (
            <div className="h-2 w-20 rounded-full bg-stone-100 overflow-hidden">
              <div
                className="h-full bg-[#844353]"
                style={{ width: `${(activeServiceCount / 3) * 100}%` }}
              />
            </div>
          )}
          <Link
            href="/dashboard/vendor/subscription"
            className="rounded-xl border border-[#844353] px-3.5 py-1.5 text-xs font-semibold text-[#844353] hover:bg-rose-50"
          >
            Upgrade Plan
          </Link>
        </div>
      </div>

      {/* 3. Main Form Card */}
      <div className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8 space-y-6 shadow-xs">
        {/* Section 1: Service Information */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-stone-900 text-white">
                <Store className="h-3.5 w-3.5" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-stone-900">
                  Service Information
                </h2>
                <p className="text-[11px] text-stone-500">
                  Provide details couples will see
                </p>
              </div>
            </div>
            <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-[10px] text-stone-600">
              * Required fields
            </span>
          </div>

          {/* Service Name */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <Label htmlFor="serviceName">
                Service Name <span className="text-rose-600">*</span>
              </Label>
              {form.serviceName && !errors.serviceName && (
                <span className="text-emerald-600 text-[11px] inline-flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Valid
                </span>
              )}
            </div>
            <Input
              id="serviceName"
              name="serviceName"
              value={form.serviceName}
              onChange={handleChange}
              placeholder="e.g. Sunset Garden Lawn & Pavilion"
              className={`h-9 text-xs rounded-xl ${
                errors.serviceName
                  ? "border-rose-400 bg-rose-50/20 focus:border-rose-500"
                  : "bg-stone-50/50"
              }`}
            />
            {errors.serviceName ? (
              <p className="mt-1 text-xs text-rose-600 font-medium">
                {errors.serviceName}
              </p>
            ) : (
              <p className="mt-1 text-[11px] text-stone-400">
                Enter a clear, descriptive title for your service.
              </p>
            )}
          </div>

          {/* Category & Pricing Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label
                htmlFor="category"
                className="text-xs font-semibold mb-1 block"
              >
                Category <span className="text-rose-600">*</span>
              </Label>
              <div className="mt-1">
                <Select
                  value={form.category}
                  onValueChange={(val) => {
                    if (val) {
                      setForm((prev) => ({ ...prev, category: val }));
                      if (errors.category) {
                        setErrors((prev) => ({ ...prev, category: "" }));
                      }
                    }
                  }}
                >
                  <SelectTrigger
                    id="category"
                    className={`h-9 text-xs rounded-xl w-full ${
                      errors.category
                        ? "border-rose-400 bg-rose-50/20"
                        : "bg-stone-50/50"
                    }`}
                  >
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent className="bg-white p-1 rounded-xl shadow-lg">
                    {CATEGORIES.map((c) => (
                      <SelectItem
                        key={c}
                        value={c}
                        className="text-xs cursor-pointer"
                      >
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {errors.category && (
                <p className="mt-1 text-xs text-rose-600 font-medium">
                  {errors.category}
                </p>
              )}
            </div>

            <div>
              <Label
                htmlFor="pricingType"
                className="text-xs font-semibold mb-1 block"
              >
                Pricing Type <span className="text-rose-600">*</span>
              </Label>
              <div className="mt-1">
                <Select
                  value={form.pricingType}
                  onValueChange={(val) =>
                    val && setForm((prev) => ({ ...prev, pricingType: val }))
                  }
                >
                  <SelectTrigger
                    id="pricingType"
                    className="h-9 text-xs bg-stone-50/50 rounded-xl w-full"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white p-1 rounded-xl shadow-lg">
                    {PRICING_TYPES.map((pt) => (
                      <SelectItem
                        key={pt}
                        value={pt}
                        className="text-xs cursor-pointer"
                      >
                        {pt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Starting Price & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label
                htmlFor="price"
                className="text-xs font-semibold mb-1 block"
              >
                Starting Price ($) <span className="text-rose-600">*</span>
              </Label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-stone-400">
                  $
                </span>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="5500"
                  className={`h-9 pl-7 text-xs rounded-xl ${
                    errors.price
                      ? "border-rose-400 bg-rose-50/20 focus:border-rose-500"
                      : "bg-stone-50/50"
                  }`}
                />
              </div>
              {errors.price && (
                <p className="mt-1 text-xs text-rose-600 font-medium">
                  {errors.price}
                </p>
              )}
            </div>

            <div>
              <Label
                htmlFor="location"
                className="text-xs font-semibold mb-1 block"
              >
                Location / Address <span className="text-rose-600">*</span>
              </Label>
              <div className="relative mt-1">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400" />
                <Input
                  id="location"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="e.g. 2480 Scenic View Drive, Austin, TX"
                  className={`h-9 pl-8 text-xs rounded-xl ${
                    errors.location
                      ? "border-rose-400 bg-rose-50/20 focus:border-rose-500"
                      : "bg-stone-50/50"
                  }`}
                />
              </div>
              {errors.location && (
                <p className="mt-1 text-xs text-rose-600 font-medium">
                  {errors.location}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <Label htmlFor="description">
                Description <span className="text-rose-600">*</span>
              </Label>
              <span className="text-[11px] text-stone-400">
                {form.description.length} / 1000
              </span>
            </div>
            <Textarea
              id="description"
              name="description"
              rows={3}
              maxLength={1000}
              value={form.description}
              onChange={handleChange}
              placeholder="Tell couples what makes your service special, what is included, and any important details."
              className={`text-xs rounded-xl ${
                errors.description
                  ? "border-rose-400 bg-rose-50/20 focus:border-rose-500"
                  : "bg-stone-50/50"
              }`}
            />
            {errors.description ? (
              <p className="mt-1 text-xs text-rose-600 font-medium">
                {errors.description}
              </p>
            ) : (
              <p className="mt-1 text-[11px] text-stone-400">
                Tell couples what makes your service special, what is included,
                and any important details.
              </p>
            )}
          </div>
        </div>

        {/* Section 2: Service Image */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-stone-900 text-white">
                <Camera className="h-3.5 w-3.5" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-stone-900">
                  Service Image <span className="text-rose-600">*</span>
                </h2>
                <p className="text-[11px] text-stone-500">
                  Upload a photo of this service
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            {image ? (
              /* Preview when image is uploaded */
              <div className="relative h-44 w-full sm:w-72 overflow-hidden rounded-xl border border-stone-200 bg-stone-100">
                <Image
                  src={image}
                  alt="Service Image Preview"
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => setImage("")}
                  className="absolute right-2.5 top-2.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white hover:bg-rose-600 transition-colors cursor-pointer"
                  title="Remove photo"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              /* Image Upload Box */
              <div className="w-full">
                <label
                  htmlFor="photo-upload"
                  className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center cursor-pointer min-h-36 transition-colors ${
                    errors.image
                      ? "border-rose-400 bg-rose-50/30"
                      : "border-stone-200 bg-stone-50/40 hover:bg-stone-50"
                  }`}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-[#844353]">
                    <UploadCloud className="h-5 w-5" />
                  </div>
                  <p className="mt-2 text-xs font-semibold text-stone-800">
                    {isUploading ? "Uploading..." : "Click or drag to upload photo"}
                  </p>
                  <p className="text-[10px] text-stone-400 mt-0.5">
                    JPG, PNG or WEBP up to 5MB
                  </p>
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    disabled={isUploading}
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
                {errors.image && (
                  <p className="mt-1.5 text-xs text-rose-600 font-medium">
                    {errors.image}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* How Approval Works */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 rounded-xl border border-rose-200/70 bg-[#FFF5F8]/60 p-3 text-[11px] text-stone-600">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-3.5 w-3.5 text-rose-700 shrink-0" />
            <span>
              <strong>How approval works:</strong> Reviewed in 24–48h. Saves as{" "}
              <span className="bg-rose-200/80 px-1 py-0.5 rounded font-semibold text-rose-900">
                Pending
              </span>
              .
            </span>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <Link
            href="/dashboard/vendor/my-services"
            className="rounded-xl px-3 py-1.5 border shadow-sm text-xs font-medium text-stone-600 hover:bg-stone-100"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting || isLimitReached}
            className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold text-white ${
              isLimitReached
                ? "bg-stone-400"
                : "bg-[#844353] hover:bg-[#6e3745]"
            }`}
          >
            <span>{isSubmitting ? "Submitting..." : "Submit for Review"}</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </form>
  );
}
