"use client";

import React, { useState, useEffect, useRef, useCallback, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { usePathname, useSearchParams } from "next/navigation";
import BrandedLoaderView from "./BrandedLoaderView";

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
 * - COMPLETING: Destination route content ready; rapid fade-out with pointer-events-none.
 * - STALLED: Safety fallback triggered if navigation exceeds 7.5s.
 */
type TransitionState = "IDLE" | "PENDING" | "VISIBLE" | "COMPLETING" | "STALLED";

const REVEAL_THRESHOLD_MS = 150; // 120-180ms window: prevents flash on fast/cached routes
const STALL_TIMEOUT_MS = 7500;   // Safety timeout to prevent infinite stuck loaders
const FADE_DURATION_MS = 220;    // Snappy fade-out duration

/**
 * Programmatic helper to trigger the page transition loader for programmatic router.push / router.replace calls
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

/**
 * Helper to display the branded loading overlay for authenticating, signing in, or signing out
 */
export function startAuthTransition(message = "Authenticating...") {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("neargrow:auth-start", { detail: { message } })
    );
  }
}

/**
 * Helper to dismiss any active auth overlay
 */
export function dismissAuthTransition() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("neargrow:auth-end"));
  }
}

export default function BrandedPageLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isClient = useIsClient();

  const [state, setState] = useState<TransitionState>("IDLE");
  const [statusMessage, setStatusMessage] = useState<string>("Loading page, please wait...");
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
          setStatusMessage("Loading page, please wait...");
        }, FADE_DURATION_MS);
        return "COMPLETING";
      }

      return prevState;
    });
  }, [clearAllTimers]);

  // Start transition with reveal threshold timer
  const startTransition = useCallback(
    (targetHref: string, customMessage?: string, immediate = false) => {
      // Generate a new unique transition ID so stale transitions cannot interfere
      const newId = Date.now();
      transitionIdRef.current = newId;
      pendingTargetRef.current = targetHref;

      clearAllTimers();
      if (customMessage) {
        setStatusMessage(customMessage);
      } else {
        setStatusMessage("Loading page, please wait...");
      }

      if (immediate) {
        setState("VISIBLE");
      } else {
        // Begin in PENDING state
        setState("PENDING");

        // Set reveal threshold: only show loader if navigation takes > 150ms
        revealTimerRef.current = setTimeout(() => {
          if (transitionIdRef.current === newId) {
            setState("VISIBLE");
          }
        }, REVEAL_THRESHOLD_MS);
      }

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

  // Listen for programmatic readiness and navigation notifications
  useEffect(() => {
    const handleRouteReady = () => {
      dismissTransition();
    };

    const handleCustomStart = (e: Event) => {
      const customEvent = e as CustomEvent<{ href?: string }>;
      const targetHref = customEvent.detail?.href || "";
      startTransition(targetHref);
    };

    const handleAuthStart = (e: Event) => {
      const customEvent = e as CustomEvent<{ message?: string }>;
      const message = customEvent.detail?.message || "Authenticating...";
      startTransition("", message, true);
    };

    const handleAuthEnd = () => {
      dismissTransition();
    };

    window.addEventListener("neargrow:route-ready", handleRouteReady);
    window.addEventListener("neargrow:navigation-start", handleCustomStart);
    window.addEventListener("neargrow:auth-start", handleAuthStart);
    window.addEventListener("neargrow:auth-end", handleAuthEnd);

    return () => {
      window.removeEventListener("neargrow:route-ready", handleRouteReady);
      window.removeEventListener("neargrow:navigation-start", handleCustomStart);
      window.removeEventListener("neargrow:auth-start", handleAuthStart);
      window.removeEventListener("neargrow:auth-end", handleAuthEnd);
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
      className={`fixed inset-0 z-[2147483646] transition-opacity duration-200 ease-out ${
        isVisible
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
    >
      <BrandedLoaderView
        statusText={statusMessage}
        isStalled={state === "STALLED"}
        onDismiss={dismissTransition}
        reducedMotion={reducedMotion}
        isServerFallback={false}
      />
    </div>,
    document.body
  );
}
