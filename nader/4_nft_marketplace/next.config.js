/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["ipfs.infura.io", "gateway.pinata.cloud"],
  },
}

module.exports = nextConfig
