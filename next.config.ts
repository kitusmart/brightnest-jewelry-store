import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  reactCompiler: true, // This is now stable in v16
};

export default nextConfig;
