/** @type {import('next').NextConfig} */
const nextConfig = {
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
