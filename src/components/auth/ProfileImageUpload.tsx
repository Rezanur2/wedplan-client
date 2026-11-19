"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Camera, X } from "lucide-react";

interface ProfileImageUploadProps {
  name: string;
  fileName: string | null;
  onFileChange: (name: string | null) => void;
}

export default function ProfileImageUpload({
  name,
  fileName,
  onFileChange,
}: ProfileImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Derive initials from name (e.g. "vendor" -> "VE", "Eleanor Vance" -> "EV")
  const getInitials = (text: string): string => {
    const trimmed = text.trim();
    if (!trimmed) return "WP";
    const parts = trimmed.split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return trimmed.slice(0, 2).toUpperCase();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      onFileChange(file.name);
    }
  };

  const handleRemove = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    onFileChange(null);
  };

  return (
    <div className="flex items-center gap-3.5 rounded-2xl border border-stone-200/90 bg-stone-50/50 p-2.5 sm:p-3 text-left">
      {/* Avatar Circle: Initials or Preview Image */}
      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-stone-200 bg-[#F4E8EC] flex items-center justify-center shadow-2xs">
        {previewUrl ? (
          <Image
            src={previewUrl}
            alt="Preview"
            fill
            className="object-cover"
          />
        ) : (
          <span className="font-serif text-sm font-semibold tracking-wider text-[#844353]">
            {getInitials(name)}
          </span>
        )}

        {previewUrl && (
          <button
            type="button"
            onClick={handleRemove}
            className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
            title="Remove image"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Upload Button & Helper */}
      <div className="flex-1 min-w-0 space-y-1">
        <label
          htmlFor="signup-image"
          className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3 py-1 text-[11px] font-medium text-stone-700 shadow-2xs hover:border-[#844353]/30 hover:bg-stone-50 transition-all cursor-pointer"
        >
          <Camera className="h-3 w-3 text-[#844353]" />
          <span>{fileName ? "Change Profile Photo" : "Upload Profile Photo (Optional)"}</span>
        </label>
        <p className="text-[10px] text-stone-400 truncate">
          {fileName ? fileName : "Hosted on ImgBB (PNG, JPG, WebP, max 5MB)."}
        </p>
      </div>

      <input
        id="signup-image"
        name="image"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
