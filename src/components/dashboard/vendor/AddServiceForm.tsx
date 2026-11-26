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
  Plus,
  User,
  Mail,
  Building2,
  AlertTriangle,
} from "lucide-react";
import VendorPlanBanner from "./VendorPlanBanner";
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
import { ServiceFormData, IDashboardUser } from "@/types";
import { createService, getServicesCount } from "@/lib/actions/services";
import { getUserPremiumById } from "@/lib/api/user";
import DashboardBreadcrumb from "@/components/dashboard/shared/DashboardBreadcrumb";


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
  user?: IDashboardUser;
  vendorId?: string;
  subscriptionPlan?: string;
  activeServiceCount?: number;
}

export default function AddServiceForm({
  user,
  vendorId = "",
  subscriptionPlan = "free",
  activeServiceCount = 0,
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

  // Multiple images state 
  const [images, setImages] = useState<string[]>([]);
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

  // Upload image 
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (images.length >= 4) {
      toast.add({
        title: "Limit Reached",
        description: "You can upload a maximum of 4 photos.",
        type: "error",
      });
      return;
    }

    if (errors.image) {
      setErrors((prev) => ({ ...prev, image: "" }));
    }

    setIsUploading(true);
    try {
      const imageURL = await uploadImageToImgBB(file);
      setImages((prev) => [...prev, imageURL]);
    } catch (err) {
      console.error("Image upload failed:", err);
      toast.add({
        title: "Upload Failed",
        description: "Failed to upload image. Please try again.",
        type: "error",
      });
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  // Remove image from gallery
  const handleRemoveImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, imageIndex) => imageIndex !== indexToRemove));
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
    if (images.length === 0) {
      newErrors.image = "Please upload at least one service image.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields first
    if (!validateForm()) {
      toast.add({
        title: "Required Fields Missing",
        description: "Please fill out all required fields marked with (*).",
        type: "error",
      });
      return;
    }

    setIsSubmitting(true);
    let isRedirecting = false;

    try {
      if (user?.id) {
        const [premiumResult, countResult] = await Promise.all([
          getUserPremiumById(user.id),
          getServicesCount(),
        ]);

        if (!premiumResult?.premium && countResult.count >= 3) {
          toast.add({
            title: "Limit Reached",
            description: "Free plan allows up to 3 services. Please upgrade to Premium.",
            type: "error",
          });
          isRedirecting = true;
          router.push("/dashboard/vendor/subscription/checkout");
          return;
        }
      }

      const serviceData: ServiceFormData = {
        ...form,
        price: Number(form.price),
        images: images,
        vendorId: user?.id || vendorId || "",
        vendorName: user?.name || "Verified Vendor",
        vendorEmail: user?.email || "",
        vendorAvatar: user?.image || "",
        businessName: user?.businessName || user?.name || "Wedding Specialist",
        status: "Pending",
        createdAt: new Date().toISOString(),
      };

      const createResult = await createService(serviceData);

      if (createResult?.insertedId || createResult?.acknowledged) {
        isRedirecting = true;
        toast.add({
          title: "Success",
          description: "Service submitted for review.",
          type: "success",
        });
        router.push("/dashboard/vendor/my-services");
        router.refresh();
        return;
      }

      toast.add({
        title: createResult?.limitReached ? "Limit Reached" : "Submission Failed",
        description: createResult?.message || "Could not submit your service. Please try again.",
        type: "error",
      });

      if (createResult?.limitReached) {
        isRedirecting = true;
        router.push("/dashboard/vendor/subscription/checkout");
      }
    } catch (error) {
      console.error("Failed to submit service:", error);
      toast.add({
        title: "Submission Failed",
        description: "Could not submit your service. Please try again.",
        type: "error",
      });
    } finally {
      if (!isRedirecting) {
        setIsSubmitting(false);
      }
    }
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
          <DashboardBreadcrumb section="VENDOR STUDIO" page="ADD SERVICE" />
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
      <VendorPlanBanner
        activeCount={activeServiceCount}
        isPremium={isPremium}
      />

      {isLimitReached && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl bg-amber-50 p-4 border border-amber-200 text-xs text-amber-900 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
            <span>
              You have used all <strong>3 of 3</strong> services allowed on the Free Plan. Please upgrade to Premium to publish more services.
            </span>
          </div>
          <Link
            href="/dashboard/vendor/subscription"
            className="rounded-lg bg-[#844353] hover:bg-[#6e3745] text-white px-3 py-1.5 font-semibold text-center shrink-0 transition"
          >
            Upgrade to Premium
          </Link>
        </div>
      )}

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
                  Service Photos <span className="text-rose-600">*</span>
                </h2>
                <p className="text-[11px] text-stone-500">
                  Upload up to 4 photos for this service
                </p>
              </div>
            </div>
            <span className="text-xs font-semibold text-stone-500">
              {images.length}/4 Photos
            </span>
          </div>

          <div>
            {/* Primary Image Upload Field */}
            <div className="w-full">
              <label
                htmlFor="photo-upload-main"
                className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center cursor-pointer min-h-36 transition-colors ${
                  errors.image
                    ? "border-rose-400 bg-rose-50/30"
                    : "border-stone-200 bg-stone-50/40 hover:bg-stone-50"
                } ${isUploading || images.length >= 4 ? "opacity-60 cursor-not-allowed" : ""}`}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-[#844353]">
                  <UploadCloud className="h-5 w-5" />
                </div>
                <p className="mt-2 text-xs font-semibold text-stone-800">
                  {isUploading
                    ? "Uploading photo..."
                    : images.length >= 4
                    ? "Maximum 4 photos uploaded"
                    : "Click or drag to upload photo"}
                </p>
                <p className="text-[10px] text-stone-400 mt-0.5">
                  JPG, PNG or WEBP up to 5MB (Upload up to 4 photos)
                </p>
                <input
                  id="photo-upload-main"
                  type="file"
                  accept="image/*"
                  disabled={isUploading || images.length >= 4}
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

            {/* 4 Thumbnails Grid (Small size on mobile, responsive grid) */}
            <div className="mt-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-stone-700">
                  Gallery Photos ({images.length}/4)
                </span>
                <span className="text-[10px] text-stone-400">
                  1st photo is cover • Click slot to add
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2 sm:gap-3">
                {Array.from({ length: 4 }).map((_, index) => {
                  const imgUrl = images[index];

                  if (imgUrl) {
                    return (
                      <div
                        key={index}
                        className="group relative aspect-square sm:aspect-4/3 w-full overflow-hidden rounded-lg sm:rounded-xl border border-stone-200 bg-stone-100 shadow-2xs"
                      >
                        <Image
                          src={imgUrl}
                          alt={`Service Photo ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                        {index === 0 && (
                          <span className="absolute left-1 top-1 rounded bg-[#844353] px-1 sm:px-1.5 py-0.5 text-[7.5px] sm:text-[9px] font-semibold text-white shadow-xs">
                            Cover
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute right-1 top-1 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-black/60 text-white hover:bg-rose-600 transition-colors cursor-pointer"
                          title="Remove photo"
                        >
                          <X className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                        </button>
                      </div>
                    );
                  }

                  return (
                    <label
                      key={index}
                      htmlFor={`photo-upload-${index}`}
                      className={`flex aspect-square sm:aspect-4/3 w-full flex-col items-center justify-center rounded-lg sm:rounded-xl border border-dashed border-stone-300 bg-stone-50/50 hover:bg-stone-100/70 hover:border-[#844353] transition-colors cursor-pointer text-stone-400 ${
                        isUploading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      <Plus className="h-3 w-3 sm:h-4 sm:w-4 text-stone-400" />
                      <span className="text-[8px] sm:text-[10px] font-medium mt-0.5 text-stone-500">
                        {index === 0 ? "Cover" : `Photo ${index + 1}`}
                      </span>
                      <input
                        id={`photo-upload-${index}`}
                        type="file"
                        accept="image/*"
                        disabled={isUploading}
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

        {/* Section 3: Vendor Profile Information */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-stone-900 text-white">
                <User className="h-3.5 w-3.5" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-stone-900">
                  Vendor Profile Information
                </h2>
                <p className="text-[11px] text-stone-500">
                  Automatically attached from your verified account
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full">
              <CheckCircle2 className="h-3 w-3 text-emerald-600" />
              Verified Account
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs font-semibold mb-1 block text-stone-600">
                Vendor Name
              </Label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400" />
                <Input
                  readOnly
                  disabled
                  value={user?.name || "Verified Vendor"}
                  className="h-9 pl-8 text-xs rounded-xl bg-stone-100/80 text-stone-600 cursor-not-allowed border-stone-200"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs font-semibold mb-1 block text-stone-600">
                Vendor Email
              </Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400" />
                <Input
                  readOnly
                  disabled
                  value={user?.email || ""}
                  className="h-9 pl-8 text-xs rounded-xl bg-stone-100/80 text-stone-600 cursor-not-allowed border-stone-200"
                />
              </div>
            </div>

            {user?.businessName ? (
              <div className="sm:col-span-2">
                <Label className="text-xs font-semibold mb-1 block text-stone-600">
                  Business Name
                </Label>
                <div className="relative mt-1">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400" />
                  <Input
                    readOnly
                    disabled
                    value={user.businessName}
                    className="h-9 pl-8 text-xs rounded-xl bg-stone-100/80 text-stone-600 cursor-not-allowed border-stone-200"
                  />
                </div>
              </div>
            ) : (
              <div className="sm:col-span-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-xl border border-amber-200 bg-amber-50/70 px-3.5 py-2.5 text-xs text-amber-900">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-amber-600 shrink-0" />
                  <span>
                    No business / studio name set yet. Add yours in{" "}
                    <strong>Profile Settings</strong> so couples see your brand.
                  </span>
                </div>
                <Link
                  href="/dashboard/vendor/profile"
                  className="inline-flex items-center gap-1 font-semibold text-[#844353] hover:underline whitespace-nowrap shrink-0"
                >
                  <span>Profile Settings</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
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
                ? "bg-stone-400 cursor-not-allowed"
                : "bg-[#844353] hover:bg-[#6e3745] cursor-pointer"
            }`}
          >
            <span>
              {isLimitReached
                ? "Slot Limit Reached (3/3)"
                : isSubmitting
                ? "Submitting..."
                : "Submit for Review"}
            </span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </form>
  );
}
