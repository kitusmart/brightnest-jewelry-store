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
  // Correct way to ignore errors in newer Next.js versions
  typescript: {
    ignoreBuildErrors: true,
  },
  // Removed the 'eslint' block that was causing the error
};

export default nextConfig;
