import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0A0A0A",
          backgroundImage:
            "linear-gradient(135deg, #0A0A0A 0%, #2a0800 50%, #CC2200 100%)",
          color: "#ffffff",
          fontSize: 120,
          fontWeight: 800,
          letterSpacing: "-0.06em",
          borderRadius: 38,
        }}
      >
        A
      </div>
    ),
    { ...size }
  );
}
