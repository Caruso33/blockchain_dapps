/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          }
        ],
      },
    ]
  },
  reactStrictMode: true,
  images: {
    domains: ["ipfs.infura.io", "gateway.pinata.cloud"],
  },
}

module.exports = nextConfig
