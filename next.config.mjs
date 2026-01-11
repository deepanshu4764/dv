/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb"
    }
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
