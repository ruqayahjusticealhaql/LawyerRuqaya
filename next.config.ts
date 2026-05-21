import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000", "lawyer-ruqaya-abdulrahman-pjtk.vercel.app"],
    },
  },
};

export default nextConfig;
