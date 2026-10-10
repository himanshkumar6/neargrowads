import Services from "@/components/Services";
import CTA from "@/components/CTA";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Local Business Growth & Digital Marketing Services | NearGrow Ads",
  description: "Explore our modular digital marketing services for local businesses: Meta Ads, Google Search Ads, Google Business Profile optimization, Local SEO, and high-converting websites.",
  alternates: {
    canonical: "https://trisagemarketing.com/services",
  },
  openGraph: {
    title: "Local Business Growth & Digital Marketing Services | NearGrow Ads",
    description: "Explore our modular digital marketing services for local businesses: Meta Ads, Google Search Ads, Google Business Profile optimization, Local SEO, and high-converting websites.",
    url: "https://trisagemarketing.com/services",
    siteName: "NearGrow Ads",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Digital Marketing Services - NearGrow Ads",
      },
    ],
  },
};

export default function ServicesPage() {
  return (
    <>
      <div className="pt-20 md:pt-28 bg-white dark:bg-gray-950 " />
      <Services />
      <CTA />
    </>
  );
}
