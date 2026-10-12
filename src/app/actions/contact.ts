/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import { EnquiryService, EnquirySource } from "@/lib/services/enquiryService";
import { getNeonSql } from "@/lib/neon/client";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function submitContactForm(formData: {
  fullName: string;
  company?: string;
  email: string;
  phone?: string;
  service: string | string[];
  message: string;
  source?: EnquirySource;
}) {
  try {
    const source: EnquirySource = formData.source || "contact_us";

    const saveResult = await EnquiryService.submitEnquiry({
      source,
      fullName: formData.fullName,
      company: formData.company,
      email: formData.email,
      phone: formData.phone,
      service: formData.service,
      message: formData.message,
    });

    if (!saveResult.success) {
      return { success: false, error: saveResult.error || "Unable to submit inquiry at this time. Please try again later." };
    }

    // Revalidate admin dashboard so new enquiry is immediately visible
    revalidatePath("/admin", "layout");
    return { success: true, enquiryId: saveResult.enquiryId };

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

    // 1. Try deleting from Neon enquiries table first
    try {
      const sql = getNeonSql();
      const neonDeleted = await sql`
        DELETE FROM enquiries 
        WHERE id = ${id}::uuid 
        RETURNING id;
      `;
      if (neonDeleted && neonDeleted.length > 0) {
        revalidatePath("/admin", "layout");
        revalidatePath("/admin/dashboard");
        revalidatePath("/admin/leads");
        return { success: true };
      }
    } catch {
      // Fallback silently if id is not a UUID or record is not in Neon
    }

    // 2. Fallback to Supabase legacy table only if not found in Neon
    try {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id);

      if (error) {
        console.warn("Supabase delete notice:", error.message);
        // If the table doesn't exist in Supabase schema cache, don't show a false failure to user
        if (error.message.includes("schema cache") || error.code === "PGRST205") {
          revalidatePath("/admin", "layout");
          return { success: true };
        }
        return { success: false, error: `Failed to delete: ${error.message}` };
      }
    } catch (e) {
      console.warn("Supabase delete exception:", e);
    }

    revalidatePath("/admin", "layout");
    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/leads");
    return { success: true };

  } catch (err: unknown) {
    console.error("deleteContactMessage unexpected error:", err);
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

    // 1. Try updating Neon enquiries table first
    try {
      const sql = getNeonSql();
      const neonUpdated = await sql`
        UPDATE enquiries 
        SET status = 'meeting_booked', updated_at = NOW() 
        WHERE id = ${id}::uuid 
        RETURNING id;
      `;
      if (neonUpdated && neonUpdated.length > 0) {
        revalidatePath("/admin", "layout");
        revalidatePath("/admin/dashboard");
        revalidatePath("/admin/leads");
        return { success: true };
      }
    } catch {
      // Fallback silently if id is not a UUID or record is in Supabase
    }

    // 2. Fallback to Supabase legacy table only if not in Neon
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ meeting_booked: true })
        .eq('id', id);

      if (error) {
        console.warn("Supabase update notice:", error.message);
        if (error.message.includes("schema cache") || error.code === "PGRST205") {
          revalidatePath("/admin", "layout");
          return { success: true };
        }
        return { success: false, error: `Failed to mark booked: ${error.message}` };
      }
    } catch (e) {
      console.warn("Supabase update exception:", e);
    }

    revalidatePath("/admin", "layout");
    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/leads");
    return { success: true };

  } catch (err: unknown) {
    console.error("markMeetingBooked unexpected error:", err);
    return { success: false, error: "An unexpected error occurred." };
  }
}
