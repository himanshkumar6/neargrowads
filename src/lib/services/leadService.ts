import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { LeadSubmission } from "@/lib/validations/chatbotSchema";

export class LeadService {
  /**
   * Safely inserts a new lead into the Supabase database.
   * Resilient to RLS and key configuration differences.
   */
  static async saveLead(leadData: LeadSubmission) {
    const finalMessage = leadData.message ? leadData.message.trim() : "Chatbot inquiry submitted.";

    const payload = {
      full_name: leadData.name.trim(),
      company: 'Chatbot Lead',
      email: leadData.email ? leadData.email.trim().toLowerCase() : null,
      phone: leadData.phone ? leadData.phone.trim() : null,
      service: [leadData.service],
      message: finalMessage,
    };

    // 1. Try privileged admin client first
    try {
      const adminClient = createAdminClient();
      const { error: adminError } = await adminClient
        .from('contact_messages')
        .insert([payload]);

      if (!adminError) {
        return { success: true };
      }
      console.warn("[LeadService] Admin insert failed, trying server client fallback:", adminError.message);
    } catch (adminInitError) {
      console.warn("[LeadService] Admin client unavailable, falling back to server client:", adminInitError);
    }

    // 2. Fallback to standard server client (same as contact form)
    const serverClient = await createClient();
    const { error: serverError } = await serverClient
      .from('contact_messages')
      .insert([payload]);

    if (serverError) {
      console.error("[LeadService] Both admin and server insert attempts failed:", serverError);
      throw new Error(`Database insertion failed: ${serverError.message || JSON.stringify(serverError)}`);
    }

    return { success: true };
  }
}
