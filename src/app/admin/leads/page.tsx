import { createClient } from "@/lib/supabase/server";
import { EnquiryService } from "@/lib/services/enquiryService";
import { redirect } from "next/navigation";
import MessagesTableBody from "@/components/admin/MessagesTableBody";
import { MessageSquare, Mail, PhoneCall, Bot, Sparkles } from "lucide-react";

export default async function LeadsPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const page = Number(searchParams?.page) || 1;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  // Count total inquiries across Neon (primary) and Supabase (fallback)
  const neonBreakdown = await EnquiryService.getSourceBreakdown();
  const { count: sbCount } = await supabase
    .from("contact_messages")
    .select("*", { count: "exact", head: true });

  const contactUsCount = (neonBreakdown?.contact_us || 0) + (sbCount || 0);
  const getInTouchCount = neonBreakdown?.get_in_touch || 0;
  const chatbotCount = neonBreakdown?.chatbot || 0;
  const totalLeads = contactUsCount + getInTouchCount + chatbotCount;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-[#0d1526] border border-slate-200/80 dark:border-white/10 rounded-2xl p-4 sm:p-5 lg:p-6 shadow-xs">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight font-sans">
              Master Lead Database
            </h1>
            <span className="px-3 py-0.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-600 dark:text-primary-400 text-xs font-semibold uppercase tracking-wider">
              {totalLeads || 0} Total Submissions
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-normal">
            Complete database of incoming website contact inquiries, instant consultation requests, and booked meeting leads.
          </p>
        </div>

        {/* Quick Channel Breakdown Chips */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50/70 dark:bg-[#07111e]/90 border border-slate-200/80 dark:border-white/10 text-xs font-semibold">
            <Mail className="w-3.5 h-3.5 text-primary-500" />
            <span className="text-slate-500 dark:text-slate-400">Contact:</span>
            <span className="text-slate-900 dark:text-white font-bold">{contactUsCount}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50/70 dark:bg-[#07111e]/90 border border-slate-200/80 dark:border-white/10 text-xs font-semibold">
            <PhoneCall className="w-3.5 h-3.5 text-secondary-500" />
            <span className="text-slate-500 dark:text-slate-400">Touch:</span>
            <span className="text-slate-900 dark:text-white font-bold">{getInTouchCount}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50/70 dark:bg-[#07111e]/90 border border-slate-200/80 dark:border-white/10 text-xs font-semibold">
            <Bot className="w-3.5 h-3.5 text-sky-500" />
            <span className="text-slate-500 dark:text-slate-400">Chatbot:</span>
            <span className="text-slate-900 dark:text-white font-bold">{chatbotCount}</span>
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="bg-white dark:bg-[#0d1526] border border-slate-200/80 dark:border-white/10 rounded-2xl p-4 sm:p-5 lg:p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 dark:border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary-500/10 text-primary-600 dark:text-primary-400 flex items-center justify-center shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white">
                All Inquiries
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Filterable database view sorted by newest submission first
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 text-slate-600 dark:text-slate-300 text-xs font-medium">
            <Sparkles className="w-3 h-3 text-secondary-500" /> Neon PostgreSQL Synced
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4 sm:gap-5">
          <MessagesTableBody limit={12} page={page} baseUrl="/admin/leads" />
        </div>
      </div>
    </div>
  );
}
