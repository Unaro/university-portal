// src/widgets/landing/ui/hero.tsx
import Link from "next/link";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";

interface HeroStats {
  students: number;
  vacancies: number;
  organizations: number;
}

export function Hero({ stats }: { stats: HeroStats }) {
  return (
    <section className="relative bg-gradient-to-br from-primary via-primary/90 to-accent text-primary-foreground overflow-hidden">
      {/* Декор */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/50 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2 animate-blob" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/50 rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-x-1/2 translate-y-1/2 animate-blob animation-delay-2000" />

      <div className="container mx-auto px-4 py-24 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <Badge variant="secondary" className="mb-6 px-4 py-1 text-sm bg-accent/20 text-accent-foreground hover:bg-accent/30 border-none">
            🚀 Официальный портал трудоустройства ВУЗа
          </Badge>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
            Построй карьеру <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-foreground/80 to-cyan-200">
              своей мечты
            </span>
          </h1>
          <p className="text-xl text-primary-foreground/70 mb-10 leading-relaxed">
            Единая платформа для студентов и работодателей.
            Умный подбор стажировок, практика в топовых компаниях и быстрый старт в профессии.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/practices">
              <Button size="lg" className="w-full sm:w-auto bg-primary-foreground text-primary hover:bg-accent text-lg h-14 px-8 shadow-lg">
                Найти вакансию
              </Button>
            </Link>
          </div>

          {/* STATS */}
          <div className="mt-16 grid grid-cols-3 gap-8 border-t border-primary-foreground/10 pt-8">
            <div>
              <div className="text-3xl font-bold">{stats.students}+</div>
              <div className="text-primary-foreground/70 text-sm">Студентов</div>
            </div>
            <div>
              <div className="text-3xl font-bold">{stats.vacancies}+</div>
              <div className="text-primary-foreground/70 text-sm">Вакансий</div>
            </div>
            <div>
              <div className="text-3xl font-bold">{stats.organizations}+</div>
              <div className="text-primary-foreground/70 text-sm">Компаний</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}