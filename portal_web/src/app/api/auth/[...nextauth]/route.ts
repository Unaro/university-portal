// src/app/api/auth/[...nextauth]/route.ts
import { handlers } from "@/auth";


export const runtime = "nodejs"; // Привязываем к Node.js
export const dynamic = "force-dynamic"; // Запрещаем статическую генерацию

export const { GET, POST } = handlers;