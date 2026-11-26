"use client";

import React, { useState, useMemo } from "react";
import { Search, X, CreditCard, Crown } from "lucide-react";
import { ITransaction } from "@/types";
import EmptyState from "@/components/dashboard/shared/EmptyState";

interface AdminTransactionsProps {
  initialTransactions?: ITransaction[];
}

export default function AdminTransactions({
  initialTransactions = [],
}: AdminTransactionsProps) {
  const [transactionList] = useState<ITransaction[]>(initialTransactions);
  const [searchQuery, setSearchQuery] = useState("");

  const getTransactionRef = (transactionItem: ITransaction) =>
    transactionItem.stripeSubscriptionId ||
    transactionItem.stripeSessionId ||
    transactionItem._id ||
    "";

  // Filter transactions by vendor email, plan, or transaction ID
  const filteredTransactions = useMemo(() => {
    return transactionList.filter((transactionItem) => {
      const cleanSearch = searchQuery.toLowerCase().trim();
      const vendorInfo = `${transactionItem.vendorName || ""} ${transactionItem.vendorEmail || ""}`.toLowerCase();
      const planName = (transactionItem.plan || "").toLowerCase();
      const transactionRef = getTransactionRef(transactionItem).toLowerCase();

      if (
        cleanSearch &&
        !`${vendorInfo} ${planName} ${transactionRef}`.includes(cleanSearch)
      ) {
        return false;
      }
      return true;
    });
  }, [transactionList, searchQuery]);

  // Date formatting helper to eliminate duplicate logic
  const formatTransactionDate = (dateValue?: string | Date) => {
    if (!dateValue) return "N/A";
    return new Date(dateValue).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Reusable vendor identity renderer
  const renderVendorIdentity = (transactionItem: ITransaction) => {
    const displayLabel =
      transactionItem.vendorEmail || transactionItem.vendorName || "Vendor Account";
    const initial = displayLabel.slice(0, 1).toUpperCase();
    const transactionRef = getTransactionRef(transactionItem);

    return (
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-50 border border-rose-100 font-semibold text-xs text-[#844353]">
          {initial}
        </div>
        <div className="min-w-0">
          <p className="font-medium text-stone-900 truncate">{displayLabel}</p>
          {transactionRef && (
            <p className="font-mono text-[10px] text-stone-400 truncate" title={transactionRef}>
              TX: {transactionRef}
            </p>
          )}
        </div>
      </div>
    );
  };

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

      {/* 2. Transactions Content or Empty State */}
      {transactionList.length === 0 ? (
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
              placeholder="Search vendor email, plan, or TX ID..."
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
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-medium text-amber-800 border border-amber-200">
                          <Crown className="h-3 w-3 text-amber-600" />
                          <span>{transactionItem.plan || "Premium Vendor"}</span>
                        </span>
                      </td>

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
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-800 border border-amber-200">
                      <Crown className="h-3 w-3 text-amber-600" />
                      <span>{transactionItem.plan || "Premium Vendor"}</span>
                    </span>

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
