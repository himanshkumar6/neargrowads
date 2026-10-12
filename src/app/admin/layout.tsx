"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import {
  LogOut,
  LayoutDashboard,
  Settings,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  BookOpenText,
  FolderTree,
  Headphones,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useState, useEffect, useSyncExternalStore } from "react";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/ThemeToggle";

import { triggerPageTransition } from "@/components/BrandedPageLoader";

const subscribeSidebar = (callback: () => void) => {
  window.addEventListener("storage", callback);
  window.addEventListener("trisage_sidebar_toggle", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("trisage_sidebar_toggle", callback);
  };
};

const getSidebarSnapshot = () => localStorage.getItem("trisage_sidebar_collapsed") === "true";
const getSidebarServerSnapshot = () => false;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const isCollapsed = useSyncExternalStore(subscribeSidebar, getSidebarSnapshot, getSidebarServerSnapshot);
  const [userEmail, setUserEmail] = useState<string>("hr@neargrowads.com");

  useEffect(() => {
    let isMounted = true;
    const supabase = createClient();

    supabase.auth
      .getUser()
      .then(({ data, error }) => {
        if (!isMounted) return;
        if (data?.user?.email) {
          setUserEmail(data.user.email);
        } else if (error) {
          if (
            error.code === 'refresh_token_not_found' ||
            error.message?.toLowerCase().includes('refresh token not found')
          ) {
            supabase.auth.signOut().catch(() => {});
          }
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    localStorage.setItem("trisage_sidebar_collapsed", String(newState));
    window.dispatchEvent(new Event("trisage_sidebar_toggle"));
  };

  const handleLogout = async () => {
    const toastId = toast.loading("Signing out...");
    triggerPageTransition("/admin/login");
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {
      console.error("Logout Error:", e);
    }
    toast.success("Successfully signed out. Redirecting...", { id: toastId });
    router.replace("/admin/login");
  };

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const currentNavItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Leads Database", href: "/admin/leads", icon: MessageSquare },
    { name: "Blog Management", href: "/admin/blog", icon: BookOpenText },
    { name: "Categories", href: "/admin/categories", icon: FolderTree },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="h-screen w-full bg-[#f8fafc] dark:bg-[#050b14] flex flex-col md:flex-row relative overflow-hidden text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">
      {/* Sidebar (Desktop) - Directly connected to parent */}
      <aside
        className={`${
          isCollapsed ? "md:w-20" : "md:w-64"
        } hidden md:flex flex-col h-screen bg-white/95 dark:bg-[#07111e]/95 backdrop-blur-xl border-r border-slate-200/80 dark:border-white/10 z-30 shadow-xs transition-all duration-300 ease-in-out shrink-0 overflow-x-hidden`}
      >
        {/* Logo Section */}
        <div
          className={`h-16 border-b border-slate-200/80 dark:border-white/10 flex items-center shrink-0 transition-all duration-300 overflow-hidden ${
            isCollapsed ? "justify-center px-0 w-20" : "justify-between px-5 w-64"
          }`}
        >
          <Link href="/admin/dashboard" className="flex items-center gap-2.5 overflow-hidden">
            <Image
              src="/icon.png"
              alt="NearGrow Ads"
              width={34}
              height={34}
              priority
              className="w-8 h-8 object-contain shrink-0"
            />
            {!isCollapsed && (
              <div className="flex flex-col min-w-0 justify-center">
                <div className="flex items-center text-base font-hero font-bold tracking-tight leading-tight">
                  <span className="text-slate-900 dark:text-white">Near</span>
                  <span className="text-[#68B955]">Grow</span>
                  <span className="text-[#FBAF35] ml-0.5">Ads</span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#68b955] animate-pulse shrink-0" />
                  <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">
                    Website CMS
                  </span>
                </div>
              </div>
            )}
          </Link>
        </div>

        {/* Navigation Items (Middle flex-1 scrollable area without horizontal scrollbar) */}
        <div className="flex-1 p-3 overflow-y-auto overflow-x-hidden">
          {!isCollapsed && (
            <span className="block px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              CMS Management
            </span>
          )}
          <nav className="space-y-1.5">
            {currentNavItems.map((item, idx) => {
              const isActive =
                item.href === "/admin/dashboard"
                  ? pathname === "/admin/dashboard" || pathname === "/admin"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={idx}
                  href={item.href}
                  className={`group relative flex items-center rounded-xl transition-all ${
                    isActive
                      ? "bg-[#68b955] text-white shadow-sm shadow-[#68b955]/30 font-bold"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white font-semibold"
                  } ${
                    isCollapsed
                      ? "w-11 h-11 mx-auto justify-center p-0"
                      : "py-2 px-2.5 gap-2.5 text-xs tracking-tight"
                  }`}
                  title={item.name}
                >
                  {/* Modern Icon Container */}
                  <div
                    className={`rounded-lg flex items-center justify-center shrink-0 transition-all ${
                      isCollapsed
                        ? "w-full h-full"
                        : "w-7 h-7 " +
                          (isActive
                            ? "bg-white/20 text-white"
                            : "bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 group-hover:bg-slate-200/90 dark:group-hover:bg-white/10 group-hover:text-slate-900 dark:group-hover:text-white")
                    }`}
                  >
                    <item.icon
                      className={`shrink-0 transition-transform group-hover:scale-105 ${
                        isCollapsed ? "w-5 h-5 stroke-[1.85]" : "w-4 h-4 stroke-[1.85]"
                      } ${isActive ? "text-white" : ""}`}
                    />
                  </div>

                  {!isCollapsed && <span className="truncate">{item.name}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Bottom Docked Section (Support Card + Collapse Toggle) */}
        <div className="p-3 border-t border-slate-200/80 dark:border-white/10 shrink-0 space-y-2.5 bg-slate-50/60 dark:bg-[#050b14]/70 overflow-x-hidden">
          {/* 24/7 Support Card */}
          {!isCollapsed ? (
            <div className="p-3 rounded-2xl bg-gradient-to-br from-[#68b955]/15 via-[#68b955]/5 to-transparent border border-[#68b955]/25 text-slate-800 dark:text-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-[#68b955] text-white font-extrabold text-[10px] flex items-center justify-center shadow-xs">
                    24/7
                  </span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    Support
                  </span>
                </div>
                <Headphones className="w-4 h-4 text-[#68b955]" />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                Need technical assistance?
              </p>
              <a
                href="mailto:support@neargrowads.com"
                className="inline-flex items-center justify-center w-full py-1.5 px-3 rounded-xl bg-[#68b955] hover:bg-[#4e993d] text-white text-[11px] font-semibold transition-colors shadow-2xs"
              >
                Contact Team
              </a>
            </div>
          ) : (
            <div className="flex justify-center">
              <a
                href="mailto:support@neargrowads.com"
                title="24/7 Tech Support"
                className="w-11 h-11 rounded-xl bg-[#68b955]/15 text-[#68b955] border border-[#68b955]/30 flex items-center justify-center font-bold text-[10px] hover:bg-[#68b955] hover:text-white transition-colors"
              >
                24/7
              </a>
            </div>
          )}

          {/* Collapse Sidebar Toggle */}
          <button
            onClick={toggleSidebar}
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            className={`flex items-center justify-center text-xs font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-200/80 dark:hover:bg-white/5 rounded-xl transition-all cursor-pointer ${
              isCollapsed ? "w-11 h-11 p-0 mx-auto" : "w-full py-2 px-3 gap-2"
            }`}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4 shrink-0" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4 shrink-0" />
                <span className="truncate">Collapse Sidebar</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content Area - Directly connected to parent */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 px-4 sm:px-6 lg:px-8 bg-white/95 dark:bg-[#07111e]/95 backdrop-blur-xl border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between z-20 shrink-0 shadow-xs">
          <div className="flex items-center gap-2 xs:gap-3 min-w-0">
            {/* Mobile Logo */}
            <div className="md:hidden flex items-center gap-1.5 xs:gap-2 min-w-0">
              <Image
                src="/icon.png"
                alt="NearGrow Ads"
                width={30}
                height={30}
                priority
                className="w-6 h-6 xs:w-7 xs:h-7 object-contain shrink-0"
              />
              <div className="flex items-center text-sm xs:text-base font-hero font-bold tracking-tight shrink-0">
                <span className="text-slate-900 dark:text-white">Near</span>
                <span className="text-[#68B955]">Grow</span>
                <span className="text-[#FBAF35] ml-0.5">Ads</span>
              </div>
              <span className="hidden xxs:inline-block px-1.5 xs:px-2 py-0.5 rounded-lg text-[9px] font-semibold uppercase tracking-wider border whitespace-nowrap bg-primary-500/10 text-primary-600 dark:text-primary-400 border-primary-500/20">
                CMS
              </span>
            </div>

            <div className="hidden md:flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 tracking-normal">
              <Link
                href="/admin"
                className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
              >
                NearGrow Ads CMS
              </Link>
              <span className="text-slate-300 dark:text-white/20 select-none font-normal">/</span>
              <span className="text-slate-900 dark:text-white font-semibold">
                {pathname === "/admin/blog/new"
                  ? "New Article"
                  : pathname === "/admin/blog/categories" || pathname === "/admin/categories"
                  ? "Blog Categories"
                  : pathname.startsWith("/admin/blog/")
                  ? "Edit Article"
                  : pathname === "/admin/blog"
                  ? "Blog Posts"
                  : pathname === "/admin/leads"
                  ? "Inquiries & Leads"
                  : pathname === "/admin/settings"
                  ? "Settings"
                  : pathname === "/admin/dashboard" || pathname === "/admin"
                  ? "Dashboard"
                  : pathname.split("/").pop() || "Dashboard"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-4 shrink-0">
            <div className="hidden xs:flex items-center px-3.5 py-1.5 rounded-full bg-[#68b955]/10 border border-[#68b955]/20 text-[#68b955] dark:text-[#7ec269] text-xs font-bold max-w-[200px] lg:max-w-none">
              <span suppressHydrationWarning className="truncate">{userEmail}</span>
            </div>

            <ThemeToggle />

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 xs:px-3.5 py-1.5 rounded-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-xs font-bold transition-all cursor-pointer min-h-[36px]"
              title="Sign Out"
              aria-label="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </header>

        {/* Main Content Viewport */}
        <main
          className="flex-1 overflow-y-auto overflow-x-hidden relative z-10 w-full px-4 sm:px-6 lg:px-8 py-5 sm:py-6 lg:py-8 pb-[max(6rem,calc(5rem+env(safe-area-inset-bottom)))] md:pb-8"
          data-lenis-prevent="true"
        >
          {/* Unified Centralized Content Canvas */}
          <div className="w-full max-w-[1536px] mx-auto">
            {children}
          </div>
        </main>

        {/* CONNECTED MOBILE BOTTOM NAVIGATION BAR (DOCKED TO BOTTOM EDGE WITH SAFE AREA) */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 w-full">
          <nav className="bg-white/95 dark:bg-[#07111e]/95 backdrop-blur-xl border-t border-slate-200/80 dark:border-white/10 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.35)] px-1 xs:px-2 pt-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] flex items-center justify-around relative overflow-hidden transition-colors duration-300">
            {currentNavItems.map((item, idx) => {
              const isActive =
                item.href === "/admin/dashboard"
                  ? pathname === "/admin/dashboard" || pathname === "/admin"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={idx}
                  href={item.href}
                  className={`flex flex-col items-center justify-center py-1 px-1.5 xs:px-2.5 transition-all relative group cursor-pointer min-h-[44px] min-w-[44px] ${
                    isActive
                      ? "text-[#68b955] dark:text-[#7ec269]"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                  }`}
                >
                  {/* Top Active Indicator Line */}
                  {isActive && (
                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-[#68b955] to-[#fbaf35] rounded-full shadow-[0_0_8px_rgba(104,185,85,0.6)] animate-in fade-in zoom-in-75 duration-200" />
                  )}

                  <item.icon
                    className={`w-5 h-5 transition-transform duration-200 ${
                      isActive
                        ? "scale-110 text-[#68b955] dark:text-[#7ec269]"
                        : "group-hover:scale-105"
                    }`}
                  />
                  <span
                    className={`text-[10px] font-bold tracking-tight mt-1 transition-colors ${
                      isActive
                        ? "text-slate-900 dark:text-white font-bold"
                        : "text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    {item.name === "Dashboard"
                      ? "Home"
                      : item.name === "Leads Database"
                      ? "Leads"
                      : item.name === "Blog Management"
                      ? "Blog"
                      : item.name === "Categories"
                      ? "Categories"
                      : "Settings"}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
