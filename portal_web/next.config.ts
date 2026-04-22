import type { NextConfig } from "next";

const publicS3Url = new URL(
  process.env.NEXT_PUBLIC_S3_ENDPOINT || 
  process.env.S3_PUBLIC_ENDPOINT || 
  "http://localhost:9000"
);
const internalS3Url = new URL(process.env.S3_ENDPOINT || "http://minio:9000");
const bucketName = process.env.S3_BUCKET_NAME || "portal-documents";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: false,
  },

  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  
  images: {
    remotePatterns: [
      // Разрешаем внешний URL (тот, что видит браузер пользователя)
      {
        protocol: publicS3Url.protocol.replace(":", "") as "http" | "https",
        hostname: publicS3Url.hostname,
        port: publicS3Url.port,
        pathname: `/${bucketName}/**`,
      },
      // Разрешаем внутренний URL (для серверных запросов внутри Docker-сети)
      {
        protocol: internalS3Url.protocol.replace(":", "") as "http" | "https",
        hostname: internalS3Url.hostname,
        port: internalS3Url.port,
        pathname: `/${bucketName}/**`,
      },
    ],
  },
};

export default nextConfig;