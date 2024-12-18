/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone', // Importante para deploy na Azure
    env: {
      NEXT_PUBLIC_AZURE_OPENAI_KEY: process.env.NEXT_PUBLIC_AZURE_OPENAI_KEY,
      NEXT_PUBLIC_AZURE_OPENAI_ENDPOINT: process.env.NEXT_PUBLIC_AZURE_OPENAI_ENDPOINT,
    },
    // Otimizações para produção
    poweredByHeader: false,
    reactStrictMode: true,
    swcMinify: true,
    // Configurações de compressão e cache
    compress: true,
    // Configuração de imagens
    images: {
      domains: ['novakstorage.blob.core.windows.net'], // Ajuste para seu storage
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