"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import MobileMenu from "./MobileMenu";
import { ThemeToggle } from "./ThemeToggle";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Methodology", href: "/methodology" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { scrollY } = useScroll();

  // Smart Scroll Engine
  useMotionValueEvent(scrollY, "change", (latest) => {
    const shouldScrolled = latest > 20;
    if (shouldScrolled !== isScrolled) {
      setIsScrolled(shouldScrolled);
    }
  });

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Handle body scroll lock and toggle mobile-menu-active class
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
      document.body.classList.add("mobile-menu-active");
    } else {
      document.body.style.overflow = "";
      document.body.classList.remove("mobile-menu-active");
    }
    return () => {
      document.body.style.overflow = "";
      document.body.classList.remove("mobile-menu-active");
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* ── Classic Full-Width Top Navbar (Fixed, Seamless, Clean) ── */}
      <header
        className={cn(
          "fixed top-0 left-0 right-0 w-full z-[1001] transition-all duration-300",
          isScrolled || isMobileMenuOpen
            ? "bg-white/95 dark:bg-[#050b14]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-white/10 shadow-sm py-3.5"
            : "bg-white/80 dark:bg-[#050b14]/80 backdrop-blur-sm border-b border-slate-100 dark:border-white/5 py-4 sm:py-5"
        )}
      >
        <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* 1. Left Brand Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-1.5 xs:gap-2.5 sm:gap-3 group cursor-pointer shrink-0"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <Image
              src="/android-chrome-192x192.png"
              alt="NearGrow Ads"
              width={38}
              height={38}
              priority
              className="w-7 h-7 xs:w-8 xs:h-8 sm:w-9 sm:h-9 object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <div className="flex items-center text-base xs:text-lg sm:text-xl font-hero font-bold tracking-tight">
              <span className="text-slate-900 dark:text-white">Near</span>
              <span className="text-[#68B955]">Grow</span>
              <span className="text-[#FBAF35] ml-0.5">Ads</span>
            </div>
          </Link>

          {/* 2. Center/Right Desktop Navigation Links (Classic Clean Text Links) */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navLinks.map((link) => {
              const isActive = link.href === "/" 
                ? pathname === "/" 
                : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "text-sm font-medium transition-colors duration-200 relative py-1",
                    isActive 
                      ? "text-[#68B955] dark:text-[#68B955] font-semibold" 
                      : "text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white"
                  )}
                >
                  <span>{link.name}</span>
                  {isActive && (
                    <motion.div 
                      layoutId="classic-nav-active"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#68B955] rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* 3. Right Action Area (ThemeToggle + Solid Green Pill Button + Mobile Hamburger) */}
          <div className="flex items-center gap-1.5 xs:gap-2.5 sm:gap-4 shrink-0">
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>

            {/* Classic Solid Green "Get Free Audit" Pill Button */}
            <button
              onClick={() => window.dispatchEvent(new Event("openLeadModal"))}
              className="inline-flex items-center justify-center px-2.5 xs:px-4 sm:px-6 py-1.5 xs:py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-white bg-[#00c371] hover:bg-[#00ad64] dark:bg-[#68B955] dark:hover:bg-[#58a647] rounded-full transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 cursor-pointer whitespace-nowrap"
              aria-label="Get Free Audit"
            >
              <span className="xs:hidden">Free Audit</span>
              <span className="hidden xs:inline">Get Free Audit</span>
            </button>

            {/* Mobile Navigation Toggle Button */}
            <button
              className="lg:hidden w-9 h-9 sm:w-10 sm:h-10 shrink-0 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:text-[#68B955] dark:hover:text-[#68B955] transition-colors rounded-lg cursor-pointer"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <MobileMenu
            navLinks={navLinks}
            pathname={pathname}
            onClose={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
