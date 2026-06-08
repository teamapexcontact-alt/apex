"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { pickFadeVariant } from "@/lib/motion";
import { useHero } from "@/hooks/useContent";
const SERVICES = [
  { text: "Website Design", type: "cyan" },
  { text: "Landing Pages", type: "violet" },
  { text: "Workflow Automation", type: "amber" },
  { text: "E-Commerce Builds", type: "sky-blue" },
  { text: "API Integrations", type: "lime" },
  { text: "CRM Automation", type: "ghost" },
  { text: "Web Apps", type: "cyan" },
  { text: "Email Automation", type: "violet" },
  { text: "No-Code Solutions", type: "amber" },
  { text: "Chatbot Development", type: "sky-blue" },
  { text: "Performance Audits", type: "lime" },
  { text: "AI Integrations", type: "ghost" },
];

export function Hero({ className }: { className?: string }) {
  const reducedMotion = usePrefersReducedMotion();
  const fadeUp = pickFadeVariant(reducedMotion);
  const { data: heroData, loading } = useHero();

  if (loading) {
    return (
      <section
        id="hero"
        className={`relative min-h-screen flex flex-col justify-center overflow-hidden section-padding pb-0 bg-[#000000] ${className || ''}`}
        aria-labelledby="hero-heading"
      >
        <div className="relative z-10">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-800 rounded w-1/3" />
            <div className="h-20 bg-gray-800 rounded w-3/4" />
            <div className="h-6 bg-gray-800 rounded w-1/2" />
          </div>
        </div>
      </section>
    );
  }

  if (!heroData) return null;

  return (
    <section
      id="hero"
      className={`hero-section relative min-h-screen flex flex-col justify-center overflow-hidden pt-[80px] pb-[64px] px-[clamp(1.25rem,4vw,6rem)] ${className || ''}`}
      aria-labelledby="hero-heading"
    >

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Headline */}
        <motion.h1
          id="hero-heading"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center mb-8"
        >
          {heroData.headline.split('\n').map((line, i) => (
            <span
              key={i}
              className={`block leading-[1.1] m-0 p-0 ${
                i === 0
                  ? 'font-[family-name:var(--font-instrument-serif)] text-2xl md:text-3xl italic text-white/80'
                  : 'font-[family-name:var(--font-syne)] text-[clamp(3rem,8vw,7rem)] md:text-[clamp(4rem,10vw,8rem)] font-bold text-[#e8ff00] tracking-tight'
              }`}
            >
              {line}
            </span>
          ))}
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={3}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-base md:text-xl text-[rgba(255,255,255,0.6)] max-w-2xl leading-[1.65] mb-8 font-[family-name:var(--font-manrope)] font-normal tracking-[-0.01em]"
        >
          {heroData.description}
        </motion.p>

        {/* CTA button */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={4}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-[48px]"
        >
          {heroData.ctaButtons.map((button, index) => (
            <Button
              key={index}
              href={button.href}
              variant="primary"
              size="pill"
            >
              {button.text}
            </Button>
          ))}
        </motion.div>
      </div>

      {/* Hero ticker/marquee bar */}
      <div className="hero-ticker-wrap">
        <div className="hero-ticker-scanlines" />
        <div className="hero-ticker-fade-left" />
        <div className="hero-ticker-fade-right" />
        <div className="hero-ticker-track">
          {[...SERVICES, ...SERVICES].map((service, idx) => (
            <div
              key={idx}
              className="hero-ticker-item-wrapper"
              style={{ "--item-index": idx } as React.CSSProperties}
            >
              <span className={`hero-ticker-item ticker-item-${service.type}`}>
                <span className={`hero-ticker-dot ticker-dot-${service.type}`} />
                {service.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
