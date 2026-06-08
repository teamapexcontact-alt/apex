"use client";

import { AppProviders } from "@/components/providers/AppProviders";
import { CinematicBackground } from "@/components/effects/CinematicBackground";
import { Footer } from "@/components/layout/Footer";
import { FloatingGlassNavbar } from "@/components/layout/FloatingGlassNavbar";
import { Hero } from "@/components/sections/Hero";
import { MissionVision } from "@/components/sections/MissionVision";
import { FeaturedWork } from "@/components/sections/FeaturedWork";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { SpotlightSection } from "@/components/sections/SpotlightSection";
import { FaqSection } from "@/components/sections/FaqSection";

export function PageShell() {
  return (
    <AppProviders>
      <CinematicBackground />
      <div className="relative z-[1]">
        <FloatingGlassNavbar />
        <main id="main-content">
          <Hero />
          <MissionVision />
          <ServicesSection />
          <FeaturedWork />
          <WhyChooseUs />
          <ProcessSection />
          <FaqSection />
          <SpotlightSection />
        </main>
        <Footer />
      </div>
    </AppProviders>
  );
}
