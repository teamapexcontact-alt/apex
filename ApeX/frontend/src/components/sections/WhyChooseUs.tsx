"use client";

import React, { useRef, useEffect } from "react";


export function WhyChooseUs() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const node = sectionRef.current;
    const canvas = canvasRef.current;
    if (!node || !canvas) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            startCanvas();
            observer.disconnect();
          }
        });
      },
      { rootMargin: "200px 0px", threshold: 0 }
    );
    observer.observe(node);

    function startCanvas() {
      const target = canvasRef.current;
      if (!target) return;
      const ctx = target.getContext("2d");
      if (!ctx) return;

      let animationFrameId = 0;
      let width = 0;
      let height = 0;

      const resize = () => {
        const parent = target.parentElement;
        if (parent) {
          width = parent.clientWidth;
          height = parent.clientHeight;
          target.width = width;
          target.height = height;
        }
      };

      resize();
      window.addEventListener("resize", resize);

      const particles: Array<{
        x: number;
        y: number;
        radius: number;
        vx: number;
        vy: number;
        color: string;
        glowColor: string;
      }> = [];

      for (let i = 0; i < 6; i++) {
        const isAccent = i % 2 === 0;
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 120 + 80,
          vx: (Math.random() - 0.5) * 0.22,
          vy: (Math.random() - 0.5) * 0.22,
          color: isAccent ? "rgba(200, 255, 0, 0.04)" : "rgba(255, 255, 255, 0.01)",
          glowColor: isAccent ? "rgba(200, 255, 0, 0.01)" : "rgba(255, 255, 255, 0.003)",
        });
      }

      const draw = () => {
        ctx.clearRect(0, 0, width, height);

        if (window.innerWidth > 768) {
          particles.forEach((p) => {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < -p.radius) p.x = width + p.radius;
            if (p.x > width + p.radius) p.x = -p.radius;
            if (p.y < -p.radius) p.y = height + p.radius;
            if (p.y > height + p.radius) p.y = -p.radius;

            const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
            grad.addColorStop(0, p.color);
            grad.addColorStop(0.3, p.glowColor);
            grad.addColorStop(1, "transparent");

            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();
          });
        }

        animationFrameId = requestAnimationFrame(draw);
      };

      draw();

      (target as HTMLCanvasElement & { _cleanup?: () => void })._cleanup = () => {
        window.removeEventListener("resize", resize);
        cancelAnimationFrame(animationFrameId);
      };
    }

    return () => {
      const cleanup = (canvas as HTMLCanvasElement & { _cleanup?: () => void })._cleanup;
      if (cleanup) cleanup();
      observer.disconnect();
    };
  }, []);

  const handleGetStartedClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      window.location.href = "/apet-contact.html";
    }
  };

  return (
    <section ref={sectionRef} className="why-section" id="why-choose-us" aria-label="Why choose ApeX Studio">
      <canvas
        id="whyCanvas"
        ref={canvasRef}
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          opacity: 0.25,
          borderRadius: "inherit",
        }}
      />

      <div className="why-container">
        <div className="ghost-backdrop" aria-hidden>WHY CHOOSE US?</div>

        <div className="orbital-stage-wrapper">
          <div className="orbital-stage-container">
            <svg className="orbital-svg" width="680" height="340" viewBox="0 0 680 340" fill="none" aria-hidden>
              <line x1="0" y1="170" x2="680" y2="170" stroke="#1a1a1a" strokeWidth="1" />
              <ellipse cx="340" cy="170" rx="138" ry="68" stroke="#1e1e1e" strokeWidth="1" />
              <ellipse cx="340" cy="170" rx="224" ry="112" stroke="#1e1e1e" strokeWidth="1.5" />
              <circle cx="340" cy="58" r="4.5" className="pulsing-dot pulsing-dot-top" />
              <circle cx="564" cy="170" r="4.5" className="pulsing-dot pulsing-dot-right" />
              <circle cx="340" cy="282" r="4.5" className="pulsing-dot pulsing-dot-bottom" />
              <circle cx="116" cy="170" r="4.5" className="pulsing-dot pulsing-dot-left" />
            </svg>

            <div className="center-node-container">
              <button type="button" className="center-back-button" aria-label="Go Back">
                <svg viewBox="0 0 24 24" width="14" height="14" stroke="#c8ff00" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
              </button>
              <div className="center-text-group">
                <div className="center-primary">Your Business Grows Faster</div>
                <div className="center-secondary">with ApeX</div>
              </div>
            </div>

            <div className="orbital-node node-top">
              <div className="node-title">Web Development</div>
              <div className="node-subtitle">Fast · Scalable · Modern</div>
            </div>
            <div className="orbital-node node-bottom">
              <div className="node-title">AI Automation</div>
              <div className="node-subtitle">Save time · Cut costs</div>
            </div>
            <div className="orbital-node node-right">
              <div className="node-title italic-accent">Make Revenue</div>
              <div className="node-subtitle dark-accent">ROI-driven results</div>
            </div>
            <div className="orbital-node node-left">
              <div className="node-title">
                <span className="blue-italic">Chatbot</span> <span className="light-grey">Integration</span>
              </div>
              <div className="node-subtitle">24/7 smart support</div>
            </div>
          </div>
        </div>

        <div className="bottom-promo-card">
          <div className="bracket bracket-tl" aria-hidden />
          <div className="bracket bracket-br" aria-hidden />
          <h3 className="card-heading">we build, automate & scale your business</h3>
          <p className="card-desc">
            From pixel-perfect websites to intelligent chatbots and end-to-end AI automation — we give your business the tech advantage it needs to outperform the competition.
          </p>
          <button type="button" className="card-cta-button" onClick={handleGetStartedClick}>
            Get Started
          </button>
        </div>
      </div>
    </section>
  );
}
