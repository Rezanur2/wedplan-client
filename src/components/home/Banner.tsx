"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useSession } from "@/lib/auth-client";
import {
  ArrowUpRight,
  Search,
  MapPin,
  Award,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Banner() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const discipline = (formData.get("discipline") as string) || "";
    const destination = ((formData.get("destination") as string) || "").trim();
    const keyword = ((formData.get("search") as string) || "").trim();

    const params = new URLSearchParams();
    if (discipline && discipline !== "All Specialties") {
      params.set("category", discipline);
    }
    if (destination) {
      params.set("location", destination);
    }
    if (keyword) {
      params.set("search", keyword);
    }

    const queryString = params.toString();
    router.push(queryString ? `/services?${queryString}` : "/services");
  };
   
  return (
    <section className="relative flex min-h-160 lg:min-h-180 w-full items-center justify-center overflow-hidden bg-stone-950 px-4 py-16 sm:px-6 lg:px-8">
      {/* Background Wedding Image */}
      <Image
        src="/images/heroImage.png"
        alt="Romantic Wedding Villa at Sunset"
        fill
        priority
        className="object-cover object-center"
      />

      {/* Dark Vignette Overlay */}
      <div className="absolute inset-0 bg-linear-to-b from-black/75 via-black/60 to-[#180E13]/90" />

      {/* Content Container */}
      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center text-center">
        {/* Edition Badge */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium tracking-widest text-white/90 uppercase backdrop-blur-md"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#844353]" />
          The Atelier Autumn / Spring 2026 Edition
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-serif text-4xl font-normal tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
        >
          Your Perfect Wedding Starts Here
        </motion.h1>

        {/* Subtitle Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-5 max-w-2xl text-sm font-light leading-relaxed text-white/80 sm:text-base md:text-lg"
        >
          Discover trusted wedding professionals, explore beautiful services,
          and bring your dream celebration to life with quiet elegance and
          timeless artistry.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3.5"
        >
          <Link
            href="/services"
            className="inline-flex items-center gap-2 rounded-lg bg-[#844353] px-6 py-3 text-sm font-medium text-white shadow-lg shadow-black/25 transition-all hover:bg-[#723645] hover:gap-2.5"
          >
            Explore Wedding Services
            <ArrowUpRight className="h-4 w-4" />
          </Link>

          {!isPending && !session?.user && (
            <Link
              href="/signup?role=vendor"
              className="inline-flex items-center rounded-lg border border-white/20 bg-white/10 px-6 py-3 text-sm font-medium text-white backdrop-blur-xs transition-all hover:bg-white/20"
            >
              Join as a Vendor
            </Link>
          )}
        </motion.div>

        {/* Filter and Search Bar */}
        <motion.form
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          onSubmit={handleSearch}
          className="mt-12 w-full max-w-4xl rounded-2xl border border-stone-200/60 bg-[#FAF6F7]/95 p-3 shadow-2xl backdrop-blur-md sm:p-4 font-sans"
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {/* Discipline Dropdown */}
            <div className="flex flex-col rounded-xl border border-stone-200/80 bg-white/90 p-2.5 text-left shadow-xs transition-all hover:bg-white focus-within:border-[#844353]/40 focus-within:bg-white">
              <span className="text-[10px] font-sans font-bold tracking-wider text-stone-500 uppercase">
                Discipline
              </span>
              <div className="mt-1 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-[#844353] shrink-0" />
                <Select name="discipline" defaultValue="All Specialties">
                  <SelectTrigger className="h-auto w-full border-0 bg-transparent p-0 font-sans text-xs font-medium text-stone-800 shadow-none hover:bg-transparent focus-visible:border-0 focus-visible:ring-0">
                    <SelectValue placeholder="All Specialties" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border border-stone-200 bg-white p-1 shadow-xl font-sans">
                    <SelectItem
                      value="All Specialties"
                      className="rounded-lg text-xs cursor-pointer hover:bg-[#FAF6F7] hover:text-[#844353]"
                    >
                      All Specialties
                    </SelectItem>
                    <SelectItem
                      value="Wedding Venues"
                      className="rounded-lg text-xs cursor-pointer hover:bg-[#FAF6F7] hover:text-[#844353]"
                    >
                      Wedding Venues
                    </SelectItem>
                    <SelectItem
                      value="Photography & Videography"
                      className="rounded-lg text-xs cursor-pointer hover:bg-[#FAF6F7] hover:text-[#844353]"
                    >
                      Photography & Videography
                    </SelectItem>
                    <SelectItem
                      value="Decoration & Florist"
                      className="rounded-lg text-xs cursor-pointer hover:bg-[#FAF6F7] hover:text-[#844353]"
                    >
                      Decoration & Florist
                    </SelectItem>
                    <SelectItem
                      value="Catering Services"
                      className="rounded-lg text-xs cursor-pointer hover:bg-[#FAF6F7] hover:text-[#844353]"
                    >
                      Catering Services
                    </SelectItem>
                    <SelectItem
                      value="Makeup & Styling"
                      className="rounded-lg text-xs cursor-pointer hover:bg-[#FAF6F7] hover:text-[#844353]"
                    >
                      Makeup & Styling
                    </SelectItem>
                    <SelectItem
                      value="Wedding Fashion"
                      className="rounded-lg text-xs cursor-pointer hover:bg-[#FAF6F7] hover:text-[#844353]"
                    >
                      Wedding Fashion
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Destination Input */}
            <div className="flex flex-col rounded-xl border border-stone-200/80 bg-white/90 p-2.5 text-left shadow-xs transition-all hover:bg-white focus-within:border-[#844353]/40 focus-within:bg-white">
              <label
                htmlFor="hero-destination"
                className="text-[10px] font-sans font-bold tracking-wider text-stone-500 uppercase"
              >
                Destination
              </label>
              <div className="mt-1 flex items-center gap-1.5 text-xs text-stone-800">
                <MapPin className="h-3.5 w-3.5 text-[#844353] shrink-0" />
                <input
                  id="hero-destination"
                  name="destination"
                  type="text"
                  placeholder="Provence, Napa, Lake Como..."
                  className="w-full bg-transparent text-xs text-stone-800 placeholder:text-stone-400 outline-none"
                />
              </div>
            </div>

            {/* Service Keyword Input */}
            <div className="flex flex-col rounded-xl border border-stone-200/80 bg-white/90 p-2.5 text-left shadow-xs transition-all hover:bg-white focus-within:border-[#844353]/40 focus-within:bg-white">
              <label
                htmlFor="hero-keyword"
                className="text-[10px] font-sans font-bold tracking-wider text-stone-500 uppercase"
              >
                Keyword
              </label>
              <div className="mt-1 flex items-center gap-1.5 text-xs text-stone-800">
                <Search className="h-3.5 w-3.5 text-[#844353] shrink-0" />
                <input
                  id="hero-keyword"
                  name="search"
                  type="text"
                  placeholder="Photographer, Venue, Florist..."
                  className="w-full bg-transparent text-xs text-stone-800 placeholder:text-stone-400 outline-none"
                />
              </div>
            </div>

            {/* Search Button */}
            <button
              type="submit"
              className="flex items-center justify-center gap-2 rounded-xl bg-stone-900 px-5 py-3 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-stone-800 active:scale-[0.98] cursor-pointer"
            >
              <Search className="h-4 w-4" />
              Find Artisans
            </button>
          </div>
        </motion.form>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-white/80"
        >
          <div className="flex items-center gap-1.5">
            <Award className="h-4 w-4 text-[#E5B582]" />
            <span>250+ Hand-Curated Partners</span>
          </div>
          <span className="hidden text-white/30 sm:inline">•</span>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-[#E5B582]" />
            <span>Zero Booking Markups</span>
          </div>
          <span className="hidden text-white/30 sm:inline">•</span>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-[#E5B582]" />
            <span>Verified Wedding Services</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
