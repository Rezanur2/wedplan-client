import React from "react";
import { CheckCircle2 } from "lucide-react";

interface PasswordRulesProps {
  hasMinLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasError?: boolean;
}

export default function PasswordRules({
  hasMinLength,
  hasUppercase,
  hasLowercase,
  hasError,
}: PasswordRulesProps) {
  return (
    <div
      className={`mt-2 rounded-xl border p-2.5 transition-colors ${
        hasError
          ? "border-rose-200 bg-rose-50/30"
          : "border-stone-200/80 bg-stone-50/50"
      }`}
    >
      <span className="text-[10px] font-bold tracking-wider text-stone-500 uppercase">
        Password Rules
      </span>
      <div className="mt-1.5 grid grid-cols-3 gap-1.5 text-[11px]">
        <div
          className={`flex items-center gap-1.5 ${
            hasMinLength ? "text-emerald-700 font-medium" : "text-stone-400"
          }`}
        >
          <CheckCircle2 className="h-3 w-3 shrink-0" />
          <span className="truncate">Min 6 Characters</span>
        </div>
        <div
          className={`flex items-center gap-1.5 ${
            hasUppercase ? "text-emerald-700 font-medium" : "text-stone-400"
          }`}
        >
          <CheckCircle2 className="h-3 w-3 shrink-0" />
          <span className="truncate">1 Uppercase</span>
        </div>
        <div
          className={`flex items-center gap-1.5 ${
            hasLowercase ? "text-emerald-700 font-medium" : "text-stone-400"
          }`}
        >
          <CheckCircle2 className="h-3 w-3 shrink-0" />
          <span className="truncate">1 Lowercase</span>
        </div>
      </div>
    </div>
  );
}
