// src/entities/vacancy/ui/vacancy-card.tsx
import Link from "next/link";
import { Building2, Clock, MapPin } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { vacancies, organizations, skills } from "@/db/schema"; 

// Уточняем тип: теперь мы ждем массив requiredSkills с вложенным skill
export type VacancyCardProps = typeof vacancies.$inferSelect & {
  organization: typeof organizations.$inferSelect;
  requiredSkills?: { skill: typeof skills.$inferSelect }[]; 
  applications?: { id: number }[]; // <--- НОВОЕ
  matchScore?: number;
};

export function VacancyCard({ data }: { data: VacancyCardProps }) {
  const approvedCount = data.applications?.length || 0;
  const totalSpots = data.availableSpots;

  return (
    <Card className="hover:shadow-md transition-shadow border-muted group h-full">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="space-y-3 flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-primary group-hover:text-primary/80 transition-colors">
                  <Link href={`/practices/${data.id}`}>{data.title}</Link>
                </h3>
                <div className="flex items-center gap-2 text-muted-foreground text-sm mt-1">
                  <Building2 className="h-4 w-4" />
                  <span className="font-medium text-foreground">
                    {data.organization.name}
                  </span>
                  {data.salary && (
                    <span className="text-green-600 dark:text-green-400 font-semibold bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded text-xs border border-green-100 dark:border-green-800 ml-2">
                      {data.salary}
                    </span>
                  )}
                  {totalSpots && (
                    <span className="text-blue-600 dark:text-blue-400 font-semibold bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded text-xs border border-blue-100 dark:border-blue-800 ml-2">
                      Мест: {totalSpots - approvedCount} / {totalSpots}
                    </span>
                  )}
                </div>
              </div>

              <span className="text-xs text-muted-foreground whitespace-nowrap hidden md:block bg-muted px-2 py-1 rounded-full">
                {data.createdAt ? new Date(data.createdAt).toLocaleDateString("ru-RU") : "Недавно"}
              </span>
            </div>

            {/* --- БЛОК ТЕГОВ (Обновлен) --- */}
            <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="secondary" className="font-normal text-xs bg-muted">
                    {data.type === 'practice' ? "Практика" : data.type === 'internship' ? "Стажировка" : "Работа"}
                </Badge>
                <Badge variant="outline" className="font-normal text-xs">
                    Мин. курс: {data.minCourse}
                </Badge>

                {/* 👇 ВЫВОД НАВЫКОВ */}
                {data.requiredSkills && data.requiredSkills.map(({ skill }) => (
                  <Badge key={skill.id} variant="outline" className="font-normal text-xs border-primary/30 text-primary bg-primary/10">
                    {skill.name}
                  </Badge>
                ))}
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {data.organization.contacts?.split(',')[0] || "Офис"} 
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" /> {data.type === 'job' ? 'Полный день' : 'Гибкий график'}
              </div>
            </div>
          </div>

          {/* <div className="flex items-center md:self-center shrink-0">
            <Link href={`/practices/${data.id}`} className="w-full md:w-auto">
              <Button className="w-full">Подробнее</Button>
            </Link>
          </div> */}
        </div>
      </CardContent>
    </Card>
  );
}