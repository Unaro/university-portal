import { CreateVacancyForm } from "@/features/create-vacancy/ui/create-vacancy-form";
import { BackButton } from "@/shared/ui/back-button";
import { Major } from "@/shared/types/db";
import { Option } from "@/shared/ui/multi-select";

interface VacancyCreateViewProps {
  majors: Major[];
  skills: Option[];
}

export function VacancyCreateView({ majors, skills }: VacancyCreateViewProps) {
  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <BackButton 
        label="Назад в дашборд" 
        variant="ghost" 
        className="mb-6 pl-0 hover:bg-transparent hover:text-primary" 
      />

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