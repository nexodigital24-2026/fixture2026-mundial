import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // Trust reverse proxy headers for subdomain deployment
  // Caddy forwards X-Forwarded-Host, X-Forwarded-Proto, X-Real-IP
};

export default nextConfig;
