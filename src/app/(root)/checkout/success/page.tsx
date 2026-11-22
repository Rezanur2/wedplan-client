import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";
import { checkoutVerify } from "@/lib/actions/payments";
import {
  CheckCircle2,
  Crown,
  Sparkles,
  ArrowRight,
  PlusCircle,
  LayoutDashboard,
  ShieldCheck,
  Receipt,
} from "lucide-react";

export const metadata = {
  title: "Payment Successful | WedPlan Vendor Studio",
  description: "Congratulations on upgrading to WedPlan Lifetime Premium Vendor.",
};

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;

  if (!session_id) {
    return redirect("/");
  }

  const session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ["line_items", "payment_intent"],
  });

  if (session.status === "open") {
    return redirect("/");
  }

  // Verify and record transaction on Express backend
  if (session.status === "complete" && session.payment_status === "paid") {
    console.log(
      session.status,
      session.payment_status,
      session.customer_details,
      session.customer_email,
      session.metadata,
      session.payment_intent
    );

    try {
      const result = await checkoutVerify(session_id);
      console.log({ result });
    } catch (err) {
      console.error("Backend checkout verification error:", err);
    }
  }

  const today = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  // Extract Transaction ID from Stripe payment_intent
  const paymentIntent = session.payment_intent;
  const transactionId =
    typeof paymentIntent === "object" && paymentIntent !== null
      ? paymentIntent.id
      : typeof paymentIntent === "string"
      ? paymentIntent
      : session_id;

  return (
    <div className="min-h-[80vh] bg-[#FCFBF9] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-xl w-full space-y-6">
        {/* Main Success Card */}
        <div className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm text-center relative overflow-hidden">
          {/* Top Decorative Glow */}
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 bg-emerald-100/60 rounded-full blur-2xl pointer-events-none" />

          {/* Success Checkmark Icon */}
          <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-2xs">
            <CheckCircle2 className="h-9 w-9 stroke-[2.2]" />
            <div className="absolute -top-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 text-white shadow-2xs">
              <Crown className="h-3.5 w-3.5 fill-white" />
            </div>
          </div>

          {/* Title & Congratulations */}
          <div className="mt-5 space-y-1">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-0.5 text-[11px] font-semibold text-emerald-700">
              <ShieldCheck className="h-3 w-3" />
              Payment Verified
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 pt-1">
              Payment Successful!
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto">
              Congratulations! Your vendor account is now upgraded to{" "}
              <strong className="text-stone-800 font-semibold">
                WedPlan Lifetime Premium
              </strong>
              .
            </p>
          </div>

          {/* Order & Payment Summary Box */}
          <div className="mt-6 rounded-2xl bg-stone-50 border border-stone-200/80 p-4 sm:p-5 text-left space-y-3">
            <div className="flex items-center justify-between border-b border-stone-200/60 pb-2.5">
              <span className="text-xs font-semibold text-stone-700 flex items-center gap-1.5">
                <Receipt className="h-3.5 w-3.5 text-stone-500" />
                Receipt Summary
              </span>
              <span className="text-[11px] font-medium text-stone-500">
                {today}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-stone-500">Plan</span>
                <span className="font-semibold text-stone-900 flex items-center gap-1">
                  <Crown className="h-3 w-3 text-amber-500 fill-amber-500" />
                  Premium Vendor (Lifetime)
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-500">Customer</span>
                <span className="font-medium text-stone-800">
                  {session.customer_email || session.customer_details?.email || "Vendor"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-500">Amount Paid</span>
                <span className="font-bold text-stone-900 text-sm">$49.00 USD</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-500">Payment Status</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100/70 px-2 py-0.5 text-[10px] font-bold text-emerald-800 capitalize">
                  {session.payment_status || "Paid"}
                </span>
              </div>

              {/* Transaction ID */}
              <div className="border-t border-stone-200/60 pt-2.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-[11px]">
                <span className="text-stone-700 font-semibold flex items-center gap-1">
                  Transaction ID
                </span>
                <span className="font-mono text-[11px] font-bold bg-white border border-stone-300 rounded-md px-2 py-0.5 text-stone-900 select-all truncate max-w-xs">
                  {transactionId}
                </span>
              </div>

              {session_id && (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-[11px]">
                  <span className="text-stone-400">Checkout Session</span>
                  <span className="font-mono text-[10px] text-stone-500 truncate max-w-xs">
                    {session_id}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Unlocked Benefits */}
          <div className="mt-6 rounded-2xl border border-rose-100 bg-rose-50/40 p-4 text-left space-y-2">
            <p className="text-[11px] font-semibold text-[#844353] uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-amber-500" />
              Your Unlocked Premium Privileges:
            </p>
            <ul className="text-xs text-stone-600 space-y-1.5 pl-1">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#844353]" />
                <span><strong>Unlimited Service Listings:</strong> Publish more than 3 services anytime.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#844353]" />
                <span><strong>Premium Crown Badge:</strong> Displayed on all your service cards.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#844353]" />
                <span><strong>Priority Ranking:</strong> Featured ahead of basic listings in browse & search.</span>
              </li>
            </ul>
          </div>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
            <Link
              href="/dashboard/vendor"
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#844353] px-5 py-3 text-xs font-semibold text-white shadow-xs hover:bg-[#6e3745] transition-all"
            >
              <LayoutDashboard className="h-3.5 w-3.5" />
              <span>Go to Vendor Dashboard</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>

            <Link
              href="/dashboard/vendor/add-service"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl border border-stone-300 bg-white px-4 py-3 text-xs font-semibold text-stone-700 shadow-2xs hover:bg-stone-50 transition-colors whitespace-nowrap"
            >
              <PlusCircle className="h-3.5 w-3.5 text-stone-600" />
              <span>Publish New Service</span>
            </Link>
          </div>
        </div>

        {/* Bottom Help note */}
        <p className="text-center text-[11px] text-stone-400">
          A receipt has been recorded. Need help? Contact us anytime at support@wedplan.com.
        </p>
      </div>
    </div>
  );
}
