import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
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
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
    };    
    return config;
  },
};

export default nextConfig;
