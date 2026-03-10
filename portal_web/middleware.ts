// middleware.ts
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

export default NextAuth(authConfig).auth;

export const config = {
  // Исключаем статические файлы и api из middleware, чтобы не тормозить их
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};