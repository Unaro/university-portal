// src/widgets/header/ui/header-client.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogIn, UserPlus, LayoutDashboard, User } from "lucide-react";
// Импортируем нашу новую фичу
import { LogoutDropdownItem } from "@/features/auth/ui/logout-dropdown-item"; 
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface HeaderClientProps {
  isLoggedIn: boolean;
  userRole?: string;
  userName?: string | null;
  userImage?: string | null;
  userEmail?: string | null;
}

export function HeaderClient({ isLoggedIn, userRole, userName, userImage, userEmail }: HeaderClientProps) {
  const getInitials = (name?: string | null) => 
    name ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : "??";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-[#1e3a8a] text-white shadow-md">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        
        <Link href="/" className="flex items-center gap-4 group">
           <div className="bg-white p-2 rounded-full transition-transform group-hover:scale-105 shrink-0 shadow-md">
              <div className="h-8 w-8 flex items-center justify-center font-bold text-[#1e3a8a]">С</div>
           </div>
           <div className="flex flex-col leading-none">
              <span className="font-bold text-2xl tracking-wide group-hover:text-blue-200 transition-colors">СИБАДИ</span>
              <span className="text-[11px] text-blue-200 uppercase tracking-[0.25em] mt-1">Портал трудоустройства</span>
           </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-3 bg-white/10 rounded-full px-3 py-2 backdrop-blur-sm mx-4">
          <HeaderLink href="/">Главная</HeaderLink>
          <HeaderLink href="/practices">Практики</HeaderLink>
          <HeaderLink href="/organizations">Организации</HeaderLink>
          <HeaderLink href="/documents">Документы</HeaderLink>
        </nav>

        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-12 w-12 rounded-full border-2 border-white/20 hover:bg-white/20 p-0 overflow-hidden">
                  <Avatar className="h-full w-full">
                    <AvatarImage src={userImage || ""} />
                    <AvatarFallback className="bg-[#1e3a8a] text-white font-bold">
                      {getInitials(userName)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{userName}</p>
                    <p className="text-xs leading-none text-muted-foreground">{userEmail}</p>
                    <p className="text-xs font-bold text-blue-600 mt-1 uppercase">
                      {userRole === 'organization_representative' ? 'Партнер' : 
                       userRole === 'university_staff' ? 'Администратор' : 'Студент'}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <DropdownMenuItem asChild>
                  <Link href={userRole === 'student' ? "/profile" : "/dashboard"} className="cursor-pointer">
                    {userRole === 'student' ? <User className="mr-2 h-4 w-4" /> : <LayoutDashboard className="mr-2 h-4 w-4" />}
                    {userRole === 'student' ? "Личный кабинет" : "Панель управления"}
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <LogoutDropdownItem />

              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/login">
                 <Button variant="ghost" className="text-white hover:bg-white/20 hover:text-white font-semibold text-base px-6 h-12">
                   <LogIn className="mr-2 h-5 w-5" /> Войти
                 </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-white text-[#1e3a8a] hover:bg-blue-50 font-bold text-base px-8 h-12 shadow-lg hover:shadow-xl transition-all rounded-full">
                  <UserPlus className="mr-2 h-5 w-5" /> Регистрация
                </Button>
              </Link>
            </>
          )}
        </div>

      </div>
    </header>
  );
}

const HeaderLink = ({ href, children }: { href: string, children: React.ReactNode }) => {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));

  return (
    <Link
      href={href}
      className={`
        px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 whitespace-nowrap
        ${isActive 
          ? "bg-white text-[#1e3a8a] shadow-md transform scale-105" 
          : "text-blue-100 hover:bg-white/15 hover:text-white"
        }
      `}
    >
      {children}
    </Link>
  );
};