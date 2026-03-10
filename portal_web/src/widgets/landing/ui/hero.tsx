// src/widgets/landing/ui/hero.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface HeroStats {
  students: number;
  vacancies: number;
  organizations: number;
}

export function Hero({ stats }: { stats: HeroStats }) {
  return (
    <section className="relative bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white overflow-hidden">
      {/* Декор */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2 animate-blob" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-x-1/2 translate-y-1/2 animate-blob animation-delay-2000" />

      <div className="container mx-auto px-4 py-24 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <Badge variant="secondary" className="mb-6 px-4 py-1 text-sm bg-blue-500/20 text-blue-100 hover:bg-blue-500/30 border-none">
            🚀 Официальный портал трудоустройства ВУЗа
          </Badge>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
            Построй карьеру <br/> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-200">
              своей мечты
            </span>
          </h1>
          <p className="text-xl text-blue-100 mb-10 leading-relaxed">
            Единая платформа для студентов и работодателей. 
            Умный подбор стажировок, практика в топовых компаниях и быстрый старт в профессии.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/practices">
              <Button size="lg" className="w-full sm:w-auto bg-white text-blue-900 hover:bg-blue-50 text-lg h-14 px-8 shadow-lg shadow-blue-900/20">
                Найти вакансию
              </Button>
            </Link>
          </div>

          {/* STATS */}
          <div className="mt-16 grid grid-cols-3 gap-8 border-t border-white/10 pt-8">
            <div>
              <div className="text-3xl font-bold">{stats.students}+</div>
              <div className="text-blue-200 text-sm">Студентов</div>
            </div>
            <div>
              <div className="text-3xl font-bold">{stats.vacancies}+</div>
              <div className="text-blue-200 text-sm">Вакансий</div>
            </div>
            <div>
              <div className="text-3xl font-bold">{stats.organizations}+</div>
              <div className="text-blue-200 text-sm">Компаний</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}