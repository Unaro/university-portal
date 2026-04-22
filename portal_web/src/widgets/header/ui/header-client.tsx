"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { Button } from "@/shared/ui/button";
import {
  LogIn, UserPlus, LayoutDashboard, User, Menu, X,
  Home, Briefcase, Building2, FileText, LogOut,
  Settings,
} from "lucide-react";
import { LogoutDropdownItem } from "@/features/auth/ui/logout-dropdown-item";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import type { users } from "@/db/schema";
import { ThemeToggle } from "@/shared/ui/theme-toggle";

// --- Types ---
export interface HeaderClientProps {
  isLoggedIn: boolean;
  userRole?: typeof users.$inferSelect["role"];
  userName?: string | null;
  userImage?: string | null;
  userEmail?: string | null;
}

type UserRole = typeof users.$inferSelect["role"];

interface UserDropdownProps {
  userName?: string | null;
  userImage?: string | null;
  userEmail?: string | null;
  userRole?: UserRole;
  getInitials: (name?: string | null) => string;
}

interface MobileUserActionsProps {
  userRole?: UserRole;
  onClose: () => void;
}

interface HeaderLinkProps {
  href: string;
  children: React.ReactNode;
  icon: React.ElementType;
  isActive: boolean;
  onClick?: () => void;
}

interface NavLink {
  href: string;
  label: string;
  icon: React.ElementType;
}

// --- Config ---
const NAV_LINKS: NavLink[] = [
  { href: "/", label: "Главная", icon: Home },
  { href: "/practices", label: "Практики", icon: Briefcase },
  { href: "/organizations", label: "Организации", icon: Building2 },
  { href: "/documents", label: "Документы", icon: FileText },
];

const TEXT_ROLE_CONFIG: Record<UserRole, string> = {
  student: "Студент",
  organization_representative: "Партнер",
  university_staff: "Сотрудник ВУЗа",
  admin: "Администратор",
};

// --- Main Component ---
export function HeaderClient({
  isLoggedIn,
  userRole,
  userName,
  userImage,
  userEmail
}: HeaderClientProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = useCallback(() => setMobileMenuOpen(true), []);
  const getInitials = (name?: string | null) =>
    name ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : "??";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 print:relative print:border-none print:bg-transparent print:backdrop-blur-none print:z-auto">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between gap-4 print:h-auto print:py-4">
        
        {/* 1. Логотип */}
        <Link href="/" className="flex items-center gap-3 group shrink-0" onClick={closeMobileMenu}>
          <div className="bg-primary text-primary-foreground p-2 rounded-full transition-transform group-hover:scale-105 shadow-sm print:bg-black print:text-white print:p-3">
            <span className="h-5 w-5 flex items-center justify-center font-bold text-sm print:text-lg">С</span>
          </div>
          <div className="flex-col leading-none hidden sm:flex print:flex">
            <span className="font-bold text-xl tracking-wide text-foreground print:text-2xl">СИБАДИ</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest print:text-xs print:text-black">Портал трудоустройства</span>
          </div>
        </Link>

        {/* 2. Десктопная навигация */}
        <nav className="hidden lg:flex items-center gap-1 print:hidden">
          {NAV_LINKS.map((link) => (
            <HeaderLink
              key={link.href}
              href={link.href}
              icon={link.icon}
              isActive={pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href))}
            >
              {link.label}
            </HeaderLink>
          ))}
        </nav>

        {/* 3. Правая часть: Тема + Мобильное меню / Авторизация */}
        <div className="flex items-center gap-2 print:hidden">
          <ThemeToggle />

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? "Закрыть меню" : "Открыть меню"}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          <div className="hidden lg:flex items-center gap-2">
            {isLoggedIn ? (
              <UserDropdown
                userName={userName}
                userImage={userImage}
                userEmail={userEmail}
                userRole={userRole}
                getInitials={getInitials}
              />
            ) : (
              <AuthButtons />
            )}
          </div>
        </div>
      </div>

      {/* 4. Мобильное меню */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t bg-background px-4 py-3 shadow-lg animate-in slide-in-from-top-5 print:hidden">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMobileMenu}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                    isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}

            <div className="border-t my-2 pt-2 flex flex-col gap-1">
              {isLoggedIn ? (
                <>
                  <div className="flex items-center gap-3 px-3 py-2">
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xs">
                      {getInitials(userName)}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-foreground">{userName}</span>
                      <span className="text-xs text-muted-foreground">
                        {userRole ? TEXT_ROLE_CONFIG[userRole] : "Неизвестная роль"}
                      </span>
                    </div>
                  </div>
                  <MobileUserActions userRole={userRole} onClose={closeMobileMenu} />
                  <MobileLogoutButton onClose={closeMobileMenu} />
                </>
              ) : (
                <AuthButtons isMobile />
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

// --- Sub-components ---
function HeaderLink({ href, children, icon: Icon, isActive, onClick }: HeaderLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        isActive ? "bg-primary/10 text-primary shadow-sm" : "text-muted-foreground hover:bg-accent hover:text-foreground"
      }`}
    >
      <Icon className="h-4 w-4" />
      {children}
    </Link>
  );
}

function UserDropdown({ userName, userImage, userEmail, userRole, getInitials }: UserDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full" aria-label="Открыть меню пользователя">
          <Avatar>
            <AvatarImage src={userImage ?? ""} />
            <AvatarFallback>{getInitials(userName)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none truncate">{userName}</p>
            <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
            <p className="text-xs font-semibold text-primary mt-1">
              {userRole ? TEXT_ROLE_CONFIG[userRole] : "Неизвестная роль"}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={userRole === "student" ? "/profile" : "/dashboard"} className="flex w-full cursor-pointer">
            {userRole === "student" ? <User className="mr-2 h-4 w-4" /> : <LayoutDashboard className="mr-2 h-4 w-4" />}
            {userRole === "student" ? "Личный кабинет" : "Панель управления"}
          </Link>
        </DropdownMenuItem>
        
        {userRole === "organization_representative" && <DropdownMenuItem asChild>
          <Link href={"/dashboard/organization"} className="flex w-full cursor-pointer">
            <Settings className="mr-2 h-4 w-4" /> Настройки
          </Link>
        </DropdownMenuItem>}
        <DropdownMenuSeparator />
        <LogoutDropdownItem />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function AuthButtons({ isMobile = false }: { isMobile?: boolean }) {
  const baseClass = "flex items-center gap-2 px-3 py-2.5 rounded-md text-sm font-medium transition-colors w-full text-left";
  return (
    <>
      <Link href="/login" className={`${baseClass} ${isMobile ? "text-muted-foreground hover:bg-accent" : "text-foreground hover:text-primary"}`}>
        <LogIn className="h-4 w-4" />
        Войти
      </Link>
      <Link href="/register" className={`${baseClass} ${isMobile ? "text-muted-foreground hover:bg-accent" : "bg-primary text-primary-foreground hover:bg-primary/90"}`}>
        <UserPlus className="h-4 w-4" />
        Регистрация
      </Link>
    </>
  );
}

function MobileUserActions({ userRole, onClose }: MobileUserActionsProps) {
  const dashboardHref = userRole === "student" ? "/profile" : "/dashboard";
  const label = userRole === "student" ? "Личный кабинет" : "Панель управления";
  const Icon = userRole === "student" ? User : LayoutDashboard;

  return (
    <>
    <Link
      href={dashboardHref}
      onClick={onClose}
      className="flex items-center gap-2 px-3 py-2.5 rounded-md text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
    {userRole === "organization_representative" && 
      <Link href={"/dashboard/organization"} className="flex w-full cursor-pointer">
        <Settings className="mr-2 h-4 w-4" /> Настройки
      </Link>}
    </>
    
  );
}

function MobileLogoutButton({ onClose }: { onClose: () => void }) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut({ redirectTo: '/' });
      
      onClose();
      
      router.refresh();
      
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
      onClose();
      router.push("/");
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 px-3 py-2.5 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full text-left"
    >
      <LogOut className="h-4 w-4" />
      Выйти
    </button>
  );
}