import type { NextConfig } from "next";
import type { Configuration } from "webpack";

const nextConfig: NextConfig = {
  /* config options here */
  async redirects() {
    return [
      // Basic redirect
      {
        source: "/",
        destination: "/building-information/residents",
        permanent: false,
      },
      {
        source: "/building-information",
        destination: "/building-information/residents",
        permanent: false,
      },
      {
        source: "/services",
        destination: "/services/hotlines",
        permanent: false,
      },
      {
        source: "/boards",
        destination: "/boards/notifications",
        permanent: false,
      },
      {
        source: "/profile",
        destination: "/profile/profile-info",
        permanent: false,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  reactStrictMode: false,
  eslint: {
    // Bỏ qua kiểm tra ESLint khi chạy `next build`
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  webpack(config: Configuration) {
    config.module?.rules?.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export default nextConfig;
