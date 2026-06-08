"use client";

import React from "react";

const services = [
  {
    title: "Website Development",
    desc: "Cutting-edge, modern websites and web apps built to perform — fast, responsive, and crafted to convert visitors into customers.",
    classNameModifier: "services-card-web",
    badgeText: "Web Apps",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    )
  },
  {
    title: "AI Automation",
    desc: "Streamline your workflows with intelligent automation. We build AI-powered pipelines that save time, reduce errors, and scale your operations.",
    classNameModifier: "services-card-ai",
    badgeText: "AI Pipelines",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707.707" />
        <circle cx="12" cy="12" r="4" />
      </svg>
    )
  },
  {
    title: "Chatbot Integration",
    desc: "Deploy smart, conversational chatbots that engage your audience 24/7 — from customer support to lead generation, fully tailored to your brand.",
    classNameModifier: "services-card-chat",
    badgeText: "24/7 Chat",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    )
  }
];

export function ServicesSection() {
  return (
    <section className="services-section" id="services">
      <style dangerouslySetInnerHTML={{ __html: `
        .services-section {
          background-color: #0a0a0a !important;
          padding: 40px 28px !important;
          border-radius: 16px !important;
          position: relative;
          z-index: 10;
          overflow: hidden;
        }

        .services-container {
          max-width: 80rem;
          margin: 0 auto;
          padding: 0 !important;
        }

        .services-grid {
          display: grid !important;
          grid-template-columns: repeat(3, 1fr) !important;
          gap: 18px !important;
        }

        @media (max-width: 900px) {
          .services-grid {
            grid-template-columns: 1fr !important;
          }
        }

        .services-card {
          background: transparent !important;
          border: 1px solid #b5f54218 !important;
          border-radius: 16px !important;
          padding: 28px 24px 26px !important;
          display: flex !important;
          flex-direction: column !important;
          gap: 16px !important;
          overflow: hidden !important;
          position: relative !important;
          transition: border-color 0.25s ease, transform 0.2s ease !important;
          box-shadow: none !important;
        }

        .services-card:hover {
          border-color: #b5f54255 !important;
          transform: translateY(-3px) !important;
        }

        /* Card Pseudo-elements */
        .services-card::before {
          content: '' !important;
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          height: 1px !important;
          background: linear-gradient(90deg, transparent, #b5f54260, transparent) !important;
          pointer-events: none !important;
          z-index: 2 !important;
        }

        .services-card::after {
          content: '' !important;
          position: absolute !important;
          bottom: 0 !important;
          left: 0 !important;
          right: 0 !important;
          height: 1px !important;
          background: linear-gradient(90deg, transparent, #b5f54230, transparent) !important;
          pointer-events: none !important;
          z-index: 2 !important;
        }

        .services-card-icon-box {
          width: 52px !important;
          height: 52px !important;
          border-radius: 14px !important;
          background: #b5f542 !important;
          color: #0a0a0a !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }

        .services-card-icon-box svg {
          width: 22px !important;
          height: 22px !important;
          stroke: #0a0a0a !important;
        }

        .services-card-dot {
          width: 8px !important;
          height: 8px !important;
          border-radius: 50% !important;
          background: #b5f542 !important;
          opacity: 0.8 !important;
        }

        .services-card-title {
          font-family: Georgia, serif !important;
          font-size: 19px !important;
          font-weight: 700 !important;
          color: #ffffff !important;
          line-height: 1.2 !important;
          margin: 0 !important;
          z-index: 10 !important;
          position: relative !important;
          text-align: left !important;
        }

        .services-card-desc {
          font-family: 'Inter', sans-serif !important;
          font-size: 13px !important;
          color: #ffffff !important;
          line-height: 1.75 !important;
          margin: 0 !important;
          z-index: 10 !important;
          position: relative !important;
          text-align: left !important;
        }

        .services-card-divider {
          width: 100% !important;
          height: 1px !important;
          background: #b5f54215 !important;
          z-index: 10 !important;
          position: relative !important;
        }

        .services-card-badge {
          display: inline-flex !important;
          align-items: center !important;
          width: fit-content !important;
          border: 1px solid #b5f54225 !important;
          background: #0a1205 !important;
          padding: 6px 14px !important;
          border-radius: 20px !important;
          z-index: 10 !important;
          position: relative !important;
        }

        .services-card-badge-dot {
          width: 6px !important;
          height: 6px !important;
          border-radius: 50% !important;
          background: #b5f542 !important;
          margin-right: 8px !important;
          flex-shrink: 0 !important;
        }

        .services-card-badge-text {
          font-family: 'Inter', sans-serif !important;
          font-size: 11px !important;
          color: #ffffff !important;
          line-height: 1 !important;
        }

        /* Decorative Overlays */
        .services-card-corner-accent {
          position: absolute !important;
          bottom: -30px !important;
          right: -30px !important;
          width: 90px !important;
          height: 90px !important;
          border-radius: 50% !important;
          background: #b5f54208 !important;
          border: 1px solid #b5f54215 !important;
          pointer-events: none !important;
          z-index: 1 !important;
        }
      ` }} />

      <div className="services-container">
        {/* Header Section */}
        <div className="mb-16 text-center" style={{ textAlign: "center", width: "100%", display: "block" }}>
          <span className="process-step-num" style={{ opacity: 1, display: "inline-block", marginBottom: "8px" }}>
            — SERVICES —
          </span>
          <h2 className="text-3xl md:text-5xl font-light font-sans text-[#f0ece8] tracking-tight leading-tight mb-4">
            Crafted for the Future
          </h2>
          <p className="mx-auto text-center w-full block text-sm md:text-base font-sans text-[#a0a0a0] max-w-[580px] leading-relaxed">
            Premium digital experiences that inspire curiosity, ambition, and limitless futures.
          </p>
        </div>

        {/* 3 Service Cards Grid */}
        <div className="services-grid">
          {services.map((service, index) => (
            <div
              key={index}
              className={`services-card ${service.classNameModifier}`}
            >
              {/* Noise texture overlay */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40 z-1" style={{ mixBlendMode: 'overlay' }} aria-hidden="true">
                <filter id={`noiseFilter-${index}`}>
                  <feTurbulence type="fractalNoise" baseFrequency="0.80" numOctaves="3" stitchTiles="stitch" />
                  <feColorMatrix type="matrix" values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.03 0" />
                </filter>
                <rect width="100%" height="100%" filter={`url(#noiseFilter-${index})`} />
              </svg>

              {/* Corner accent decorative overlay */}
              <div className="services-card-corner-accent" />

              {/* Top row */}
              <div className="flex items-center justify-between w-full z-10 relative">
                <div className="services-card-icon-box">
                  {service.icon}
                </div>
                <span className="services-card-dot" />
              </div>

              {/* Title & Description */}
              <h3 className="services-card-title">{service.title}</h3>
              <p className="services-card-desc">{service.desc}</p>

              {/* Divider */}
              <div className="services-card-divider" />

              {/* Badge */}
              <div className="services-card-badge">
                <span className="services-card-badge-dot" />
                <span className="services-card-badge-text">{service.badgeText}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
