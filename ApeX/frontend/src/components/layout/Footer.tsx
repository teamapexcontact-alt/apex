"use client";

import Link from "next/link";
import { siteConfig } from "@/lib/seo";

export function Footer() {
  const year = new Date().getFullYear();
  const socials = siteConfig.socialLinks;

  const sections: Array<{ label: string; href: string }> = [
    { label: "Home", href: "/#hero" },
    { label: "Services", href: "/#services" },
    { label: "Our Work", href: "/#portfolio" },
    { label: "Why Us", href: "/#why-choose-us" },
    { label: "Our Process", href: "/#our-process" },
    { label: "FAQ", href: "/#faq" },
  ];

  return (
    <footer className="relative w-full bg-[#000000] border-t border-[#1a1a1a]">
      <div
        className="px-[4rem] pt-[64px] pb-[40px] flex justify-between items-start max-w-[1440px] mx-auto"
        style={{ gap: "3rem" }}
      >
        <div className="flex flex-col" style={{ maxWidth: 360 }}>
          <div className="flex items-center gap-[12px] mb-[1rem]">
            <span className="text-[1.3rem] font-bold text-white">{siteConfig.name}</span>
          </div>

          <p className="text-[0.85rem] text-[#a3a3a3] leading-[1.6] mt-[1rem]">
            {siteConfig.description}
          </p>

          <address className="mt-[1rem] not-italic">
            <span className="text-[0.85rem] text-[#a3a3a3]">Get in Touch: </span>
            <a
              href={`mailto:${siteConfig.email}`}
              className="text-[0.85rem] text-white hover:text-[#84cc16] transition-colors"
            >
              {siteConfig.email}
            </a>
          </address>

          <div className="flex gap-[8px] mt-[1.5rem]" aria-label="Social links">
            {socials.instagram ? (
              <a
                href={socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-[36px] h-[36px] border border-[#2a2a2a] rounded-[8px] flex items-center justify-center text-white hover:border-[#84cc16] transition-colors"
                aria-label={`${siteConfig.name} on Instagram`}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
            ) : null}
            {socials.whatsapp ? (
              <a
                href={socials.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="w-[36px] h-[36px] border border-[#2a2a2a] rounded-[8px] flex items-center justify-center text-white hover:border-[#84cc16] transition-colors"
                aria-label={`${siteConfig.name} on WhatsApp`}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M20.52 3.449C18.25 1.18 15.22 0 12.001 0 5.373 0 0 5.373 0 12c0 2.164.564 4.279 1.637 6.138L.065 24l6.196-1.626A11.966 11.966 0 0 0 12.001 24c6.627 0 12-5.373 12-12 0-3.219-1.18-6.249-3.481-8.551zm-8.519 18.175c-1.89 0-3.738-.508-5.35-1.468l-.383-.228-3.974 1.043 1.062-3.876-.249-.395c-1.055-1.674-1.61-3.612-1.61-5.592 0-5.836 4.747-10.584 10.584-10.584 2.83 0 5.489 1.103 7.485 3.104 1.996 1.999 3.103 4.656 3.102 7.485-.001 5.835-4.748 10.584-10.583 10.584zm5.782-7.925c-.317-.159-1.874-.925-2.164-1.032-.291-.107-.502-.159-.714.159-.212.317-.82 1.032-.997 1.246-.176.213-.353.24-.653.08-.301-.161-1.272-.469-2.423-1.498-.895-.798-1.498-1.783-1.673-2.083-.176-.301-.019-.463.131-.613.134-.134.301-.35.452-.524.151-.174.201-.301.301-.502.1-.201.05-.375-.025-.524-.075-.149-.652-1.572-.894-2.152-.23-.55-.466-.475-.653-.484-.168-.008-.361-.01-.553-.01-.192 0-.505.071-.77.362-.265.291-1.011.989-1.011 2.41 0 1.421 1.034 2.793 1.178 2.984.144.192 2.037 3.111 4.936 4.368.69.297 1.229.475 1.649.608.692.22 1.322.189 1.821.115.553-.082 1.874-.766 2.136-1.507.262-.74.262-1.374.183-1.507-.079-.133-.291-.212-.607-.371z" />
                </svg>
              </a>
            ) : null}
            {socials.twitter ? (
              <a
                href={socials.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="w-[36px] h-[36px] border border-[#2a2a2a] rounded-[8px] flex items-center justify-center text-white hover:border-[#84cc16] transition-colors"
                aria-label={`${siteConfig.name} on Twitter`}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            ) : null}
            {socials.linkedin ? (
              <a
                href={socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-[36px] h-[36px] border border-[#2a2a2a] rounded-[8px] flex items-center justify-center text-white hover:border-[#84cc16] transition-colors"
                aria-label={`${siteConfig.name} on LinkedIn`}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
                </svg>
              </a>
            ) : null}
            {socials.github ? (
              <a
                href={socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="w-[36px] h-[36px] border border-[#2a2a2a] rounded-[8px] flex items-center justify-center text-white hover:border-[#84cc16] transition-colors"
                aria-label={`${siteConfig.name} on GitHub`}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2c-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.09-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.18 1.18a11.04 11.04 0 0 1 5.79 0c2.21-1.49 3.18-1.18 3.18-1.18.62 1.58.23 2.75.11 3.04.73.8 1.18 1.83 1.18 3.09 0 4.42-2.69 5.4-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.68.8.56A11.52 11.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
                </svg>
              </a>
            ) : null}
          </div>
        </div>

        <nav
          className="flex gap-[4rem]"
          aria-label="Footer navigation"
          style={{ flexWrap: "wrap" }}
        >
          <div>
            <h2 className="text-[0.8rem] tracking-[0.1em] text-white font-semibold mb-[1rem] uppercase">
              Sections
            </h2>
            <ul className="space-y-0" style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {sections.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block text-[0.85rem] text-[#a3a3a3] leading-[2] hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-[0.8rem] tracking-[0.1em] text-white font-semibold mb-[1rem] uppercase">
              Connect
            </h2>
            <ul className="space-y-0" style={{ listStyle: "none", padding: 0, margin: 0 }}>
              <li>
                <Link
                  href="/#contact"
                  className="block text-[0.85rem] text-[#a3a3a3] leading-[2] hover:text-white transition-colors"
                >
                  Start a project
                </Link>
              </li>
              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="block text-[0.85rem] text-[#a3a3a3] leading-[2] hover:text-white transition-colors"
                >
                  Email us
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.whatsapp ? `https://wa.me/${siteConfig.whatsapp}` : "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-[0.85rem] text-[#a3a3a3] leading-[2] hover:text-white transition-colors"
                >
                  WhatsApp
                </a>
              </li>
              <li>
                <span className="block text-[0.85rem] text-[#a3a3a3] leading-[2]">
                  {siteConfig.location.city}, {siteConfig.location.country}
                </span>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      <div className="border-t border-[#1a1a1a] px-[4rem] py-[1.5rem] flex justify-between items-center max-w-[1440px] mx-auto">
        <p className="text-[0.8rem] text-[#a3a3a3]">
          © {year} {siteConfig.name}. All rights reserved.
        </p>
        <p className="text-[0.8rem] text-[#a3a3a3]">
          {siteConfig.location.city} · {siteConfig.location.country}
        </p>
      </div>

      <style>{`
        @media (max-width: 767px) {
          footer > div:first-child {
            flex-direction: column;
            gap: 2rem;
          }
          footer > div:first-child > nav {
            flex-direction: column;
            gap: 2rem;
          }
        }
      `}</style>
    </footer>
  );
}
