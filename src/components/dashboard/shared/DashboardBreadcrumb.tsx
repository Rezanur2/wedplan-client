import React from "react";

interface DashboardBreadcrumbProps {
  section: string;
  page: string;
  badge?: React.ReactNode;
}

export default function DashboardBreadcrumb({
  section,
  page,
  badge,
}: DashboardBreadcrumbProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-stone-400">
        {section} <span className="text-stone-300 mx-0.5 sm:mx-1">/</span> {page}
      </span>
      {badge}
    </div>
  );
}
