// src/features/auth/ui/logout-button.tsx
"use client";

import { signOut } from "next-auth/react"; // Используем клиентский метод для простоты
import { Button } from "@/shared/ui/button";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  return (
    <Button 
      variant="destructive" 
      className="w-full gap-2" 
      onClick={() => signOut({ callbackUrl: "/login" })}
    >
      <LogOut className="h-4 w-4" /> Выйти
    </Button>
  );
}