export default function BlogLoading() {
  return (
    <main className="min-h-screen bg-white dark:bg-[#050b14] relative overflow-hidden">
      {/* ── Background Aesthetic Accents (Identical to BlogLayout) ── */}
      <div
        className="absolute top-0 right-0 w-[55vw] h-[45vw] max-w-[650px] max-h-[550px] rounded-full pointer-events-none opacity-40 dark:opacity-20 blur-3xl transform-gpu"
        style={{
          background: "radial-gradient(circle, rgba(16,185,129,0.18) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute top-[25vw] left-[-10vw] w-[50vw] h-[45vw] max-w-[600px] max-h-[500px] rounded-full pointer-events-none opacity-30 dark:opacity-15 blur-3xl transform-gpu"
        style={{
          background: "radial-gradient(circle, rgba(56,189,248,0.15) 0%, transparent 70%)",
        }}
      />

      {/* ── Hero / Header Shell ── */}
      <section className="container mx-auto px-4 xs:px-6 md:px-8 pt-28 xs:pt-32 sm:pt-36 md:pt-40 pb-8 sm:pb-10 relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 mb-4 animate-pulse">
          <span>KNOWLEDGE HUB & INSIGHTS</span>
        </div>

        <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-white mb-4 sm:mb-5">
          Growth <span className="text-emerald-500">Insights</span>
        </h1>

        <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
          Insights, strategies, and practical playbooks to help your business improve local search visibility and attract high-intent customers.
        </p>

        {/* ── Category Pill Skeletons ── */}
        <div className="flex items-center justify-center gap-2 sm:gap-2.5 mt-8 overflow-x-hidden py-1">
          {["All", "Local SEO", "Digital Marketing", "Meta Ads", "Google Ads", "Business Growth"].map((cat, i) => (
            <div
              key={cat}
              className={`h-9 px-4 rounded-full animate-pulse shrink-0 ${
                i === 0
                  ? "bg-emerald-500/30 w-24"
                  : "bg-slate-100 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 w-28"
              }`}
            />
          ))}
        </div>
      </section>

      {/* ── Cards Grid Skeleton (6 Cards) ── */}
      <section className="container mx-auto px-4 xs:px-6 md:px-8 pb-20 sm:pb-28 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div
              key={idx}
              className="flex flex-col h-full bg-white dark:bg-[#0d1526] rounded-2xl sm:rounded-[20px] overflow-hidden border border-slate-200/80 dark:border-white/5 shadow-sm animate-pulse"
            >
              {/* Thumbnail skeleton */}
              <div className="w-full bg-slate-200/70 dark:bg-white/5 aspect-video" />

              {/* Card body skeleton */}
              <div className="p-5 sm:p-6 flex flex-col flex-1 gap-3.5">
                {/* Category & read time */}
                <div className="flex items-center justify-between">
                  <div className="h-5 w-24 bg-slate-200/60 dark:bg-white/5 rounded-full" />
                  <div className="h-4 w-16 bg-slate-200/40 dark:bg-white/5 rounded-full" />
                </div>

                {/* Title skeleton */}
                <div className="space-y-2 mt-1">
                  <div className="h-5 w-full bg-slate-200/80 dark:bg-white/10 rounded-md" />
                  <div className="h-5 w-4/5 bg-slate-200/80 dark:bg-white/10 rounded-md" />
                </div>

                {/* Excerpt skeleton */}
                <div className="space-y-1.5 mt-1">
                  <div className="h-3.5 w-full bg-slate-200/50 dark:bg-white/5 rounded-md" />
                  <div className="h-3.5 w-3/4 bg-slate-200/50 dark:bg-white/5 rounded-md" />
                </div>

                {/* Author footer skeleton */}
                <div className="pt-4 mt-auto border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-slate-200/80 dark:bg-white/10" />
                    <div className="h-3.5 w-20 bg-slate-200/70 dark:bg-white/5 rounded-md" />
                  </div>
                  <div className="h-3.5 w-16 bg-slate-200/50 dark:bg-white/5 rounded-md" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
