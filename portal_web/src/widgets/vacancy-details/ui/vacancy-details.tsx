// src/widgets/vacancy-details/ui/vacancy-details.tsx
import Link from "next/link";
import { 
  ArrowLeft, 
  Building2, 
  MapPin, 
  Clock, 
  Calendar, 
  FileText, 
  CheckCircle2,
  Share2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ApplyButton } from "@/features/apply-vacancy/ui/apply-button";
import { getFileUrl } from "@/lib/s3";

// Типы пропсов (данные, которые придут из Page)
interface VacancyDetailsProps {
  data: {
    id: number;
    title: string;
    description: string;
    requirements?: string | null;
    salary?: string | null;
    type: string;
    createdAt: Date | null;
    organization: {
      name: string;
      logo?: string | null;
      logoUrl?: string | null; // Подписанная ссылка
      contacts?: string | null;
      website?: string | null;
    };
    skills: { name: string }[];
  };
  isApplied: boolean;
  canApply: boolean; // Проверка профиля студента
}

export function VacancyDetails({ data, isApplied, canApply }: VacancyDetailsProps) {
  // Разбираем требования на список (если они разделены новой строкой)
  const requirementsList = data.requirements 
    ? data.requirements.split('\n').filter(Boolean) 
    : [];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Кнопка Назад */}
      <Link href="/practices">
        <Button variant="ghost" className="mb-6 pl-0 hover:bg-transparent hover:text-primary gap-2">
          <ArrowLeft className="h-4 w-4" /> Назад к поиску
        </Button>
      </Link>

      <Card className="mb-8 overflow-hidden border-none shadow-lg">
        {/* ШАПКА ВАКАНСИИ */}
        <div className="bg-slate-50 p-6 md:p-8 border-b">
          <div className="flex flex-col md:flex-row justify-between gap-6 items-start">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground mb-3">{data.title}</h1>
              
              <div className="flex flex-wrap gap-4 text-muted-foreground mb-6">
                 <div className="flex items-center gap-2 font-medium text-primary bg-white px-3 py-1 rounded-full border shadow-sm">
                    {data.organization.logoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={data.organization.logoUrl} alt="Logo" className="w-5 h-5 object-contain" />
                    ) : (
                        <Building2 className="h-4 w-4" />
                    )}
                    {data.organization.name}
                 </div>
                 {data.organization.contacts && (
                    <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" /> {data.organization.contacts.split(',')[0]}
                    </div>
                 )}
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-white border text-sm py-1">
                    {data.type === 'job' ? 'Работа' : data.type === 'internship' ? 'Стажировка' : 'Практика'}
                </Badge>
                {data.skills.map((skill, i) => (
                  <Badge key={i} variant="outline" className="bg-transparent border-slate-300">
                    {skill.name}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Зарплата и Действия */}
            <div className="flex flex-col items-start md:items-end gap-4 min-w-[200px]">
              {data.salary && (
                  <span className="text-2xl font-bold text-green-700 bg-green-50 px-4 py-2 rounded-lg border border-green-100">
                    {data.salary}
                  </span>
              )}
              
              <div className="w-full flex flex-col gap-2">
                  <ApplyButton 
                    vacancyId={data.id} 
                    isApplied={isApplied} 
                    disabled={!canApply} 
                  />
                  {!canApply && !isApplied && (
                      <p className="text-xs text-red-500 text-center">Заполните профиль для отклика</p>
                  )}
              </div>
            </div>
          </div>
        </div>

        {/* ТЕЛО ВАКАНСИИ */}
        <CardContent className="p-6 md:p-8 space-y-8">
          
          {/* Описание */}
          <section>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-800">
              <FileText className="h-5 w-5 text-blue-600" /> Описание
            </h3>
            <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
              {data.description}
            </p>
          </section>

          <Separator />

          {/* Требования */}
          {requirementsList.length > 0 && (
             <section>
              <h3 className="text-xl font-bold mb-4 text-slate-800 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" /> Требования и обязанности
              </h3>
              <ul className="space-y-3">
                {requirementsList.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-700 bg-slate-50 p-3 rounded-lg">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

           <Separator />
           
           {/* Подвал карточки */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-500 bg-slate-50 p-5 rounded-xl border border-slate-100">
              <div>
                <p className="font-semibold text-slate-900 mb-1">Контакты компании:</p>
                <p>{data.organization.contacts || "Не указаны"}</p>
                {data.organization.website && (
                    <a href={data.organization.website} className="text-blue-600 hover:underline">
                        {data.organization.website} {/* Исправить переход на страницу организации */}
                    </a>
                )}
              </div>
              <div className="flex flex-col gap-2 md:items-end">
                 <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> 
                    Опубликовано: {data.createdAt ? new Date(data.createdAt).toLocaleDateString("ru-RU") : "Недавно"}
                 </div>
              </div>
           </div>

        </CardContent>
      </Card>
    </div>
  );
}