// src/widgets/header/ui/header.tsx
import { auth } from "@/auth";
import { HeaderClient } from "./header-client";
import { ThemeToggle } from "@/shared/ui/theme-toggle";

export async function Header() {
  const session = await auth();

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