"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { services } from "@/data/services";
import { motion } from "framer-motion";
import { Plus, Minus, Mail, Phone, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

// Social Icons
const Email = ({ size = 20 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3 7l9 6 9-6" />
  </svg>
);
const Linkedin = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
);
const Instagram = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
);

// Mobile Accordion
function FooterAccordion({ title, children }: { title: string; children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full border-b border-slate-200 dark:border-slate-800/80 md:border-none">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex py-3.5 xs:py-4 min-h-[44px] w-full items-center justify-between md:justify-start lg:w-full md:cursor-default md:pointer-events-none group md:py-0 md:mb-5"
        aria-expanded={isOpen}
      >
        <h3 className="w-full text-left font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
          {title}
        </h3>
        <span className="md:hidden text-slate-400 dark:text-slate-500 group-hover:text-primary-500 transition-colors shrink-0 ml-2">
          {isOpen ? <Minus size={15} /> : <Plus size={15} />}
        </span>
      </button>

      <div
        className={cn(
          "grid transition-all duration-300 ease-in-out md:grid-rows-[1fr] md:opacity-100",
          isOpen ? "grid-rows-[1fr] opacity-100 pb-4 md:pb-0" : "grid-rows-[0fr] opacity-0 pb-0"
        )}
      >
        <div className="overflow-hidden">{children}</div>
      </div>
    </div>
  );
}

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();

  const handleSamePageScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (pathname === href) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="relative bg-white dark:bg-[#050b14] pt-16 pb-0 border-t border-slate-200 dark:border-slate-800 overflow-hidden">

      {/* ── Mesh Orbs (Brand Green & Amber) ── */}
      <div
        className="absolute -top-1/4 left-[-8%] w-[45%] h-[70%] rounded-full pointer-events-none animate-[pulse_10s_ease-in-out_infinite] will-change-opacity transform-gpu"
        style={{ background: "radial-gradient(circle, rgba(104,185,85,0.06) 0%, transparent 70%)" }}
      />
      <div
        className="absolute -bottom-1/4 right-[-5%] w-[40%] h-[60%] rounded-full pointer-events-none animate-[pulse_13s_ease-in-out_infinite_reverse] will-change-opacity transform-gpu"
        style={{ background: "radial-gradient(circle, rgba(251,175,53,0.05) 0%, transparent 70%)" }}
      />

      {/* ── Scrolling Marquee Background ── */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden pointer-events-none opacity-40 select-none z-0">
        <motion.div
          animate={{ x: [0, "-50%"] }}
          transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
          className="flex w-max whitespace-nowrap"
        >
          {[...Array(4)].map((_, i) => (
            <span
              key={i}
              className="text-[35vw] md:text-[45vw] font-bold leading-[0.75] tracking-tighter text-slate-900/[0.025] dark:text-white/[0.025] pr-16 md:pr-32"
              style={{ fontFamily: "'Google Sans Flex', sans-serif" }}
            >
              NEARGROW
            </span>
          ))}
        </motion.div>
      </div>

      <div className="container mx-auto px-3 xs:px-4 md:px-8 relative z-10 max-w-7xl">

        {/* ── Main Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-8 lg:gap-10 items-start mb-4 md:mb-8">

          {/* Column 1: Brand */}
          <div className="flex flex-col gap-5 mb-8 md:mb-0 border-b border-slate-200 dark:border-slate-800 pb-6 md:border-none md:pb-0">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2.5 sm:gap-3 group cursor-pointer shrink-0"
              onClick={(e) => handleSamePageScroll(e, "/")}
            >
              <Image
                src="/icon.png"
                alt="NearGrow Ads"
                width={40}
                height={40}
                className="h-9 w-9 md:h-10 md:w-10 object-contain transition-transform duration-300 group-hover:scale-105"
              />
              <div className="flex items-center leading-none">
                <span className="font-hero font-bold tracking-[0.03em] text-xl md:text-2xl text-slate-900 dark:text-white transition-colors whitespace-nowrap">
                  NEAR<span className="text-[#68B955]">GROW</span> <span className="text-[#FBAF35] ml-1">ADS</span>
                </span>
              </div>
            </Link>

            {/* Brand description — Clean sentence case, high readability */}
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm font-normal">
              Dedicated local business growth agency helping nearby retail shops, clinics, restaurants, and service providers scale through <strong className="font-semibold text-slate-900 dark:text-white">Google Maps visibility</strong>, <strong className="font-semibold text-slate-900 dark:text-white">targeted local advertising</strong>, and high-converting creative execution.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-2.5">
              {[
                { href: "mailto:info@neargrowads.in", icon: <Email size={17} />, label: "Email" },
                { 
                  href: "https://wa.me/919289810149?text=Hello%20NearGrow%20Ads!%20I%20would%20like%20to%20inquire%20about%20your%20digital%20marketing%20services.", 
                  icon: (
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.705 1.754zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l.999 1.594-1.066 3.896 3.99-1.045 1.82 1.222zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                    </svg>
                  ), 
                  label: "WhatsApp" 
                },
                { href: "https://linkedin.com/company/neargrow-ads/", icon: <Linkedin size={17} />, label: "LinkedIn" },
                { href: "https://instagram.com/neargrowads", icon: <Instagram size={17} />, label: "Instagram" },
              ].map(({ href, icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-full flex items-center justify-center border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-[#68B955] dark:hover:border-[#68B955] hover:text-[#68B955] dark:hover:text-[#68B955] hover:bg-slate-50 dark:hover:bg-slate-900 transition-all duration-300"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Company */}
          <div className="border-t border-slate-200 dark:border-slate-800/80 md:border-none mt-4 md:mt-0">
            <FooterAccordion title="Company">
              <nav aria-label="Company Navigation">
                <ul className="flex flex-col gap-2.5 text-sm lg:pr-4">
                  {[
                    { href: "/about", label: "About Us" },
                    { href: "/services", label: "Our Services" },
                    { href: "/methodology", label: "Methodology" },
                    { href: "/blog", label: "Blog" },
                    { href: "/contact", label: "Contact" },
                  ].map(({ href, label }) => (
                    <li key={href}>
                      <Link
                        href={href}
                        onClick={(e) => handleSamePageScroll(e, href)}
                        className="font-medium text-slate-600 dark:text-slate-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors duration-200 flex items-center gap-1.5 group"
                      >
                        <span className="w-0 group-hover:w-1.5 h-0.5 bg-primary-500 transition-all duration-300 rounded-full" />
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </FooterAccordion>
          </div>

          {/* Column 3: Services */}
          <FooterAccordion title="Services">
            <nav aria-label="Services Navigation">
              <ul className="flex flex-col gap-2.5 text-sm">
                {services.map((service) => {
                  const serviceHref = `/services/${service.slug}`;
                  return (
                    <li key={service.id}>
                      <Link
                        href={serviceHref}
                        onClick={(e) => handleSamePageScroll(e, serviceHref)}
                        className="font-medium text-slate-600 dark:text-slate-400 hover:text-secondary-500 dark:hover:text-secondary-400 transition-colors duration-200 flex items-center gap-1.5 group"
                      >
                        <span className="w-0 group-hover:w-1.5 h-0.5 bg-secondary-500 transition-all duration-300 rounded-full" />
                        {service.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </FooterAccordion>

          {/* Column 4: Contact */}
          <FooterAccordion title="Contact Info">
            <ul className="flex flex-col gap-4 text-sm pt-1">
              <li>
                <a
                  href="tel:+919289810149"
                  className="flex items-center gap-3 text-slate-700 dark:text-slate-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors group font-medium"
                >
                  <Phone size={18} className="text-primary-500 dark:text-primary-400 shrink-0 group-hover:scale-110 transition-transform" />
                  <span>+91 92898 10149</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@neargrowads.in"
                  className="flex items-center gap-3 text-slate-700 dark:text-slate-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors group font-medium"
                >
                  <Mail size={18} className="text-primary-500 dark:text-primary-400 shrink-0 group-hover:scale-110 transition-transform" />
                  <span>info@neargrowads.in</span>
                </a>
              </li>
              <li className="pt-1">
                <a 
                  href="https://www.google.com/maps/search/?api=1&query=Pillar+no.+781,+B-1,+Bhagwati+Garden+Rd,+near+dwarka+mor,+Uttam+Nagar,+Bhagwati+Garden,+Nawada,+New+Delhi,+Delhi+110059" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-slate-700 dark:text-slate-300 hover:text-secondary-500 dark:hover:text-secondary-400 transition-colors leading-relaxed group font-medium text-xs sm:text-sm"
                >
                  <MapPin size={18} className="text-secondary-500 dark:text-secondary-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                  <span>
                    Pillar no. 781, B-1, Bhagwati Garden Rd,<br />
                    near dwarka mor, Uttam Nagar,<br />
                    Bhagwati Garden, Nawada,<br />
                    New Delhi, Delhi, 110059
                  </span>
                </a>
              </li>
            </ul>
          </FooterAccordion>

        </div>

        {/* ── Bottom Bar ── */}
        <div className="border-t border-slate-200 dark:border-slate-800 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Copyright */}
          <p className="font-medium text-xs text-slate-500 dark:text-slate-400 text-center md:text-left order-2 md:order-1 leading-relaxed">
            <strong className="block md:inline font-semibold text-slate-800 dark:text-slate-200">
              © {currentYear} NearGrow Ads.
            </strong>
            <span className="hidden md:inline mx-2 text-slate-300 dark:text-slate-700">·</span>
            <span className="block text-slate-500 dark:text-slate-400 mt-1 md:mt-0 md:inline">
              All rights reserved. Grow Local. Grow Smart.
            </span>
          </p>

          {/* Legal links */}
          <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-2 xs:gap-x-5 order-1 md:order-2">
            <Link
              href="/privacy"
              onClick={(e) => handleSamePageScroll(e, "/privacy")}
              className="text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
            >
              Privacy Policy
            </Link>
            <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
            <Link
              href="/terms-and-conditions"
              onClick={(e) => handleSamePageScroll(e, "/terms-and-conditions")}
              className="text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-secondary-500 dark:hover:text-secondary-400 transition-colors"
            >
              Terms of Service
            </Link>
            <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
            <Link
              href="/sitemap"
              onClick={(e) => handleSamePageScroll(e, "/sitemap")}
              className="text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
            >
              Sitemap
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
