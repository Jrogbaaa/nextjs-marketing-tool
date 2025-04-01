/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/nextjs-marketing-tool' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/nextjs-marketing-tool/' : '',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

module.exports = nextConfig; 