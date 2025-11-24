/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Exclude old Vite entry files and React Router dependencies
  typescript: {
    // Ignore type errors in old entry files
    ignoreBuildErrors: false,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
}

module.exports = nextConfig

