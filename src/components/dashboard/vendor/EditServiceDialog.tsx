"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Pencil,
  Save,
  Loader2,
  Store,
  MapPin,
  DollarSign,
  Camera,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
import { IVendorService } from "@/types";
import { updateService } from "@/lib/actions/services";
import { uploadImageToImgBB } from "@/lib/uploadImage";

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

interface EditServiceDialogProps {
  service: IVendorService;
}

export function EditServiceDialog({ service }: EditServiceDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [category, setCategory] = useState(service.category || CATEGORIES[0]);
  const [pricingType, setPricingType] = useState(
    service.pricingType || PRICING_TYPES[0]
  );
  const [coverImage, setCoverImage] = useState<string>(
    service.images?.[0] || ""
  );
  const [isUploading, setIsUploading] = useState(false);

  const serviceId = service._id || service.id || "";

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await uploadImageToImgBB(file);
      setCoverImage(url);
      toast.add({
        title: "Cover Uploaded",
        description: "Cover photo updated. Click Save Changes to save.",
        type: "success",
      });
    } catch (err) {
      console.error("Cover image upload failed:", err);
      toast.add({
        title: "Upload Failed",
        description: "Could not upload image. Please try again.",
        type: "error",
      });
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const serviceName = String(formData.get("serviceName") || "").trim();
    const price = Number(formData.get("price"));
    const location = String(formData.get("location") || "").trim();
    const description = String(formData.get("description") || "").trim();

    if (!serviceName) {
      toast.add({
        title: "Missing Information",
        description: "Please enter a valid service name.",
        type: "error",
      });
      setLoading(false);
      return;
    }

    if (Number.isNaN(price) || price <= 0) {
      toast.add({
        title: "Invalid Price",
        description: "Please enter a valid price greater than 0.",
        type: "error",
      });
      setLoading(false);
      return;
    }

    const updatedImages = coverImage
      ? [coverImage, ...(service.images?.slice(1) || [])]
      : service.images || [];

    const updatedData = {
      serviceName,
      category,
      pricingType,
      price,
      location,
      description,
      images: updatedImages,
    };

    try {
      const res = await updateService(serviceId, updatedData);

      if (res.acknowledged || res.modifiedCount > 0 || res.matchedCount > 0) {
        toast.add({
          title: "Service Updated",
          description: `"${serviceName}" has been successfully updated.`,
          type: "success",
        });
        setOpen(false);
        router.refresh();
      } else {
        toast.add({
          title: "Update Failed",
          description: "Could not update the service. Please try again.",
          type: "error",
        });
      }
    } catch (err) {
      console.error("Error updating service:", err);
      toast.add({
        title: "Error",
        description: "Failed to connect to the server. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className="h-8 border-stone-200 text-stone-700 hover:bg-black hover:text-white hover:border-black transition cursor-pointer text-xs font-medium"
          >
            <Pencil className="mr-1.5 h-3.5 w-3.5" />
            <span>Edit</span>
          </Button>
        }
      />

      <DialogContent className="sm:max-w-xl bg-white border border-stone-200 rounded-2xl p-6 sm:p-7 shadow-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-50 text-[#844353]">
              <Store className="h-4 w-4" />
            </div>
            <div>
              <DialogTitle className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
                Edit Wedding Service
              </DialogTitle>
              <DialogDescription className="text-xs text-stone-500">
                Update the pricing, category, and details for this listing.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* Cover Photo Change Section */}
          <div className="space-y-1.5 rounded-xl border border-stone-200/80 bg-stone-50/70 p-3">
            <Label className="text-xs font-semibold text-stone-700 block">
              Cover Photo
            </Label>
            <div className="flex items-center gap-3">
              {coverImage ? (
                <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border border-stone-200 bg-stone-100 shadow-2xs">
                  <Image
                    src={coverImage}
                    alt="Cover preview"
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-16 w-24 shrink-0 items-center justify-center rounded-lg border border-dashed border-stone-300 bg-stone-100 text-stone-400">
                  <Camera className="h-5 w-5" />
                </div>
              )}

              <div className="space-y-1">
                <label
                  htmlFor={`cover-upload-${serviceId}`}
                  className={`inline-flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-700 shadow-2xs hover:bg-stone-50 hover:border-stone-300 transition cursor-pointer ${
                    isUploading ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-[#844353]" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Camera className="h-3.5 w-3.5 text-[#844353]" />
                      <span>Change Cover Photo</span>
                    </>
                  )}
                  <input
                    id={`cover-upload-${serviceId}`}
                    type="file"
                    accept="image/*"
                    disabled={isUploading}
                    onChange={handleCoverUpload}
                    className="hidden"
                  />
                </label>
                <p className="text-[10px] text-stone-400">
                  JPG, PNG or WEBP up to 5MB (Updates primary cover photo)
                </p>
              </div>
            </div>
          </div>

          {/* 1. Service Name */}
          <div className="space-y-1">
            <Label htmlFor="serviceName" className="text-xs font-semibold text-stone-700">
              Service Name <span className="text-rose-600">*</span>
            </Label>
            <Input
              id="serviceName"
              name="serviceName"
              defaultValue={service.serviceName}
              required
              placeholder="e.g. West Lakeside Promenade & Terrace"
              className="h-10 text-xs rounded-xl bg-stone-50/60 border-stone-200 focus-visible:ring-[#844353]"
            />
          </div>

          {/* 2. Category & Pricing Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-stone-700">
                Service Category <span className="text-rose-600">*</span>
              </Label>
              <Select value={category} onValueChange={(val) => val && setCategory(val)}>
                <SelectTrigger className="w-full h-10 text-xs rounded-xl bg-stone-50/60 border-stone-200 focus:border-[#844353]">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent className="bg-white border-stone-200 rounded-xl shadow-lg">
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat} className="text-xs cursor-pointer py-2">
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold text-stone-700">
                Pricing Structure <span className="text-rose-600">*</span>
              </Label>
              <Select
                value={pricingType}
                onValueChange={(val) => val && setPricingType(val)}
              >
                <SelectTrigger className="w-full h-10 text-xs rounded-xl bg-stone-50/60 border-stone-200 focus:border-[#844353]">
                  <SelectValue placeholder="Select Pricing Type" />
                </SelectTrigger>
                <SelectContent className="bg-white border-stone-200 rounded-xl shadow-lg">
                  {PRICING_TYPES.map((type) => (
                    <SelectItem key={type} value={type} className="text-xs cursor-pointer py-2">
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 3. Price & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <Label htmlFor="price" className="text-xs font-semibold text-stone-700">
                Starting Price ($) <span className="text-rose-600">*</span>
              </Label>
              <div className="relative">
                <DollarSign className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400" />
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  defaultValue={service.price}
                  required
                  placeholder="5500"
                  className="h-10 pl-8.5 text-xs rounded-xl bg-stone-50/60 border-stone-200 focus-visible:ring-[#844353]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="location" className="text-xs font-semibold text-stone-700">
                Location / City <span className="text-rose-600">*</span>
              </Label>
              <div className="relative">
                <MapPin className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400" />
                <Input
                  id="location"
                  name="location"
                  defaultValue={service.location}
                  required
                  placeholder="e.g. Austin, TX"
                  className="h-10 pl-8.5 text-xs rounded-xl bg-stone-50/60 border-stone-200 focus-visible:ring-[#844353]"
                />
              </div>
            </div>
          </div>

          {/* 4. Description */}
          <div className="space-y-1">
            <Label htmlFor="description" className="text-xs font-semibold text-stone-700">
              Description <span className="text-rose-600">*</span>
            </Label>
            <Textarea
              id="description"
              name="description"
              rows={3}
              defaultValue={service.description}
              required
              placeholder="Tell couples what makes this wedding service special..."
              className="text-xs rounded-xl bg-stone-50/60 border-stone-200 focus-visible:ring-[#844353] resize-none"
            />
          </div>

          {/* Dialog Footer Actions */}
          <DialogFooter className="gap-2 pt-2">
            <DialogClose
              render={
                <Button
                  type="button"
                  variant="outline"
                  className="h-9 rounded-xl border-stone-200 text-xs font-medium text-stone-600 hover:bg-stone-100"
                >
                  Cancel
                </Button>
              }
            />
            <Button
              type="submit"
              disabled={loading}
              className="h-9 rounded-xl bg-[#844353] hover:bg-[#6e3745] text-white text-xs font-semibold gap-1.5 shadow-xs transition cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-3.5 w-3.5" />
                  <span>Save Changes</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
