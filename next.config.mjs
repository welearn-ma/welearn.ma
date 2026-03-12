/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },

  async rewrites() {
    return [
      {
        source: "/logos/:slug.png",
        destination: "/partners/:slug.webp",
      },
    ];
  },
};

export default nextConfig;
