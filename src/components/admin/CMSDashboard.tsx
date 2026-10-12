import { createClient } from "@/lib/supabase/server";
import { EnquiryService } from "@/lib/services/enquiryService";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Mail,
  PhoneCall,
  Bot,
  ArrowUpRight,
  Plus,
  ExternalLink,
} from "lucide-react";
import EnquiryDonutChart from "@/components/admin/EnquiryDonutChart";

interface EnquiryRecord {
  id: string;
  source: string;
  full_name: string | null;
  company: string | null;
  email: string | null;
  phone: string | null;
  service: string | string[] | null;
  message: string | null;
  status: string | null;
  created_at: string | null;
}

interface ActivityItem {
  id: string;
  type: string;
  title: string;
  detail: string;
  timestamp: string | null;
  dotColor: string;
  href: string;
}

function formatRelativeTime(dateStr: string | null): string {
  if (!dateStr) return "Recent";
  try {
    const d = new Date(dateStr);
    const now = Date.now();
    const diffMs = now - d.getTime();
    const diffMins = Math.floor(diffMs / (60 * 1000));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch {
    return "Recent";
  }
}

export default async function CMSDashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  // 1. Fetch real Neon enquiry breakdown
  const neonBreakdown = await EnquiryService.getSourceBreakdown();

  // 2. Fetch Supabase legacy contact messages count (if any)
  const { count: sbLeadCount } = await supabase
    .from("contact_messages")
    .select("*", { count: "exact", head: true });

  const contactUsCount = (neonBreakdown?.contact_us || 0) + (sbLeadCount || 0);
  const getInTouchCount = neonBreakdown?.get_in_touch || 0;
  const chatbotCount = neonBreakdown?.chatbot || 0;
  const totalEnquiries = contactUsCount + getInTouchCount + chatbotCount;

  // 3. Fetch recent enquiries from Neon
  const recentNeon = await EnquiryService.getRecentEnquiries(6);
  const recentEnquiries: EnquiryRecord[] = recentNeon.map((row) => ({
    id: String(row.id),
    source: row.source || "contact_us",
    full_name: row.full_name,
    company: row.company,
    email: row.email,
    phone: row.phone,
    service: row.service,
    message: row.message,
    status: row.status || "new",
    created_at: row.created_at ? new Date(row.created_at).toISOString() : null,
  }));

  // Fallback to Supabase legacy messages if Neon has fewer than 5
  if (recentEnquiries.length < 5) {
    const { data: sbMessages } = await supabase
      .from("contact_messages")
      .select("id, full_name, company, email, phone, service, message, created_at, meeting_booked")
      .order("created_at", { ascending: false })
      .limit(5 - recentEnquiries.length);

    if (sbMessages) {
      for (const m of sbMessages) {
        recentEnquiries.push({
          id: String(m.id),
          source: "contact_us",
          full_name: m.full_name,
          company: m.company,
          email: m.email,
          phone: m.phone,
          service: m.service,
          message: m.message,
          status: m.meeting_booked ? "meeting_booked" : "new",
          created_at: m.created_at ? new Date(m.created_at).toISOString() : null,
        });
      }
    }
  }

  // 4. Fetch recent blogs from Supabase
  const { data: recentBlogs } = await supabase
    .from("blogs")
    .select("id, title, slug, created_at, author_name, categories(name)")
    .order("created_at", { ascending: false })
    .limit(5);

  // 5. Build unified chronological activity feed
  const activities: ActivityItem[] = [];

  for (const enq of recentEnquiries) {
    const sourceLabel =
      enq.source === "chatbot"
        ? "Chatbot Lead"
        : enq.source === "get_in_touch"
        ? "Get in Touch"
        : "Contact Us";

    const dotColor =
      enq.source === "chatbot"
        ? "bg-sky-500 shadow-sky-500/50"
        : enq.source === "get_in_touch"
        ? "bg-secondary-500 shadow-secondary-500/50"
        : "bg-primary-500 shadow-primary-500/50";

    const serviceName = Array.isArray(enq.service)
      ? enq.service[0]
      : typeof enq.service === "string" && enq.service
      ? enq.service
      : "General Inquiry";

    activities.push({
      id: `enq-${enq.id}`,
      type: enq.source,
      title: `${enq.full_name || "New Client"} submitted inquiry`,
      detail: `${sourceLabel} • ${serviceName}`,
      timestamp: enq.created_at,
      dotColor,
      href: "/admin/leads",
    });
  }

  if (recentBlogs) {
    for (const blog of recentBlogs) {
      const categoryName = Array.isArray(blog.categories)
        ? blog.categories[0]?.name
        : (blog.categories as { name?: string } | null)?.name || "Article";

      activities.push({
        id: `blog-${blog.id}`,
        type: "blog",
        title: `Blog "${blog.title}" published`,
        detail: `${categoryName} • ${blog.author_name || "Admin"}`,
        timestamp: blog.created_at,
        dotColor: "bg-purple-500 shadow-purple-500/50",
        href: `/admin/blog/${blog.id}`,
      });
    }
  }

  // Sort activities chronologically (newest first)
  activities.sort((a, b) => {
    const tA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
    const tB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
    return tB - tA;
  });

  const topEnquiry = recentEnquiries.length > 0 ? recentEnquiries[0] : null;
  const subsequentEnquiries = recentEnquiries.slice(1, 5);

  return (
    <div className="space-y-6">
      {/* Top Header Banner (Synchronized with Admin Route Standard) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#0d1526] border border-slate-200/80 dark:border-white/10 rounded-2xl p-4 sm:p-5 lg:p-6 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-sans">
              Dashboard Overview
            </h1>
            <span className="px-3 py-0.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-600 dark:text-primary-400 text-xs font-semibold uppercase tracking-wider">
              Live CMS
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-normal">
            Real-time client inquiries, acquisition breakdown, and website updates.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Link
            href="/admin/leads"
            className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-primary-500/10 text-primary-600 dark:text-primary-400 border border-primary-500/20 hover:bg-primary-500/20 transition-all flex items-center gap-1.5"
          >
            <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
            <span>{totalEnquiries} Submissions</span>
          </Link>
          <Link
            href="/admin/blog/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#68b955] hover:bg-[#4e993d] text-white font-bold rounded-xl text-xs sm:text-sm shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Post</span>
          </Link>
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200/60 dark:border-white/10 text-slate-600 dark:text-slate-300 transition-colors shadow-2xs"
            title="View Live Website"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* ROW 1: Three Equally Sized Summary Cards (Reference Layout) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-4 lg:gap-5">
        {/* Card 1: Contact Us */}
        <div className="bg-slate-50/80 dark:bg-[#07111e]/90 border border-slate-200/80 dark:border-white/10 rounded-2xl p-4 sm:p-5 lg:p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Contact Us
            </span>
            <div className="w-9 h-9 rounded-full bg-primary-500/10 text-primary-600 dark:text-primary-400 flex items-center justify-center shadow-xs">
              <Mail className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="block text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-sans">
              {contactUsCount}
            </span>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-primary-600 dark:text-primary-400 mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>Direct website submissions</span>
            </div>
          </div>
        </div>

        {/* Card 2: Get in Touch */}
        <div className="bg-slate-50/80 dark:bg-[#07111e]/90 border border-slate-200/80 dark:border-white/10 rounded-2xl p-4 sm:p-5 lg:p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Get in Touch
            </span>
            <div className="w-9 h-9 rounded-full bg-secondary-500/10 text-secondary-600 dark:text-secondary-400 flex items-center justify-center shadow-xs">
              <PhoneCall className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="block text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-sans">
              {getInTouchCount}
            </span>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-secondary-600 dark:text-secondary-400 mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>Instant callback requests</span>
            </div>
          </div>
        </div>

        {/* Card 3: Chatbot Leads */}
        <div className="bg-slate-50/80 dark:bg-[#07111e]/90 border border-slate-200/80 dark:border-white/10 rounded-2xl p-4 sm:p-5 lg:p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Chatbot Leads
            </span>
            <div className="w-9 h-9 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center shadow-xs">
              <Bot className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="block text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-sans">
              {chatbotCount}
            </span>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-sky-600 dark:text-sky-400 mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>24/7 AI captured leads</span>
            </div>
          </div>
        </div>
      </div>

      {/* ROW 2: Three Panels (Reference Layout) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 lg:gap-6">
        {/* PANEL 1 (Left): Overview / Recent Enquiries */}
        <div className="bg-white dark:bg-[#0d1526] border border-slate-200/80 dark:border-white/10 rounded-2xl p-4 sm:p-5 lg:p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-white/10 pb-3">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  Overview
                </h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Recent customer enquiries
                </p>
              </div>
              <Link
                href="/admin/leads"
                className="px-3 py-1 rounded-full text-[11px] font-semibold bg-primary-500/10 text-primary-600 dark:text-primary-400 border border-primary-500/20 hover:bg-primary-500/20 transition-all"
              >
                View All
              </Link>
            </div>

            {/* Records List */}
            {!topEnquiry ? (
              <div className="py-12 text-center text-slate-400 text-xs font-medium">
                No recent enquiries found.
              </div>
            ) : (
              <div className="space-y-3">
                {/* Standout Highlighted Top Banner (Matching Reference Visual) */}
                <div className="p-3.5 sm:p-4 rounded-xl bg-gradient-to-r from-[#4e993d] to-[#68b955] text-white shadow-sm space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-white/20 text-white font-bold text-xs flex items-center justify-center shrink-0">
                        {(topEnquiry.full_name || "CL").substring(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <span className="block text-xs sm:text-sm font-bold truncate">
                          {topEnquiry.full_name || "New Client"}
                        </span>
                        <span className="block text-[10px] text-white/80 truncate">
                          {topEnquiry.company || "Individual Client"}
                        </span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-[#3d7931] uppercase tracking-wider shrink-0 shadow-2xs">
                      {topEnquiry.status === "meeting_booked" ? "Booked" : "Active"}
                    </span>
                  </div>

                  <div className="text-[11px] font-medium text-white/95 truncate bg-black/10 px-2.5 py-1 rounded-md">
                    {Array.isArray(topEnquiry.service)
                      ? topEnquiry.service[0]
                      : topEnquiry.service || "Website Consultation"}
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-white/80 pt-0.5">
                    <span className="truncate">{topEnquiry.email || topEnquiry.phone}</span>
                    <span className="font-mono shrink-0">{formatRelativeTime(topEnquiry.created_at)}</span>
                  </div>
                </div>

                {/* Subsequent Clean Records */}
                <div className="space-y-2">
                  {subsequentEnquiries.map((enq) => {
                    const initials = (enq.full_name || "CL").substring(0, 2).toUpperCase();
                    const srv = Array.isArray(enq.service)
                      ? enq.service[0]
                      : enq.service || "Inquiry";
                    const isChatbot = enq.source === "chatbot";
                    const isGetInTouch = enq.source === "get_in_touch";

                    return (
                      <div
                        key={enq.id}
                        className="p-2.5 rounded-xl bg-slate-50/70 dark:bg-[#07111e]/90 border border-slate-200/70 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 transition-colors flex items-center justify-between gap-2.5"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300 font-bold text-[10px] flex items-center justify-center shrink-0">
                            {initials}
                          </div>
                          <div className="min-w-0">
                            <span className="block text-xs font-semibold text-slate-900 dark:text-white truncate">
                              {enq.full_name || "Client"}
                            </span>
                            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 truncate">
                              <span
                                className={`px-1.5 py-0.2 rounded text-[9px] font-semibold uppercase ${
                                  isChatbot
                                    ? "bg-sky-500/10 text-sky-600 dark:text-sky-400"
                                    : isGetInTouch
                                    ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                    : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                }`}
                              >
                                {isChatbot ? "Bot" : isGetInTouch ? "Touch" : "Contact"}
                              </span>
                              <span className="truncate">{srv}</span>
                            </div>
                          </div>
                        </div>

                        <span className="text-[10px] text-slate-400 font-mono shrink-0">
                          {formatRelativeTime(enq.created_at)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <Link
            href="/admin/leads"
            className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200/60 dark:border-white/10 text-slate-700 dark:text-slate-200 font-semibold text-xs text-center block transition-all mt-2"
          >
            Manage All Inquiries &rarr;
          </Link>
        </div>

        {/* PANEL 2 (Center): Enquiry-Source Distribution (Donut Gauge) */}
        <div className="bg-white dark:bg-[#0d1526] border border-slate-200/80 dark:border-white/10 rounded-2xl p-4 sm:p-5 lg:p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-white/10 pb-3">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Source Breakdown
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Lead distribution by channel
              </p>
            </div>
            <Link
              href="/admin/leads"
              className="px-3 py-1 rounded-full text-[11px] font-semibold bg-primary-500/10 text-primary-600 dark:text-primary-400 border border-primary-500/20 hover:bg-primary-500/20 transition-all"
            >
              View All
            </Link>
          </div>

          {/* Donut Visualization */}
          <div className="flex-1 flex items-center justify-center py-2">
            <EnquiryDonutChart
              contactUs={contactUsCount}
              getInTouch={getInTouchCount}
              chatbot={chatbotCount}
              total={totalEnquiries}
            />
          </div>

          <div className="text-[10px] text-slate-400 dark:text-slate-500 text-center pt-1 border-t border-slate-100 dark:border-white/10">
            Calculated dynamically from real database records
          </div>
        </div>

        {/* PANEL 3 (Right): Recent Activity Feed */}
        <div className="bg-white dark:bg-[#0d1526] border border-slate-200/80 dark:border-white/10 rounded-2xl p-4 sm:p-5 lg:p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-white/10 pb-3">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  Activity
                </h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Live updates &amp; actions
                </p>
              </div>
              <Link
                href="/admin/leads"
                className="px-3 py-1 rounded-full text-[11px] font-semibold bg-primary-500/10 text-primary-600 dark:text-primary-400 border border-primary-500/20 hover:bg-primary-500/20 transition-all"
              >
                View All
              </Link>
            </div>

            {/* Timeline List */}
            {activities.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs font-medium">
                No recent activity recorded.
              </div>
            ) : (
              <div className="space-y-3.5">
                {activities.slice(0, 5).map((act) => (
                  <Link
                    key={act.id}
                    href={act.href}
                    className="group flex items-start gap-3 p-1.5 -mx-1.5 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                  >
                    {/* Colored Status Dot */}
                    <div className="relative mt-1 shrink-0">
                      <span className={`block w-2.5 h-2.5 rounded-full ${act.dotColor}`} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors truncate">
                        {act.title}
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mt-0.5">
                        <span className="truncate">{act.detail}</span>
                        <span className="font-mono shrink-0 ml-2">
                          {formatRelativeTime(act.timestamp)}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/admin/blog"
            className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200/60 dark:border-white/10 text-slate-700 dark:text-slate-200 font-semibold text-xs text-center block transition-all mt-2"
          >
            Manage Blog &amp; Content &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}