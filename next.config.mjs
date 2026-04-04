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

  async redirects() {
    return [
      {
        source: "/formations/diplomantes/mastere-bim",
        destination: "/formations/mastere-bim",
        permanent: true,
      },
      {
        source: "/formations/diplomantes/master-immobilier",
        destination: "/formations/master-immobilier",
        permanent: true,
      },
      {
        source: "/formations/certifiantes/bim-foundations",
        destination: "/formations/bim-foundations",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
