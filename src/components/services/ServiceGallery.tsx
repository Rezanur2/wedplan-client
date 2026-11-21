"use client";

import React, { useState } from "react";
import Image from "next/image";

interface ServiceGalleryProps {
  images?: string[];
  serviceName?: string;
}

export default function ServiceGallery({
  images = [],
  serviceName = "Wedding Service",
}: ServiceGalleryProps) {
  const fallbackImage =
    "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1200";

  // Use provided images or fallback
  const galleryImages =
    images && images.length > 0 ? images : [fallbackImage];

  const [activeIndex, setActiveIndex] = useState(0);

  const activeImage = galleryImages[activeIndex] || galleryImages[0];

  return (
    <div className="space-y-4">
      {/* 1. Main Large Active Image */}
      <div className="relative aspect-16/10 sm:aspect-video w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-stone-200/90 bg-stone-100 shadow-xs">
        <Image
          src={activeImage}
          alt={`${serviceName} - Photo ${activeIndex + 1}`}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 65vw"
          className="object-cover transition-all duration-500 ease-out"
        />

        {/* Subtle photo counter badge */}
        {galleryImages.length > 1 && (
          <span className="absolute bottom-3 right-3 rounded-full bg-stone-900/80 px-3 py-1 text-xs font-semibold text-white shadow-xs backdrop-blur-xs">
            {activeIndex + 1} / {galleryImages.length} Photos
          </span>
        )}
      </div>

      {/* 2. Thumbnails Row */}
      {galleryImages.length > 1 && (
        <div className="flex items-center gap-2.5 sm:gap-3 overflow-x-auto p-1.5 no-scrollbar">
          {galleryImages.map((imgUrl, index) => {
            const isActive = index === activeIndex;

            return (
              <button
                key={index}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`View photo ${index + 1}`}
                className={`group relative h-14 w-20 sm:h-20 sm:w-28 shrink-0 cursor-pointer rounded-xl transition-all duration-200 focus:outline-hidden p-0.5 ${
                  isActive
                    ? "border-2 border-[#844353] bg-white shadow-xs"
                    : "border border-stone-200 bg-white opacity-70 hover:opacity-100"
                }`}
              >
                <div className="relative h-full w-full overflow-hidden rounded-[8px] sm:rounded-[9px]">
                  <Image
                    src={imgUrl}
                    alt={`${serviceName} thumbnail ${index + 1}`}
                    fill
                    sizes="(max-width: 640px) 80px, 120px"
                    className="object-cover"
                  />
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
