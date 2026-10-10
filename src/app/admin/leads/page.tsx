import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import MessagesTableBody from "@/components/admin/MessagesTableBody";
import { MessageSquare } from "lucide-react";

export default async function LeadsPage(props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const searchParams = await props.searchParams;
  const page = Number(searchParams?.page) || 1;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  // Count total inquiries
  const { count: totalLeads } = await supabase
    .from('contact_messages')
    .select('*', { count: 'exact', head: true });

  return (
    <div className="p-4 sm:p-6 md:p-10 w-full max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#1f2a3e] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              Master Lead Database
            </h1>
            <span className="px-3 py-0.5 rounded-full bg-secondary-500/10 border border-secondary-500/20 text-secondary-600 dark:text-secondary-400 text-xs font-medium uppercase tracking-wider">
              {totalLeads || 0} Total Submissions
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-normal">
            Complete database of incoming website contact inquiries, consultation requests, and booked meeting leads.
          </p>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="bg-white dark:bg-[#1f2a3e] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-secondary-500/10 text-secondary-500 flex items-center justify-center shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white">All Inquiries</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Filterable database view sorted by newest submission first</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          <MessagesTableBody limit={12} page={page} baseUrl="/admin/leads" />
        </div>
      </div>
    </div>
  );
}
