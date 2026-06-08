"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { UnderlineLink } from "@/components/ui/UnderlineLink";
import { Button } from "@/components/ui/Button";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useNavigation } from "@/hooks/useContent";

export function FloatingGlassNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: navData, loading } = useNavigation();
  const sectionIds = navData?.links.map(link => link.href.replace('#', '')) || [];
  const activeSection = useActiveSection(sectionIds);

  const linkHrefToId = (href: string) => href.replace("#", "");

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace("#", "");
    const element = document.getElementById(targetId);
    if (element) {
      const offset = 80; // Account for navbar height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      
      // Close mobile menu if open
      setMobileOpen(false);
    }
  };

  if (loading) {
    return (
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex items-center justify-between gap-8 px-8 py-3.5 rounded-full"
        style={{
          backgroundColor: "rgba(13, 17, 23, 0.92)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
        }}
        aria-label="Main navigation"
      >
        <motion.a
          href="#hero"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E03A1E]"
        >
          <span className="font-[family-name:var(--font-syne)] text-lg font-bold tracking-tight text-white">
            ApeX
          </span>
        </motion.a>
        <div className="animate-pulse h-8 w-32 bg-[#2A2A2A] rounded" />
      </motion.nav>
    );
  }

  if (!navData) return null;

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex items-center justify-between gap-6 md:gap-8 px-6 md:px-8 py-3.5 rounded-full"
        style={{
          backgroundColor: "rgba(13, 17, 23, 0.92)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
        }}
        aria-label="Main navigation"
      >
        {/* Logo Section */}
        <motion.a
          href="#hero"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E03A1E]"
        >
          <span className="font-[family-name:var(--font-syne)] text-lg font-bold tracking-tight text-white">
            ApeX
          </span>
        </motion.a>

        {/* Desktop Navigation Links */}
        <ul className="hidden md:flex items-center gap-6">
          {navData.links.map((link) => {
            const id = linkHrefToId(link.href);
            const isActive = activeSection === id;
            return (
              <li key={link.href}>
                <UnderlineLink
                  href={link.href}
                  onClick={(e) => handleSmoothScroll(e, link.href)}
                  aria-current={isActive ? "page" : undefined}
                  className={`text-xs uppercase tracking-[0.2em] transition-all duration-300 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D4FF00] ${
                    isActive
                      ? "text-[#D4FF00]"
                      : "text-[#FFFFFF] hover:text-white"
                  }`}
                >
                  {link.label}
                </UnderlineLink>
              </li>
            );
          })}
          <li className="ml-2">
            <Button
              href="/apet-contact.html"
              variant="primary"
              size="sm"
              className="!rounded-full px-4 py-1.5 text-xs font-semibold"
            >
              Join Now
            </Button>
          </li>
        </ul>


        {/* Mobile Menu Button */}
        <button
          type="button"
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          className="md:hidden flex flex-col gap-1.5 p-2 min-w-[36px] min-h-[36px] items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D4FF00]"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <span
            className={`block w-5 h-px bg-white transition-transform duration-300 ${mobileOpen ? "rotate-45 translate-y-1.5" : ""}`}
          />
          <span
            className={`block w-5 h-px bg-white transition-opacity duration-300 ${mobileOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block w-5 h-px bg-white transition-transform duration-300 ${mobileOpen ? "-rotate-45 -translate-y-1.5" : ""}`}
          />
        </button>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-[99] w-[calc(100%-2rem)] max-w-md rounded-2xl p-6"
            style={{
              backgroundColor: "rgba(13, 17, 23, 0.92)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
            }}
          >
            <ul className="flex flex-col gap-4">
              {navData.links.map((link) => {
                const id = linkHrefToId(link.href);
                const isActive = activeSection === id;
                return (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={(e) => handleSmoothScroll(e, link.href)}
                      className={`block py-3 text-sm uppercase tracking-[0.2em] min-h-[44px] flex items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D4FF00] transition-colors duration-300 ${
                        isActive ? "text-[#D4FF00]" : "text-[#FFFFFF]"
                      }`}
                    >
                      {link.label}
                    </a>
                  </li>
                );
              })}
              <li className="mt-2">
                <Button
                  href="/apet-contact.html"
                  variant="primary"
                  size="sm"
                  className="w-full text-center"
                >
                  Join Now
                </Button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
