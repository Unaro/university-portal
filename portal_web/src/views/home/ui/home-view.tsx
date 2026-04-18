// src/views/home/ui/home-view.tsx
import Link from "next/link";
import { Button } from "@/shared/ui/button";
import { ArrowRight } from "lucide-react";
import { Hero } from "@/widgets/landing/ui/hero";
import { Features } from "@/widgets/landing/ui/features";
import { VacancyCard, VacancyCardProps } from "@/entities/vacancy/ui/vacancy-card";

interface HomeViewProps {
  stats: { students: number; vacancies: number; organizations: number };
  latestVacancies: VacancyCardProps[];
}

export function HomeView({ stats, latestVacancies }: HomeViewProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">

      <Hero stats={stats} />
      <Features />

      {/* Свежие вакансии */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground">Свежие предложения</h2>
              <p className="text-muted-foreground mt-2">Успейте откликнуться первыми</p>
            </div>
            <Link href="/practices" className="hidden sm:block">
              <Button variant="outline">Все вакансии <ArrowRight size={16} className="ml-2"/></Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestVacancies.map((vac) => (
              <VacancyCard key={vac.id} data={vac} />
            ))}
          </div>
          
          <div className="mt-8 text-center sm:hidden">
             <Link href="/practices">
              <Button variant="outline" className="w-full">Посмотреть все вакансии</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}