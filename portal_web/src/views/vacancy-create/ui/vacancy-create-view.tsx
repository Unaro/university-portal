// src/views/vacancy-create/ui/vacancy-create-view.tsx
import { CreateVacancyForm } from "@/features/create-vacancy/ui/create-vacancy-form";
import Link from "next/link";
import { Button } from "@/shared/ui/button";
import { ArrowLeft } from "lucide-react";
import { Major } from "@/shared/types/db";
import { Option } from "@/shared/ui/multi-select";

interface VacancyCreateViewProps {
  majors: Major[];
  skills: Option[];
}

export function VacancyCreateView({ majors, skills }: VacancyCreateViewProps) {
  return (
    <div className="max-w-3xl mx-auto py-10">
      <Link href="/dashboard">
        <Button variant="ghost" className="mb-6 pl-0 hover:bg-transparent hover:text-primary gap-2">
          <ArrowLeft className="h-4 w-4" /> Назад в дашборд
        </Button>
      </Link>

      <h1 className="text-3xl font-bold mb-2 text-foreground">Создание вакансии</h1>
      <p className="text-muted-foreground mb-8">
        Заполните параметры для автоматического подбора студентов.
      </p>
      
      <CreateVacancyForm 
        allMajors={majors}
        allSkills={skills}
      />
    </div>
  );
}