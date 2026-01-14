/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb"
    }
  },
  async redirects() {
    return [
      {
        source: "/api/auth/google/callback",
        destination: "/api/auth/callback/google",
        permanent: false
      }
    ];
  },
  async rewrites() {
    return [
      {
        source: "/",
        destination: "/legacy-index.html"
      }
    ];
  }
};

export default nextConfig;
