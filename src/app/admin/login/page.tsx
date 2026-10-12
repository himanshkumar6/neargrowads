"use client";

import { useTransition, Suspense, useEffect } from "react";
import { login } from "./actions";
import { Lock, Mail, Loader2, ArrowRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { triggerPageTransition } from "@/components/BrandedPageLoader";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const reason = searchParams.get("reason");
    if (reason === "session_expired") {
      toast.error("Your session has expired. Please sign in again.");
    }
  }, [searchParams]);

  const returnUrlRaw = searchParams.get("returnUrl") || "";
  const returnUrl =
    returnUrlRaw && returnUrlRaw.startsWith("/admin") && !returnUrlRaw.startsWith("/admin/login")
      ? returnUrlRaw
      : "/admin/dashboard";

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await login(formData);
      if (result?.error) {
        toast.error(result.error || "Authentication failed");
      } else if (result?.success) {
        toast.success("Login successful. Redirecting...");
        const targetRoute = result.redirectUrl || returnUrl;
        triggerPageTransition(targetRoute);
        router.push(targetRoute);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="hidden" name="returnUrl" value={returnUrl} />

      <div>
        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 ml-1 uppercase tracking-wider">
          Email
        </label>
        <div className="relative group/input">
          <div className="absolute inset-y-0 left-0 pl-3 sm:pl-3.5 flex items-center pointer-events-none transition-colors group-focus-within/input:text-primary-500">
            <Mail className="w-4 h-4 text-gray-400 group-focus-within/input:text-primary-500 transition-colors" />
          </div>
          <input
            type="email"
            name="email"
            required
            className="w-full pl-9 sm:pl-10 pr-3.5 py-3 min-h-[44px] bg-white dark:bg-[#050b14]/80 border border-slate-200/90 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-[#68b955]/30 focus:border-[#68b955] transition-all outline-none text-base sm:text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 shadow-inner"
            placeholder="admin@neargrowads.com"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 ml-1 uppercase tracking-wider">
          Password
        </label>
        <div className="relative group/input">
          <div className="absolute inset-y-0 left-0 pl-3 sm:pl-3.5 flex items-center pointer-events-none">
            <Lock className="w-4 h-4 text-gray-400 group-focus-within/input:text-primary-500 transition-colors" />
          </div>
          <input
            type="password"
            name="password"
            required
            className="w-full pl-9 sm:pl-10 pr-3.5 py-3 min-h-[44px] bg-white dark:bg-[#050b14]/80 border border-slate-200/90 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-[#68b955]/30 focus:border-[#68b955] transition-all outline-none text-base sm:text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 shadow-inner"
            placeholder="••••••••"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full flex items-center justify-center py-3 sm:py-3.5 px-5 sm:px-6 min-h-[44px] rounded-xl text-white text-sm font-bold tracking-wide bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-500 hover:to-secondary-500 shadow-lg shadow-primary-500/20 hover:shadow-primary-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-98 mt-2 cursor-pointer"
      >
        {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In Securely"}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[100dvh] pb-[env(safe-area-inset-bottom)] z-50 flex items-center justify-center bg-[#f3fbf9] dark:bg-[#050b14] relative py-6 sm:py-10 px-3 sm:px-4 overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary-500/10 dark:bg-primary-500/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-secondary-500/10 dark:bg-secondary-500/5 blur-[120px]" />
      </div>

      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-500">
        {/* Back to Home */}
        <div className="mb-4 sm:mb-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            <ArrowRight className="w-4 h-4 rotate-180" /> Back to Website
          </Link>
        </div>

        <div className="relative group bg-white/90 dark:bg-[#0d1526]/90 backdrop-blur-2xl border border-slate-200/80 dark:border-white/10 rounded-2xl sm:rounded-[2rem] p-5 sm:p-8 shadow-[0_8px_40px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_40px_rgb(0,0,0,0.2)]">
          {/* Subtle top gradient line */}
          <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-primary-500/50 to-transparent opacity-50" />

          <div className="mb-6 sm:mb-8 flex flex-col items-center text-center">
            <div className="mb-3 sm:mb-4">
              <Image
                src="/logo.svg"
                alt="NearGrow Ads"
                width={160}
                height={45}
                priority
                className="h-8 sm:h-10 w-auto transition-all mix-blend-multiply dark:mix-blend-screen"
              />
            </div>
            <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 tracking-wide uppercase">
              Secure Admin Portal
            </p>
          </div>

          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
