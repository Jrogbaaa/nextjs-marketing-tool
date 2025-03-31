/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/NEW-MARKETING-TOOL' : '',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,

  // Only include the src folder in the build, not linkedin-lead-analysis
  experimental: {
    outputFileTracingRoot: './src',
  },
};

module.exports = nextConfig; 