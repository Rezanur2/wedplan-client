import React from "react";
import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  iconOnly?: boolean;
  className?: string;
}

export default function Logo({ iconOnly = false, className = "" }: LogoProps) {
  if (iconOnly) {
    return (
      <Link
        href="/"
        className={`relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-xl shadow-xs transition-transform hover:scale-105 ${className}`}
      >
        <Image
          src="/images/logo.png"
          alt="WedPlan Logo"
          fill
          sizes="32px"
          className="object-contain"
          priority
        />
      </Link>
    );
  }

  return (
    <Link href="/" className={`group inline-flex items-center gap-2.5 ${className}`}>
      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl shadow-xs transition-transform duration-200 group-hover:scale-105">
        <Image
          src="/images/logo.png"
          alt="WedPlan Logo"
          fill
          sizes="40px"
          className="object-contain"
          priority
        />
      </div>
      <span className="font-serif text-2xl font-bold tracking-tight text-stone-900">
        Wed <span className="text-[#844353]">Plan</span>
      </span>
    </Link>
  );
}
