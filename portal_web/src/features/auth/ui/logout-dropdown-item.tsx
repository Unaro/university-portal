// src/features/auth/ui/logout-dropdown-item.tsx
"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export function LogoutDropdownItem() {
  const handleLogout = () => {
    // Просто говорим: "После выхода перекинь на главную страницу этого же сайта"
    signOut({ redirectTo: '/'}); 
  };

  return (
    <DropdownMenuItem 
      className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50"
      onClick={handleLogout}
    >
      <LogOut className="mr-2 h-4 w-4" />
      Выйти
    </DropdownMenuItem>
  );
}