/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  reactStrictMode: false,
  async redirects() {
    return [
      {
        source: '/category/:slug',
        destination: '/:slug',
        permanent: true, // Redirection 301 pour transférer la puissance SEO
      },
      {
        source: '/product/:slug',
        destination: '/:slug',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;