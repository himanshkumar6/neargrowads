import AboutHero from "@/components/AboutHero";
import Founder from "@/components/Founder";
import DirectorsVision from "@/components/DirectorsVision";
import TeamShowcase from "@/components/TeamShowcase";
import Process from "@/components/Process";
import CTA from "@/components/CTA";
import DeviceManagement from "@/components/DeviceManagement";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | NearGrow Ads",
  description: "Learn about NearGrow Ads, our leadership team, and our practical methodology for helping local businesses grow through Google Maps, paid advertising, and targeted digital marketing.",
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />

      <DeviceManagement />


      <DirectorsVision />
      <Founder />
      <TeamShowcase />
      <Process />
      <CTA />
    </>
  );
}
