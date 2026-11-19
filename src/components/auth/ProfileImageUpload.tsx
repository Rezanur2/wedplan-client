"use client";

import React from "react";
import { Camera } from "lucide-react";

interface ProfileImageUploadProps {
  fileName: string | null;
  onFileChange: (name: string) => void;
}

export default function ProfileImageUpload({
  fileName,
  onFileChange,
}: ProfileImageUploadProps) {
  return (
    <div className="rounded-xl border border-stone-200 bg-stone-50/50 p-2.5 text-left">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Camera className="h-4 w-4 text-[#844353]" />
          <div>
            <p className="text-xs font-semibold text-stone-800">
              Profile Image{" "}
              <span className="text-[10px] font-normal text-stone-400">
                (Optional)
              </span>
            </p>
            <p className="text-[10px] text-stone-500 truncate max-w-50">
              {fileName || "Upload photo to host on ImgBB"}
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
              onFileChange(e.target.files[0].name);
            }
          }}
        />
      </div>
    </div>
  );
}
