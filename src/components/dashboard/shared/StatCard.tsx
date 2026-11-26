import React from "react";
import Link from "next/link";
import { LucideIcon, ArrowRight } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  description?: string;
  href?: string;
  iconBgColor?: string;
  iconTextColor?: string;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  description,
  href,
  iconBgColor = "bg-rose-50",
  iconTextColor = "text-[#844353]",
}: StatCardProps) {
  const cardContent = (
    <div className="flex flex-col justify-between rounded-2xl border border-[#EFE5E9] bg-white p-5 shadow-2xs transition duration-200 hover:border-[#844353]/30 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-medium text-stone-500">{title}</p>
          <p className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            {value}
          </p>
        </div>
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconBgColor} ${iconTextColor}`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>

      {description && (
        <div className="mt-4 flex items-center justify-between border-t border-stone-100 pt-3">
          <span className="text-xs text-stone-500">{description}</span>
          {href && (
            <ArrowRight className="h-4 w-4 text-stone-400 transition-transform group-hover:translate-x-1 group-hover:text-[#844353]" />
          )}
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="group block">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}
