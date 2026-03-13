import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  serverExternalPackages: ["pdf-parse", "@langchain/community"],
  turbopack: {},
  experimental: {
    instrumentationHook: true,
  },
};

export default nextConfig;
