"use client";

import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import { UnderlineLink } from "@/components/ui/UnderlineLink";
import { Button } from "@/components/ui/Button";
import { useActiveSection } from "@/hooks/useActiveSection";
import { NAV_LINKS, SECTION_IDS } from "@/lib/constants";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeSection = useActiveSection(SECTION_IDS);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 40);
  });

  const linkHrefToId = (href: string) => href.replace("#", "");

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        scrolled
          ? "bg-[rgba(8,8,8,0.88)] backdrop-blur-xl border-b border-[rgba(255,255,255,0.08)]"
          : "bg-transparent"
      }`}
    >
      <nav
        className="flex items-center justify-between px-5 md:px-10 lg:px-16 xl:px-24 h-20"
        aria-label="Main navigation"
      >
        <a
          href="#main-content"
          className="font-[family-name:var(--font-syne)] text-xl md:text-2xl font-bold tracking-tight gradient-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          ApeX
        </a>

        <ul className="hidden md:flex items-center gap-10">
          {NAV_LINKS.map((link) => {
            const id = linkHrefToId(link.href);
            const isActive = activeSection === id;
            return (
              <li key={link.href}>
                <UnderlineLink
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`text-xs uppercase tracking-[0.2em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent ${
                    isActive
                      ? "nav-active-yg"
                      : "text-[#FFFFFF] hover:text-[#FFFFFF]"
                  }`}
                >
                  {link.label}
                </UnderlineLink>
              </li>
            );
          })}
          <li>
            <Button href="/apet-contact.html" variant="primary" size="pill">
              Join Now
            </Button>
          </li>
        </ul>


        <button
          type="button"
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          className="md:hidden flex flex-col gap-1.5 p-3 min-w-[44px] min-h-[44px] items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <span
            className={`block w-6 h-px bg-text-primary transition-transform ${mobileOpen ? "rotate-45 translate-y-2" : ""}`}
          />
          <span
            className={`block w-6 h-px bg-text-primary transition-opacity ${mobileOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block w-6 h-px bg-text-primary transition-transform ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`}
          />
        </button>
      </nav>

      {mobileOpen && (
        <motion.div
          id="mobile-menu"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="md:hidden border-t border-[rgba(255,255,255,0.08)] bg-[rgba(8,8,8,0.97)] backdrop-blur-xl"
        >
          <ul className="flex flex-col gap-6 p-8">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block py-2 text-sm uppercase tracking-[0.2em] text-[#FFFFFF] min-h-[44px] flex items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <Button href="/apet-contact.html" variant="primary" size="pill" onClick={() => setMobileOpen(false)}>
                Join Now
              </Button>
            </li>
          </ul>
        </motion.div>
      )}
    </motion.header>
  );
}
