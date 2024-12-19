/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    experimental: {
      appDir: true
    },
    env: {
      NEXT_PUBLIC_AZURE_OPENAI_KEY: process.env.NEXT_PUBLIC_AZURE_OPENAI_KEY,
      NEXT_PUBLIC_AZURE_OPENAI_ENDPOINT: process.env.NEXT_PUBLIC_AZURE_OPENAI_ENDPOINT,
    },
    reactStrictMode: true,
    compress: true,
    images: {
      domains: ['novakstorage.blob.core.windows.net'],
      remotePatterns: [
        {
          protocol: 'https',
          hostname: '**.windows.net',
          port: '',
          pathname: '/files/**',
        },
      ],
    },
  };
  
  export default nextConfig;