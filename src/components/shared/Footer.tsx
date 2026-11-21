import React from "react";
import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import Logo from "./Logo";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Browse Services", href: "/services" },
  { name: "Sign In", href: "/signin" },
  { name: "Create Account", href: "/signup" },
  { name: "Dashboard", href: "/dashboard/vendor" },
];

const categoryLinks = [
  {
    name: "Photography & Videography",
    href: "/services?category=Photography%20%26%20Videography",
  },
  { name: "Wedding Venues", href: "/services?category=Wedding%20Venues" },
  {
    name: "Decoration & Florist",
    href: "/services?category=Decoration%20%26%20Florist",
  },
  { name: "Catering Services", href: "/services?category=Catering%20Services" },
  {
    name: "Makeup & Styling",
    href: "/services?category=Makeup%20%26%20Styling",
  },
];

const socialPills = [
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/md-rezanur-rahman/",
    icon: (
      <svg className="h-3 w-3 fill-current" viewBox="0 0 24 24">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
      </svg>
    ),
  },
  {
    name: "GitHub",
    href: "https://github.com/Rezanur2",
    icon: (
      <svg className="h-3 w-3 fill-current" viewBox="0 0 24 24">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
        />
      </svg>
    ),
  },
  {
    name: "X (Twitter)",
    href: "https://x.com/rezanurrahman02",
    icon: (
      <svg className="h-3 w-3 fill-current" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[#EFE5E9] bg-[#FAF6F7] text-stone-600">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        {/* Main Grid: On small screens 2-col friendly, on md+ 12-column balanced grid */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-8 lg:gap-10">
          {/* Column 1: Brand Info (Takes 4 cols on md+) */}
          <div className="space-y-4 md:col-span-4">
            <Logo />
            <p className="max-w-sm text-xs leading-relaxed text-stone-600">
              An editorial planning atelier curated for discerning couples and
              premier wedding purveyors. Cultivating quiet luxury, architectural
              floral artistry, and unforgettable celebrations worldwide.
            </p>

            {/* Social Pills */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                Social Links
              </h3>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {socialPills.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3 py-1 text-[11px] font-medium text-stone-600 shadow-2xs hover:border-[#844353] hover:bg-rose-50/50 hover:text-[#844353] transition-all"
                  >
                    {social.icon}
                    <span>{social.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation & Categories: 2 Columns on mobile, directly unrolls into 12-col grid on md+ */}
          <div className="grid grid-cols-2 gap-6 sm:gap-8 md:contents">
            {/* Column 2: Navigation (Takes 2 cols on md+) */}
            <div className="md:col-span-2 md:pl-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                Navigation
              </h3>
              <ul className="mt-4 space-y-2.5 text-xs">
                {navLinks.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-stone-600 hover:text-[#844353] transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Categories (Takes 3 cols on md+) */}
            <div className="md:col-span-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                Categories
              </h3>
              <ul className="mt-4 space-y-2.5 text-xs">
                {categoryLinks.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-stone-600 hover:text-[#844353] transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Column 4: Contact Us (Takes 3 cols on md+) */}
          <div className="space-y-4 md:col-span-3 md:pl-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">
              Contact Us
            </h3>

            {/* Contact Information */}
            <div className="space-y-2.5 pt-1 text-xs text-stone-600">
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-[#844353] shrink-0" />
                <a
                  href="mailto:mdrezanurrahman2@gmail.com"
                  className="hover:text-[#844353] transition-colors truncate"
                >
                  mdrezanurrahman2@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-[#844353] shrink-0" />
                <a
                  href="tel:+8801551986848"
                  className="hover:text-[#844353] transition-colors"
                >
                  +8801551986848
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-[#844353] shrink-0" />
                <span>Uttara, Dhaka</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Sub-Footer: Copyright, Legal Links & Tagline */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[#EFE5E9] pt-6 text-xs text-stone-500 sm:flex-row">
          <div className="text-center sm:text-left">
            <span>
              © {currentYear} WedPlan Wedding Planning Platform. All rights
              reserved.
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
            <Link
              href="/privacy"
              className="hover:text-stone-900 transition-colors"
            >
              Privacy Policy
            </Link>
            <span className="text-stone-300">·</span>
            <Link
              href="/terms"
              className="hover:text-stone-900 transition-colors"
            >
              Terms of Service
            </Link>
            <span className="hidden lg:inline text-stone-300">·</span>
            <span className="hidden lg:inline italic font-serif text-[#844353]">
              Crafted for couples & verified wedding artisans worldwide.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
