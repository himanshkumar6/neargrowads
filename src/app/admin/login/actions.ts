"use server";

import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid corporate email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

// Lightweight in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export async function login(formData: FormData) {
  const result = loginSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return { error: "Authentication failed. Please check your email and password." };
  }

  const { email, password } = result.data;
  
  // Rate limiting logic
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for") || "unknown_ip";
  const identifier = `${ip}_${email}`;
  
  const now = Date.now();
  const record = rateLimitMap.get(identifier);
  
  if (record) {
    if (now > record.resetTime) {
      // Reset window
      rateLimitMap.set(identifier, { count: 1, resetTime: now + WINDOW_MS });
    } else {
      if (record.count >= MAX_ATTEMPTS) {
        const minutesLeft = Math.ceil((record.resetTime - now) / 60000);
        return { error: `Too many login attempts. Please try again in ${minutesLeft} minutes.` };
      }
      record.count += 1;
      rateLimitMap.set(identifier, record);
    }
  } else {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + WINDOW_MS });
  }

  const supabase = await createClient();

  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !authData.user) {
    return { error: "Authentication failed. Please check your email and password." };
  }

  // Clear rate limit on successful login
  rateLimitMap.delete(identifier);

  return { success: true, redirectUrl: '/admin/dashboard' };
}
