/* eslint-disable @typescript-eslint/no-unused-vars */
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { User, Bell, Shield, Palette } from "lucide-react";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  // Murphy's Law: Providing a beautiful fallback for the email if it fails to load
  const userEmail = user.email || "admin@neargrowads.com";

  return (
    <div className="p-4 sm:p-6 md:p-12 w-full max-w-4xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
          Portal Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Manage your account preferences, security, and notifications.
        </p>
      </div>

      <div className="space-y-8">
        {/* Profile Section */}
        <section className="bg-white/60 dark:bg-[#0a1220]/60 backdrop-blur-xl rounded-[2rem] border border-gray-200/50 dark:border-white/5 shadow-xl overflow-hidden p-5 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
            <div className="p-3 bg-primary-50 dark:bg-primary-500/10 rounded-xl">
              <User className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Admin Profile</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Your personal administrator details.</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
              <input 
                type="text" 
                value={userEmail} 
                disabled 
                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-500 dark:text-gray-400 cursor-not-allowed"
              />
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section className="bg-white/60 dark:bg-[#0a1220]/60 backdrop-blur-xl rounded-[2rem] border border-gray-200/50 dark:border-white/5 shadow-xl overflow-hidden p-5 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
            <div className="p-3 bg-rose-50 dark:bg-rose-500/10 rounded-xl">
              <Shield className="w-6 h-6 text-rose-600 dark:text-rose-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Security</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Keep your CRM data locked down and secure.</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-gray-100 dark:border-white/5 rounded-xl bg-gray-50/50 dark:bg-white/[0.02]">
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">Account Password</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">We recommend rotating your password every 90 days.</p>
              </div>
              <button className="px-5 py-2.5 bg-white dark:bg-[#0a1220] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                Change Password
              </button>
            </div>
          </div>
        </section>

        {/* Notifications Section */}
        <section className="bg-white/60 dark:bg-[#0a1220]/60 backdrop-blur-xl rounded-[2rem] border border-gray-200/50 dark:border-white/5 shadow-xl overflow-hidden p-5 sm:p-8 opacity-50 cursor-not-allowed">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
            <div className="p-3 bg-amber-50 dark:bg-amber-500/10 rounded-xl">
              <Bell className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Notifications</h2>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full">Coming Soon</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Manage email and SMS alerts for new leads.</p>
            </div>
          </div>
          
          <div className="space-y-4 pointer-events-none">
            <div className="flex items-center justify-between p-4 border border-gray-100 dark:border-white/5 rounded-xl bg-gray-50/50 dark:bg-white/[0.02]">
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">New Lead Emails</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Get an email instantly when someone fills out the form.</p>
              </div>
              <div className="w-12 h-6 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center px-1">
                <div className="w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
