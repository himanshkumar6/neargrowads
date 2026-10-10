/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function submitContactForm(formData: { fullName: string; company?: string; email: string; phone?: string; service: string | string[]; message: string; }) {
  try {
    // Server-side Defensive Validation
    if (!formData.fullName || typeof formData.fullName !== 'string' || formData.fullName.trim().length < 2 || formData.fullName.length > 100) {
      return { success: false, error: "Please provide a valid full name (2-100 characters)." };
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || typeof formData.email !== 'string' || !emailRegex.test(formData.email) || formData.email.length > 255) {
      return { success: false, error: "Please provide a valid email address." };
    }
    if (formData.phone && (typeof formData.phone !== 'string' || formData.phone.length > 30)) {
      return { success: false, error: "Phone number is invalid or too long." };
    }
    if (formData.message && (typeof formData.message !== 'string' || formData.message.length > 3000)) {
      return { success: false, error: "Message must be under 3000 characters." };
    }

    const supabase = await createClient();
    
    const { error } = await supabase
      .from('contact_messages')
      .insert([
        {
          full_name: formData.fullName.trim(),
          company: formData.company ? String(formData.company).trim().slice(0, 100) : null,
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone ? String(formData.phone).trim().slice(0, 30) : null,
          service: Array.isArray(formData.service) ? formData.service : [formData.service],
          message: formData.message ? String(formData.message).trim().slice(0, 3000) : "",
        }
      ]);

    if (error) {
      console.error("Supabase insert error:", error);
      return { success: false, error: "Unable to submit inquiry at this time. Please try again later." };
    }

    // Since we added a new message, tell Next.js to revalidate the admin dashboard
    // so it shows up instantly for any logged-in admin.
    revalidatePath("/admin", "layout");
    return { success: true };

  } catch (err: unknown) {
    console.error("Server action error:", err);
    return { success: false, error: "An unexpected error occurred. Please try again." };
  }
}

export async function deleteContactMessage(id: string) {
  try {
    const supabase = await createClient();
    
    // Admins only (RLS enforces this, but server action is another layer)
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const { error } = await supabase
      .from('contact_messages')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Supabase delete error:", error);
      return { success: false, error: `Failed to delete: ${error.message}` };
    }

    revalidatePath("/admin", "layout");
    return { success: true };

  } catch (err: unknown) {
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function markMeetingBooked(id: string) {
  try {
    const supabase = await createClient();
    
    // Admins only
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const { error } = await supabase
      .from('contact_messages')
      .update({ meeting_booked: true })
      .eq('id', id);

    if (error) {
      console.error("Supabase update error:", error);
      return { success: false, error: `Failed to mark booked: ${error.message}` };
    }

    revalidatePath("/admin", "layout");
    return { success: true };

  } catch (err: unknown) {
    return { success: false, error: "An unexpected error occurred." };
  }
}
