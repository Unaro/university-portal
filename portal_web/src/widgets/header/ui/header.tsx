// src/widgets/header/ui/header.tsx
import { auth } from "@/auth";
import { HeaderClient } from "./header-client";

export async function Header() {
  const session = await auth(); // Получает свежую сессию при router.refresh()
  
  return (
    <HeaderClient 
      isLoggedIn={!!session?.user} 
      userRole={session?.user?.role}
      userName={session?.user?.name}
      userImage={session?.user?.image}
      userEmail={session?.user?.email}
    />
  );
}