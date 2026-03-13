import type { NextConfig } from "next";

// 1. Динамически парсим наши URL из переменных окружения.
// Если переменных вдруг нет (например, при локальном запуске без .env), ставим безопасные дефолты.
const publicS3Url = new URL(process.env.NEXT_PUBLIC_S3_ENDPOINT || "http://localhost:9000");
const internalS3Url = new URL(process.env.S3_ENDPOINT || "http://minio:9000");
const bucketName = process.env.S3_BUCKET_NAME || "portal-documents";

const nextConfig: NextConfig = {
  output: "standalone",

  // Включаем строгую проверку типов при билде
  // Если есть TS ошибки — билд упадёт (это правильно)
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
        // new URL() возвращает protocol с двоеточием (например, "http:"), а Next.js ждет "http"
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
      // localhost можно оставить как фолбэк для удобства локальной разработки
      {
        protocol: "http",
        hostname: "localhost",
        port: publicS3Url.port,
        pathname: `/${bucketName}/**`,
      }
    ],
  },
};

export default nextConfig;