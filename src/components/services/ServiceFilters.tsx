"use client";

import React, { useState, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, SlidersHorizontal } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

const QUICK_CATEGORIES = [
  { label: "All", value: "All" },
  { label: "Venues", value: "Wedding Venues" },
  { label: "Photography", value: "Photography & Videography" },
  { label: "Florals", value: "Decoration & Florist" },
  { label: "Catering", value: "Catering Services" },
  { label: "Bridal Wear", value: "Wedding Fashion" },
  { label: "Hair & Makeup", value: "Makeup & Styling" },
];

const ALL_CATEGORIES = [
  "All Categories",
  "Photography & Videography",
  "Wedding Venues",
  "Decoration & Florist",
  "Catering Services",
  "Makeup & Styling",
  "Wedding Fashion",
];

const SORT_OPTIONS = [
  { label: "Top Featured", value: "recommended" },
  { label: "Price: Low to High", value: "price-low" },
  { label: "Price: High to Low", value: "price-high" },
];

interface ServiceFiltersProps {
  initialSearch?: string;
  initialCategory?: string;
  initialLocation?: string;
  initialSort?: string;
}

export default function ServiceFilters({
  initialSearch = "",
  initialCategory = "All",
  initialLocation = "",
  initialSort = "recommended",
}: ServiceFiltersProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory || "All");
  const [location, setLocation] = useState(initialLocation);
  const [sort, setSort] = useState(initialSort || "recommended");

  // Keep internal state in sync if URL props change from outside
  const [prevProps, setPrevProps] = useState({
    initialSearch,
    initialCategory,
    initialLocation,
    initialSort,
  });

  if (
    prevProps.initialSearch !== initialSearch ||
    prevProps.initialCategory !== initialCategory ||
    prevProps.initialLocation !== initialLocation ||
    prevProps.initialSort !== initialSort
  ) {
    setPrevProps({ initialSearch, initialCategory, initialLocation, initialSort });
    setCategory(initialCategory || "All");
    setLocation(initialLocation);
    setSort(initialSort || "recommended");
    if (initialSearch !== search) {
      setSearch(initialSearch);
    }
  }

  // Timer refs for debouncing typing
  const searchTimerRef = useRef<NodeJS.Timeout | null>(null);
  const locationTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Smooth, non-blocking URL update
  const navigateWithParams = (params: URLSearchParams) => {
    const queryString = params.toString();
    startTransition(() => {
      router.replace(queryString ? `/services?${queryString}` : "/services", {
        scroll: false,
      });
    });
  };

  // 1. Live Instant Search as user types (Debounced 300ms)
  const handleLiveSearch = (value: string) => {
    setSearch(value);

    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);

    searchTimerRef.current = setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      if (value.trim()) {
        params.set("search", value.trim());
      } else {
        params.delete("search");
      }
      navigateWithParams(params);
    }, 300);
  };

  // 2. Live Instant Location as user types (Debounced 300ms)
  const handleLiveLocation = (value: string) => {
    setLocation(value);

    if (locationTimerRef.current) clearTimeout(locationTimerRef.current);

    locationTimerRef.current = setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      if (value.trim()) {
        params.set("location", value.trim());
      } else {
        params.delete("location");
      }
      navigateWithParams(params);
    }, 300);
  };

  // 3. Immediate handler for Dropdowns & Quick Pills
  const handleFilterChange = (name: string, value: string) => {
    const params = new URLSearchParams(window.location.search);

    if (value && value !== "All" && value !== "All Categories" && value !== "recommended") {
      params.set(name, value);
    } else {
      params.delete(name);
    }

    navigateWithParams(params);
  };

  // 4. Form Submit handler (Enter key or Search Button click)
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    if (locationTimerRef.current) clearTimeout(locationTimerRef.current);

    const params = new URLSearchParams(window.location.search);

    if (search.trim()) params.set("search", search.trim());
    else params.delete("search");

    if (location.trim()) params.set("location", location.trim());
    else params.delete("location");

    navigateWithParams(params);
  };

  const currentCategoryLabel =
    !category || category === "All" || category === "All Categories"
      ? "All Categories"
      : category;

  const currentSortLabel =
    SORT_OPTIONS.find((s) => s.value === sort)?.label || "Top Featured";

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 rounded-2xl border border-stone-200/80 bg-white p-3.5 sm:p-5 shadow-xs"
    >
      {/* Main Controls Row */}
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-12 lg:gap-3 items-center">
        
        {/* 1. Live Search Input */}
        <div className="relative sm:col-span-1 lg:col-span-3">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            name="searchField"
            value={search}
            onChange={(e) => handleLiveSearch(e.target.value)}
            placeholder="Search vendors or keyword..."
            autoComplete="off"
            className="w-full h-11 rounded-xl border border-stone-200/90 bg-stone-50/50 pl-10 pr-3 text-xs sm:text-sm text-stone-800 placeholder-stone-400 outline-none transition focus:border-[#844353] focus:bg-white"
          />
        </div>

        {/* 2. Category Dropdown */}
        <div className="sm:col-span-1 lg:col-span-3">
          <Select
            value={!category || category === "All" ? "All Categories" : category}
            onValueChange={(val) => {
              if (!val) return;
              const newCat = val === "All Categories" ? "All" : val;
              setCategory(newCat);
              handleFilterChange("category", newCat);
            }}
          >
            <SelectTrigger className="w-full h-11 rounded-xl border border-stone-200/90 bg-stone-50/50 px-3.5 text-xs sm:text-sm text-stone-800 transition hover:border-[#844353] focus-visible:border-[#844353] focus-visible:ring-0 flex items-center justify-between cursor-pointer">
              <span className="truncate">{currentCategoryLabel}</span>
            </SelectTrigger>
            <SelectContent className="rounded-2xl border border-stone-200/90 bg-white p-1.5 shadow-xl min-w-60">
              {ALL_CATEGORIES.map((cat) => (
                <SelectItem
                  key={cat}
                  value={cat}
                  className="rounded-xl px-3 py-2.5 text-xs sm:text-sm text-stone-700 cursor-pointer focus:bg-[#FAF6F7] focus:text-[#844353]"
                >
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 3. Live Location Input */}
        <div className="relative sm:col-span-1 lg:col-span-3">
          <MapPin className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            name="locationField"
            value={location}
            onChange={(e) => handleLiveLocation(e.target.value)}
            placeholder="e.g. Austin, New York..."
            autoComplete="off"
            className="w-full h-11 rounded-xl border border-stone-200/90 bg-stone-50/50 pl-10 pr-3 text-xs sm:text-sm text-stone-800 placeholder-stone-400 outline-none transition focus:border-[#844353] focus:bg-white"
          />
        </div>

        {/* 4. Sort Dropdown & Search Button */}
        <div className="flex items-center gap-2 sm:col-span-1 lg:col-span-3">
          <div className="flex-1">
            <Select
              value={sort}
              onValueChange={(val) => {
                if (!val) return;
                setSort(val);
                handleFilterChange("sort", val);
              }}
            >
              <SelectTrigger className="w-full h-11 rounded-xl border border-stone-200/90 bg-stone-50/50 px-3 text-xs sm:text-sm text-stone-800 transition hover:border-[#844353] focus-visible:border-[#844353] focus-visible:ring-0 flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-2 truncate">
                  <SlidersHorizontal className="h-3.5 w-3.5 text-stone-600 shrink-0" />
                  <span className="truncate">{currentSortLabel}</span>
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-2xl border border-stone-200/90 bg-white p-1.5 shadow-xl min-w-52.5">
                {SORT_OPTIONS.map((opt) => (
                  <SelectItem
                    key={opt.value}
                    value={opt.value}
                    className="rounded-xl px-3 py-2.5 text-xs sm:text-sm text-stone-700 cursor-pointer focus:bg-[#FAF6F7] focus:text-[#844353]"
                  >
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Form Submit Button */}
          <button
            type="submit"
            className="h-11 px-4 sm:px-5 rounded-xl bg-[#844353] text-xs font-semibold text-white shadow-2xs transition hover:bg-[#723645] flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
          >
            <Search className="h-3.5 w-3.5" />
            <span>Search</span>
          </button>
        </div>

      </div>

      {/* Quick Category Pills Row */}
      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-stone-100 pt-3">
        <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mr-1">
          Category:
        </span>
        {QUICK_CATEGORIES.map((tab) => {
          const isActive =
            category === tab.value ||
            (tab.value === "All" && (!category || category === "All" || category === "All Categories"));

          return (
            <button
              key={tab.label}
              type="button"
              onClick={() => {
                const newCat = tab.value === "All" ? "All" : tab.value;
                setCategory(newCat);
                handleFilterChange("category", newCat);
              }}
              className={`rounded-full px-3.5 py-1 text-xs font-medium transition-all cursor-pointer ${
                isActive
                  ? "bg-[#844353] text-white shadow-2xs"
                  : "bg-stone-100/80 text-stone-600 hover:bg-stone-200/70 hover:text-stone-900"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </form>
  );
}
