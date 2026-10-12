import { NextResponse } from "next/server";
import { leadSubmissionSchema } from "@/lib/validations/chatbotSchema";
import { EnquiryService } from "@/lib/services/enquiryService";

// Simple in-memory rate limiter (Note: Resets on serverless cold boots, but effective for basic spam bursts)
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 30; // Increased to 30 to allow for thorough client testing without blocking

export async function POST(request: Request) {
  try {
    // 0. Rate Limiting Check
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown-ip";
    
    if (ip !== "unknown-ip") {
      const now = Date.now();
      const userLimit = rateLimitMap.get(ip);
      
      if (userLimit) {
        if (now - userLimit.timestamp < RATE_LIMIT_WINDOW_MS) {
          if (userLimit.count >= MAX_REQUESTS_PER_WINDOW) {
            console.warn(`[Anti-Spam] Rate limit exceeded for IP: ${ip}`);
            return NextResponse.json(
              { error: "Too many requests. Please try again later." },
              { status: 429 }
            );
          }
          userLimit.count += 1;
        } else {
          // Reset window
          rateLimitMap.set(ip, { count: 1, timestamp: now });
        }
      } else {
        rateLimitMap.set(ip, { count: 1, timestamp: now });
      }
    }

    // 1. Parse incoming JSON
    const body = await request.json();

    // 1.5 Anti-Spam Honeypot Check
    // If a bot fills out the hidden honeypot field, silently reject the request but pretend it succeeded.
    if (body.honeypot && typeof body.honeypot === "string" && body.honeypot.length > 0) {
      console.warn(`[Anti-Spam] Honeypot triggered by IP: ${ip}`);
      return NextResponse.json({ success: true }, { status: 200 }); // Silent fail
    }

    // 2. Validate with Zod
    const result = leadSubmissionSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid lead data", details: result.error.format() },
        { status: 400 }
      );
    }

    const leadData = result.data;

    // 3. Attach metadata
    const userAgent = request.headers.get("user-agent") || undefined;
    
    // 4. Save to Neon PostgreSQL Database using the EnquiryService
    const saveResult = await EnquiryService.submitEnquiry({
      source: "chatbot",
      fullName: leadData.name,
      company: leadData.company,
      email: leadData.email,
      phone: leadData.phone,
      service: leadData.service,
      message: leadData.message,
      pageUrl: leadData.page_url,
      metadata: {
        userAgent,
        ip: ip !== "unknown-ip" ? ip : undefined,
      },
      honeypot: leadData.honeypot,
    });

    if (!saveResult.success) {
      return NextResponse.json(
        { error: saveResult.error || "Failed to record enquiry" },
        { status: 500 }
      );
    }

    // 5. Return success
    return NextResponse.json({
      success: true,
      enquiryId: saveResult.enquiryId,
    }, { status: 200 });

  } catch (error: unknown) {
    console.error("[Chatbot API] Error processing submission:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
