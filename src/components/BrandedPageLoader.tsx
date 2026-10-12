"use client";

import React, { useState, useEffect, useRef, useCallback, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

const emptySubscribe = () => () => {};
function useIsClient() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

/**
 * State machine for the branded page-transition loader:
 * - IDLE: Inactive, zero DOM overhead, zero animation.
 * - PENDING: Navigation initiated, waiting for reveal threshold (150ms).
 * - VISIBLE: Route transition took >150ms, liquid fill animation active.
 * - COMPLETING: Destination route content ready; liquid tops off (100%), rapid fade-out with pointer-events-none.
 * - STALLED: Safety fallback triggered if navigation exceeds 7.5s.
 */
type TransitionState = "IDLE" | "PENDING" | "VISIBLE" | "COMPLETING" | "STALLED";

const REVEAL_THRESHOLD_MS = 150; // 120-180ms window: prevents flash on fast/cached routes
const STALL_TIMEOUT_MS = 7500;   // Safety timeout to prevent infinite stuck loaders
const FADE_DURATION_MS = 220;    // Snappy fade-out duration

/**
 * Programmatic helper to trigger the page transition loader for programmatic router.push calls
 */
export function triggerPageTransition(targetHref?: string) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("neargrow:navigation-start", { detail: { href: targetHref } })
    );
  }
}

/**
 * Programmatic helper to notify that destination route critical content is ready
 */
export function notifyRouteReady() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("neargrow:route-ready"));
  }
}

export default function BrandedPageLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isClient = useIsClient();

  const [state, setState] = useState<TransitionState>("IDLE");
  const [reducedMotion, setReducedMotion] = useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
    return false;
  });

  // References to track transition lifecycle, timers, and prevent race conditions
  const transitionIdRef = useRef<number>(0);
  const revealTimerRef = useRef<NodeJS.Timeout | null>(null);
  const stallTimerRef = useRef<NodeJS.Timeout | null>(null);
  const fadeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const currentUrlRef = useRef<string>("");
  const pendingTargetRef = useRef<string>("");
  const hasMountedRef = useRef<boolean>(false);

  // Detect prefers-reduced-motion changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");

    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };

    mq.addEventListener("change", handleChange);
    return () => mq.removeEventListener("change", handleChange);
  }, []);

  // Prevent accidental background scrolling and touch interactions while overlay is visible,
  // without modifying document.body styles (avoiding scroll jumps and layout shifts).
  useEffect(() => {
    if (state !== "VISIBLE" && state !== "STALLED") return;

    const preventTouchAndWheel = (e: TouchEvent | WheelEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest("button")) {
        return; // Allow interacting with emergency recovery action
      }
      if (e.cancelable) {
        e.preventDefault();
      }
    };

    window.addEventListener("wheel", preventTouchAndWheel, { passive: false });
    window.addEventListener("touchmove", preventTouchAndWheel, { passive: false });

    return () => {
      window.removeEventListener("wheel", preventTouchAndWheel);
      window.removeEventListener("touchmove", preventTouchAndWheel);
    };
  }, [state]);

  // Clear all pending timers safely
  const clearAllTimers = useCallback(() => {
    if (revealTimerRef.current) {
      clearTimeout(revealTimerRef.current);
      revealTimerRef.current = null;
    }
    if (stallTimerRef.current) {
      clearTimeout(stallTimerRef.current);
      stallTimerRef.current = null;
    }
    if (fadeTimerRef.current) {
      clearTimeout(fadeTimerRef.current);
      fadeTimerRef.current = null;
    }
  }, []);

  // Dismiss transition promptly when destination is ready
  const dismissTransition = useCallback(() => {
    clearAllTimers();

    setState((prevState) => {
      // If we were only in PENDING (under 150ms), cancel completely with ZERO flash!
      if (prevState === "PENDING") {
        pendingTargetRef.current = "";
        return "IDLE";
      }

      // If loader was visible or stalled, transition to COMPLETING with a brief fade-out
      if (prevState === "VISIBLE" || prevState === "STALLED") {
        fadeTimerRef.current = setTimeout(() => {
          setState("IDLE");
          pendingTargetRef.current = "";
        }, FADE_DURATION_MS);
        return "COMPLETING";
      }

      return prevState;
    });
  }, [clearAllTimers]);

  // Start transition with reveal threshold timer
  const startTransition = useCallback(
    (targetHref: string) => {
      // Generate a new unique transition ID so stale transitions cannot interfere
      const newId = Date.now();
      transitionIdRef.current = newId;
      pendingTargetRef.current = targetHref;

      clearAllTimers();

      // Begin in PENDING state
      setState("PENDING");

      // Set reveal threshold: only show loader if navigation takes > 150ms
      revealTimerRef.current = setTimeout(() => {
        if (transitionIdRef.current === newId) {
          setState("VISIBLE");
        }
      }, REVEAL_THRESHOLD_MS);

      // Safety stall timeout: recovery if navigation drops or hangs
      stallTimerRef.current = setTimeout(() => {
        if (transitionIdRef.current === newId) {
          setState("STALLED");
        }
      }, STALL_TIMEOUT_MS);
    },
    [clearAllTimers]
  );

  // Track initial mount and current URL
  useEffect(() => {
    if (typeof window !== "undefined") {
      currentUrlRef.current = window.location.pathname + window.location.search;
    }
  }, []);

  // Listen to Next.js route commits (pathname or searchParams change)
  useEffect(() => {
    // Avoid running on the very first mount of the page
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    const newUrl = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
    currentUrlRef.current = newUrl;

    // Use double requestAnimationFrame to ensure the destination's primary DOM content
    // has completed layout and paint before dismissing the overlay
    let raf2: number;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        dismissTransition();
      });
    });

    return () => {
      cancelAnimationFrame(raf1);
      if (raf2) {
        cancelAnimationFrame(raf2);
      }
    };
  }, [pathname, searchParams, dismissTransition]);

  // Listen for programmatic readiness notifications
  useEffect(() => {
    const handleRouteReady = () => {
      dismissTransition();
    };

    const handleCustomStart = (e: Event) => {
      const customEvent = e as CustomEvent<{ href?: string }>;
      const targetHref = customEvent.detail?.href || "";
      startTransition(targetHref);
    };

    window.addEventListener("neargrow:route-ready", handleRouteReady);
    window.addEventListener("neargrow:navigation-start", handleCustomStart);

    return () => {
      window.removeEventListener("neargrow:route-ready", handleRouteReady);
      window.removeEventListener("neargrow:navigation-start", handleCustomStart);
    };
  }, [dismissTransition, startTransition]);

  // Delegated Link Click & Popstate Listener
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Filter link clicks with high discipline to avoid intercepting buttons, forms, or same-page anchors
    const handleLinkClick = (e: MouseEvent) => {
      // 1. Check if another component has already prevented default (e.g. accordion, menu toggle, modal)
      if (e.defaultPrevented) return;

      // 2. Only primary mouse button (left-click) with no modifier keys (Ctrl, Meta, Shift, Alt)
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        return;
      }

      // 3. Find closest anchor tag
      const anchor = (e.target as Element | null)?.closest("a");
      if (!anchor) return;

      // 4. Do not intercept if anchor target is not _self
      if (anchor.target && anchor.target.toLowerCase() !== "_self") {
        return;
      }

      // 5. Do not intercept download links
      if (anchor.hasAttribute("download")) {
        return;
      }

      // 6. Do not intercept external rel links
      const rel = anchor.getAttribute("rel") || "";
      if (rel.includes("external")) {
        return;
      }

      // 7. Check raw href value
      const rawHref = anchor.getAttribute("href");
      if (!rawHref) return;

      const trimmed = rawHref.trim().toLowerCase();
      // Ignore anchors, mailto, tel, sms, javascript
      if (
        trimmed.startsWith("#") ||
        trimmed.startsWith("mailto:") ||
        trimmed.startsWith("tel:") ||
        trimmed.startsWith("sms:") ||
        trimmed.startsWith("javascript:")
      ) {
        return;
      }

      // 8. Parse target URL
      let targetUrl: URL;
      try {
        targetUrl = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }

      // 9. Ignore external domains
      if (targetUrl.origin !== window.location.origin) {
        return;
      }

      // 10. Ignore current location (same pathname and search params, normalizing trailing slashes)
      const norm = (p: string) => p.replace(/\/+$/, "") || "/";
      if (
        norm(targetUrl.pathname) === norm(window.location.pathname) &&
        targetUrl.search === window.location.search
      ) {
        return;
      }

      // Eligible internal navigation transition: start loader lifecycle immediately
      // (Native Next.js link semantics and prefetching are preserved)
      startTransition(targetUrl.pathname + targetUrl.search);
    };

    // Listen to browser Back / Forward buttons
    const handlePopState = () => {
      const norm = (p: string) => p.replace(/\/+$/, "") || "/";
      const destination = window.location.pathname + window.location.search;
      if (norm(destination) !== norm(currentUrlRef.current)) {
        startTransition(destination);
      }
    };

    // Use capture phase so navigation intent on <a> elements is recognized before Next.js calls preventDefault
    document.addEventListener("click", handleLinkClick, true);
    window.addEventListener("popstate", handlePopState);

    return () => {
      document.removeEventListener("click", handleLinkClick, true);
      window.removeEventListener("popstate", handlePopState);
      clearAllTimers();
    };
  }, [startTransition, clearAllTimers]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      clearAllTimers();
    };
  }, [clearAllTimers]);

  // If idle or running during SSR, render nothing
  if (state === "IDLE" || !isClient) {
    return null;
  }

  const isVisible = state === "VISIBLE" || state === "STALLED";
  const isCompleting = state === "COMPLETING";

  return createPortal(
    <div
      id="branded-page-loader"
      role="status"
      aria-live="polite"
      aria-label="Loading page"
      aria-busy={isVisible || isCompleting}
      className={cn(
        "fixed inset-0 z-[2147483646] flex flex-col items-center justify-center select-none transition-opacity duration-200 ease-out",
        "w-screen max-w-[100vw] h-[100dvh] min-h-[100dvh] overscroll-contain touch-none",
        "bg-white/95 dark:bg-[#050b14]/95 backdrop-blur-[2px]",
        isVisible
          ? "opacity-100 pointer-events-auto"
          : isCompleting
          ? "opacity-0 pointer-events-none"
          : "opacity-0 pointer-events-none"
      )}
      style={{
        paddingTop: "max(1rem, env(safe-area-inset-top, 0px))",
        paddingBottom: "max(1rem, env(safe-area-inset-bottom, 0px))",
        paddingLeft: "max(1rem, env(safe-area-inset-left, 0px))",
        paddingRight: "max(1rem, env(safe-area-inset-right, 0px))",
      }}
    >
      {/* Screen reader only status message */}
      <span className="sr-only">
        {state === "STALLED"
          ? "Navigation is taking longer than usual."
          : "Loading page, please wait..."}
      </span>

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
                !reducedMotion && isVisible && "animate-liquid-fill-cycle"
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
        {state === "STALLED" && (
          <div className="mt-3 sm:mt-4 pt-1 sm:pt-2 flex flex-col items-center gap-1.5 animate-fadeIn">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Taking longer than expected...
            </p>
            <button
              type="button"
              onClick={dismissTransition}
              className="text-xs font-semibold text-[#68B955] hover:text-[#58a946] dark:text-[#68B955] dark:hover:text-[#80ce6d] underline cursor-pointer p-1"
            >
              Dismiss loader
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
