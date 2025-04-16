import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async redirects() {
    return [
      // Basic redirect
      {
        source: "/",
        destination: "/dashboard",
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
