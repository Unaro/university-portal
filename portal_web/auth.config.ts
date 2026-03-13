// auth.config.ts
import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      const isOnProfile = nextUrl.pathname.startsWith("/profile");
      const isOnOrganizations = nextUrl.pathname.startsWith("/organizations");
      const isOnPractices = nextUrl.pathname.startsWith("/practices");

      // Публичные страницы доступны всем
      if (nextUrl.pathname === "/" || nextUrl.pathname === "/login" || nextUrl.pathname === "/register") {
        return true;
      }

      // Защищённые роуты требуют авторизации
      if (isOnDashboard || isOnProfile || isOnOrganizations || isOnPractices) {
        if (isLoggedIn) return true;
        return false; // Редирект на /login (указан в pages.signIn)
      }

      // Остальные роуты по умолчанию доступны
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        // Исправляем ошибку: явно говорим TS, что id это строка
        token.id = user.id as string; 
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  providers: [], // Провайдеры добавим в основном файле
} satisfies NextAuthConfig;