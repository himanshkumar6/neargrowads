"use server";

import { getNeonSql } from "@/lib/neon/client";

/**
 * Records a qualified real visitor session in Neon PostgreSQL.
 * Triggered after user dwell time exceeds the qualification threshold.
 */
export async function logRealVisitor(sessionId: string) {
  try {
    if (!sessionId || typeof sessionId !== "string") {
      return { success: false, error: "Invalid session identifier" };
    }

    const cleanSessionId = sessionId.trim().slice(0, 120);
    const sql = getNeonSql();

    await sql`
      INSERT INTO website_visitors (session_id)
      VALUES (${cleanSessionId});
    `;

    return { success: true };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.warn("[Analytics] Warning recording visitor session in Neon:", errorMsg);
    // Graceful degradation: analytics must never disrupt the visitor experience
    return { success: false, error: errorMsg };
  }
}
