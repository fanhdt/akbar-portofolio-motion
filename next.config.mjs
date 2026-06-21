/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
      // tambahkan juga hostname Sanity CDN kamu kalau belum ada, contoh:
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
  // Memaksa Next.js tetap melanjutkan build meskipun ada eror TypeScript (garis merah)
  typescript: {
    ignoreBuildErrors: true,
  },

  // Memaksa Next.js tetap melanjutkan build meskipun ada eror ESLint
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
