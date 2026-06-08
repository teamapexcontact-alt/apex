import { ImageResponse } from "next/og";
import { siteConfig, SITE_TAGLINE } from "@/lib/seo";

export const alt = `${siteConfig.name} — ${SITE_TAGLINE}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          backgroundColor: "#000000",
          backgroundImage:
            "radial-gradient(ellipse 80% 60% at 100% 0%, rgba(204, 34, 0, 0.22) 0%, transparent 55%), radial-gradient(ellipse 60% 50% at 0% 100%, rgba(212, 240, 0, 0.10) 0%, transparent 55%), linear-gradient(180deg, #050505 0%, #000000 100%)",
          fontFamily: "system-ui, sans-serif",
          color: "#ffffff",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            opacity: 0.45,
            display: "flex",
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            position: "relative",
            zIndex: 2,
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 18,
              background:
                "linear-gradient(135deg, #CC2200 0%, #9A1A00 55%, #E02A00 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              fontSize: 38,
              fontWeight: 800,
              letterSpacing: "-0.04em",
            }}
          >
            A
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              lineHeight: 1.1,
            }}
          >
            <div
              style={{
                fontSize: 30,
                fontWeight: 800,
                letterSpacing: "-0.02em",
                color: "#ffffff",
                display: "flex",
              }}
            >
              {siteConfig.name}
            </div>
            <div
              style={{
                fontSize: 16,
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.55)",
                marginTop: 4,
                display: "flex",
              }}
            >
              Digital Studio
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            position: "relative",
            zIndex: 2,
            maxWidth: 980,
          }}
        >
          <div
            style={{
              fontSize: 28,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: "#d4f000",
              marginBottom: 28,
              fontWeight: 600,
              display: "flex",
            }}
          >
            {siteConfig.location.city} - Worldwide
          </div>
          <div
            style={{
              fontSize: 88,
              lineHeight: 1.05,
              fontWeight: 800,
              letterSpacing: "-0.04em",
              background:
                "linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.78) 100%)",
              backgroundClip: "text",
              color: "transparent",
              display: "flex",
            }}
          >
            {SITE_TAGLINE}
          </div>
          <div
            style={{
              fontSize: 28,
              lineHeight: 1.45,
              color: "rgba(255,255,255,0.72)",
              marginTop: 28,
              maxWidth: 880,
              display: "flex",
            }}
          >
            High-performance websites, AI automations, 3D web experiences, and brand
            systems for modern businesses.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            position: "relative",
            zIndex: 2,
            fontSize: 18,
            color: "rgba(255,255,255,0.55)",
            letterSpacing: "0.06em",
          }}
        >
          <div style={{ display: "flex" }}>{siteConfig.url}</div>
          <div
            style={{
              display: "flex",
              padding: "10px 22px",
              borderRadius: 999,
              border: "1.5px solid #d4f000",
              color: "#d4f000",
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              fontSize: 14,
            }}
          >
            Build - Automate - Scale
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
