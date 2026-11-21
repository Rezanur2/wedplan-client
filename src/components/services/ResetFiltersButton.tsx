"use client";

import React, { useTransition } from "react";
import { useRouter } from "next/navigation";
import { RotateCcw } from "lucide-react";

export default function ResetFiltersButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleReset = () => {
    startTransition(() => {
      router.replace("/services", { scroll: false });
    });
  };

  return (
    <button
      type="button"
      onClick={handleReset}
      disabled={isPending}
      className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#844353] px-4 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-[#723645] transition-all cursor-pointer disabled:opacity-75"
    >
      <RotateCcw className={`h-3.5 w-3.5 ${isPending ? "animate-spin" : ""}`} />
      <span>{isPending ? "Resetting..." : "Reset All Filters"}</span>
    </button>
  );
}
