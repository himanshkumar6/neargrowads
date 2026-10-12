import { EnquiryService, EnquirySource } from "@/lib/services/enquiryService";
import { LeadSubmission } from "@/lib/validations/chatbotSchema";

export class LeadService {
  /**
   * Delegates lead saving to the shared Neon EnquiryService.
   */
  static async saveLead(leadData: LeadSubmission) {
    const source: EnquirySource = (leadData.source as EnquirySource) || "chatbot";

    return await EnquiryService.submitEnquiry({
      source,
      fullName: leadData.name,
      company: leadData.company,
      email: leadData.email,
      phone: leadData.phone,
      service: leadData.service,
      message: leadData.message,
      pageUrl: leadData.page_url,
      metadata: leadData.user_agent ? { userAgent: leadData.user_agent } : undefined,
      honeypot: leadData.honeypot,
    });
  }
}
