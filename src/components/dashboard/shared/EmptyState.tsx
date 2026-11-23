import React from "react";
import Link from "next/link";
import { LucideIcon, Inbox, ArrowRight } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
}

export default function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`rounded-2xl border border-dashed border-stone-300 bg-white p-10 sm:p-12 text-center ${className}`}
    >
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-[#844353]">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mt-3 font-serif text-base font-bold text-stone-900">
        {title}
      </h3>
      <p className="mt-1 text-xs text-stone-500 max-w-sm mx-auto leading-relaxed">
        {description}
      </p>

      {actionLabel && actionHref && (
        <div className="mt-4">
          <Link
            href={actionHref}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#844353] hover:bg-[#6e3745] px-4 py-2 text-xs font-semibold text-white transition shadow-2xs cursor-pointer"
          >
            <span>{actionLabel}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}

      {actionLabel && onAction && !actionHref && (
        <div className="mt-4">
          <button
            type="button"
            onClick={onAction}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#844353] hover:bg-[#6e3745] px-4 py-2 text-xs font-semibold text-white transition shadow-2xs cursor-pointer"
          >
            <span>{actionLabel}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
