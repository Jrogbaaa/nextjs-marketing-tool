/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/NEW-MARKETING-TOOL' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/NEW-MARKETING-TOOL/' : '',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

module.exports = nextConfig; 