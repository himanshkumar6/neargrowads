"use client";

import { useEffect } from "react";
import { logRealVisitor } from "@/app/actions/analytics";

export default function AnalyticsTracker() {
  useEffect(() => {
    try {
      // Check if the user has already been tracked as a real visitor this session/forever
      const hasBeenTracked = localStorage.getItem("trisage_visitor_tracked");
      
      if (hasBeenTracked) {
        return; // Already tracked, do nothing
      }

      // Set a timer for 120,000 ms (2 minutes)
      const TIME_TO_QUALIFY_AS_REAL_VISITOR = 120000; 

      const timer = setTimeout(async () => {
        try {
          // User has stayed on the page for 2 minutes! They are a "Real Visitor"
          const sessionId = typeof crypto !== "undefined" && crypto.randomUUID
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
          
          const result = await logRealVisitor(sessionId);
          
          if (result?.success) {
            // Flag local storage so we don't double count on subsequent page loads
            localStorage.setItem("trisage_visitor_tracked", "true");
            console.log("[Analytics] Real visitor qualified & recorded successfully.");
          } else if (result?.error) {
            console.warn("[Analytics] Visitor qualification notice:", result.error);
          }
        } catch (subErr) {
          console.warn("[Analytics] Deferred tracking caught an exception:", subErr);
        }
      }, TIME_TO_QUALIFY_AS_REAL_VISITOR);

      // Cleanup timer if they leave before 2 minutes
      return () => clearTimeout(timer);
    } catch {
      // Ignore storage/browser availability issues
    }
  }, []);

  return null; // Silent component, no UI
}
