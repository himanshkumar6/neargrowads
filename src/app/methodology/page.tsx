import MethodologyHero from "@/components/MethodologyHero";
import MethodologyTimeline from "@/components/MethodologyTimeline";
import GrowthEngine from "@/components/GrowthEngine";
import Process from "@/components/Process";
import CTA from "@/components/CTA";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Methodology | NearGrow Ads",
  description: "Discover our structured approach to expanding local visibility, optimizing Google Business Profiles, and acquiring nearby customers with NearGrow Ads.",
};

export default function MethodologyPage() {
  return (
    <>
      <MethodologyHero />
      <MethodologyTimeline />
      <GrowthEngine />
      <Process />
      <CTA />
    </>
  );
}
