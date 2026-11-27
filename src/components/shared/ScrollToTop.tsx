"use client";

import React, { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      onClick={handleScrollToTop}
      aria-label="Scroll to top"
      title="Back to top"
      className={`fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 flex h-10 w-10 items-center justify-center rounded-full bg-[#844353] text-white shadow-lg shadow-[#844353]/25 transition-all duration-200 hover:bg-[#6e3745] hover:-translate-y-0.5 cursor-pointer ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-3 pointer-events-none"
      }`}
    >
      <ArrowUp className="h-4 w-4" />
    </button>
  );
}
