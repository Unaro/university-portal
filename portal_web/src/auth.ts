// src/auth.ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "../auth.config";
import { z } from "zod";
import { db } from "./db";
import { users } from "./db/schema";
import { eq } from "drizzle-orm";
import { verifyPassword } from "./lib/password";

async function getUser(email: string) {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });
    return user;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Database error");
  }
}

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          
          if (!user || !user.password) return null;

          const passwordsMatch = await verifyPassword(password, user.password);
          if (passwordsMatch) {
             return { 
               id: user.id.toString(),
               name: user.name,
               email: user.email,
               image: user.image,
               role: user.role 
             };
          }
        }
        return null;
      },
    }),
  ],
});