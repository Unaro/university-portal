// auth.config.ts
import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl, headers } }) {
      const isLoggedIn = !!auth?.user;
      const isAuthPage = nextUrl.pathname === "/login" || nextUrl.pathname === "/register";
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      const isOnProfile = nextUrl.pathname.startsWith("/profile");
      const isOnOrganizations = nextUrl.pathname.startsWith("/organizations/");
      const isOnPractices = nextUrl.pathname.startsWith("/practices");

      // Если пользователь пытается попасть на страницу авторизации, но уже залогинен, редиректим его
      if (isAuthPage) {
        if (isLoggedIn) {
          const referer = headers.get('referer');
          // Если referer существует и принадлежит нашему домену (защита от редиректа на чужие сайты)
          if (referer && referer.startsWith(nextUrl.origin)) {
            return Response.redirect(referer);
          }
          
          // Фолбэк: если referer пустой (пользователь ввел адрес /login вручную), кидаем на главную
          return Response.redirect(new URL("/", nextUrl));
          }
        return true;
      }

      // Открытые страницы
      if (nextUrl.pathname === "/" || nextUrl.pathname === "/login" || nextUrl.pathname === "/register" || isOnPractices) {
        return true;
      }

      // Защищённые роуты требуют авторизации
      if (isOnDashboard || isOnProfile || isOnOrganizations) {
        if (isLoggedIn) return true;
        return false;
      }

      // Остальные роуты по умолчанию доступны
      return true;
    },
    async jwt({ token, user }) {
      if (user && user.id) {
        token.id = user.id; 
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
  providers: [],
} satisfies NextAuthConfig;