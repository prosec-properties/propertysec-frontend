/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "lodash",
      "recharts",
      "date-fns",
      "@radix-ui/react-dialog",
      "@radix-ui/react-slot",
      "@radix-ui/react-label",
      "@radix-ui/react-select",
      "@radix-ui/react-toast",
      "@radix-ui/react-accordion",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-popover",
      "@radix-ui/react-tabs",
      "@radix-ui/react-checkbox",
      "@radix-ui/react-radio-group",
      "@radix-ui/react-switch",
      "@radix-ui/react-tooltip",
      "@radix-ui/react-scroll-area",
      "@tanstack/react-query",
    ],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "prosecblob.blob.core.windows.net",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "prosecbucketstorage.s3.amazonaws.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "qadoc.s3.amazonaws.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "pub-5a047034065145e8a6cb669ec5aca91e.r2.dev",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "dc27b5589db2bd071b61f02c1a6aad39.r2.cloudflarestorage.com",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
