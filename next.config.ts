import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Removed 'output: export' to support dynamic routes with client-side state
  images: {
    unoptimized: true,
  },
  // basePath: '/x1-foreman', // Commented out for development
};

export default nextConfig;
