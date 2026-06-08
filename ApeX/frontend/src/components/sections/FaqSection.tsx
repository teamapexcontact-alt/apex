"use client";

import { useState } from "react";
import { siteConfig } from "@/lib/seo";

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="relative w-full"
      style={{
        paddingLeft: "var(--section-x)",
        paddingRight: "var(--section-x)",
        paddingTop: "var(--section-y)",
        paddingBottom: "var(--section-y)",
        backgroundColor: "#000000",
      }}
    >
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <span
            style={{
              fontSize: "0.7rem",
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: "#d4f000",
              fontWeight: 600,
            }}
          >
            — FAQ —
          </span>
          <h2
            id="faq-heading"
            style={{
              fontSize: "clamp(2rem, 4vw, 3.25rem)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              color: "#ffffff",
              margin: "0.75rem 0 1rem",
            }}
          >
            Questions, answered
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,0.6)",
              fontSize: "clamp(0.95rem, 1.4vw, 1.05rem)",
              lineHeight: 1.6,
              maxWidth: 540,
              margin: "0 auto",
            }}
          >
            Everything you need to know about working with {siteConfig.shortName}.
          </p>
        </div>

        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {siteConfig.faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            const panelId = `faq-panel-${index}`;
            const buttonId = `faq-button-${index}`;
            return (
              <li
                key={faq.question}
                style={{
                  borderRadius: 14,
                  background: "rgba(17, 24, 39, 0.6)",
                  border: `1px solid ${isOpen ? "rgba(212, 240, 0, 0.28)" : "rgba(255,255,255,0.06)"}`,
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  overflow: "hidden",
                  transition: "border-color 0.3s ease",
                }}
              >
                <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 600 }}>
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "1rem",
                      padding: "1.1rem 1.25rem",
                      background: "transparent",
                      border: "none",
                      color: "#ffffff",
                      fontSize: "clamp(0.95rem, 1.3vw, 1.05rem)",
                      fontWeight: 600,
                      textAlign: "left",
                      cursor: "pointer",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    <span style={{ flex: 1 }}>{faq.question}</span>
                    <span
                      aria-hidden
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 28,
                        height: 28,
                        borderRadius: 999,
                        border: "1px solid rgba(212, 240, 0, 0.35)",
                        color: "#d4f000",
                        fontSize: 14,
                        transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                        transition: "transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
                        flexShrink: 0,
                      }}
                    >
                      +
                    </span>
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  hidden={!isOpen}
                  style={{
                    padding: isOpen ? "0 1.25rem 1.1rem" : "0 1.25rem",
                    color: "rgba(255,255,255,0.7)",
                    fontSize: "0.95rem",
                    lineHeight: 1.65,
                  }}
                >
                  {faq.answer}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
