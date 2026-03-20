// src/lib/s3.ts
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const BUCKET_NAME = process.env.S3_BUCKET_NAME!;
const REGION = process.env.S3_REGION || "us-east-1";

// Адреса из переменных окружения
const INTERNAL_ENDPOINT = process.env.S3_ENDPOINT || "http://minio:9000";
// Если PUBLIC переменная не задана, падаем обратно на localhost (для локальной разработки без сети)
const PUBLIC_ENDPOINT = process.env.S3_PUBLIC_ENDPOINT || "http://localhost:9000";

// 1. ВНУТРЕННИЙ КЛИЕНТ (Сервер -> MinIO)
// Оптимизирован для работы внутри Docker
const internalClient = new S3Client({
  region: REGION,
  endpoint: INTERNAL_ENDPOINT,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
  forcePathStyle: true,
  requestChecksumCalculation: "WHEN_REQUIRED",
  responseChecksumValidation: "WHEN_REQUIRED",
});

// 2. ВНЕШНИЙ КЛИЕНТ (Для генерации ссылок браузеру)
const publicClient = new S3Client({
  region: REGION,
  endpoint: PUBLIC_ENDPOINT,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
  forcePathStyle: true,
});

// --- ФУНКЦИИ ---

export async function uploadFile(file: File, folder: string = "uploads") {
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = `${folder}/${Date.now()}-${file.name}`;

    console.log(`[S3] Uploading ${fileName} to ${process.env.S3_ENDPOINT}...`);

    // Используем внутренний клиент
    await internalClient.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: fileName,
        Body: buffer,
        ContentType: file.type,
      })
    );

    console.log(`[S3] Upload success: ${fileName}`);
    return fileName;
  } catch (error) {
    console.error("[S3] Upload failed:", error);
    throw new Error("Failed to upload file to storage");
  }
}

export async function deleteFile(key: string) {
  try {
    await internalClient.send(
      new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
      })
    );
  } catch (error) {
    console.error("[S3] Delete failed:", error);
    // Не выбрасываем ошибку, чтобы не ломать интерфейс, если файл уже удален
  }
}

export async function getFileUrl(key: string) {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });
    
    // Ссылка сгенерируется с использованием PUBLIC_ENDPOINT (т.е. твоего IP)
    return await getSignedUrl(publicClient, command, { expiresIn: 3600 });
  } catch (error) {
    console.error("[S3] Get URL failed:", error);
    return null;
  }
}