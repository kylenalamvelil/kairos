import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_KAIROS_API_URL: process.env.NEXT_PUBLIC_KAIROS_API_URL ?? 'https://kairos-production-64c5.up.railway.app',
  },
};

export default nextConfig;
