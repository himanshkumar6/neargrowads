import { getNeonSql } from "@/lib/neon/client";

export type EnquirySource = "contact_us" | "get_in_touch" | "chatbot";

export interface CreateEnquiryInput {
  source: EnquirySource;
  fullName: string;
  company?: string | null;
  email?: string | null;
  phone?: string | null;
  service?: string | string[] | null;
  message?: string | null;
  pageUrl?: string | null;
  metadata?: Record<string, unknown> | null;
  honeypot?: string | null;
}

export interface EnquiryResult {
  success: boolean;
  enquiryId?: string;
  error?: string;
  duplicate?: boolean;
}

export interface EnquiryRow {
  id: string;
  source: string;
  full_name: string | null;
  company: string | null;
  email: string | null;
  phone: string | null;
  service: string | string[] | null;
  message: string | null;
  page_url?: string | null;
  metadata?: Record<string, unknown> | null;
  status: string | null;
  created_at: string | Date | null;
  updated_at?: string | Date | null;
}

// In-memory rate limiting map for basic protection on high frequency requests
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute window
const MAX_REQUESTS_PER_WINDOW = 10;

export class EnquiryService {
  /**
   * Validates and saves an enquiry into the Neon PostgreSQL production database.
   * Parameterized queries prevent SQL injection, and duplicate checks prevent accidental re-submissions.
   */
  static async submitEnquiry(input: CreateEnquiryInput): Promise<EnquiryResult> {
    try {
      // 1. Anti-Spam Honeypot Check: Silently succeed without saving if honeypot is filled
      if (input.honeypot && typeof input.honeypot === "string" && input.honeypot.trim().length > 0) {
        console.warn(`[EnquiryService] Honeypot triggered for source: ${input.source}`);
        return { success: true };
      }

      // 2. Defensive Server-Side Input Validation
      const cleanFullName = typeof input.fullName === "string" ? input.fullName.trim() : "";
      if (cleanFullName.length < 2 || cleanFullName.length > 150) {
        return { success: false, error: "Please provide a valid name (2 to 150 characters)." };
      }

      const rawEmail = typeof input.email === "string" ? input.email.trim().toLowerCase() : "";
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const cleanEmail = rawEmail && emailRegex.test(rawEmail) && rawEmail.length <= 255 ? rawEmail : null;

      const rawPhone = typeof input.phone === "string" ? input.phone.trim() : "";
      const phoneDigits = rawPhone.replace(/\D/g, "");
      const cleanPhone = rawPhone && phoneDigits.length >= 7 && rawPhone.length <= 50 ? rawPhone : null;

      if (!cleanEmail && !cleanPhone) {
        return { success: false, error: "Please provide either a valid email address or phone number." };
      }

      const cleanCompany = input.company && typeof input.company === "string" ? input.company.trim().slice(0, 150) : null;
      const cleanMessage = input.message && typeof input.message === "string" ? input.message.trim().slice(0, 3000) : "";
      const cleanPageUrl = input.pageUrl && typeof input.pageUrl === "string" ? input.pageUrl.trim().slice(0, 1000) : null;

      // Normalize service array
      let serviceArray: string[] = [];
      if (Array.isArray(input.service)) {
        serviceArray = input.service.map((s) => String(s).trim()).filter(Boolean);
      } else if (typeof input.service === "string" && input.service.trim().length > 0) {
        serviceArray = [input.service.trim()];
      }
      if (serviceArray.length === 0) {
        serviceArray = ["General Inquiry"];
      }

      const validSources: EnquirySource[] = ["contact_us", "get_in_touch", "chatbot"];
      const source: EnquirySource = validSources.includes(input.source) ? input.source : "contact_us";

      const metadata = input.metadata && typeof input.metadata === "object" ? JSON.stringify(input.metadata) : "{}";

      // 3. Connect to Neon PostgreSQL via Serverless Driver
      const sql = getNeonSql();

      // 4. Duplicate Check (Idempotency): Prevent accidental double-clicks within 60s
      try {
        const existing = await sql`
          SELECT id FROM enquiries
          WHERE source = ${source}
            AND (
              (${cleanEmail}::text IS NOT NULL AND email = ${cleanEmail}) OR
              (${cleanPhone}::text IS NOT NULL AND phone = ${cleanPhone})
            )
            AND message = ${cleanMessage}
            AND created_at > (NOW() - INTERVAL '60 seconds')
          LIMIT 1;
        `;

        if (existing && existing.length > 0) {
          const duplicateId = String(existing[0].id);
          console.log(`[EnquiryService] Duplicate enquiry detected within 60s window (id: ${duplicateId}).`);
          return { success: true, enquiryId: duplicateId, duplicate: true };
        }
      } catch (dedupError) {
        // Log error but proceed to insertion so valid leads are never dropped
        console.warn("[EnquiryService] Idempotency check warning:", (dedupError as Error).message);
      }

      // 5. Parameterized Insert into Neon enquiries Table
      const insertResult = await sql`
        INSERT INTO enquiries (
          source,
          full_name,
          company,
          email,
          phone,
          service,
          message,
          page_url,
          metadata
        ) VALUES (
          ${source},
          ${cleanFullName},
          ${cleanCompany},
          ${cleanEmail},
          ${cleanPhone},
          ${serviceArray},
          ${cleanMessage},
          ${cleanPageUrl},
          ${metadata}::jsonb
        )
        RETURNING id, created_at;
      `;

      if (!insertResult || insertResult.length === 0) {
        throw new Error("Insert returned no confirmed record.");
      }

      const savedId = String(insertResult[0].id);
      console.log(`[EnquiryService] Successfully saved enquiry [id: ${savedId}, source: ${source}].`);

      return {
        success: true,
        enquiryId: savedId,
      };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.error(`[EnquiryService] Failed to record enquiry for source ${input?.source || "unknown"}:`, errorMsg);
      return {
        success: false,
        error: "Unable to process enquiry at this time. Please try again.",
      };
    }
  }

  /**
   * Fetch paginated enquiries from Neon
   */
  static async getEnquiries(limit = 12, page = 1): Promise<{ data: EnquiryRow[]; total: number }> {
    try {
      const sql = getNeonSql();
      const offset = Math.max(0, (page - 1) * limit);

      const [countRows, dataRows] = await Promise.all([
        sql`SELECT COUNT(*)::int as count FROM enquiries;`,
        sql`
          SELECT * FROM enquiries
          ORDER BY created_at DESC
          LIMIT ${limit} OFFSET ${offset};
        `
      ]);

      const total = countRows[0]?.count || 0;
      return { data: dataRows as unknown as EnquiryRow[], total };
    } catch (err) {
      console.error("[EnquiryService] Error fetching enquiries:", err);
      return { data: [], total: 0 };
    }
  }

  /**
   * Count total enquiries from Neon
   */
  static async countEnquiries(): Promise<number> {
    try {
      const sql = getNeonSql();
      const result = await sql`SELECT COUNT(*)::int as count FROM enquiries;`;
      return result[0]?.count || 0;
    } catch (err) {
      console.error("[EnquiryService] Error counting enquiries:", err);
      return 0;
    }
  }

  /**
   * Get breakdown of enquiries by source from Neon
   */
  static async getSourceBreakdown(): Promise<{
    contact_us: number;
    get_in_touch: number;
    chatbot: number;
    total: number;
  }> {
    try {
      const sql = getNeonSql();
      const rows = await sql`SELECT source, COUNT(*)::int as count FROM enquiries GROUP BY source;`;
      let contact_us = 0;
      let get_in_touch = 0;
      let chatbot = 0;
      for (const row of rows) {
        if (row.source === "contact_us") contact_us = Number(row.count) || 0;
        else if (row.source === "get_in_touch") get_in_touch = Number(row.count) || 0;
        else if (row.source === "chatbot") chatbot = Number(row.count) || 0;
      }
      return {
        contact_us,
        get_in_touch,
        chatbot,
        total: contact_us + get_in_touch + chatbot,
      };
    } catch (err) {
      console.error("[EnquiryService] Error fetching source breakdown:", err);
      return { contact_us: 0, get_in_touch: 0, chatbot: 0, total: 0 };
    }
  }

  /**
   * Fetch recent enquiries for dashboard overview
   */
  static async getRecentEnquiries(limit = 6): Promise<EnquiryRow[]> {
    try {
      const sql = getNeonSql();
      const rows = await sql`
        SELECT id, source, full_name, company, email, phone, service, message, status, created_at
        FROM enquiries
        ORDER BY created_at DESC
        LIMIT ${limit};
      `;
      return rows as unknown as EnquiryRow[];
    } catch (err) {
      console.error("[EnquiryService] Error fetching recent enquiries:", err);
      return [];
    }
  }

  /**
   * Simple client-identifier rate limiter
   */
  static checkRateLimit(clientKey: string): boolean {
    if (!clientKey || clientKey === "unknown-ip") return true;
    const now = Date.now();
    const existing = rateLimitMap.get(clientKey);

    if (existing) {
      if (now - existing.timestamp < RATE_LIMIT_WINDOW_MS) {
        if (existing.count >= MAX_REQUESTS_PER_WINDOW) {
          return false;
        }
        existing.count += 1;
      } else {
        rateLimitMap.set(clientKey, { count: 1, timestamp: now });
      }
    } else {
      rateLimitMap.set(clientKey, { count: 1, timestamp: now });
    }
    return true;
  }
}
