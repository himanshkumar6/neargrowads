"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { cn } from "@/lib/utils";

import { ThemeToggle } from "./ThemeToggle";

interface MobileMenuProps {
  navLinks: { name: string; href: string }[];
  pathname: string;
  onClose: () => void;
}

// Hardware-accelerated Apple cubic-bezier curves for silky 60/120 FPS open & close
const containerVariants: Variants = {
  hidden: { opacity: 0, scale: 0.98 },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.2,
      ease: [0.16, 1, 0.3, 1],
      staggerChildren: 0.03,
      delayChildren: 0.04,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    transition: {
      duration: 0.15,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] } 
  },
  exit: { 
    opacity: 0, 
    transition: { duration: 0.1, ease: "easeOut" } 
  },
};

export default function MobileMenu({ navLinks, pathname, onClose }: MobileMenuProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      exit="exit"
      // Senior Web Dev: High z-index, zero browser scrollbar clutter, and GPU hardware compositing
      className="fixed inset-0 z-[1000] bg-white dark:bg-[#050b14] pt-20 xs:pt-24 pb-8 xs:pb-10 px-4 xs:px-6 sm:px-10 flex flex-col lg:hidden overflow-y-auto no-scrollbar overscroll-contain transform-gpu"
    >
      <div className="flex flex-col justify-between min-h-[calc(100dvh-6.5rem)] w-full max-w-lg mx-auto">
        {/* ── Navigation Links Block ── */}
        <nav className="flex flex-col gap-2 xs:gap-3 sm:gap-4 items-start justify-start pt-1 pb-3 w-full">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            
            return (
              <motion.div key={link.name} variants={itemVariants} className="w-full">
                <Link
                  href={link.href}
                  onClick={onClose}
                  className="group flex items-center justify-between w-full py-1.5 xs:py-2"
                >
                  <span className={cn(
                    "text-xl xs:text-2xl sm:text-3xl font-bold uppercase tracking-tight transition-all duration-200",
                    isActive 
                      ? "text-emerald-500 dark:text-emerald-400 translate-x-1.5" 
                      : "text-slate-800 dark:text-slate-200 group-hover:text-emerald-500 dark:group-hover:text-white group-hover:translate-x-1.5"
                  )}>
                    {link.name}
                  </span>
                  {isActive && (
                    <motion.div 
                      layoutId="mobile-active-indicator"
                      className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)]"
                    />
                  )}
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* ── Appearance & Bottom Action Area ── */}
        <div className="flex flex-col w-full pt-2">
          {/* Theme Switcher for Mobile */}
          <motion.div 
            variants={itemVariants} 
            className="py-2.5 xs:py-3 w-full flex items-center justify-between border-y border-slate-200/80 dark:border-slate-800/80 my-1"
          >
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Appearance
            </span>
            <ThemeToggle showLabel />
          </motion.div>

          {/* High-Converting Get Free Audit Action */}
          <motion.div 
            variants={itemVariants}
            className="mt-3 xs:mt-4 pt-1 flex flex-col items-center gap-2 w-full relative text-center shrink-0"
          >
            <p className="text-[10px] xs:text-[11px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
              Ready to grow your local visibility?
            </p>
            
            <button
              onClick={() => {
                onClose();
                window.dispatchEvent(new Event("openLeadModal"));
              }}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 xs:py-3.5 text-xs xs:text-sm font-bold text-white bg-gradient-to-r from-emerald-500 via-[#68B955] to-teal-500 hover:from-emerald-400 hover:to-teal-400 rounded-full transition-all active:scale-95 shadow-lg shadow-emerald-500/25 cursor-pointer"
            >
              <span>Get Free Website Audit</span>
            </button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
