"use client";

import { useEffect, useRef } from "react";
import { createPublicClient } from "@/lib/supabase/public";

interface BlogViewTrackerProps {
  blogId: string;
}

/**
 * Silently records article view counts using the Supabase increment_blog_view RPC.
 * Uses sessionStorage to prevent inflating views on rapid tab refreshes.
 */
export default function BlogViewTracker({ blogId }: BlogViewTrackerProps) {
  const hasIncremented = useRef(false);

  useEffect(() => {
    if (!blogId || hasIncremented.current) return;
    hasIncremented.current = true;

    if (typeof window !== "undefined") {
      const sessionKey = `viewed_blog_${blogId}`;
      if (sessionStorage.getItem(sessionKey)) return;

      try {
        const supabase = createPublicClient();
        void supabase
          .rpc("increment_blog_view", { blog_id: blogId })
          .then(
            ({ error }) => {
              if (!error) {
                sessionStorage.setItem(sessionKey, "1");
              }
            },
            () => {
              // Non-blocking fallback
            }
          );
      } catch {
        // Non-blocking fallback
      }
    }
  }, [blogId]);

  return null;
}
