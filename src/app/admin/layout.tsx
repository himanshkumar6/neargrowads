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
  Shield,
  MessageSquare,
  Newspaper,
  Tag,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useState, useEffect, useSyncExternalStore } from "react";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/ThemeToggle";

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
  const supabase = createClient();
  const pathname = usePathname();

  const [mounted, setMounted] = useState(false);
  const externalCollapsed = useSyncExternalStore(subscribeSidebar, getSidebarSnapshot, getSidebarServerSnapshot);
  const isCollapsed = mounted ? externalCollapsed : false;

  useEffect(() => {
    setMounted(true);
  }, []);

  const [userEmail, setUserEmail] = useState<string>('hr@neargrowads.com');
  const [isNavigating, setIsNavigating] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setIsNavigating(false);
  }

  const [dots, setDots] = useState(".");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "." : prev + "."));
    }, 350);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user?.email) {
        setUserEmail(data.user.email);
      }
    });
  }, [supabase]);

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    localStorage.setItem('trisage_sidebar_collapsed', String(newState));
    window.dispatchEvent(new Event('trisage_sidebar_toggle'));
  };

  const handleLogout = async () => {
    const toastId = toast.loading("Signing out...");
    try {
      await supabase.auth.signOut();
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {
      console.error("HR Logout Error:", e);
    }
    toast.success("Successfully signed out. Redirecting...", { id: toastId });
    setTimeout(() => {
      router.replace("/admin/login");
    }, 400);
  };

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const isEditorPage = pathname.startsWith('/admin/blog/') && pathname !== '/admin/blog';

  const currentNavItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Leads Database", href: "/admin/leads", icon: MessageSquare },
    { name: "Blog Management", href: "/admin/blog", icon: Newspaper },
    { name: "Categories", href: "/admin/categories", icon: Tag },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="h-screen bg-slate-100 dark:bg-[#141b29] flex flex-col md:flex-row relative overflow-hidden text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">

      {/* Sidebar (Desktop) */}
      <aside
        className={`${isCollapsed ? "md:w-20" : "md:w-64"} hidden md:flex flex-col h-screen bg-white/95 dark:bg-[#1f2a3e]/95 backdrop-blur-xl border-r border-slate-200 dark:border-slate-800 z-30 shadow-sm transition-all duration-300 ease-in-out shrink-0`}
      >
        {/* Logo Section */}
        <div className={`h-16 border-b border-slate-200 dark:border-slate-800 flex items-center shrink-0 transition-all duration-300 ${isCollapsed ? "justify-center px-0 w-20" : "justify-between px-5 w-64"}`}>
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
              <div className="flex items-center gap-2">
                <div className="flex items-center text-lg font-hero font-bold tracking-tight shrink-0">
                  <span className="text-slate-900 dark:text-white">Near</span>
                  <span className="text-[#68B955]">Grow</span>
                  <span className="text-[#FBAF35] ml-0.5">Ads</span>
                </div>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider border whitespace-nowrap bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20">
                  Website CMS
                </span>
              </div>
            )}
          </Link>
        </div>

        {/* Navigation Items (Strictly Isolated by Active Portal Mode) */}
        <nav className="flex-1 p-3 space-y-4 overflow-y-auto">
          <div>
            {!isCollapsed && (
              <span className="block px-3 mb-2 text-[10px] font-medium uppercase tracking-widest text-slate-400 dark:text-slate-500">
                CMS Management
              </span>
            )}
            <div className="space-y-1">
              {currentNavItems.map((item, idx) => {
                const isActive = item.href === "/admin/dashboard"
                  ? (pathname === "/admin/dashboard" || pathname === "/admin")
                  : pathname.startsWith(item.href);

                return (
                  <Link
                    key={idx}
                    href={item.href}
                    onClick={() => {
                      if (pathname !== item.href) setIsNavigating(true);
                    }}
                    className={`flex items-center gap-3 rounded-xl transition-all font-bold text-xs uppercase tracking-wider ${isActive
                        ? "bg-secondary-500/10 text-secondary-600 dark:text-secondary-400 border border-secondary-500/30 shadow-xs"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                      } ${isCollapsed
                        ? "justify-center w-11 h-11 mx-auto p-0"
                        : "py-2.5 px-3.5"
                      }`}
                    title={item.name}
                  >
                    <item.icon className={`w-4 h-4 shrink-0 ${isActive ? "text-secondary-600 dark:text-secondary-400" : ""}`} />
                    {!isCollapsed && <span className="truncate">{item.name}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Sidebar Collapse Toggle Footer */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 shrink-0">
          <button
            onClick={toggleSidebar}
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            className={`flex items-center justify-center text-xs font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all cursor-pointer ${isCollapsed ? "w-11 h-11 p-0 mx-auto" : "w-full py-2.5 px-3.5 gap-2"
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

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 px-4 sm:px-8 bg-white/90 dark:bg-[#1f2a3e]/90 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 flex items-center justify-between z-20 shrink-0 shadow-xs">
          <div className="flex items-center gap-3">
            {/* Mobile Logo */}
            <div className="md:hidden flex items-center gap-2">
              <Image
                src="/icon.png"
                alt="NearGrow Ads"
                width={32}
                height={32}
                priority
                className="w-7 h-7 object-contain shrink-0"
              />
              <div className="flex items-center text-base font-hero font-bold tracking-tight shrink-0">
                <span className="text-slate-900 dark:text-white">Near</span>
                <span className="text-[#68B955]">Grow</span>
                <span className="text-[#FBAF35] ml-0.5">Ads</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-semibold uppercase tracking-wider border whitespace-nowrap bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20">
                Website CMS
              </span>
            </div>

            <div className="hidden md:flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <span>NearGrow Ads EMS</span>
              <span>/</span>
              <span className="text-slate-900 dark:text-white capitalize">
                {pathname.split('/').pop() || 'Dashboard'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="hidden xs:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
              <Shield className="w-3.5 h-3.5" />
              <span>{userEmail}</span>
            </div>

            <ThemeToggle />

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-xs font-bold transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </header>

        {/* Main Content Viewport */}
        <main className={`flex-1 overflow-y-auto relative z-10 w-full ${isEditorPage ? 'p-0' : 'p-4 sm:p-8 pb-24 md:pb-8'}`} data-lenis-prevent="true">
          {isNavigating && (
            <div className="fixed inset-0 z-50 bg-[#f8fafc]/95 dark:bg-[#0f172a]/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-slate-900 dark:text-white font-sans animate-in fade-in duration-150">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="relative flex items-center justify-center">
                  <div className="w-10 h-10 border-3 border-slate-200 dark:border-slate-800 border-t-secondary-500 rounded-full animate-spin" />
                </div>

                <div className="text-sm font-medium text-slate-600 dark:text-slate-300 tracking-wide font-sans">
                  Loading{dots}
                </div>
              </div>
            </div>
          )}
          {children}
        </main>

        {/* CONNECTED MOBILE BOTTOM NAVIGATION BAR (DOCKED TO BOTTOM EDGE) */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 w-full">
          <nav className="bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.35)] px-2 py-2 flex items-center justify-around relative overflow-hidden transition-colors duration-300">
            {currentNavItems.map((item, idx) => {
              const isActive = item.href === "/admin/dashboard"
                ? (pathname === "/admin/dashboard" || pathname === "/admin")
                : pathname.startsWith(item.href);

              return (
                <Link
                  key={idx}
                  href={item.href}
                  onClick={() => {
                    if (pathname !== item.href) setIsNavigating(true);
                  }}
                  className={`flex flex-col items-center justify-center py-1 px-2.5 transition-all relative group cursor-pointer ${isActive ? "text-secondary-600 dark:text-secondary-400" : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                    }`}
                >
                  {/* Top Active Indicator Line */}
                  {isActive && (
                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-linear-to-r from-secondary-500 to-cyan-400 rounded-full shadow-[0_0_8px_rgba(56,189,248,0.8)] animate-in fade-in zoom-in-75 duration-200" />
                  )}

                  <item.icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? "scale-110 text-secondary-600 dark:text-secondary-400" : "group-hover:scale-105"}`} />
                  <span className={`text-[10px] font-bold tracking-tight mt-1 transition-colors ${isActive ? "text-slate-900 dark:text-white font-bold" : "text-slate-500 dark:text-slate-400"}`}>
                    {item.name === "Dashboard" ? "Home" : item.name === "Leads Database" ? "Leads" : item.name === "Blog Management" ? "Blog" : "Settings"}
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
