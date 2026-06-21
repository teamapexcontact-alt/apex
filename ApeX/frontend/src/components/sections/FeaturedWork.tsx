"use client";

import { motion } from "framer-motion";
import React, { useRef, useState, useEffect } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type Project = {
  id: string;
  name: string;
  tag: string;
  description: string;
  url: string;
  link: string;
  gradient: string;
  accent: string;
};

const PROJECTS_DATA: Project[] = [
  {
    id: "ishot-fleets",
    name: "iShot Fleets",
    tag: "Enterprise Logistics",
    description: "Cinematic dashboard and fleet visualizer designed to streamline global transportation logistics at scale.",
    url: "ishot-fleets.apex",
    link: "https://ishottreels.vercel.app/?utm_source=chatgpt.com",
    gradient: "linear-gradient(135deg, #3b0066 0%, #0d0033 50%, #001f4d 100%)",
    accent: "#D4FF00",
  },
  {
    id: "apex-pickles",
    name: "Apex Pickles",
    tag: "Demo Project",
    description: "A vibrant pickle brand demo showcasing bold product visuals, playful animations, and a conversion-focused landing experience.",
    url: "apexpickles.buildwithapex.app",
    link: "https://apexpickles.buildwithapex.app/",
    gradient: "linear-gradient(135deg, #8B0000 0%, #4a0e0e 50%, #2d0a0a 100%)",
    accent: "#FFD700",
  },
  {
    id: "laundry-services",
    name: "Laundry Services",
    tag: "On-Demand Platform",
    description: "A modern laundry service platform with real-time booking, order tracking, and seamless customer experience.",
    url: "apexlaundary.buildwithapex.app",
    link: "https://apexlaundary.buildwithapex.app/",
    gradient: "linear-gradient(135deg, #004d40 0%, #00251a 50%, #00120d 100%)",
    accent: "#00E5C3",
  },
];

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const reducedMotion = usePrefersReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);
  const clickStart = useRef({ x: 0, y: 0 });

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion) return;
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xPct = x / rect.width;
    const yPct = y / rect.height;

    // RotateX/RotateY tilt effect
    const rotateX = (yPct - 0.5) * -6;
    const rotateY = (xPct - 0.5) * 6;

    // Magnetic effect (translation shift max 10px towards cursor)
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;
    const magneticX = (deltaX / (rect.width / 2)) * 10;
    const magneticY = (deltaY / (rect.height / 2)) * 10;

    card.style.setProperty("--pointer-x", `${xPct * 100}%`);
    card.style.setProperty("--pointer-y", `${yPct * 100}%`);
    card.style.setProperty("--rotate-x", `${rotateX.toFixed(2)}deg`);
    card.style.setProperty("--rotate-y", `${rotateY.toFixed(2)}deg`);
    card.style.setProperty("--magnetic-x", `${magneticX.toFixed(2)}px`);
    card.style.setProperty("--magnetic-y", `${magneticY.toFixed(2)}px`);

    // Parallax shifts for mockup overlay (moves in opposite direction)
    const translateXMockup = (xPct - 0.5) * -16;
    const translateYMockup = (yPct - 0.5) * -16;
    card.style.setProperty("--parallax-x", `${translateXMockup.toFixed(2)}px`);
    card.style.setProperty("--parallax-y", `${translateYMockup.toFixed(2)}px`);
  };

  const onMouseEnter = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.setProperty("--card-scale", "1.03");
    card.style.setProperty("--card-y", "-10px");
    card.style.setProperty("--glow-opacity", "1");
    card.style.setProperty("--mockup-z", "45px");
    card.style.setProperty("--cta-scale", "1");
    card.style.setProperty("--cta-y", "0px");
  };

  const onMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.setProperty("--card-scale", "1");
    card.style.setProperty("--card-y", "0px");
    card.style.setProperty("--glow-opacity", "0");
    card.style.setProperty("--rotate-x", "0deg");
    card.style.setProperty("--rotate-y", "0deg");
    card.style.setProperty("--parallax-x", "0px");
    card.style.setProperty("--parallax-y", "0px");
    card.style.setProperty("--magnetic-x", "0px");
    card.style.setProperty("--magnetic-y", "0px");
    card.style.setProperty("--pointer-x", "50%");
    card.style.setProperty("--pointer-y", "50%");
    card.style.setProperty("--mockup-z", "30px");
    card.style.setProperty("--cta-scale", "0.9");
    card.style.setProperty("--cta-y", "10px");
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    clickStart.current = { x: e.clientX, y: e.clientY };
  };

  const handleCardClick = (e: React.MouseEvent) => {
    const distance = Math.sqrt(
      Math.pow(e.clientX - clickStart.current.x, 2) +
      Math.pow(e.clientY - clickStart.current.y, 2)
    );
    // If user dragged more than 6px, suppress navigation (it was a swipe)
    if (distance > 6) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    // Navigate in a new tab
    window.open(project.link, "_blank", "noopener,noreferrer");
  };

  const cardStyle: React.CSSProperties = {
    transform: "perspective(1000px) rotateX(var(--rotate-x, 0deg)) rotateY(var(--rotate-y, 0deg)) scale(var(--card-scale, 1)) translateY(var(--card-y, 0px)) translate(var(--magnetic-x, 0px), var(--magnetic-y, 0px))",
    transformStyle: "preserve-3d",
    transition: "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
    background: project.gradient,
  };

  const floatAnim = {
    animate: reducedMotion ? {} : {
      y: [0, index % 2 === 0 ? -6 : -10, 0],
      transition: {
        repeat: Infinity,
        duration: index % 2 === 0 ? 5 : 6,
        ease: "easeInOut" as const,
        delay: index * 0.2,
      },
    },
  };

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 60, scale: 0.96 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
        },
      }}
      className="w-full md:w-[calc(66.66vw-24px)] lg:w-[calc(50vw-28px)] min-w-full md:min-w-[calc(66.66vw-24px)] lg:min-w-[calc(50vw-28px)] scroll-snap-align-start flex-shrink-0 relative snap-start"
    >
      <motion.div
        ref={cardRef}
        onMouseMove={onMouseMove}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onMouseDown={handleMouseDown}
        onClick={handleCardClick}
        style={cardStyle}
        variants={floatAnim}
        animate="animate"
        className="w-full h-[500px] rounded-[28px] overflow-hidden relative shadow-[0_15px_35px_rgba(0,0,0,0.5),0_5px_15px_rgba(0,0,0,0.3)] cursor-pointer group border border-white/5 border-t-white/10"
      >
        {/* Isolated Film Grain (3% opacity) */}
        <div className="absolute inset-0 z-10 pointer-events-none opacity-[0.03] mix-blend-overlay bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E')]" />

        {/* Ambient Radial Spotlight from top-left */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.06)_0%,transparent_65%)] z-10 pointer-events-none" />

        {/* Cursor Glass Reflection Spotlight */}
        <div
          className="absolute inset-0 z-30 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: "radial-gradient(circle 280px at var(--pointer-x, 50%) var(--pointer-y, 50%), rgba(255,255,255,0.08) 0%, transparent 80%)",
          }}
        />

        {/* Ambient color light glow behind mockup */}
        <div className="absolute top-[20%] left-[20%] w-[60%] h-[60%] rounded-full bg-[radial-gradient(circle_at_center,rgba(212,255,0,0.03)_0%,transparent_70%)] blur-[40px] pointer-events-none z-10" />

        {/* Floating Browser Mockup */}
        <div
          className="absolute top-12 left-1/2 -translate-x-1/2 w-[85%] h-[230px] rounded-t-xl bg-[#0b0e14] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] z-20 overflow-hidden pointer-events-none transition-transform duration-500 ease-out"
          style={{
            transform: "perspective(1000px) translateZ(var(--mockup-z, 30px)) translateX(var(--parallax-x, 0px)) translateY(var(--parallax-y, 0px))",
            transformStyle: "preserve-3d",
          }}
        >
          {/* Browser Header Bar */}
          <div className="flex items-center gap-1.5 px-4 py-2 bg-[#121620] border-b border-white/5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
            <div className="mx-auto w-[65%] h-4.5 rounded bg-[#07090e] border border-white/5 flex items-center justify-center">
              <span className="text-[9px] text-white/30 font-mono tracking-tight">{project.url}</span>
            </div>
          </div>

          {/* Browser Document Preview */}
          <div className="p-4 flex flex-col gap-4 h-full bg-[#000000]">
            {/* Nav */}
            <div className="flex justify-between items-center opacity-80">
              <span className="font-bold text-[10px] text-[#d4f000] tracking-tight">ApeX</span>
              <div className="flex gap-2">
                <span className="w-8 h-1 bg-white/20 rounded-sm" />
                <span className="w-8 h-1 bg-white/20 rounded-sm" />
                <span className="w-8 h-1 bg-white/20 rounded-sm" />
              </div>
            </div>
            {/* Hero */}
            <div className="flex flex-col items-center gap-2 text-center mt-3">
              <div className="w-[85%] h-3.5 rounded bg-white/90" />
              <div className="w-[60%] h-2.5 rounded bg-white/40" />
              <div className="w-14 h-4 rounded-full bg-[#d4f000]/95 mt-1" />
            </div>
            {/* Columns */}
            <div className="grid grid-cols-3 gap-2 mt-2 opacity-40">
              <div className="h-12 rounded bg-white/5 border border-white/5" />
              <div className="h-12 rounded bg-white/5 border border-white/5" />
              <div className="h-12 rounded bg-white/5 border border-white/5" />
            </div>
          </div>
        </div>

        {/* Floating CTA Badge */}
        <div
          className="absolute pointer-events-none opacity-0 group-hover:opacity-100 z-40 bg-[#d4f000] text-black font-[family-name:var(--font-syne)] font-bold text-xs px-4 py-2.5 rounded-full flex items-center gap-1.5 shadow-[0_15px_30px_rgba(212,255,0,0.4)] transition-all duration-300 ease-out"
          style={{
            left: "var(--pointer-x, 50%)",
            top: "var(--pointer-y, 50%)",
            transform: "translate(-50%, -50%) translateZ(45px) scale(var(--cta-scale, 0.9)) translateY(var(--cta-y, 10px))",
            transformStyle: "preserve-3d",
          }}
        >
          <span>View Live Project</span>
          <span className="inline-block transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">↗</span>
        </div>

        {/* Bottom Overlay Card Details */}
        <div className="absolute bottom-0 inset-x-0 p-8 lg:p-10 z-20 flex justify-between items-end">
          {/* Left Details */}
          <div className="flex flex-col gap-3 text-left max-w-[70%]">
            <span className="w-fit px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-[#d4f000] border border-[#d4f000]/30 bg-[#d4f000]/10 backdrop-blur-sm">
              {project.tag}
            </span>
            <h4 className="font-[family-name:var(--font-syne)] text-2xl lg:text-3xl font-extrabold text-white tracking-tight leading-none">
              {project.name}
            </h4>
            <p className="font-[family-name:var(--font-manrope)] text-white/50 text-xs lg:text-sm font-light leading-relaxed line-clamp-2">
              {project.description}
            </p>
          </div>

          {/* Right Action Button */}
          <div className="flex items-center gap-1.5 text-white/80 font-[family-name:var(--font-syne)] text-xs lg:text-sm font-semibold tracking-wider uppercase transition-colors duration-300 group-hover:text-white pb-1 border-b border-white/10 group-hover:border-[#d4f000]">
            <span>View Project</span>
            <svg
              className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300 text-[#d4f000]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function FeaturedWork({ className }: { className?: string }) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);
  const walkDistance = useRef(0);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Redirect vertical scroll wheel to horizontal scrolling
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        container.scrollLeft += e.deltaY * 1.1;
      }
    };

    container.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      container.removeEventListener("wheel", onWheel);
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    setIsDragging(true);
    startX.current = e.clientX - container.offsetLeft;
    scrollLeftStart.current = container.scrollLeft;
    walkDistance.current = 0;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const container = scrollContainerRef.current;
    if (!container) return;

    e.preventDefault();
    const x = e.clientX - container.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    walkDistance.current = Math.abs(walk);
    container.scrollLeft = scrollLeftStart.current - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  return (
    <section
      id="portfolio"
      className={`portfolio-section px-0 ${className || ""}`}
      aria-labelledby="featured-work-heading"
      style={{ paddingTop: "clamp(40px, 4.5vw, 60px)", paddingBottom: "clamp(30px, 3.5vw, 40px)" }}
    >
      {/* Ambient Moving Glow Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
        <motion.div
          animate={{
            x: [0, 45, -25, 0],
            y: [0, -35, 45, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-[10%] left-[-15%] w-[50vw] h-[50vw] max-w-[650px] max-h-[650px] bg-[radial-gradient(circle_at_center,rgba(79,31,138,0.06)_0%,transparent_68%)] blur-[100px] pointer-events-none"
        />
        <motion.div
          animate={{
            x: [0, -35, 55, 0],
            y: [0, 45, -35, 0],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-[10%] right-[-15%] w-[45vw] h-[45vw] max-w-[600px] max-h-[600px] bg-[radial-gradient(circle_at_center,rgba(20,0,120,0.04)_0%,transparent_68%)] blur-[110px] pointer-events-none"
        />
      </div>

      <div className="relative z-10 max-w-[85rem] mx-auto flex flex-col">
        {/* Header Block */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 px-[clamp(1.25rem,4vw,6rem)] text-left"
        >
          <span
            className="block text-[#d4f000] mb-3 text-center w-full"
            style={{
              fontFamily: "'Raleway', sans-serif",
              fontWeight: 600,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              fontSize: "clamp(11px, 1.2vw, 13px)",
              textAlign: "center",
              width: "100%",
              display: "block",
            }}
          >
            — Our Work —
          </span>
          <h2
            id="featured-work-heading"
            className="text-white mb-4 text-center w-full block"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 900,
              fontSize: "clamp(18px, 3vw, 42px)",
              lineHeight: 1.1,
              letterSpacing: "-0.01em",
              whiteSpace: "nowrap",
              width: "100%",
              textAlign: "center",
              display: "block",
            }}
          >
            Built by Us. Trusted by Clients. Proven in the Market.
          </h2>
          <p
            className="text-white text-center w-full block mx-auto"
            style={{
              fontFamily: "'Raleway', sans-serif",
              fontWeight: 300,
              fontSize: "clamp(15px, 1.6vw, 18px)",
              lineHeight: 1.8,
              maxWidth: "580px",
              opacity: 0.75,
              textAlign: "center",
              width: "100%",
              display: "block",
              margin: "0 auto",
            }}
          >
            Designed with purpose. Built with precision. Proven by results.
          </p>
        </motion.div>

        {/* Horizontal Scroll Gallery Container */}
        <motion.div
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.2,
              },
            },
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          ref={scrollContainerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          className="flex gap-8 overflow-x-auto select-none scrollbar-none snap-x snap-mandatory px-[clamp(1.25rem,4vw,6rem)] pb-12 cursor-grab active:cursor-grabbing"
          style={{ scrollBehavior: isDragging ? "auto" : "smooth" }}
        >
          {PROJECTS_DATA.map((project, idx) => (
            <ProjectCard key={project.id} project={project} index={idx} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
