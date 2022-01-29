/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  redirects: async () => [
    {
      source: "/:path*",
      has: [{ type: "host", value: "www.giftnft.cards" }],
      destination: "https://giftnft.cards/:path*",
      permanent: true,
    },
  ],
};
