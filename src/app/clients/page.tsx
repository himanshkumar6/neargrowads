import OurClients from "@/components/OurClients";
import CTA from "@/components/CTA";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Clients & Partners | NearGrow Ads",
  description: "Discover the local businesses, regional brands, and enterprises that trust NearGrow Ads for digital marketing and growth.",
};

export default function ClientsPage() {
  return (
    <>
      <div className="pt-32 pb-8 bg-gradient-to-b from-primary-50/50 dark:from-gray-900 to-white dark:to-gray-950 text-center">
        <div className="container mx-auto px-4 md:px-8">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">Our Clients</h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            Discover the local businesses, regional brands, and enterprises that partner with NearGrow Ads.
          </p>
        </div>
      </div>
      <OurClients />
      <CTA />
    </>
  );
}
