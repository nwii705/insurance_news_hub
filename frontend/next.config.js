/** @type {import('next').NextConfig} */
const nextConfig = {
  // Reactivity & Performance
  reactStrictMode: true,
  swcMinify: true,

  // Internationalization
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000"],
    },
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.vnexpress.net",
      },
      {
        protocol: "https",
        hostname: "**.cafef.vn",
      },
      {
        protocol: "https",
        hostname: "**.vneconomy.vn",
      },
      {
        protocol: "https",
        hostname: "**.baodautu.vn",
      },
      {
        protocol: "https",
        hostname: "**.dantri.com.vn",
      },
      {
        protocol: "https",
        hostname: "**.thuvienphapluat.vn",
      },
      {
        protocol: "https",
        hostname: "localhost",
      },
    ],
  },
};

module.exports = nextConfig;
