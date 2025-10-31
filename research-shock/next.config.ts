import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   images: {
    domains: [
      'avatars.githubusercontent.com',
      'images.unsplash.com',
      'res.cloudinary.com',
      'localhost',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  experimental: {
  }

};

export default nextConfig;
