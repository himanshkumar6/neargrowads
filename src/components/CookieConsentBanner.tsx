"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { ShieldCheck, Cookie, X } from "lucide-react";

export default function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();

  const isPublicOrLoginRoute =
    pathname === "/login" ||
    pathname === "/admin/login" ||
    pathname === "/" ||
    pathname.startsWith("/services") ||
    pathname.startsWith("/about") ||
    pathname.startsWith("/contact") ||
    pathname.startsWith("/case-studies") ||
    pathname.startsWith("/privacy") ||
    pathname.startsWith("/terms");

  useEffect(() => {
    // Only trigger cookie consent prompt AFTER user has logged in (on /dashboard or /admin routes)
    if (isPublicOrLoginRoute) return;

    const consent = localStorage.getItem("trisage_cookie_consent");
    if (!consent) {
      // Show consent popup after a slight delay once logged into dashboard
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isPublicOrLoginRoute]);

  const handleAccept = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("trisage_cookie_consent", "accepted");
      localStorage.setItem("trisage_cookie_consent_date", new Date().toISOString());
    }
    setIsVisible(false);
  };

  const handleDecline = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("trisage_cookie_consent", "declined");
      localStorage.setItem("trisage_cookie_consent_date", new Date().toISOString());
    }
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div 
      id="cookie-consent-banner" 
      className="fixed bottom-[54px] md:bottom-6 left-0 right-0 md:left-6 md:right-auto w-full md:max-w-sm z-[9999999] px-2.5 sm:px-4 md:px-0 animate-in slide-in-from-bottom-6 fade-in duration-300 font-sans floating-widget-container"
    >
      <div className="relative group max-w-sm mx-auto md:max-w-none">
        {/* Glow ambient border shadow */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-600 via-secondary-500 to-teal-500 rounded-2xl blur opacity-25 dark:opacity-35 group-hover:opacity-40 transition duration-300" />

        <div className="relative bg-white/95 dark:bg-[#0d1526]/95 backdrop-blur-xl border border-slate-200/90 dark:border-white/10 rounded-2xl p-3 sm:p-4 shadow-xl text-slate-900 dark:text-white space-y-2.5">
          {/* Top Row: Icon + Title + Close Button */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-secondary-500/10 border border-secondary-500/20 text-secondary-600 dark:text-secondary-400 flex items-center justify-center shrink-0 shadow-2xs">
                <Cookie className="w-4 h-4" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold tracking-tight text-slate-900 dark:text-white leading-tight truncate">
                  Stay Logged In (30 Days)
                </span>
                <span className="text-[10px] font-medium text-secondary-600 dark:text-secondary-400 uppercase tracking-wider leading-none mt-0.5">
                  Cookie Preferences
                </span>
              </div>
            </div>

            <button
              onClick={handleDecline}
              className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer shrink-0"
              title="Close"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Simple Layman Description */}
          <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 font-normal leading-normal">
            Save your login for 30 days so you don&apos;t have to type your password again and again.
          </p>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-0.5">
            <button
              onClick={handleAccept}
              className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-600 text-white font-semibold text-[11px] uppercase tracking-wide hover:opacity-95 transition-all shadow-xs active:scale-98 cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap text-center"
            >
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span>Accept 30 Days</span>
            </button>

            <button
              onClick={handleDecline}
              className="py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium text-[11px] uppercase tracking-wide transition-all active:scale-98 cursor-pointer shrink-0 whitespace-nowrap text-center"
            >
              Skip
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
