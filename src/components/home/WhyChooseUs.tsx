"use client";

import React from "react";
import { ShieldCheck, CheckCircle2, CalendarCheck, Lock, Award } from "lucide-react";
import { motion } from "framer-motion";

interface BenefitItem {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const BENEFITS: BenefitItem[] = [
  {
    title: "Handpicked & Verified Artisans",
    description: "Every purveyor is vetted for authentic portfolios, professional excellence, and verifiable client satisfaction.",
    icon: ShieldCheck,
  },
  {
    title: "Transparent & Upfront Pricing",
    description: "Zero unexpected markups or hidden commission fees. Review clear per-event or hourly rates upfront.",
    icon: CheckCircle2,
  },
  {
    title: "Seamless Booking Coordination",
    description: "Check vendor availability, select your wedding date, submit custom details, and track your reservation status.",
    icon: CalendarCheck,
  },
  {
    title: "Secure Payments & Peace of Mind",
    description: "Built-in Stripe checkout, verified transaction receipts, and role-based data privacy for couples and vendors.",
    icon: Lock,
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-16 sm:py-24 border-b border-[#EFE5E9]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto space-y-2.5"
        >
          <div className="inline-flex items-center gap-1.5 rounded-full border border-rose-200/80 bg-rose-50/70 px-3 py-1 text-[11px] font-bold tracking-wider text-[#844353] uppercase shadow-2xs">
            <Award className="h-3.5 w-3.5 text-[#844353]" />
            <span>The Atelier Standard</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-stone-900">
            Why Choose WedPlan?
          </h2>

          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Crafted for discerning couples and premier wedding purveyors to ensure an authentic, effortless planning journey.
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((benefitItem, benefitIndex) => {
            const IconComponent = benefitItem.icon;

            return (
              <motion.div
                key={benefitItem.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: benefitIndex * 0.08 }}
                className="flex flex-col justify-between rounded-2xl border border-stone-200/80 bg-white p-6 shadow-2xs transition-all duration-300 hover:border-[#844353]/30 hover:shadow-md"
              >
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-[#844353]">
                    <IconComponent className="h-5 w-5" />
                  </div>

                  <h3 className="mt-5 font-serif text-base font-bold text-stone-900">
                    {benefitItem.title}
                  </h3>

                  <p className="mt-2 text-xs leading-relaxed text-stone-500">
                    {benefitItem.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
