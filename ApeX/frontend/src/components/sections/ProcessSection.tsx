"use client";

import React, { useEffect, useRef } from "react";

interface ProcessStep {
  num: string;
  title: string;
  desc: string;
}

const steps: ProcessStep[] = [
  {
    num: "01",
    title: "Discovery",
    desc: "We dive deep into your industry, research competitor ecosystems, and conduct interviews with key stakeholders to align on project objectives, user personas, and target outcomes."
  },
  {
    num: "02",
    title: "Strategy",
    desc: "Translating insights into action. We define the product roadmap, technology architecture, user flows, and key performance indicators to ensure strict alignment with your business goals."
  },
  {
    num: "03",
    title: "Design",
    desc: "Crafting beautiful, accessible, and intuitive user experiences. We produce high-fidelity wireframes, custom typography layouts, cohesive color systems, and interactive prototypes."
  },
  {
    num: "04",
    title: "Development",
    desc: "Engineering state-of-the-art web interfaces using modern Next.js and clean, component-scoped CSS styles. We prioritize semantic structures, fluid animations, and fast load speeds."
  },
  {
    num: "05",
    title: "Testing",
    desc: "Rigorous quality assurance across all modern browsers and device form factors. We optimize assets, execute usability checks, audit for accessibility, and resolve code inconsistencies."
  },
  {
    num: "06",
    title: "Launch",
    desc: "Deploying highly optimized production builds with zero downtime. We finalize deployment pipelines, configure SEO metadata schemas, set up analytics, and transition project ownership."
  }
];

export function ProcessSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const fill = fillRef.current;
    const dot = dotRef.current;
    if (!container || !fill || !dot) return;

    const updateTimeline = () => {
      const stepsElements = container.querySelectorAll(".process-step");
      const tlRect = container.getBoundingClientRect();
      const trigger = window.innerHeight * 0.65;
      let lastActive = -1;

      stepsElements.forEach((step) => {
        const htmlStep = step as HTMLElement;
        const rect = htmlStep.getBoundingClientRect();
        const stepTop = rect.top + rect.height * 0.3;

        if (stepTop < trigger) {
          htmlStep.classList.add("process-revealed");
          lastActive = parseInt(htmlStep.dataset.index || "-1", 10);
        } else {
          htmlStep.classList.remove("process-revealed");
        }
      });

      if (lastActive >= 0) {
        const activeStep = stepsElements[lastActive] as HTMLElement;
        const sRect = activeStep.getBoundingClientRect();
        const dotY = sRect.top - tlRect.top + 24;

        dot.style.top = `${dotY}px`;
        fill.style.height = `${dotY + 20}px`;
        dot.textContent = String(lastActive + 1).padStart(2, "0");
        dot.classList.add("process-visible");
      } else {
        fill.style.height = "0px";
        dot.classList.remove("process-visible");
      }
    };

    window.addEventListener("scroll", updateTimeline, { passive: true });
    window.addEventListener("resize", updateTimeline, { passive: true });
    
    // Run the animation updater immediately on mount
    updateTimeline();

    return () => {
      window.removeEventListener("scroll", updateTimeline);
      window.removeEventListener("resize", updateTimeline);
    };
  }, []);

  return (
    <section className="process-section" id="our-process">
      <div className="process-container">
        <div className="mb-16 text-center" style={{ textAlign: "center", width: "100%", display: "block" }}>
          <span className="process-step-num" style={{ opacity: 1, display: "inline-block", marginBottom: "8px" }}>
            — OUR PROCESS —
          </span>
          <h2 className="text-3xl md:text-5xl font-light font-sans text-[#f0ece8] tracking-tight leading-tight">
            Designed with purpose. Built with precision.
          </h2>
        </div>

        <div className="process-timeline" ref={containerRef}>
          <div className="process-tl-track" />
          <div className="process-tl-fill" ref={fillRef} />
          <div className="process-tl-dot" ref={dotRef}>01</div>

          {steps.map((step, idx) => {
            const isOdd = idx % 2 === 0; // index 0, 2, 4 are the 1st, 3rd, 5th steps
            return (
              <div
                key={idx}
                className="process-step"
                data-index={idx}
              >
                {/* Left Column: contains content for odd-indexed steps */}
                <div className="process-step-left">
                  {isOdd && (
                    <div>
                      <div className="process-step-num">{step.num}</div>
                      <h3 className="process-step-title">{step.title}</h3>
                      <p className="process-step-desc">{step.desc}</p>
                    </div>
                  )}
                </div>

                {/* Center Column Spacer */}
                <div className="process-step-center" />

                {/* Right Column: contains content for even-indexed steps */}
                <div className="process-step-right">
                  {!isOdd && (
                    <div>
                      <div className="process-step-num">{step.num}</div>
                      <h3 className="process-step-title">{step.title}</h3>
                      <p className="process-step-desc">{step.desc}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
