// src/views/practices/ui/practices-view.tsx
import { Suspense } from "react";
import { VacancyList } from "@/widgets/vacancy-list/ui/vacancy-list";
import { VacancyFilter } from "@/features/vacancy-filter/ui/vacancy-filter";

interface PracticesViewProps {
  searchParams: {
    search?: string;
    type?: string;
    payment?: string;
    course?: string;
    page?: string;
  };
}

export function PracticesView({ searchParams }: PracticesViewProps) {
  return (
    <div className="min-h-screen bg-background pb-10">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">База практик</h1>
          <p className="text-muted-foreground">Найдите место для старта карьеры</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* ЛЕВАЯ КОЛОНКА: ФИЛЬТРЫ */}
          <div className="lg:col-span-1">
             {/* Оборачиваем клиентский компонент с useSearchParams */}
             <Suspense fallback={<div className="p-4 bg-card rounded shadow animate-pulse h-64"></div>}>
                <VacancyFilter />
             </Suspense>
          </div>

          {/* ПРАВАЯ КОЛОНКА: СПИСОК */}
          <div className="lg:col-span-3">
             <VacancyList searchParams={searchParams} />
          </div>

        </div>
      </div>
    </div>
  );
}