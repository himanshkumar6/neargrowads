import type { Metadata } from "next";
import Hero from "@/components/Hero";
import MissionVision from "@/components/MissionVision";
import HomeServices from "@/components/HomeServices";
import DiverseSolutions from "@/components/DiverseSolutions";
import WhyChooseUs from "@/components/WhyChooseUs";
import Process from "@/components/Process";
import FAQ from "@/components/FAQ";
import HomeBlog from "@/components/HomeBlog";
import CTA from "@/components/CTA";
import HomeBackground from "@/components/HomeBackground";
import { createClient } from "@/lib/supabase/server";
import FaqSchema from "@/components/Schema/FaqSchema";
import { faqs } from "@/data/faqs";

export const metadata: Metadata = {
  title: "NearGrow Ads | Grow Local. Grow Smart. | Digital Marketing Agency",
  description: "NearGrow Ads helps local businesses scale with Google Business Profile optimization, Local SEO, Meta Ads, Google Search Ads, and organic social media growth.",
  alternates: {
    canonical: "https://trisagemarketing.com",
  },
  openGraph: {
    title: "NearGrow Ads | Grow Local. Grow Smart. | Digital Marketing Agency",
    description: "NearGrow Ads helps local businesses scale with Google Business Profile optimization, Local SEO, Meta Ads, Google Search Ads, and organic social media growth.",
    url: "https://trisagemarketing.com",
    siteName: "NearGrow Ads",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "NearGrow Ads - Digital Marketing Agency",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NearGrow Ads | Grow Local. Grow Smart. | Digital Marketing Agency",
    description: "NearGrow Ads helps local businesses scale with Google Business Profile optimization, Local SEO, Meta Ads, Google Search Ads, and organic social media growth.",
    images: ["/logo.png"],
  },
};

export default async function Home() {
  const supabase = await createClient();
  const { data: rawPosts, error } = await supabase
    .from("blogs")
    .select("id, slug, title, excerpt, featured_image, published_at, author_name, author_avatar, read_time, categories(name)")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(3);

  // Flatten the joined category name and cover_image so HomeBlog receives the expected shape
  const recentPosts = (rawPosts || []).map((p) => {
    const catName = Array.isArray(p.categories)
      ? (p.categories[0] as { name?: string } | undefined)?.name
      : (p.categories as { name?: string } | null)?.name;
    return {
      ...p,
      category: catName ?? null,
      cover_image: p.featured_image ?? null,
      author_name: p.author_name || null,
      author_avatar: p.author_avatar || null,
      categories: undefined,
    };
  });

  if (error) {
    console.error("Supabase Error on Homepage:", error.message, error.hint);
  }

  return (
    <main className="relative min-h-screen bg-white dark:bg-[#050b14]">
      <FaqSchema faqs={faqs} />
      {/* <IndianFlagPlanes /> */}

      {/* ── Creative Animated Background (Hero Only) ── */}
      <div className="absolute top-0 left-0 w-full h-[120vh] overflow-hidden pointer-events-none z-0">
        <HomeBackground />
      </div>

      {/* ── Page Content ── */}
      <div className="homepage-wrapper relative z-10">
        <Hero />
        <MissionVision />
        {/* <BusinessPartners /> */}
        <HomeServices />
        <DiverseSolutions />
        {/* <OurClients /> */}
        <WhyChooseUs />
        <Process />
        {/* <GlobalPresence /> */}
        {/* Testimonials section hidden for all devices */}
        {/* <Testimonials /> */}
        <HomeBlog recentPosts={recentPosts || []} />
        <FAQ />
        <CTA />
      </div>
    </main>
  );
}
