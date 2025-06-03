/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/auth/google',
        destination: 'http://localhost:4000/auth/google',
      },
      {
        source: '/auth/google/callback',
        destination: 'http://localhost:4000/auth/google/callback',
      },
    ];
  },
};

module.exports = nextConfig;