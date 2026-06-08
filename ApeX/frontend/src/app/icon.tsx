import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default async function Icon() {
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
          borderRadius: 7,
          color: "#ffffff",
          fontSize: 22,
          fontWeight: 800,
          letterSpacing: "-0.06em",
          backgroundImage:
            "linear-gradient(135deg, #0A0A0A 0%, #1a0500 70%, #2a0800 100%)",
        }}
      >
        A
      </div>
    ),
    { ...size }
  );
}
