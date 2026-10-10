import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { services } from "@/data/services";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ChevronDown, FileText } from "lucide-react";
import ServiceSchema from "@/components/Schema/ServiceSchema";
import BreadcrumbSchema from "@/components/Schema/BreadcrumbSchema";
import FaqSchema from "@/components/Schema/FaqSchema";
import { getAllPublishedPosts } from "@/lib/blog/data";

// For static site generation
export function generateStaticParams() {
  return services.map((service) => ({
    slug: service.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);

  if (!service) {
    return {
      title: "Service Not Found | NearGrow Ads",
    };
  }

  const title = `${service.title} | NearGrow Ads`;
  const description = `${service.description} Practical local marketing and customer acquisition by NearGrow Ads.`;
  const canonicalUrl = `https://trisagemarketing.com/services/${service.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "NearGrow Ads",
      type: "website",
      images: [
        {
          url: "/logo.png",
          width: 1200,
          height: 630,
          alt: `${service.title} - NearGrow Ads`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/logo.png"],
    },
  };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);

  if (!service) {
    notFound();
  }

  const Icon = service.icon;

  // Dynamically fetch published blog posts for Hub-and-Spoke SEO
  const allPosts = await getAllPublishedPosts();
  
  // Filter for matching posts or grab the latest 2 published posts
  const dynamicRelatedPosts = allPosts && allPosts.length > 0 
    ? allPosts.filter((p: { slug?: string; title?: string } | null | undefined) => p && p.slug && p.title).slice(0, 2)
    : [];

  const breadcrumbs = [
    { name: "Home", item: "/" },
    { name: "Services", item: "/services" },
    { name: service.title, item: `/services/${service.slug}` }
  ];

  return (
    <div className="pt-24 pb-0 bg-white dark:bg-[#050b14] ">
      <ServiceSchema service={service} />
      <BreadcrumbSchema items={breadcrumbs} />
      {service.faqs && <FaqSchema faqs={service.faqs} />}
      
      {/* Hero Section */}
      <section className="relative py-12 xs:py-16 sm:py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-50/50 via-white to-white dark:from-primary-900/20 dark:via-[#050b14] dark:to-[#050b14] -z-10" />
        
        <div className="container mx-auto px-3 xs:px-4 md:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-16 h-16 xs:w-20 xs:h-20 bg-primary-50 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center text-primary-600 dark:text-primary-400 mx-auto mb-6 xs:mb-8 shadow-sm border border-primary-100 dark:border-primary-800">
              <Icon size={34} />
            </div>
            <span className="text-primary-600 dark:text-primary-400 font-semibold tracking-wider uppercase text-xs xs:text-sm mb-3 xs:mb-4 block">
              Our Services
            </span>
            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-3 xs:mb-4 leading-tight tracking-tight">
              {service.title}
            </h1>
            <h2 className="text-base xs:text-lg sm:text-xl md:text-2xl font-semibold text-primary-600 dark:text-primary-400 mb-4 xs:mb-6 max-w-3xl mx-auto leading-relaxed">
              {service.description}
            </h2>
            <p className="text-sm xs:text-base md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-6 xs:mb-10 max-w-3xl mx-auto">
              {service.longDescription}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 xs:gap-4">
              <Link href="/contact" className="w-full sm:w-auto inline-flex justify-center items-center px-5 xs:px-8 py-3.5 xs:py-4 text-sm xs:text-base font-semibold text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 rounded-full transition-all shadow-lg hover:shadow-primary-600/25 dark:hover:shadow-primary-500/25 hover:-translate-y-1">
                Request a Free Visibility Check
              </Link>
              <Link href="/methodology" className="w-full sm:w-auto inline-flex justify-center items-center px-5 xs:px-8 py-3.5 xs:py-4 text-sm xs:text-base font-semibold text-gray-900 dark:text-white bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-full transition-all hover:-translate-y-1">
                View Methodology
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features & Benefits Section */}
      <section className="py-12 xs:py-16 md:py-20 bg-gray-50 dark:bg-gray-900/50 border-y border-gray-100 dark:border-gray-800">
        <div className="container mx-auto px-3 xs:px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-24 items-start max-w-6xl mx-auto">
            
            {/* Features */}
            <div>
              <h2 className="text-2xl xs:text-3xl font-bold text-gray-900 dark:text-white mb-6 xs:mb-8">What&apos;s Included</h2>
              <ul className="space-y-4 xs:space-y-6">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3 xs:gap-4 bg-white dark:bg-[#050b14] p-4 xs:p-6 rounded-xl xs:rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-all hover:shadow-md">
                    <div className="mt-0.5 bg-primary-50 dark:bg-primary-900/30 p-1.5 xs:p-2 rounded-full text-primary-600 dark:text-primary-400 shrink-0">
                      <ArrowRight size={18} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white text-base xs:text-lg leading-snug">{feature}</h4>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Benefits */}
            <div>
              <h2 className="text-2xl xs:text-3xl font-bold text-gray-900 dark:text-white mb-6 xs:mb-8">Why You Need This</h2>
              <div className="bg-white dark:bg-[#050b14] rounded-2xl xs:rounded-3xl p-5 xs:p-8 md:p-10 border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden h-full">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50 dark:bg-primary-900/20 rounded-full blur-3xl -mr-32 -mt-32 -z-10" />
                <ul className="space-y-4 xs:space-y-6">
                  {service.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-3 xs:gap-4">
                      <div className="mt-0.5 text-primary-600 dark:text-primary-400 shrink-0">
                        <CheckCircle2 size={20} />
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 text-sm xs:text-base md:text-lg leading-relaxed">{benefit}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Dynamic Related Insights Section */}
      <section aria-labelledby="related-insights-heading" className="py-12 xs:py-16 md:py-20 bg-white dark:bg-[#050b14]">
        <div className="container mx-auto px-3 xs:px-4 md:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between gap-3 xs:gap-4 mb-6 xs:mb-8 flex-wrap">
              <div className="flex items-center gap-2.5 xs:gap-3">
                <FileText className="text-primary-600 dark:text-primary-400" size={24} aria-hidden="true" />
                <h2 id="related-insights-heading" className="text-2xl xs:text-3xl font-bold text-gray-900 dark:text-white">Related Insights</h2>
              </div>
              <Link href="/blog" className="text-xs xs:text-sm font-semibold text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1">
                View All Insights <ArrowRight size={14} />
              </Link>
            </div>

            {dynamicRelatedPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xs:gap-6 md:gap-8">
                {dynamicRelatedPosts.map((post: { id?: string; slug?: string; title?: string; summary?: string; excerpt?: string | null; published_at?: string | null; cover_image_url?: string | null; category?: string | null; }) => (
                  <Link 
                    key={post.id || post.slug} 
                    href={`/blog/${post.slug || post.id}`}
                    className="group p-4 xs:p-6 md:p-8 bg-gray-50 dark:bg-[#0a1220] rounded-2xl xs:rounded-3xl border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-all hover:-translate-y-1 flex flex-col justify-between"
                  >
                    <div>
                      {post.category && (
                        <span className="text-[10px] xs:text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400 mb-2 block">
                          {post.category}
                        </span>
                      )}
                      <h3 className="font-semibold text-base xs:text-lg md:text-xl text-gray-900 dark:text-white mb-2 xs:mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="text-xs xs:text-sm md:text-base text-gray-600 dark:text-gray-400 line-clamp-2 mb-4 xs:mb-6">
                          {post.excerpt}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 text-xs xs:text-sm font-semibold pt-2">
                      Read Article <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-6 xs:p-8 md:p-12 bg-gray-50 dark:bg-[#0a1220] rounded-2xl xs:rounded-3xl border border-gray-100 dark:border-gray-800 text-center">
                <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm xs:text-base md:text-lg">Explore our latest insights on local business marketing and growth strategies.</p>
                <Link href="/blog" className="inline-flex items-center gap-2 text-xs xs:text-sm font-bold text-primary-600 dark:text-primary-400 hover:underline">
                  Browse All Articles <ArrowRight size={14} />
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      {service.faqs && service.faqs.length > 0 && (
        <section aria-labelledby="faq-heading" className="py-12 xs:py-16 md:py-20 bg-gray-50 dark:bg-[#0a1220] border-t border-gray-100 dark:border-gray-800">
          <div className="container mx-auto px-3 xs:px-4 md:px-8">
            <div className="max-w-6xl mx-auto">
              <h2 id="faq-heading" className="text-2xl xs:text-3xl font-bold text-gray-900 dark:text-white text-center mb-8 xs:mb-12">Frequently Asked Questions</h2>
              <div className="space-y-4 xs:space-y-6 max-w-4xl mx-auto">
                {service.faqs.map((faq: { question?: string; answer?: string; }, idx: number) => (
                  <details key={idx} className="group bg-white dark:bg-[#050b14] rounded-xl xs:rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 [&_summary::-webkit-details-marker]:hidden">
                    <summary className="flex cursor-pointer items-start justify-between gap-3 xs:gap-4 p-4 xs:p-6 font-semibold text-gray-900 dark:text-white text-sm xs:text-base sm:text-lg leading-snug">
                      <span className="flex-1">{faq.question}</span>
                      <span className="relative ml-1.5 h-5 w-5 shrink-0 transition duration-300 group-open:-rotate-180 mt-0.5">
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      </span>
                    </summary>
                    <div className="px-4 xs:px-6 pb-4 xs:pb-6 text-xs xs:text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                      {faq.answer}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-12 xs:py-16 md:py-24 bg-white dark:bg-[#050b14]">
        <div className="container mx-auto px-3 xs:px-4 md:px-8">
          <div className="max-w-6xl mx-auto text-center bg-primary-600 dark:bg-primary-900/40 rounded-2xl xs:rounded-3xl md:rounded-[2.5rem] p-6 xs:p-8 sm:p-10 md:p-16 relative overflow-hidden border border-primary-500 dark:border-primary-800 shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>
            
            <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 xs:mb-6 relative z-10 leading-tight">
              Ready to grow your local presence?
            </h2>
            <p className="text-primary-100 dark:text-primary-200 text-sm xs:text-base md:text-xl mb-6 xs:mb-10 max-w-2xl mx-auto relative z-10 leading-relaxed">
              Connect with NearGrow Ads to explore how {service.title} can help attract and convert nearby customers for your business.
            </p>
            <Link href="/contact" className="inline-flex justify-center items-center px-6 xs:px-8 py-3.5 xs:py-4 text-sm xs:text-base sm:text-lg font-semibold text-white bg-secondary-600 hover:bg-secondary-700 dark:bg-secondary-500 dark:hover:bg-secondary-600 rounded-full transition-all hover:scale-105 shadow-xl hover:shadow-secondary-600/25 relative z-10">
              Request a Free Visibility Check
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
