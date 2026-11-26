"use client";

import React from "react";
import Link from "next/link";
import {
  Camera,
  Building2,
  Flower2,
  UtensilsCrossed,
  Sparkles,
  Shirt,
  ArrowRight,
  Grid2X2,
} from "lucide-react";
import { motion } from "framer-motion";

interface CategoryItem {
  name: string;
  tagline: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const CATEGORIES: CategoryItem[] = [
  {
    name: "Photography & Videography",
    tagline: "Timeless Imagery",
    description: "Editorial photography and cinematic films crafted to immortalize every intimate wedding emotion.",
    icon: Camera,
  },
  {
    name: "Wedding Venues",
    tagline: "Unforgettable Settings",
    description: "Romantic châteaus, historic estates, scenic vineyards, and grand ballrooms tailored for your celebration.",
    icon: Building2,
  },
  {
    name: "Decoration & Florist",
    tagline: "Botanical Artistry",
    description: "Bespoke floral installations, curated tablescapes, and ambient design styling to transform your space.",
    icon: Flower2,
  },
  {
    name: "Catering Services",
    tagline: "Artisanal Gastronomy",
    description: "Gourmet multi-course banquets, bespoke cocktail bars, and artisanal dessert experiences.",
    icon: UtensilsCrossed,
  },
  {
    name: "Makeup & Styling",
    tagline: "Radiant Elegance",
    description: "Haute bridal beauty artists specializing in glowing skin, refined hairstyling, and editorial looks.",
    icon: Sparkles,
  },
  {
    name: "Wedding Fashion",
    tagline: "Couture & Tailoring",
    description: "Handcrafted bridal gowns, bespoke tuxedos, and heirloom accessories for timeless sophistication.",
    icon: Shirt,
  },
];

export default function ServiceCategories() {
  return (
    <section className="py-16 sm:py-24 border-b border-[#EFE5E9] bg-white/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto space-y-2.5"
        >
          <div className="inline-flex items-center gap-1.5 rounded-full border border-rose-200/80 bg-rose-50/70 px-3 py-1 text-[11px] font-bold tracking-wider text-[#844353] uppercase shadow-2xs">
            <Grid2X2 className="h-3.5 w-3.5 text-[#844353]" />
            <span>Curated Disciplines</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-stone-900">
            Wedding Service Categories
          </h2>

          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Explore dedicated wedding specialists across every discipline to plan your dream celebration with effortless grace.
          </p>
        </motion.div>

        {/* Categories Grid */}
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((categoryItem, categoryIndex) => {
            const IconComponent = categoryItem.icon;
            const targetUrl = `/services?category=${encodeURIComponent(categoryItem.name)}`;

            return (
              <motion.div
                key={categoryItem.name}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: categoryIndex * 0.07 }}
              >
                <Link
                  href={targetUrl}
                  className="group relative flex h-full flex-col justify-between rounded-2xl border border-stone-200/80 bg-white p-6 shadow-2xs transition-all duration-300 hover:border-[#844353]/30 hover:shadow-md cursor-pointer"
                >
                  <div>
                    {/* Category Icon & Tagline */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FAF6F7] text-[#844353] transition-colors duration-300 group-hover:bg-[#844353] group-hover:text-white">
                        <IconComponent className="h-5 w-5" />
                      </div>

                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#844353]">
                        {categoryItem.tagline}
                      </span>
                    </div>

                    {/* Category Title */}
                    <h3 className="mt-4 font-serif text-lg font-bold text-stone-900 transition-colors group-hover:text-[#844353]">
                      {categoryItem.name}
                    </h3>

                    {/* Category Description */}
                    <p className="mt-2 text-xs leading-relaxed text-stone-500">
                      {categoryItem.description}
                    </p>
                  </div>

                  {/* Explore Link Arrow */}
                  <div className="mt-6 flex items-center gap-1.5 pt-4 border-t border-stone-100 text-xs font-semibold text-stone-800 transition-colors group-hover:text-[#844353]">
                    <span>Explore Specialists</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
