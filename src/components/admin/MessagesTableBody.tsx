import { createClient } from "@/lib/supabase/server";
import { Mail, Phone, Building, Tag } from "lucide-react";
import Link from "next/link";
import MessageActions from "./MessageActions";

export interface ContactMessage {
  id: string;
  full_name: string | null;
  company: string | null;
  email: string | null;
  phone: string | null;
  service: string | string[] | null;
  message: string | null;
  created_at: string | null;
  meeting_booked: boolean;
}

interface MessagesTableBodyProps {
  limit?: number;
  page?: number;
  baseUrl?: string;
}

export default async function MessagesTableBody({ limit = 9, page = 1, baseUrl = "/admin/dashboard" }: MessagesTableBodyProps) {
  const supabase = await createClient();
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const query = supabase
    .from('contact_messages')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  const { data: messages, count, error } = await query;

  if (error || !messages || messages.length === 0) {
    return (
      <div className="col-span-full py-16 px-4 text-center flex flex-col items-center justify-center bg-white/40 dark:bg-black/20 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mb-4 shadow-xs">
          <Mail className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">No Inquiries Found</h3>
        <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm max-w-sm leading-relaxed">
          When website visitors fill out the contact form or book a meeting, their details will appear here automatically.
        </p>
      </div>
    );
  }

  return (
    <>
      {messages.map((msg: ContactMessage) => {
        // Murphy's Law: Never trust database data structure
        const safeName = msg.full_name ?? "Unknown Applicant";
        const safeCompany = msg.company ?? "Individual / N/A";
        const safeEmail = msg.email ?? "No email provided";
        const safePhone = msg.phone ?? "No phone provided";
        const rawService = msg.service;
        let serviceArray: string[] = [];
        if (Array.isArray(rawService)) {
          serviceArray = rawService;
        } else if (typeof rawService === 'string' && rawService.trim() !== '') {
          serviceArray = rawService.split(',');
        } else {
          serviceArray = ["General Inquiry"];
        }
        const safeMessage = msg.message ?? "No message content provided.";
        
        let safeDateShort = "Recent";
        let safeTimeShort = "";
        try {
          if (msg.created_at) {
            const d = new Date(msg.created_at);
            safeDateShort = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            safeTimeShort = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
          }
        } catch (e) {
          console.error("Invalid date format from DB", e);
        }

        const initials = safeName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'IN';

        return (
          <div 
            key={msg.id} 
            className={`group relative transition-all duration-300 border p-5 rounded-3xl shadow-sm hover:shadow-md flex flex-col justify-between ${
              msg.meeting_booked 
                ? "border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-500/10" 
                : "border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-[#192233]/90 hover:border-slate-300 dark:hover:border-slate-700"
            }`}
          >
            <div className="space-y-4">
              {/* Card Header: Avatar, Name, Company & Status Badge */}
              <div className="flex items-start justify-between gap-3 border-b border-slate-200/60 dark:border-slate-800/60 pb-3.5">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-600 to-secondary-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                    {initials}
                  </div>
                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white truncate">
                        {safeName}
                      </h3>
                      {msg.meeting_booked && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shrink-0">
                          Booked
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs font-semibold text-secondary-600 dark:text-secondary-400 truncate">
                      <Building className="w-3 h-3 shrink-0" />
                      <span className="truncate">{safeCompany}</span>
                    </div>
                  </div>
                </div>

                {/* Date Badge */}
                <div className="text-right shrink-0">
                  <span className="block text-[11px] font-bold text-slate-800 dark:text-slate-200 font-mono">{safeDateShort}</span>
                  <span className="block text-[10px] text-slate-400 dark:text-slate-500 font-mono">{safeTimeShort}</span>
                </div>
              </div>

              {/* Service Badges */}
              <div className="flex flex-wrap gap-1.5">
                {serviceArray.map((srv: string, idx: number) => {
                  const safeSrv = typeof srv === 'string' ? srv.trim() : String(srv || '');
                  if (!safeSrv) return null;
                  return (
                    <span 
                      key={idx} 
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-medium tracking-wider uppercase bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/60"
                    >
                      <Tag className="w-2.5 h-2.5 text-slate-400" />
                      {safeSrv}
                    </span>
                  );
                })}
              </div>

              {/* Contact Information Grid (Centered Text & Equal Alignment) */}
              <div className="grid grid-cols-1 gap-2 p-3 rounded-2xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 text-xs">
                <div className="flex items-center justify-between gap-2 border-b border-slate-200/40 dark:border-slate-800/40 pb-1.5">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1 shrink-0">
                    <Mail className="w-3 h-3 text-secondary-500" /> Email
                  </span>
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate text-right">{safeEmail}</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1 shrink-0">
                    <Phone className="w-3 h-3 text-emerald-500" /> Phone
                  </span>
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100 font-mono text-right">{safePhone}</span>
                </div>
              </div>

              {/* Message Content Quote */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Message Statement:</span>
                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed italic bg-slate-50/50 dark:bg-slate-900/30 p-2.5 rounded-xl border border-slate-200/40 dark:border-slate-800/40" title={safeMessage}>
                  &quot;{safeMessage}&quot;
                </p>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-3 mt-4 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between gap-3">
              <span className="text-[10px] font-semibold text-slate-400 shrink-0 whitespace-nowrap">ID: {String(msg.id).substring(0, 8)}...</span>
              <MessageActions msg={msg} />
            </div>
          </div>
        );
      })}

      {/* Pagination Controls */}
      {count && count > limit && (
        <div className="col-span-full flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200/80 dark:border-slate-800 mt-4">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 text-center sm:text-left">
            Showing <span className="font-bold text-slate-900 dark:text-white">{(page - 1) * limit + 1}</span> to <span className="font-bold text-slate-900 dark:text-white">{Math.min(page * limit, count)}</span> of <span className="font-bold text-slate-900 dark:text-white">{count}</span> lead inquiries
          </div>
          <div className="flex items-center gap-2">
            {page > 1 ? (
              <Link 
                href={`${baseUrl}?page=${page - 1}`}
                className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-xs"
              >
                &larr; Previous Page
              </Link>
            ) : (
              <button disabled className="px-4 py-2 text-xs font-semibold text-slate-400 dark:text-slate-600 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl cursor-not-allowed opacity-60">
                &larr; Previous Page
              </button>
            )}
            
            {page * limit < count ? (
              <Link 
                href={`${baseUrl}?page=${page + 1}`}
                className="px-4 py-2 text-xs font-semibold text-white bg-secondary-600 hover:bg-secondary-700 rounded-xl shadow-md transition-all"
              >
                Next Page &rarr;
              </Link>
            ) : (
              <button disabled className="px-4 py-2 text-xs font-semibold text-slate-400 dark:text-slate-600 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl cursor-not-allowed opacity-60">
                Next Page &rarr;
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
