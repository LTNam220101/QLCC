import type { NextConfig } from "next";

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
        source: "/profile",
        destination: "/profile/profile-info",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
