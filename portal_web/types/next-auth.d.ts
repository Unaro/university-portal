// types/next-auth.d.ts
import { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "student" | "university_staff" | "organization_representative" | "admin";
    } & DefaultSession["user"];
  }

  interface User {
    role: "student" | "university_staff" | "organization_representative" | "admin";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "student" | "university_staff" | "organization_representative" | "admin";
  }
}