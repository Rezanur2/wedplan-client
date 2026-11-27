"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Search, X, CreditCard, Crown, DollarSign } from "lucide-react";
import { ITransaction } from "@/types";
import { getPaidRevenueSummary } from "@/lib/utils";
import EmptyState from "@/components/dashboard/shared/EmptyState";

interface AdminTransactionsProps {
  initialTransactions?: ITransaction[];
}

export default function AdminTransactions({
  initialTransactions = [],
}: AdminTransactionsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { totalRevenue, paidCount } = getPaidRevenueSummary(initialTransactions);

  const getTransactionRef = (transactionItem: ITransaction) =>
    transactionItem.stripeSubscriptionId ||
    transactionItem.stripeSessionId ||
    transactionItem._id ||
    "";

  // Date formatting helper to eliminate duplicate logic
  const formatTransactionDate = (dateValue?: string | Date) => {
    if (!dateValue) return "N/A";
    return new Date(dateValue).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Filter transactions by vendor, email, plan, status, amount, date, or any transaction ID
  const filteredTransactions = initialTransactions.filter((transactionItem) => {
    const cleanSearch = searchQuery.toLowerCase().trim();
    if (!cleanSearch) return true;

    const normalizedSearch = cleanSearch.replace(/^tx:\s*/i, "");
    const formattedDate = formatTransactionDate(transactionItem.createdAt);
    const amountText = `$${Number(transactionItem.amount || 0).toFixed(2)}`;
    const searchableText = [
      transactionItem.vendorName,
      transactionItem.vendorEmail,
      transactionItem.plan,
      transactionItem.status,
      transactionItem.currency,
      amountText,
      String(transactionItem.amount ?? ""),
      formattedDate,
      transactionItem.stripeSubscriptionId,
      transactionItem.stripeSessionId,
      transactionItem._id,
      transactionItem.id,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return (
      searchableText.includes(cleanSearch) ||
      (normalizedSearch.length > 0 && searchableText.includes(normalizedSearch))
    );
  });

  // Reusable vendor identity renderer
  const renderVendorIdentity = (transactionItem: ITransaction) => {
    const primaryName =
      transactionItem.vendorName || transactionItem.vendorEmail || "Vendor Account";
    const vendorEmail = transactionItem.vendorEmail || "";
    const initial = primaryName.slice(0, 1).toUpperCase();
    const transactionRef = getTransactionRef(transactionItem);

    return (
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-rose-50 border border-rose-100 font-semibold text-xs text-[#844353]">
          {transactionItem.vendorImage ? (
            <Image
              src={transactionItem.vendorImage}
              alt={primaryName}
              fill
              sizes="32px"
              className="object-cover"
            />
          ) : (
            initial
          )}
        </div>
        <div className="min-w-0">
          <p className="font-medium text-stone-900 truncate">{primaryName}</p>
          {vendorEmail && vendorEmail !== primaryName && (
            <p className="text-[11px] text-stone-500 truncate">{vendorEmail}</p>
          )}
          {transactionRef && (
            <p className="font-mono text-[10px] text-stone-400 truncate" title={transactionRef}>
              TX: {transactionRef}
            </p>
          )}
        </div>
      </div>
    );
  };

  // Reusable subscription plan badge helper
  const renderPlanBadge = (transactionItem: ITransaction, compact = false) => (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-amber-50 font-medium text-amber-800 border border-amber-200 capitalize ${
        compact ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-0.5 text-[11px]"
      }`}
    >
      <Crown className="h-3 w-3 text-amber-600" />
      <span>{transactionItem.plan || "Premium Vendor"}</span>
    </span>
  );

  // Payment status badge helper
  const renderStatusBadge = (transactionItem: ITransaction) => {
    const status = (transactionItem.status || "").toLowerCase();

    if (status === "paid" || status === "complete") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 border border-emerald-200">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span>Paid</span>
        </span>
      );
    }

    if (status === "failed") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-[11px] font-semibold text-rose-700 border border-rose-200">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
          <span>Failed</span>
        </span>
      );
    }

    if (status === "cancelled" || status === "canceled") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-[11px] font-semibold text-rose-700 border border-rose-200">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
          <span>Cancelled</span>
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700 border border-amber-200">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
        <span>Pending</span>
      </span>
    );
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200/80 bg-rose-50/80 px-2.5 py-0.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#844353] whitespace-nowrap shrink-0 shadow-2xs">
              <span className="h-1.5 w-1.5 rounded-full bg-[#844353]" />
              Admin Center • Financial Ledger
            </span>
          </div>
          <h1 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-stone-900 tracking-tight pt-0.5">
            Platform Transactions
          </h1>
          <p className="mt-0.5 text-xs sm:text-sm text-stone-500">
            View and monitor all vendor subscription payments.
          </p>
        </div>

        {/* Total Paid Revenue Card */}
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-200/80 bg-white px-4 py-3 shadow-2xs self-start sm:self-auto">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
            <DollarSign className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-stone-500">Total Revenue</p>
            <p className="font-serif text-lg sm:text-xl font-bold text-stone-900 leading-tight">
              ${totalRevenue.toFixed(2)}{" "}
              <span className="font-sans text-[11px] font-normal text-stone-400">USD</span>
            </p>
            <p className="text-[10px] font-medium text-emerald-700">
              {paidCount} paid {paidCount === 1 ? "payment" : "payments"}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Transactions Content or Empty State */}
      {initialTransactions.length === 0 ? (
        <EmptyState
          icon={CreditCard}
          title="No Transactions Recorded"
          description="There are currently no subscription payments recorded in the platform ledger."
        />
      ) : (
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(changeEvent) => setSearchQuery(changeEvent.target.value)}
              placeholder="Search vendor, email, plan, status, or TX ID..."
              className="w-full rounded-xl border border-stone-200 bg-white pl-9 pr-8 py-2 text-xs text-stone-900 placeholder:text-stone-400 focus:border-[#844353] focus:outline-none focus:ring-1 focus:ring-[#844353] transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* 3. Desktop Table (Shows: Vendor Info, Plan, Amount, Status, Date) */}
          <div className="hidden md:block overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-2xs">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50/70 text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                  <th className="py-3.5 px-4">Vendor Information</th>
                  <th className="py-3.5 px-4">Subscription Plan</th>
                  <th className="py-3.5 px-4">Payment Amount</th>
                  <th className="py-3.5 px-4">Payment Status</th>
                  <th className="py-3.5 px-4 text-right">Transaction Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {filteredTransactions.map((transactionItem) => {
                  const transactionId = transactionItem._id || transactionItem.id || "";
                  const formattedDate = formatTransactionDate(transactionItem.createdAt);

                  return (
                    <tr key={transactionId} className="hover:bg-stone-50/60 transition">
                      {/* Vendor Info */}
                      <td className="py-3.5 px-4">{renderVendorIdentity(transactionItem)}</td>

                      {/* Subscription Plan */}
                      <td className="py-3.5 px-4">{renderPlanBadge(transactionItem)}</td>

                      {/* Payment Amount */}
                      <td className="py-3.5 px-4 font-semibold text-stone-900">
                        ${Number(transactionItem.amount || 0).toFixed(2)}{" "}
                        <span className="text-[10px] font-normal text-stone-500 uppercase">
                          {transactionItem.currency || "USD"}
                        </span>
                      </td>

                      {/* Payment Status */}
                      <td className="py-3.5 px-4">{renderStatusBadge(transactionItem)}</td>

                      {/* Transaction Date */}
                      <td className="py-3.5 px-4 text-right text-stone-500">
                        {formattedDate}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* 4. Mobile Cards */}
          <div className="md:hidden space-y-3">
            {filteredTransactions.map((transactionItem) => {
              const transactionId = transactionItem._id || transactionItem.id || "";
              const formattedDate = formatTransactionDate(transactionItem.createdAt);

              return (
                <div
                  key={transactionId}
                  className="rounded-2xl border border-stone-200 bg-white p-4 shadow-2xs space-y-3 text-xs"
                >
                  <div className="flex items-center justify-between gap-2">
                    {renderVendorIdentity(transactionItem)}
                    {renderStatusBadge(transactionItem)}
                  </div>

                  <div className="flex items-center justify-between text-stone-600 border-t border-stone-100 pt-2.5">
                    {renderPlanBadge(transactionItem, true)}

                    <span className="font-semibold text-stone-900 text-sm">
                      ${Number(transactionItem.amount || 0).toFixed(2)}{" "}
                      <span className="text-[10px] font-normal text-stone-500 uppercase">
                        {transactionItem.currency || "USD"}
                      </span>
                    </span>
                  </div>

                  <div className="text-right text-stone-400 text-[11px] pt-1">
                    {formattedDate}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty State when search has no match */}
          {filteredTransactions.length === 0 && (
            <EmptyState
              title="No Matching Transactions"
              description={`No transactions found matching "${searchQuery}".`}
              actionLabel="Clear search"
              onAction={() => setSearchQuery("")}
            />
          )}
        </div>
      )}
    </div>
  );
}
