import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ishop.kg",
        pathname: "/**",
      },
    ],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      // Route react-router-dom imports to our Next.js compatibility layer
      "react-router-dom": path.resolve(__dirname, "src/router/compat.tsx"),
    };
    return config;
  },
};

export default nextConfig;
