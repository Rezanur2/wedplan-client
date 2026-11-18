import React from "react";
import Link from "next/link";
import Image from "next/image";

interface StatItem {
  value: string;
  label: string;
}

interface AuthSidebarProps {
  imageSrc: string;
  edition: string;
  badge: string;
  quote: string;
  description: string;
  stats: StatItem[];
  footerLeft: string;
  footerRight: string;
}

export default function AuthSidebar({
  imageSrc,
  edition,
  badge,
  quote,
  description,
  stats,
  footerLeft,
  footerRight,
}: AuthSidebarProps) {
  return (
    <div className="relative hidden h-full min-h-[620px] flex-col justify-between overflow-hidden bg-stone-900 p-8 text-white lg:col-span-5 lg:flex lg:p-10">
      {/* Background Image Container */}
      <div className="absolute inset-0 pointer-events-none">
        <Image
          src={imageSrc}
          alt="Wedding Atelier"
          fill
          sizes="(max-width: 1024px) 100vw, 42vw"
          priority
          className="object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/95 via-stone-900/60 to-stone-900/80" />
      </div>

      {/* Top Branding */}
      <div className="relative z-10 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="relative h-9 w-9 overflow-hidden rounded-xl border border-white/20 bg-stone-800">
            <Image
              src="/images/logo.png"
              alt="WedPlan"
              fill
              sizes="36px"
              className="object-contain"
            />
          </div>
          <span className="font-serif text-lg font-bold tracking-tight text-white">
            WedPlan
          </span>
        </Link>
        <span className="text-[10px] font-semibold tracking-widest text-stone-400 uppercase">
          {edition}
        </span>
      </div>

      {/* Middle Quote */}
      <div className="relative z-10 flex flex-1 flex-col justify-center py-6">
        <span className="text-[10px] font-semibold tracking-[0.2em] text-[#E5B582] uppercase">
          {badge}
        </span>
        <blockquote className="mt-3 font-serif text-2xl font-normal leading-snug text-white italic sm:text-3xl">
          &ldquo;{quote}&rdquo;
        </blockquote>
        <p className="mt-4 text-xs font-light leading-relaxed text-stone-300">
          {description}
        </p>

        {/* Stats */}
        <div className={`mt-8 grid gap-4 border-t border-white/10 pt-6 ${stats.length === 3 ? "grid-cols-3 text-center" : "grid-cols-2"}`}>
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="font-serif text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-[9px] font-medium tracking-wider text-stone-400 uppercase">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Protocol */}
      <div className="relative z-10 flex items-center justify-between text-[10px] text-stone-400 uppercase tracking-widest">
        <span>{footerLeft}</span>
        <span>{footerRight}</span>
      </div>
    </div>
  );
}
