"use client";
/* eslint-disable @typescript-eslint/no-unused-vars, react-hooks/set-state-in-effect */

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { 
  PhoneCall, 
  Sun, 
  Moon, 
  ArrowUp, 
  X, 
  MessageSquare 
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function FloatingToggleHub() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [mounted, setMounted] = useState(false);
  const { theme, resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle escape key to close menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!mounted) return null;

  const currentTheme = resolvedTheme || theme;

  const toggleTheme = () => {
    setTheme(currentTheme === "dark" ? "light" : "dark");
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          id="floating-toggle-hub-container"
          className="fixed bottom-3.5 left-3.5 sm:bottom-6 sm:left-6 z-50 flex flex-col items-start gap-2.5 sm:gap-3 pointer-events-auto select-none floating-widget-container"
        >
          {/* ── EXPANDED SPEED-DIAL QUICK ACTION MENU ── */}
          <AnimatePresence>
            {isOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 15, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.9 }}
                transition={{ duration: 0.25, staggerChildren: 0.08 }}
                className="flex flex-col items-start gap-2.5 mb-1"
              >
                {/* Action 1: Open Get In Touch Lead Form Modal */}
                <motion.button
                  whileHover={{ scale: 1.08, x: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setIsOpen(false);
                    window.dispatchEvent(new Event("openLeadModal"));
                  }}
                  className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-full bg-white/85 dark:bg-[#07111e]/90 border border-white/60 dark:border-white/15 text-gray-800 dark:text-gray-100 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.2)] dark:shadow-[0_15px_35px_-5px_rgba(0,0,0,0.6)] backdrop-blur-xl text-xs font-semibold group cursor-pointer"
                  aria-label="Open Get in Touch lead form"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-secondary-500 via-emerald-400 to-primary-600 text-white flex items-center justify-center shadow-md animate-pulse">
                    <MessageSquare size={15} />
                  </div>
                  <span className="hidden sm:inline font-medium uppercase tracking-wider text-[10px] text-gray-600 dark:text-gray-300 group-hover:text-secondary-500 transition-colors">
                    Get In Touch
                  </span>
                </motion.button>

                {/* Action 2: Scroll To Top */}
                <motion.button
                  whileHover={{ scale: 1.08, x: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={scrollToTop}
                  className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-full bg-white/85 dark:bg-[#07111e]/90 border border-white/60 dark:border-white/15 text-gray-800 dark:text-gray-100 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.2)] dark:shadow-[0_15px_35px_-5px_rgba(0,0,0,0.6)] backdrop-blur-xl text-xs font-semibold group cursor-pointer"
                  aria-label="Scroll back to top"
                >
                  <div className="w-8 h-8 rounded-full bg-primary-600 dark:bg-primary-700 text-white flex items-center justify-center shadow-md">
                    <ArrowUp size={15} />
                  </div>
                  <span className="hidden sm:inline font-medium uppercase tracking-wider text-[10px] text-gray-600 dark:text-gray-300 group-hover:text-primary-600 transition-colors">
                    Back to Top
                  </span>
                </motion.button>

                {/* Action 3: Toggle Theme (Dark / Light) */}
                <motion.button
                  whileHover={{ scale: 1.08, x: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleTheme}
                  className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-full bg-white/85 dark:bg-[#07111e]/90 border border-white/60 dark:border-white/15 text-gray-800 dark:text-gray-100 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.2)] dark:shadow-[0_15px_35px_-5px_rgba(0,0,0,0.6)] backdrop-blur-xl text-xs font-semibold group cursor-pointer"
                  aria-label="Toggle dark mode"
                >
                  <div className="w-8 h-8 rounded-full bg-amber-500 dark:bg-indigo-600 text-white flex items-center justify-center shadow-md">
                    {currentTheme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
                  </div>
                  <span className="hidden sm:inline font-medium uppercase tracking-wider text-[10px] text-gray-600 dark:text-gray-300 group-hover:text-amber-500 transition-colors">
                    {currentTheme === "dark" ? "Light Mode" : "Dark Mode"}
                  </span>
                </motion.button>

                {/* Action 4: Quick Direct Phone Call (+91 92898 10149) */}
                <motion.a
                  whileHover={{ scale: 1.08, x: -2 }}
                  whileTap={{ scale: 0.95 }}
                  href="tel:+919289810149"
                  className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-full bg-white/85 dark:bg-[#07111e]/90 border border-white/60 dark:border-white/15 text-gray-800 dark:text-gray-100 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.2)] dark:shadow-[0_15px_35px_-5px_rgba(0,0,0,0.6)] backdrop-blur-xl text-xs font-semibold group"
                  aria-label="Call +91 92898 10149"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md">
                    <PhoneCall size={15} />
                  </div>
                  <span className="hidden sm:inline font-medium uppercase tracking-wider text-[10px] text-gray-600 dark:text-gray-300 group-hover:text-blue-500 transition-colors">
                    Call Direct
                  </span>
                </motion.a>

                {/* Action 5: Official Modern WhatsApp Direct Connect (+91 92898 10149) */}
                <motion.a
                  whileHover={{ scale: 1.08, x: -2 }}
                  whileTap={{ scale: 0.95 }}
                  href="https://wa.me/919289810149?text=Hello%20NearGrow%20Ads!%20I%20would%20like%20to%20inquire%20about%20your%20digital%20marketing%20services."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-full bg-white/85 dark:bg-[#07111e]/90 border border-white/60 dark:border-white/15 text-gray-800 dark:text-gray-100 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.2)] dark:shadow-[0_15px_35px_-5px_rgba(0,0,0,0.6)] backdrop-blur-xl text-xs font-semibold group"
                  aria-label="Chat on WhatsApp"
                >
                  <div className="w-8 h-8 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white flex items-center justify-center shadow-[0_0_15px_rgba(37,211,102,0.4)]">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.705 1.754zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l.999 1.594-1.066 3.896 3.99-1.045 1.82 1.222zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                    </svg>
                  </div>
                  <span className="hidden sm:inline font-medium uppercase tracking-wider text-[10px] text-gray-600 dark:text-gray-300 group-hover:text-emerald-500 transition-colors">
                    WhatsApp Chat
                  </span>
                </motion.a>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── MAIN MASTER FLOATING TOGGLE BUTTON (3D Apple Liquid Glass Sphere FAB) ── */}
          <div className="relative">
            {/* Ambient Pulse Ring when closed */}
            {!isOpen && (
              <span className="absolute inset-0 rounded-full bg-secondary-400/40 animate-ping pointer-events-none" />
            )}

            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => setIsOpen(!isOpen)}
              className={cn(
                "w-11 h-11 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-white transition-all duration-300 cursor-pointer overflow-hidden relative transform-gpu",
                isOpen
                  ? "bg-gray-900 dark:bg-white text-white dark:text-gray-950 border border-gray-700 dark:border-gray-300 shadow-xl"
                  : "apple-liquid-glass-btn"
              )}
              aria-label={isOpen ? "Close quick actions menu" : "Open quick actions menu"}
            >
              {/* Top Glass Specular Rim Line */}
              {!isOpen && (
                <div className="absolute inset-x-3 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white to-transparent pointer-events-none rounded-full opacity-90" />
              )}

              <motion.div
                animate={{ rotate: isOpen ? 90 : 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-center"
              >
                {isOpen ? (
                  <X size={20} className="sm:w-5 sm:h-5" />
                ) : (
                  <Image
                    src="/android-chrome-192x192.png"
                    alt="NearGrow Ads"
                    width={32}
                    height={32}
                    className="w-6 h-6 sm:w-8 sm:h-8 object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
                  />
                )}
              </motion.div>
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
