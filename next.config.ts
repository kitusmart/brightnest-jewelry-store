import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Stable top-level property in v16
  reactCompiler: true,

  // New stable Turbopack configuration for v16
  turbopack: {
    root: "./",
  },
};

export default nextConfig;
