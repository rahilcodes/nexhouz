import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  env: {
    NEXT_PUBLIC_BUILD_TIMESTAMP: new Date().toISOString()
  }
};

export default nextConfig;

