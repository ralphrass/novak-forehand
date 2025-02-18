/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_AZURE_OPENAI_KEY: process.env.NEXT_PUBLIC_AZURE_OPENAI_KEY,
    NEXT_PUBLIC_AZURE_OPENAI_ENDPOINT: process.env.NEXT_PUBLIC_AZURE_OPENAI_ENDPOINT,
  },
  images: {
    domains: ['novakstorage.blob.core.windows.net', 'lh3.googleusercontent.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.windows.net',
        port: '',
        pathname: '/files/**',
      },
    ],
  },
}

export default nextConfig