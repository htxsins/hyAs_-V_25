/** @type {import('next').NextConfig} */
import path from "path";
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        port: "",
      },
    ],
    domains: ['res.cloudinary.com', 'hebbkx1anhila5yf.public.blob.vercel-storage.com'],
  },
  webpack: (config) => {
    // Resolve aliases
    config.resolve.alias["@"] = "/src"; // Adjust the path as needed

    return config;
  },
};

export default nextConfig;
