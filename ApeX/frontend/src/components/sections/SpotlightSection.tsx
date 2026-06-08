"use client";

import React, { useRef, useState, useEffect } from "react";

interface DustParticle {
  id: number;
  left: number;
  delay: number;
  duration: number;
  dx: number;
  scale: number;
}

export function SpotlightSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [particles, setParticles] = useState<DustParticle[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const list: DustParticle[] = [];
    for (let i = 0; i < 65; i++) {
      list.push({
        id: i,
        left: Math.random() * 80 + 20,
        delay: Math.random() * -18,
        duration: Math.random() * 11 + 7,
        dx: -(Math.random() * 3.5 + 1.5),
        scale: Math.random() * 2 + 1,
      });
    }
    setParticles(list);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => setIsVisible(entry.isIntersecting));
      },
      { rootMargin: "200px 0px", threshold: 0 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    let time = 0;
    let animationFrameId: number;
    const svgNode = svgRef.current;

    const breathe = () => {
      time += 0.007;
      const opacity = 0.96 + Math.sin(time) * 0.04;
      if (svgNode) {
        svgNode.style.opacity = opacity.toString();
      }
      animationFrameId = requestAnimationFrame(breathe);
    };
    breathe();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const stars: Array<{ x: number; y: number; size: number; opacity: number }> = [];
    for (let i = 0; i < 90; i++) {
      stars.push({
        x: Math.random(),
        y: Math.random(),
        size: Math.random() * 1.2 + 0.5,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }

    const drawStars = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((star) => {
        ctx.fillStyle = `rgba(200, 230, 255, ${star.opacity})`;
        ctx.beginPath();
        ctx.arc(star.x * canvas.width, star.y * canvas.height, star.size, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drawStars();
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [isVisible]);

  return (
    <section
      ref={sectionRef}
      className="spotlight-stage-section"
      id="contact"
      aria-labelledby="contact-heading"
    >
      <div className="ambient-source-glow" aria-hidden />

      <canvas
        id="reactStarCanvas"
        ref={canvasRef}
        aria-hidden
        style={{ display: isVisible ? "block" : "none" }}
      />

      <svg
        ref={svgRef}
        className="god-rays-vector-svg"
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
        aria-hidden
        style={{ display: isVisible ? "block" : "none" }}
      >
        <defs>
          <linearGradient id="react-g-main" x1="0.82" y1="0" x2="0.38" y2="1" gradientUnits="objectBoundingBox">
            <stop offset="0%" stopColor="#c8ecff" stopOpacity={0.60} />
            <stop offset="22%" stopColor="#88ccf0" stopOpacity={0.25} />
            <stop offset="60%" stopColor="#4aa8e0" stopOpacity={0.09} />
            <stop offset="100%" stopColor="#2070c0" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="react-g-warm" x1="0.82" y1="0" x2="0.40" y2="1" gradientUnits="objectBoundingBox">
            <stop offset="0%" stopColor="#ffe8c0" stopOpacity={0.65} />
            <stop offset="16%" stopColor="#ffcc80" stopOpacity={0.32} />
            <stop offset="55%" stopColor="#e09050" stopOpacity={0.08} />
            <stop offset="100%" stopColor="#c06030" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="react-g-bloom" x1="0.82" y1="0" x2="0.28" y2="1" gradientUnits="objectBoundingBox">
            <stop offset="0%" stopColor="#a0d8ff" stopOpacity={0.28} />
            <stop offset="45%" stopColor="#60b0e8" stopOpacity={0.06} />
            <stop offset="100%" stopColor="#3090d0" stopOpacity={0} />
          </linearGradient>
          <filter id="react-blur20">
            <feGaussianBlur stdDeviation="20" />
          </filter>
          <filter id="react-blur8">
            <feGaussianBlur stdDeviation="8" />
          </filter>
          <filter id="react-blur3">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>
        <polygon points="1180,0 0,900 1240,900" fill="url(#react-g-bloom)" filter="url(#react-blur20)" opacity={0.85} />
        <polygon points="1180,0 0,900 1280,900" fill="url(#react-g-main)" filter="url(#react-blur8)" opacity={0.78} />
        <polygon points="1180,0 1110,900 1280,900" fill="url(#react-g-main)" filter="url(#react-blur8)" opacity={0.28} />
        <polygon points="1180,0 1010,900 880,900" fill="url(#react-g-main)" filter="url(#react-blur3)" opacity={0.38} />
        <polygon points="1180,0 840,900 730,900" fill="url(#react-g-main)" filter="url(#react-blur3)" opacity={0.48} />
        <polygon points="1180,0 600,900 480,900" fill="url(#react-g-warm)" filter="url(#react-blur3)" opacity={0.82} />
        <polygon points="1180,0 555,900 595,900" fill="url(#react-g-warm)" opacity={0.58} />
        <polygon points="1180,0 380,900 270,900" fill="url(#react-g-main)" filter="url(#react-blur3)" opacity={0.42} />
        <polygon points="1180,0 60,900 -80,900" fill="url(#react-g-main)" filter="url(#react-blur8)" opacity={0.22} />
      </svg>

      <div className="theatre-light-dot" aria-hidden />
      <div className="stage-floor-reflection" aria-hidden />

      <div className="dust" aria-hidden>
        {particles.map((p) => (
          <span
            key={p.id}
            className="react-dust-particle"
            style={
              {
                left: `${p.left}vw`,
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.duration}s`,
                "--dx": p.dx,
                width: `${p.scale}px`,
                height: `${p.scale}px`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      <div className="spotlight-centered-content">
        <h2 id="contact-heading" className="spotlight-headline">
          <span className="spotlight-line1">Elevate Your Brand.</span>
          <span className="spotlight-line1">Accelerate Your</span>
          <span className="spotlight-line2">Growth.</span>
        </h2>
        <p className="spotlight-subline">
          Partner with ApeX to create digital experiences that drive lasting impact.
        </p>
        <button
          type="button"
          className="spotlight-cta-button"
          onClick={() => {
            if (typeof window !== "undefined") {
              window.location.href = "/apet-contact.html";
            }
          }}
        >
          <span>Join Now</span>
          <span className="arrow" aria-hidden>→</span>
        </button>
      </div>
    </section>
  );
}
