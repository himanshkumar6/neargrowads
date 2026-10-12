import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  User,
  ShieldCheck,
  Database,
  CheckCircle2,
  Clock,
  Sparkles,
  Server,
  Lock,
  ArrowUpRight,
  ExternalLink,
  MessageSquare,
  KeyRound,
} from "lucide-react";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const userEmail = user.email || "hr@neargrowads.com";
  const userInitials = userEmail.substring(0, 2).toUpperCase();

  return (
    <div className="space-y-6">
      {/* 1. Header Banner (Synchronized with CMS Standard) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#0d1526] border border-slate-200/80 dark:border-white/10 rounded-2xl p-4 sm:p-5 lg:p-6 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight font-sans">
              Portal Settings
            </h1>
            <span className="px-3 py-0.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-600 dark:text-primary-400 text-xs font-semibold uppercase tracking-wider">
              System Active
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-normal">
            Manage your administrator credentials, database connections, encryption protocols, and system controls.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href="/admin/leads"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200/60 dark:border-white/10 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-semibold transition-colors shadow-2xs"
          >
            <MessageSquare size={15} />
            <span>Master Leads</span>
          </Link>
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#68b955] hover:bg-[#4e993d] text-white font-bold rounded-xl text-xs sm:text-sm shadow-xs transition-all cursor-pointer"
          >
            <ExternalLink size={15} />
            <span>Live Website</span>
          </a>
        </div>
      </div>

      {/* 2. ROW 1: Three Equally Sized Summary Cards (Dashboard Pattern) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
        {/* Card 1: Admin Authority */}
        <div className="bg-slate-50/80 dark:bg-[#07111e]/90 border border-slate-200/80 dark:border-white/10 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Admin Access
            </span>
            <div className="w-9 h-9 rounded-full bg-primary-500/10 text-primary-600 dark:text-primary-400 flex items-center justify-center shadow-xs">
              <User className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="block text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-sans">
              Super Admin
            </span>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-primary-600 dark:text-primary-400 mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>Full read, write &amp; delete privileges</span>
            </div>
          </div>
        </div>

        {/* Card 2: Cloud Infrastructure */}
        <div className="bg-slate-50/80 dark:bg-[#07111e]/90 border border-slate-200/80 dark:border-white/10 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Database Cluster
            </span>
            <div className="w-9 h-9 rounded-full bg-secondary-500/10 text-secondary-600 dark:text-secondary-400 flex items-center justify-center shadow-xs">
              <Database className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="block text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-sans">
              2 Services
            </span>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-secondary-600 dark:text-secondary-400 mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>Neon PostgreSQL + Supabase</span>
            </div>
          </div>
        </div>

        {/* Card 3: Security & Encryption */}
        <div className="bg-slate-50/80 dark:bg-[#07111e]/90 border border-slate-200/80 dark:border-white/10 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Data Governance
            </span>
            <div className="w-9 h-9 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="block text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-sans">
              TLS 1.3 / AES
            </span>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-sky-600 dark:text-sky-400 mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>100% server secrets isolated</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. ROW 2: Two Panels — Left Profile (Col 5) + Right Infrastructure (Col 7) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        {/* Left Column: Admin Profile Card */}
        <div className="xl:col-span-5 bg-white dark:bg-[#0d1526] border border-slate-200/80 dark:border-white/10 rounded-2xl p-4 sm:p-5 lg:p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-3 border-b border-slate-200/80 dark:border-white/10 pb-4">
            <div className="w-9 h-9 rounded-xl bg-primary-500/10 text-primary-600 dark:text-primary-400 flex items-center justify-center shrink-0">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                Administrator Profile
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Authenticated session identity &amp; governance
              </p>
            </div>
          </div>

          {/* User Details Pill */}
          <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-[#07111e]/90 border border-slate-200/70 dark:border-white/10 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#68b955] to-[#4e993d] text-white flex items-center justify-center font-bold text-base shadow-xs shrink-0">
                {userInitials}
              </div>
              <div className="min-w-0">
                <span className="block text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                  {userEmail}
                </span>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-primary-500/10 text-primary-600 dark:text-primary-400">
                    Administrator
                  </span>
                  <span>•</span>
                  <span>Primary</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full shrink-0">
              <CheckCircle2 className="w-3 h-3" />
              <span>Verified</span>
            </div>
          </div>

          {/* Session Lifecycle Details */}
          <div className="space-y-2.5 pt-1">
            <div className="flex items-center justify-between text-xs py-2 border-b border-slate-100 dark:border-white/10">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-slate-400" /> Authentication Provider
              </span>
              <span className="font-semibold text-slate-900 dark:text-white">Supabase Auth (JWT)</span>
            </div>

            <div className="flex items-center justify-between text-xs py-2 border-b border-slate-100 dark:border-white/10">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" /> Session Persistence
              </span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">HttpOnly Cookie</span>
            </div>

            <div className="flex items-center justify-between text-xs py-2">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400" /> Privilege Level
              </span>
              <span className="font-semibold text-slate-900 dark:text-white">Root Workspace Admin</span>
            </div>
          </div>
        </div>

        {/* Right Column: Database & Cloud Infrastructure Card */}
        <div className="xl:col-span-7 bg-white dark:bg-[#0d1526] border border-slate-200/80 dark:border-white/10 rounded-2xl p-4 sm:p-5 lg:p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-3 border-b border-slate-200/80 dark:border-white/10 pb-4">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                Connected Cloud Infrastructure
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Active database backends and API dispatch systems
              </p>
            </div>
          </div>

          <div className="space-y-3.5">
            {/* Database 1: Neon PostgreSQL */}
            <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-[#07111e]/90 border border-slate-200/70 dark:border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-primary-500/10 text-[#68b955] flex items-center justify-center">
                    <Server className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    Neon PostgreSQL (Production Serverless)
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Connected
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed pl-9">
                Project ID: <span className="font-mono text-[11px] text-slate-700 dark:text-slate-300 font-semibold">odd-silence-82467980</span> • Branch: <span className="font-mono text-[11px] text-slate-700 dark:text-slate-300 font-semibold">production</span>. Powers real-time storage for Contact Us, Get in Touch, and Chatbot enquiry capture.
              </p>
            </div>

            {/* Database 2: Supabase CMS */}
            <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-[#07111e]/90 border border-slate-200/70 dark:border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-secondary-500/10 text-secondary-500 flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    Supabase CMS &amp; Authentication Engine
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Operational
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed pl-9">
                Stores published marketing articles, taxonomy categories, autosaved drafts, admin credentials, and media assets.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. ROW 3: Security & Data Governance Controls (Full Width) */}
      <div className="bg-white dark:bg-[#0d1526] border border-slate-200/80 dark:border-white/10 rounded-2xl p-4 sm:p-5 lg:p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-200/80 dark:border-white/10 pb-3">
          <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              Security Architecture &amp; Data Protection
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Zero-leak credential isolation and parameterized database query execution
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-[#07111e]/90 border border-slate-200/70 dark:border-white/10 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                Server-Side Secret Isolation
              </span>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                Enforced
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Database connection strings and service role secrets strictly restricted to secure server environments. Zero client-side leakage.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-[#07111e]/90 border border-slate-200/70 dark:border-white/10 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                Parameterized Queries
              </span>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                Active
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              All enquiry and blog inputs are filtered through sanitized, parameterized prepared statements to prevent injection vulnerabilities.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-[#07111e]/90 border border-slate-200/70 dark:border-white/10 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                Throttling &amp; Anti-Spam
              </span>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                Protected
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Inquiry submission endpoints are safeguarded against automated bot submissions, duplicate spam requests, and replay vectors.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
