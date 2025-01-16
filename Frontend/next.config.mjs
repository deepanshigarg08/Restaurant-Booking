/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    domains: [''], // Only the hostname, without "https://"
  },
};

export default nextConfig;
