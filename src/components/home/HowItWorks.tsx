"use client";

import React from "react";
import Link from "next/link";
import { Search, CalendarCheck, HeartHandshake, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useSession } from "@/lib/auth-client";

interface StepItem {
  number: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const STEPS: StepItem[] = [
  {
    number: "01",
    title: "Discover Curated Artisans",
    description: "Explore verified venues, photographers, florists, and stylists with transparent pricing and portfolios.",
    icon: Search,
  },
  {
    number: "02",
    title: "Request & Coordinate",
    description: "Select your event date, submit your booking inquiry, and coordinate custom details directly with the vendor.",
    icon: CalendarCheck,
  },
  {
    number: "03",
    title: "Celebrate Seamlessly",
    description: "Confirm your arrangements with peace of mind and bring your dream celebration to life with quiet elegance.",
    icon: HeartHandshake,
  },
];

export default function HowItWorks() {
  const { data: session, isPending } = useSession();

  return (
    <section className="py-16 sm:py-24 bg-white/60">
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
            <span className="h-1.5 w-1.5 rounded-full bg-[#844353]" />
            <span>Effortless Planning</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-stone-900">
            How WedPlan Works
          </h2>

          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            From discovering unique artisans to your wedding reception, our platform makes planning seamless and inspiring.
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
          {STEPS.map((stepItem, stepIndex) => {
            const IconComponent = stepItem.icon;

            return (
              <motion.div
                key={stepItem.number}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: stepIndex * 0.12 }}
                className="relative flex flex-col justify-between rounded-2xl border border-stone-200/80 bg-white p-7 shadow-2xs transition-all duration-300 hover:border-[#844353]/30 hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-[#844353]">
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <span className="font-serif text-3xl font-light text-stone-300">
                      {stepItem.number}
                    </span>
                  </div>

                  <h3 className="mt-6 font-serif text-lg font-bold text-stone-900">
                    {stepItem.title}
                  </h3>

                  <p className="mt-2 text-xs leading-relaxed text-stone-500">
                    {stepItem.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-stone-100 flex items-center text-[11px] font-semibold text-[#844353]">
                  <span>Step {stepItem.number} of 03</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16 rounded-3xl border border-[#EFE5E9] bg-linear-to-br from-rose-50/70 via-white to-amber-50/40 p-8 sm:p-10 text-center shadow-2xs"
        >
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            Ready to Begin Planning Your Celebration?
          </h3>
          <p className="mx-auto mt-2 max-w-xl text-xs sm:text-sm text-stone-600">
            Explore hundreds of verified wedding vendors and book your dates with total confidence.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3.5">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 rounded-xl bg-[#844353] px-6 py-3 text-xs sm:text-sm font-semibold text-white shadow-xs transition hover:bg-[#723645]"
            >
              <span>Explore Wedding Services</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            {!isPending && !session?.user && (
              <Link
                href="/signup?role=vendor"
                className="inline-flex items-center rounded-xl border border-stone-300 bg-white px-6 py-3 text-xs sm:text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
              >
                List Your Services
              </Link>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
