/** @type {import('next').NextConfig} */
const nextConfig = {
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
