import { neon, NeonQueryFunction } from "@neondatabase/serverless";

/**
 * Server-only Neon PostgreSQL Client
 * Connected to project: odd-silence-82467980 (branch: production)
 */

function getDatabaseUrl(): string {
  if (typeof window !== "undefined") {
    throw new Error("[NeonClient] Security Violation: Database client cannot be accessed in browser context.");
  }

  const url = process.env.DATABASE_URL || process.env.DATABASE_URL_UNPOOLED;
  if (!url) {
    throw new Error(
      "[NeonClient] Missing DATABASE_URL environment variable. Please check your .env configuration."
    );
  }
  return url;
}

let cachedSql: NeonQueryFunction<false, false> | null = null;

export function getNeonSql(): NeonQueryFunction<false, false> {
  const url = getDatabaseUrl();
  // Reuse client across requests in serverless environments
  if (!cachedSql) {
    cachedSql = neon(url);
  }
  return cachedSql;
}
