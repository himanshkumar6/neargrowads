import { z } from "zod";

// Shared Zod schema for validating a Lead submission
export const leadSubmissionSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters.").max(100, "Name is too long."),
  company: z.string().max(100, "Company name is too long.").optional(),
  email: z.string().email("Please provide a valid email address.").max(150, "Email is too long.").optional().or(z.literal("")),
  phone: z.string().min(7, "Please provide a valid phone number.").max(30, "Phone number is too long.").optional().or(z.literal("")),
  service: z.string().min(1, "Please select a service.").max(150, "Service name is too long."),
  message: z.string().max(3000, "Message is too long.").optional(),
  source: z.string().default("chatbot"),
  page_url: z.string().max(1000, "URL is too long.").optional().or(z.literal("")),
  user_agent: z.string().optional(),
  honeypot: z.string().max(0).optional(),
}).refine(data => data.email || data.phone, {
  message: "Either email or phone must be provided.",
  path: ["email"] // Attach error to email if both are missing
});

export type LeadSubmission = z.infer<typeof leadSubmissionSchema>;
