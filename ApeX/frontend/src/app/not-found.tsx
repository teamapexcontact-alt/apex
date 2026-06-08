import type { Metadata } from "next";
import Link from "next/link";
import { generatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Page Not Found",
  description:
    "The page you are looking for could not be found. Explore premium digital experiences, AI automation, and brand systems by ApeX Studio.",
  path: "/404",
  noIndex: true,
});

export default function NotFound() {
  return (
    <main
      id="main-content"
      role="main"
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        backgroundColor: "#000000",
        color: "#ffffff",
        padding: "1.5rem",
        position: "relative",
        overflow: "hidden",
        fontFamily: "var(--font-dm-sans), system-ui, sans-serif",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 80% 60% at 50% 30%, rgba(204, 34, 0, 0.18) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 100%, rgba(212, 240, 0, 0.08) 0%, transparent 55%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "relative",
          zIndex: 1,
          textAlign: "center",
          maxWidth: 640,
        }}
      >
        <div
          aria-hidden
          style={{
            fontSize: "clamp(8rem, 22vw, 16rem)",
            fontWeight: 800,
            letterSpacing: "-0.06em",
            lineHeight: 0.9,
            background:
              "linear-gradient(135deg, rgba(204, 34, 0, 0.85) 0%, rgba(255, 77, 26, 0.6) 60%, rgba(212, 240, 0, 0.6) 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            marginBottom: "0.5rem",
            fontFamily: "var(--font-syne), system-ui, sans-serif",
          }}
        >
          404
        </div>
        <h1
          style={{
            fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            margin: "0 0 1rem",
            fontFamily: "var(--font-syne), system-ui, sans-serif",
          }}
        >
          Page not found
        </h1>
        <p
          style={{
            color: "rgba(255,255,255,0.65)",
            fontSize: "clamp(0.95rem, 1.5vw, 1.1rem)",
            lineHeight: 1.6,
            margin: "0 auto 2rem",
            maxWidth: 480,
          }}
        >
          The link you followed may be broken, or the page may have been moved.
          Let&apos;s get you back to building something great.
        </p>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.75rem",
            justifyContent: "center",
          }}
        >
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.85rem 2rem",
              borderRadius: 999,
              background:
                "linear-gradient(135deg, #CC2200 0%, #9A1A00 55%, #E02A00 100%)",
              color: "#ffffff",
              textDecoration: "none",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              fontSize: "0.85rem",
              boxShadow: "0 0 28px rgba(204, 34, 0, 0.4)",
            }}
          >
            Back to home
            <span aria-hidden>→</span>
          </Link>
          <Link
            href="/#services"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.85rem 2rem",
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.15)",
              color: "#ffffff",
              textDecoration: "none",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              fontSize: "0.85rem",
              background: "transparent",
            }}
          >
            Explore services
          </Link>
        </div>
      </div>
    </main>
  );
}
