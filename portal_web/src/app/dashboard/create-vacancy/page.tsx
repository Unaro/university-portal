// src/app/dashboard/create-vacancy/page.tsx
import { auth } from "@/auth";
import { db } from "@/db";
import { majors, skills } from "@/db/schema";
import { redirect } from "next/navigation";
import { VacancyCreateView } from "@/views/vacancy-create/ui/vacancy-create-view";
import { Option } from "@/components/ui/multi-select";

export default async function CreateVacancyPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  // 1. Получаем типизированные данные из БД
  const allMajors = await db.select().from(majors);
  const allSkills = await db.select().from(skills);

  // 2. Трансформируем навыки в UI-формат (Option)
  const formattedSkills: Option[] = allSkills.map(s => ({ 
    label: s.name, 
    value: s.id.toString() 
  }));

  return (
    <VacancyCreateView 
      majors={allMajors}
      skills={formattedSkills}
    />
  );
}