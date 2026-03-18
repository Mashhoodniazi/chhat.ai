import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Chaat.ai — Build AI Chatbots for Your Website";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background glow effects */}
        <div
          style={{
            position: "absolute",
            top: -100,
            left: -100,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -100,
            right: -100,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)",
            display: "flex",
          }}
        />

        {/* Logo + name row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            marginBottom: 32,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${process.env.NEXTAUTH_URL ?? "http://localhost:3000"}/logo.png`}
            width={80}
            height={80}
            style={{ borderRadius: 16 }}
            alt="logo"
          />
          <span
            style={{
              fontSize: 56,
              fontWeight: 800,
              color: "#ffffff",
              letterSpacing: "-1px",
            }}
          >
            Chaat.ai
          </span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 28,
            fontWeight: 500,
            color: "#94a3b8",
            textAlign: "center",
            maxWidth: 760,
            lineHeight: 1.4,
          }}
        >
          Build AI Chatbots for Your Website
        </div>

        {/* Sub-tagline */}
        <div
          style={{
            marginTop: 16,
            fontSize: 20,
            color: "#64748b",
            textAlign: "center",
            maxWidth: 680,
          }}
        >
          Upload documents · Create bots · Embed anywhere
        </div>

        {/* Bottom badge */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(99,102,241,0.15)",
            border: "1px solid rgba(99,102,241,0.3)",
            borderRadius: 999,
            padding: "8px 20px",
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#6366f1",
              display: "flex",
            }}
          />
          <span style={{ color: "#a5b4fc", fontSize: 16 }}>
            Powered by AI
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
