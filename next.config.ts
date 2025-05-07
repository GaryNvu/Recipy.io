import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: '**',
        port: '',
        pathname: '**',
        
      }
    ],
    domains: ['v5.airtableusercontent.com'],
  }
};

export default nextConfig;
