// src/widgets/footer/ui/footer.tsx
import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground pt-10 pb-6 border-t border-border mt-auto">
      <div className="container mx-auto px-4">

        {/* СЕТКА ССЫЛОК */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-8 text-sm items-start">

          {/* 1. Навигация */}
          <div className="space-y-4">
            <h4 className="font-bold text-primary-foreground/70 uppercase text-xs tracking-wider">Навигация</h4>
            <ul className="space-y-2">
              <li><FooterLink href="/">Главная</FooterLink></li>
              <li><FooterLink href="/practices">База практик</FooterLink></li>
              <li><FooterLink href="/organizations">Организации</FooterLink></li>
              <li><FooterLink href="/documents">Документы</FooterLink></li>
            </ul>
          </div>

          {/* 2. Студентам */}
          <div className="space-y-4">
            <h4 className="font-bold text-primary-foreground/70 uppercase text-xs tracking-wider">Студентам</h4>
            <ul className="space-y-2">
              <li><FooterLink href="/profile">Личный кабинет</FooterLink></li>
              <li><FooterLink href="/practices">Поиск места</FooterLink></li>
            </ul>
          </div>

          {/* 3. Партнерам */}
          <div className="space-y-4">
            <h4 className="font-bold text-primary-foreground/70 uppercase text-xs tracking-wider">Партнерам</h4>
            <ul className="space-y-2">
              <li><FooterLink href="/register">Стать партнером</FooterLink></li>
              <li><FooterLink href="/login">Разместить вакансию</FooterLink></li>
              <li><FooterLink href="/organizations">Каталог компаний</FooterLink></li>
            </ul>
          </div>

          {/* 4. Сотрудникам */}
          <div className="space-y-4">
            <h4 className="font-bold text-primary-foreground/70 uppercase text-xs tracking-wider">Сотрудникам</h4>
            <ul className="space-y-2">
              <li><FooterLink href="/login">Вход для сотрудников</FooterLink></li>
              <li><FooterLink href="/dashboard/admin">Панель управления</FooterLink></li>
            </ul>
          </div>

          {/* 5. Контакты */}
          <div className="space-y-4 col-span-2 md:col-span-1 lg:col-span-1">
             <h4 className="font-bold text-primary-foreground/70 uppercase text-xs tracking-wider">Контакты</h4>
            <ul className="space-y-3 text-primary-foreground/60">
              <li className="flex items-start gap-2">
                <span>📍</span>
                <span>г. Омск, пр. Мира, 5</span>
              </li>
              <li className="flex items-center gap-2">
                <span>📞</span>
                <span>+7 (3812) 65-03-22</span>
              </li>
              <li className="flex items-center gap-2">
                <span>✉️</span>
                <a href="mailto:info@sibadi.org" className="hover:text-primary-foreground underline decoration-muted-foreground/50">info@sibadi.org</a>
              </li>
            </ul>
          </div>

        </div>

        {/* Разделитель */}
        <div className="border-t border-border/50 my-6"></div>

        {/* Копирайт */}
        <div className="text-center text-xs text-primary-foreground/40">
          <p>© {currentYear} ФГБОУ ВО «СибАДИ»</p>
        </div>
      </div>
    </footer>
  );
}

const FooterLink = ({ href, children }: { href: string, children: React.ReactNode }) => (
  <Link href={href} className="text-primary-foreground/50 hover:text-primary-foreground transition-colors hover:translate-x-1 inline-block duration-200">
    {children}
  </Link>
);