import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface BrandedLoaderViewProps {
  statusText?: string;
  isStalled?: boolean;
  onDismiss?: () => void;
  reducedMotion?: boolean;
  isServerFallback?: boolean;
  className?: string;
}

/**
 * Shared Branded Loading View for NearGrow Ads:
 * - Can be rendered server-side (loading.tsx boundaries) or client-side (portal overlays)
 * - Identical brand logo silhouette, repeating bottom-to-top liquid fill, and brand typography
 * - Responsive on mobile (including safe-area insets), tablets (Tab A9), and desktop viewports
 * - Accessible with sr-only status text and prefers-reduced-motion support
 */
export default function BrandedLoaderView({
  statusText = "Loading page, please wait...",
  isStalled = false,
  onDismiss,
  reducedMotion = false,
  isServerFallback = false,
  className,
}: BrandedLoaderViewProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading page"
      data-branded-loader={isServerFallback ? "server" : "client"}
      className={cn(
        "fixed inset-0 flex flex-col items-center justify-center select-none",
        "w-screen max-w-[100vw] h-[100dvh] min-h-[100dvh] overscroll-contain touch-none",
        "bg-white/95 dark:bg-[#050b14]/95 backdrop-blur-[2px]",
        isServerFallback ? "z-[2147483645]" : "z-[2147483646]",
        className
      )}
      style={{
        paddingTop: "max(1rem, env(safe-area-inset-top, 0px))",
        paddingBottom: "max(1rem, env(safe-area-inset-bottom, 0px))",
        paddingLeft: "max(1rem, env(safe-area-inset-left, 0px))",
        paddingRight: "max(1rem, env(safe-area-inset-right, 0px))",
      }}
    >
      {/* Screen reader only status message */}
      <span className="sr-only">{isStalled ? "Navigation is taking longer than usual." : statusText}</span>

      {/* Main Centered Brand Card */}
      <div className="flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 max-w-sm w-full text-center my-auto">
        {/* Logo Container with Liquid Effect */}
        <div
          className="relative aspect-square w-16 h-16 xs:w-20 xs:h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 max-h-[20vh] max-w-[20vh] flex items-center justify-center mb-3 sm:mb-4 md:mb-5 shrink-0"
          style={{ contain: "paint" }}
        >
          {/* Layer 1: Faint Base Logo (Glass Silhouette) */}
          <Image
            src="/android-chrome-192x192.png"
            alt="NearGrow Ads"
            width={112}
            height={112}
            priority
            className="w-full h-full object-contain opacity-20 dark:opacity-25 grayscale brightness-90 dark:brightness-110 pointer-events-none select-none transition-opacity duration-300"
          />

          {/* Layer 2: Masked Liquid Layer (Clips strictly to NearGrow Ads logo silhouette) */}
          <div
            className="absolute inset-0 pointer-events-none overflow-hidden select-none"
            style={{
              WebkitMaskImage: "url('/android-chrome-192x192.png')",
              maskImage: "url('/android-chrome-192x192.png')",
              WebkitMaskSize: "contain",
              maskSize: "contain",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
              maskPosition: "center",
            }}
          >
            {/* Liquid Rig: Repeating bottom-to-top fill and clean reset */}
            <div
              className={cn(
                "absolute left-0 right-0 bottom-0 w-full h-full pointer-events-none will-change-transform",
                !reducedMotion && "animate-liquid-fill-cycle"
              )}
              style={
                reducedMotion
                  ? { transform: "translate3d(0, 25%, 0)", opacity: 0.9 }
                  : undefined
              }
            >
              {/* Animated Undulating Wave Surface */}
              {!reducedMotion && (
                <div className="absolute -top-3 left-0 w-full h-4 overflow-visible pointer-events-none">
                  {/* Wave 2: Secondary Amber/Green Translucent Ambient Wave */}
                  <svg
                    viewBox="0 0 200 24"
                    preserveAspectRatio="none"
                    className="absolute top-0 left-0 w-[200%] h-4 animate-liquid-wave-reverse opacity-60 pointer-events-none"
                    aria-hidden="true"
                  >
                    <path
                      d="M 0 12 C 25 2, 25 22, 50 12 C 75 2, 75 22, 100 12 C 125 2, 125 22, 150 12 C 175 2, 175 22, 200 12 V 24 H 0 Z"
                      fill="#FBAF35"
                    />
                  </svg>

                  {/* Wave 1: Foreground Vibrant Leaf Green Wave */}
                  <svg
                    viewBox="0 0 200 24"
                    preserveAspectRatio="none"
                    className="absolute top-0 left-0 w-[200%] h-4 animate-liquid-wave opacity-95 pointer-events-none"
                    aria-hidden="true"
                  >
                    <path
                      d="M 0 12 C 25 0, 25 24, 50 12 C 75 0, 75 24, 100 12 C 125 0, 125 24, 150 12 C 175 0, 175 24, 200 12 V 24 H 0 Z"
                      fill="#68B955"
                    />
                  </svg>
                </div>
              )}

              {/* Liquid Body (Green to Amber gradient matching NearGrow Ads brand) */}
              <div
                className="w-full h-full relative"
                style={{
                  background: "linear-gradient(180deg, #68B955 0%, #58a946 60%, #FBAF35 100%)",
                }}
              >
                {/* Subtle glass reflection highlight */}
                <div
                  className="absolute inset-0 opacity-25"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, transparent 65%)",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Brand Name Underneath */}
        <div className="flex flex-col items-center gap-1 sm:gap-1.5 shrink-0">
          <div className="flex items-center text-lg xs:text-xl sm:text-2xl md:text-3xl font-hero font-bold tracking-tight select-none">
            <span className="text-slate-900 dark:text-white">Near</span>
            <span className="text-[#68B955]">Grow</span>
            <span className="text-[#FBAF35] ml-0.5">Ads</span>
          </div>

          {/* Minimalist discreet loading indicator line */}
          <div className="h-0.5 w-10 sm:w-12 md:w-14 rounded-full overflow-hidden bg-slate-200/80 dark:bg-white/10 mt-1">
            <div className="h-full bg-gradient-to-r from-[#68B955] to-[#FBAF35] rounded-full animate-[pulse_1.6s_ease-in-out_infinite]" />
          </div>
        </div>

        {/* Safety Recovery Action if transition stalls */}
        {isStalled && (
          <div className="mt-3 sm:mt-4 pt-1 sm:pt-2 flex flex-col items-center gap-1.5 animate-fadeIn">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Taking longer than expected...
            </p>
            {onDismiss && (
              <button
                type="button"
                onClick={onDismiss}
                className="text-xs font-semibold text-[#68B955] hover:text-[#58a946] dark:text-[#68B955] dark:hover:text-[#80ce6d] underline cursor-pointer p-1"
              >
                Dismiss loader
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
