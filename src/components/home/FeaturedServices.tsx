"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, SearchX } from "lucide-react";
import { motion } from "framer-motion";
import { useSession } from "@/lib/auth-client";
import ServiceCard from "@/components/services/ServiceCard";
import { IVendorService } from "@/types";

interface FeaturedServicesProps {
  services: IVendorService[];
}

export default function FeaturedServices({ services }: FeaturedServicesProps) {
  const { data: session, isPending } = useSession();
  const featuredServicesList = services.slice(0, 6);

  return (
    <section className="py-16 sm:py-24 border-b border-[#EFE5E9]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-rose-200/80 bg-rose-50/70 px-3 py-1 text-[11px] font-bold tracking-wider text-[#844353] uppercase shadow-2xs">
              <Sparkles className="h-3.5 w-3.5 text-[#844353]" />
              <span>Curated Selection</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-stone-900">
              Featured Wedding Services
            </h2>

            <p className="max-w-2xl text-xs sm:text-sm text-stone-600 leading-relaxed">
              Explore handpicked and verified wedding professionals curated to elevate your special celebration.
            </p>
          </div>

          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#844353] hover:text-[#723645] transition-colors group self-start sm:self-end"
          >
            <span>View All Services</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>

        {/* Services Grid or Empty State */}
        {featuredServicesList.length === 0 ? (
          <div className="mt-12 flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-white p-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-[#844353]">
              <SearchX className="h-6 w-6" />
            </div>
            <h3 className="mt-4 font-serif text-lg font-bold text-stone-900">
              No Featured Services Yet
            </h3>
            <p className="mt-1 max-w-sm text-xs text-stone-500">
              Our curated wedding services are currently being updated. Visit the browse page or join as a wedding vendor to publish your services.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/services"
                className="rounded-xl bg-[#844353] px-5 py-2.5 text-xs font-semibold text-white shadow-2xs hover:bg-[#723645] transition-colors"
              >
                Browse All Services
              </Link>
              {!isPending && !session?.user && (
                <Link
                  href="/signup?role=vendor"
                  className="rounded-xl border border-stone-200 bg-white px-5 py-2.5 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors"
                >
                  Join as Vendor
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredServicesList.map((serviceItem, serviceIndex) => (
              <motion.div
                key={serviceItem._id || serviceItem.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: serviceIndex * 0.08 }}
              >
                <ServiceCard service={serviceItem} />
              </motion.div>
            ))}
          </div>
        )}

        {/* Bottom CTA for View All Services */}
        {services.length > 6 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-12 flex justify-center"
          >
            <Link
              href="/services"
              className="inline-flex items-center gap-2 rounded-xl border border-stone-300 bg-white px-6 py-3 text-xs font-semibold text-stone-800 shadow-2xs hover:border-[#844353] hover:text-[#844353] hover:bg-rose-50/30 transition-all"
            >
              <span>Explore All {services.length} Verified Services</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}
