"use client";

import { motion } from "framer-motion";
import { TiltCard } from "@/components/ui/TiltCard";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export function MissionVision({ className }: { className?: string }) {
  const reducedMotion = usePrefersReducedMotion();

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ease: (reducedMotion ? "linear" : [0.16, 1, 0.3, 1]) as any,
      },
    },
  };

  const floatingVariants = (yOffset: number, duration: number, delay: number) => ({
    animate: reducedMotion ? {} : {
      y: [0, yOffset, 0],
      transition: {
        repeat: Infinity,
        duration: duration,
        ease: "easeInOut" as const,
        delay: delay,
      },
    },
  });

  return (
    <section
      className={`about-apex-section relative pt-[96px] pb-[45px] md:pb-[60px] px-[clamp(1.25rem,4vw,6rem)] ${className || ''}`}
      style={{ backgroundColor: "#000000" }}
      aria-labelledby="mission-vision-heading"
    >
      {/* Isolated Film Grain Overlay (3% opacity) */}
      <div className="film-grain-overlay" aria-hidden />

      {/* Cinematic Lighting Backdrop for Depth */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
        <div className="absolute top-[20%] left-1/4 -translate-x-1/2 w-[60vw] h-[40vh] bg-[radial-gradient(circle_at_center,rgba(212,255,0,0.04)_0%,transparent_70%)] blur-[80px]" />
        <div className="absolute bottom-[20%] right-[-10%] w-[50vw] h-[50vh] bg-[radial-gradient(circle_at_center,rgba(255,107,58,0.03)_0%,transparent_70%)] blur-[90px]" />
        <div className="absolute bottom-0 left-1/3 w-[70vw] h-[40vh] bg-[radial-gradient(circle_at_center,rgba(74,158,255,0.03)_0%,transparent_70%)] blur-[80px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center gap-16">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center"
        >
          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#c8f000] block mb-4 font-sans text-center w-full">
            — ABOUT US —
          </span>
          <h2
            id="mission-vision-heading"
            className="text-center font-light tracking-[-0.01em] leading-[1.15] text-[#F0EBE0] text-[clamp(32px,5.5vw,64px)] max-w-4xl mx-auto"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Built with precision. Trusted by clients. Designed for lasting growth.
          </h2>
        </motion.div>

        {/* 3D Glass Cards perspective-tilted grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-3 gap-8 md:gap-6 lg:gap-8 w-full max-w-6xl"
        >
          {/* Card 1 — Who We Are */}
          <motion.div variants={itemVariants} className="relative group min-w-0">
            {/* Ambient Lime Glow behind card */}
            <div className="absolute -inset-6 rounded-3xl bg-[radial-gradient(circle_at_center,rgba(212,255,0,0.05)_0%,transparent_60%)] pointer-events-none blur-2xl group-hover:scale-110 transition-transform duration-500 z-0" />
            <motion.div
              variants={floatingVariants(-8, 6, 0)}
              animate="animate"
              className="relative z-10 h-full"
            >
              <TiltCard maxTilt={3} accent="#D4FF00" className="h-full min-w-0">
                <div className="relative z-10 p-8 lg:p-10 flex flex-col gap-6 h-full text-left">
                  {/* Olive-green People Icon Container */}
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center border border-[rgba(85,107,47,0.2)] bg-[rgba(85,107,47,0.1)] text-[#556B2F]">
                    <svg
                      className="w-7 h-7"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>

                  {/* Heading */}
                  <h3 className="font-[family-name:var(--font-inter)] text-2xl lg:text-3xl font-extrabold text-[#D4FF00] tracking-tight">
                    Who We Are
                  </h3>

                  {/* Statement */}
                  <p className="font-[family-name:var(--font-inter)] text-lg lg:text-xl text-white font-medium leading-snug">
                    {"We are not your average agency. "}<span className="italic text-[#D4FF00]">{"We are the standard."}</span>
                  </p>

                  {/* Body */}
                  <p className="font-[family-name:var(--font-inter)] font-light text-white/70 leading-relaxed text-sm md:text-base">
                    {"ApeX is a next-generation digital agency built for businesses that refuse to blend in. We combine the craft of world-class web development with the power of cutting-edge AI tools to create digital experiences that don't just look good — they perform, convert, and command attention."}
                  </p>

                  {/* Quote */}
                  <p className="font-[family-name:var(--font-inter)] italic text-white/90 leading-relaxed text-sm md:text-base pl-4 border-l-2 border-[#D4FF00]">
                    {"\"Small team. Massive output. Unreasonable results. That's just how ApeX works.\""}
                  </p>
                </div>
              </TiltCard>
            </motion.div>
          </motion.div>

          {/* Card 2 — Our Mission */}
          <motion.div variants={itemVariants} className="relative group min-w-0">
            {/* Ambient Coral Glow behind card */}
            <div className="absolute -inset-6 rounded-3xl bg-[radial-gradient(circle_at_center,rgba(255,107,58,0.05)_0%,transparent_60%)] pointer-events-none blur-2xl group-hover:scale-110 transition-transform duration-500 z-0" />
            <motion.div
              variants={floatingVariants(-11, 6.5, 0.3)}
              animate="animate"
              className="relative z-10 h-full"
            >
              <TiltCard maxTilt={3} accent="#FF6B3A" className="h-full min-w-0">
                <div className="relative z-10 p-8 lg:p-10 flex flex-col gap-6 h-full text-left">
                  {/* Coral Lightning Icon Container */}
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center border border-[rgba(255,107,58,0.2)] bg-[rgba(255,107,58,0.1)] text-[#FF6B3A]">
                    <svg
                      className="w-7 h-7"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>

                  {/* Heading */}
                  <h3 className="font-[family-name:var(--font-inter)] text-2xl lg:text-3xl font-extrabold text-[#FF6B3A] tracking-tight">
                    Our Mission
                  </h3>

                  {/* Statement */}
                  <p className="font-[family-name:var(--font-inter)] text-lg lg:text-xl text-white font-medium leading-snug">
                    {"To put every brand we touch "}<span className="italic text-[#FF6B3A]">{"at the top of its game."}</span>
                  </p>

                  {/* Body */}
                  <p className="font-[family-name:var(--font-inter)] font-light text-white/70 leading-relaxed text-sm md:text-base">
                    {"To transform and reinvigorate digital solutions that drive growth, empower startups and create impactful brand experiences."}
                  </p>

                  {/* Quote */}
                  <p className="font-[family-name:var(--font-inter)] italic text-white/90 leading-relaxed text-sm md:text-base pl-4 border-l-2 border-[#FF6B3A]">
                    {"\"We don't just deliver work. We deliver the version of your brand you always knew it could be.\""}
                  </p>
                </div>
              </TiltCard>
            </motion.div>
          </motion.div>

          {/* Card 3 — Our Vision */}
          <motion.div variants={itemVariants} className="relative group min-w-0">
            {/* Ambient Sky-blue Glow behind card */}
            <div className="absolute -inset-6 rounded-3xl bg-[radial-gradient(circle_at_center,rgba(74,158,255,0.05)_0%,transparent_60%)] pointer-events-none blur-2xl group-hover:scale-110 transition-transform duration-500 z-0" />
            <motion.div
              variants={floatingVariants(-7, 5.5, 0.6)}
              animate="animate"
              className="relative z-10 h-full"
            >
              <TiltCard maxTilt={3} accent="#4A9EFF" className="h-full min-w-0">
                <div className="relative z-10 p-8 lg:p-10 flex flex-col gap-6 h-full text-left">
                  {/* Steel-blue Eye Icon Container */}
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center border border-[rgba(70,130,180,0.2)] bg-[rgba(70,130,180,0.1)] text-[#4682B4]">
                    <svg
                      className="w-7 h-7"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </div>

                  {/* Heading */}
                  <h3 className="font-[family-name:var(--font-inter)] text-2xl lg:text-3xl font-extrabold text-[#4A9EFF] tracking-tight">
                    Our Vision
                  </h3>

                  {/* Statement */}
                  <p className="font-[family-name:var(--font-inter)] text-lg lg:text-xl text-white font-medium leading-snug">
                    {"A world where every great business "}<span className="italic text-[#4A9EFF]">{"looks exactly as great as it is."}</span>
                  </p>

                  {/* Body */}
                  <p className="font-[family-name:var(--font-inter)] font-light text-white/70 leading-relaxed text-sm md:text-base">
                    {"Our vision is to become the agency that defines what modern brands look like — one website, one poster, one unforgettable first impression at a time."}
                  </p>

                  {/* Quote */}
                  <p className="font-[family-name:var(--font-inter)] italic text-white/90 leading-relaxed text-sm md:text-base pl-4 border-l-2 border-[#4A9EFF]">
                    {"\"The peak isn't out of reach. We just help you get there faster.\""}
                  </p>
                </div>
              </TiltCard>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
