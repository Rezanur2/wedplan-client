"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Building2,
  Shield,
  Crown,
  Camera,
  Loader2,
} from "lucide-react";
import { IDashboardUser } from "@/types";
import { authClient } from "@/lib/auth-client";
import { uploadImageToImgBB } from "@/lib/uploadImage";
import { toast } from "@/components/ui/toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ProfileSettingsFormProps {
  user?: IDashboardUser | null;
}

export default function ProfileSettingsForm({ user }: ProfileSettingsFormProps) {
  const router = useRouter();

  const [name, setName] = useState(user?.name || "");
  const [businessName, setBusinessName] = useState(user?.businessName || "");
  const [imageUrl, setImageUrl] = useState(user?.image || "");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const userRole = user?.role?.toLowerCase() || "customer";
  const isAdmin = userRole === "admin";
  const isVendor = userRole === "vendor";
  const userInitial = name ? name.charAt(0).toUpperCase() : "U";

  // Handle image upload to ImgBB
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.add({
        title: "Invalid File",
        description: "Please upload an image file (PNG, JPG, or WEBP).",
        type: "error",
      });
      return;
    }

    setIsUploadingImage(true);
    try {
      const url = await uploadImageToImgBB(file);
      setImageUrl(url);
      toast.add({
        title: "Photo Uploaded",
        description: "Profile photo uploaded successfully. Click Save to apply.",
        type: "success",
      });
    } catch (err: unknown) {
      console.error(err);
      toast.add({
        title: "Upload Failed",
        description: "Could not upload image. Please check your connection and try again.",
        type: "error",
      });
    } finally {
      setIsUploadingImage(false);
      e.target.value = "";
    }
  };

  // Submit profile updates
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.add({
        title: "Name Required",
        description: "Please provide your full name.",
        type: "error",
      });
      return;
    }

    setIsSaving(true);
    try {
      const updatePayload: { name: string; image?: string; businessName?: string } = {
        name: name.trim(),
        image: imageUrl || undefined,
      };

      if (isVendor && businessName.trim()) {
        updatePayload.businessName = businessName.trim();
      }

      const res = await authClient.updateUser(updatePayload);

      if (res?.error) {
        toast.add({
          title: "Update Failed",
          description: res.error.message || "Failed to update profile settings.",
          type: "error",
        });
      } else {
        toast.add({
          title: "Profile Updated",
          description: "Your profile information has been saved successfully.",
          type: "success",
        });
        router.refresh();
      }
    } catch (err: unknown) {
      console.error(err);
      toast.add({
        title: "Error",
        description: "An unexpected error occurred while updating profile.",
        type: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-12">
      {/* 1. Header (Title and Badge side-by-side) */}
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
          Profile Settings
        </h1>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 border border-stone-200 px-3 py-1 text-xs font-semibold text-stone-700 capitalize">
            <Shield className="h-3.5 w-3.5 text-[#844353]" />
            {isAdmin ? "Administrator" : isVendor ? "Vendor" : "Customer"}
          </span>
          {isVendor && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 border border-rose-200 px-3 py-1 text-xs font-semibold text-[#844353]">
              {user?.subscriptionPlan?.toLowerCase() === "premium" ? (
                <>
                  <Crown className="h-3 w-3 text-amber-500 fill-amber-500" />
                  Premium Plan
                </>
              ) : (
                "Free Plan"
              )}
            </span>
          )}
        </div>
      </div>
      <p className="text-xs text-stone-500 -mt-4">
        Manage your avatar, personal details, and WedPlan account settings.
      </p>

      {/* 2. Responsive 2-Column Layout */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Avatar & Photo Actions */}
        <div className="lg:col-span-1 rounded-2xl border border-stone-200 bg-white p-6 shadow-2xs flex flex-col items-center text-center space-y-4 h-fit">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-400 self-start">
            Profile Photo
          </h2>

          <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full border-2 border-stone-200 bg-[#F4E8EC] shadow-2xs flex items-center justify-center">
            {isUploadingImage ? (
              <Loader2 className="h-8 w-8 animate-spin text-[#844353]" />
            ) : imageUrl ? (
              <Image
                src={imageUrl}
                alt={name || "User Avatar"}
                fill
                className="object-cover"
                sizes="112px"
              />
            ) : (
              <span className="font-serif text-3xl font-bold text-[#844353]">
                {userInitial}
              </span>
            )}
          </div>

          <div className="space-y-1">
            <p className="font-serif text-base font-bold text-stone-900 truncate max-w-50">
              {name || "User"}
            </p>
            <p className="text-xs text-stone-400 truncate max-w-50">
              {user?.email}
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-2 w-full">
            <label
              htmlFor="profile-image-upload"
              className={`inline-flex items-center justify-center gap-1.5 rounded-xl border border-stone-300 bg-white px-4 py-2 text-xs font-semibold text-stone-700 shadow-2xs hover:bg-stone-50 transition-colors cursor-pointer w-full ${
                isUploadingImage ? "opacity-50 pointer-events-none" : ""
              }`}
            >
              {isUploadingImage ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Camera className="h-3.5 w-3.5 text-stone-600" />
                  <span>Change Photo</span>
                </>
              )}
            </label>

            <input
              id="profile-image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageFileChange}
              disabled={isUploadingImage}
              className="hidden"
            />

            {imageUrl && (
              <button
                type="button"
                onClick={() => setImageUrl("")}
                className="rounded-xl px-3 py-1.5 text-xs font-medium text-stone-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              >
                Remove Photo
              </button>
            )}
          </div>

          <p className="text-[11px] text-stone-400 pt-1">
            Supported: JPG, PNG, WEBP (Max 5MB)
          </p>
        </div>

        {/* Right Column: Editable Information Form */}
        <div className="lg:col-span-2 rounded-2xl border border-stone-200 bg-white p-6 shadow-2xs space-y-5">
          <div>
            <h2 className="text-sm font-semibold text-stone-900">Personal Information</h2>
            <p className="text-xs text-stone-400">Update your account name and public profile details.</p>
          </div>

          <div className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs font-semibold text-stone-700">
                Full Name <span className="text-rose-500">*</span>
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
                <Input
                  id="name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="pl-9 text-xs rounded-xl border-stone-200"
                  required
                />
              </div>
            </div>

            {/* Business Name (Vendor specific) */}
            {isVendor && (
              <div className="space-y-1.5">
                <Label htmlFor="businessName" className="text-xs font-semibold text-stone-700">
                  Business / Studio Name
                </Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
                  <Input
                    id="businessName"
                    name="businessName"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Dream Moments Photography"
                    className="pl-9 text-xs rounded-xl border-stone-200"
                  />
                </div>
              </div>
            )}

            {/* Email Address (Read-only / Security) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="email" className="text-xs font-semibold text-stone-700">
                  Email Address
                </Label>
                <span className="text-[10px] text-stone-400 font-medium flex items-center gap-1">
                  <Shield className="h-2.5 w-2.5 text-stone-400" />
                  Login Identity (Locked)
                </span>
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
                <Input
                  id="email"
                  value={user?.email || ""}
                  disabled
                  className="pl-9 text-xs rounded-xl border-stone-200 bg-stone-50 text-stone-500 cursor-not-allowed select-none"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex items-center justify-end pt-4 border-t border-stone-100">
            <button
              type="submit"
              disabled={isSaving || isUploadingImage}
              className="inline-flex items-center gap-2 rounded-xl bg-[#844353] px-6 py-2.5 text-xs font-semibold text-white shadow-2xs hover:bg-[#6e3745] disabled:opacity-50 transition-colors cursor-pointer"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <span>Save Profile</span>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
