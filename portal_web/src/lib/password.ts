// src/lib/password.ts
import bcrypt from "bcryptjs";

export async function saltAndHashPassword(password: string) {
  return await bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return await bcrypt.compare(password, hash);
}