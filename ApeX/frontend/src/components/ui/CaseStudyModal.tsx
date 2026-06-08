"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Button } from "@/components/ui/Button";
import type { PortfolioProject } from "@/lib/types";

interface CaseStudyModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: PortfolioProject | null;
}

export function CaseStudyModal({ isOpen, onClose, project }: CaseStudyModalProps) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!project || !project.caseStudy) return null;

  const { title, category, caseStudy } = project;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="w-full max-w-4xl max-h-[90vh] overflow-y-auto"
              role="dialog"
              aria-modal="true"
              aria-labelledby="case-study-title"
            >
              <GlassPanel className="p-8 md:p-12">
                {/* Header */}
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <span className="text-xs uppercase tracking-[0.2em] text-text-muted mb-2 block">
                      {category}
                    </span>
                    <h2
                      id="case-study-title"
                      className="font-[family-name:var(--font-syne)] text-3xl md:text-4xl font-bold tracking-tight text-text-primary"
                    >
                      {title}
                    </h2>
                  </div>
                  <button
                    onClick={onClose}
                    className="ml-4 p-2 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
                    aria-label="Close modal"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Description */}
                <p className="text-lg text-text-secondary mb-8 leading-relaxed">
                  {caseStudy.description}
                </p>

                {/* Challenges */}
                <div className="mb-8">
                  <h3 className="text-sm uppercase tracking-[0.2em] text-text-muted mb-4">Challenges</h3>
                  <ul className="space-y-2">
                    {caseStudy.challenges.map((challenge, index) => (
                      <li key={index} className="flex items-start gap-3 text-text-secondary">
                        <span className="text-[#AAFF00] mt-1">•</span>
                        <span>{challenge}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Solutions */}
                <div className="mb-8">
                  <h3 className="text-sm uppercase tracking-[0.2em] text-text-muted mb-4">Solutions</h3>
                  <ul className="space-y-2">
                    {caseStudy.solutions.map((solution, index) => (
                      <li key={index} className="flex items-start gap-3 text-text-secondary">
                        <span className="text-[#AAFF00] mt-1">✓</span>
                        <span>{solution}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Results */}
                <div className="mb-8">
                  <h3 className="text-sm uppercase tracking-[0.2em] text-text-muted mb-4">Results</h3>
                  <ul className="space-y-2">
                    {caseStudy.results.map((result, index) => (
                      <li key={index} className="flex items-start gap-3 text-text-secondary">
                        <span className="text-[#AAFF00] mt-1">★</span>
                        <span>{result}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Technologies */}
                {caseStudy.technologies.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-sm uppercase tracking-[0.2em] text-text-muted mb-4">Technologies</h3>
                    <div className="flex flex-wrap gap-2">
                      {caseStudy.technologies.map((tech, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 text-sm rounded-full bg-white/5 border border-white/10 text-text-secondary"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4 pt-4 border-t border-white/10">
                  {caseStudy.liveUrl && (
                    <Button
                      href={caseStudy.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="primary"
                      size="pill"
                    >
                      View Live Site →
                    </Button>
                  )}
                </div>
              </GlassPanel>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
