/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  outputFileTracingRoot: __dirname,
  typescript: {
    tsconfigPath: './tsconfig.json',
  },
};

module.exports = nextConfig;
