import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        // This proxy is used for public API calls made from the client-side.
        // It hides the actual API endpoint from the browser.
        source: "/api/proxy/:path*",
        destination: `${process.env.REMOTE_API_BASE_URL}/:path*`,
      },
    ];
  },
};

export default nextConfig;
