// src/views/dashboard/ui/student-dashboard.tsx
import { db } from "@/db";
import { students, vacancies, organizations, applications, studentSkills } from "@/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, CheckCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { applyToVacancy, deleteApplication } from "@/app/actions/application";
import { ReactNode } from "react";

// --- ТИПИЗАЦИЯ ---

// 1. Тип "Умной вакансии" (Данные из БД + Связи + Вычисляемые поля)
// Мы используем $inferSelect, чтобы взять типы прямо из схемы Drizzle
type SmartVacancy = typeof vacancies.$inferSelect & {
  organization: typeof organizations.$inferSelect;
  // Связи many-to-many возвращают массив объектов связующей таблицы
  requiredSkills: (typeof import("@/db/schema").vacancySkills.$inferSelect)[];
  allowedMajors: (typeof import("@/db/schema").vacancyAllowedMajors.$inferSelect)[];
  // Вычисляемые поля для UI
  matchScore: number;
  missingSkills: number;
};

// 2. Тип Профиля студента
type StudentProfile = typeof students.$inferSelect & {
  skills: (typeof studentSkills.$inferSelect)[];
};

interface StudentDashboardProps {
  userId: number;
  filterType: string;
}

export async function StudentDashboard({ userId, filterType }: StudentDashboardProps) {
  // 1. Загружаем профиль
  const studentProfile = await db.query.students.findFirst({
    where: eq(students.userId, userId),
    with: { skills: true }
  }) as StudentProfile | undefined; // Явно указываем тип результата

  const studentStats = { total: 0, pending: 0, approved: 0, rejected: 0 };
  const myApplicationsMap = new Map<number, typeof applications.$inferSelect>();

  // 2. Инициализируем переменную строго типизированным массивом
  let visibleVacancies: SmartVacancy[] = [];

  if (studentProfile) {
    const studentSkillSet = new Set(studentProfile.skills.map(s => s.skillId));

    // Drizzle возвращает сырые данные, которые мы потом обогатим
    const allVacanciesRaw = await db.query.vacancies.findMany({
      where: eq(vacancies.isActive, true),
      with: { 
        organization: true,
        requiredSkills: true,
        allowedMajors: true
      },
    });

    // Фильтрация и маппинг в SmartVacancy
    visibleVacancies = allVacanciesRaw
      .filter((vac) => {
        if (filterType !== "all") {
            if (filterType === 'practice' && vac.type !== 'practice') return false;
            if (filterType === 'job' && vac.type === 'practice') return false;
        }
        if (studentProfile!.course && studentProfile!.course < (vac.minCourse || 1)) return false;
        if (vac.allowedMajors.length > 0) {
          const isMajorAllowed = vac.allowedMajors.some(m => m.majorId === studentProfile!.majorId);
          if (!isMajorAllowed) return false;
        }
        return true;
      })
      .map((vac) => {
        let matchCount = 0;
        vac.requiredSkills.forEach((req) => {
          if (studentSkillSet.has(req.skillId)) matchCount++;
        });
        
        // Возвращаем объект, полностью соответствующий типу SmartVacancy
        return {
          ...vac,
          matchScore: matchCount,
          missingSkills: vac.requiredSkills.length - matchCount 
        };
      })
      .sort((a, b) => {
        if (b.matchScore !== a.matchScore) {
          return b.matchScore - a.matchScore;
        }
        // Обработка возможного null в дате (хотя defaultNow() обычно гарантирует дату, но TS может ругаться)
        const dateA = a.createdAt ? a.createdAt.getTime() : 0;
        const dateB = b.createdAt ? b.createdAt.getTime() : 0;
        return dateB - dateA;
      });

    // Загрузка заявок
    const myApps = await db.query.applications.findMany({
      where: eq(applications.studentId, studentProfile.id),
    });
    
    myApps.forEach(app => {
      myApplicationsMap.set(app.vacancyId, app);
      studentStats.total++;
      if (app.status === 'pending') studentStats.pending++;
      if (app.status === 'approved') studentStats.approved++;
      if (app.status === 'rejected') studentStats.rejected++;
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold">Рекомендации для вас</h2>
          </div>
          <div className="flex gap-2">
            <Link href="/profile">
                {/* studentProfile может быть undefined, используем опциональную цепочку */}
                <Button variant={studentProfile?.skills.length === 0 ? "destructive" : "secondary"}>
                    {studentProfile?.skills.length === 0 ? "⚠️ Заполните навыки!" : "👤 Профиль"}
                </Button>
            </Link>
            {/* Ссылка на резюме (если нужно, можно восстановить) */}
            {/* <Link href="/dashboard/resume">
                  <Button variant="outline">✎ Резюме</Button>
            </Link> */}
          </div>
      </div>

      {/* СТАТИСТИКА */}
      <div className="grid grid-cols-3 gap-4 mb-4">
          <StatsCard icon={<FileText size={16} />} label="Всего заявок" value={studentStats.total} />
          <StatsCard icon={<CheckCircle size={16} />} label="Приглашений" value={studentStats.approved} color="text-green-600 dark:text-green-400" />
          <StatsCard icon={<XCircle size={16} />} label="Отказов" value={studentStats.rejected} color="text-destructive" />
      </div>

      {/* ФИЛЬТРЫ */}
      <div className="flex gap-2 border-b pb-4 overflow-x-auto">
          <FilterButton active={filterType === 'all'} href="/dashboard?filter=all">Все</FilterButton>
          <FilterButton active={filterType === 'practice'} href="/dashboard?filter=practice">🎓 Практика</FilterButton>
          <FilterButton active={filterType === 'job'} href="/dashboard?filter=job">💼 Работа</FilterButton>
      </div>
      
      {/* СПИСОК ВАКАНСИЙ */}
      {visibleVacancies.length === 0 ? (
        <div className="p-10 text-center bg-muted rounded border border-dashed">
          <p className="text-muted-foreground">Нет подходящих вакансий. Проверьте профиль или фильтры.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {visibleVacancies.map((vac) => {
            const application = myApplicationsMap.get(vac.id);
            const isApplied = !!application;
            const isHighMatch = vac.matchScore > 0 && vac.missingSkills === 0;

            return (
              <div key={vac.id} className={`bg-card p-6 rounded-lg shadow-sm border transition hover:shadow-md ${isHighMatch ? "border-l-4 border-l-green-500" : ""}`}>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-xl font-bold text-foreground">{vac.title}</h3>
                      <Badge variant="outline" className="text-xs font-normal bg-muted">
                          {vac.type === 'job' ? 'Работа' : vac.type === 'internship' ? 'Стажировка' : 'Практика'}
                      </Badge>
                      {vac.salary && <Badge className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800">{vac.salary}</Badge>}
                  </div>
                  {vac.requiredSkills.length > 0 && (
                      <div className="text-xs font-medium px-2 py-1 bg-muted rounded border text-muted-foreground ml-2">
                          Совпадение: <span className={isHighMatch ? "text-green-600 dark:text-green-400 font-bold" : "text-primary"}>{vac.matchScore}/{vac.requiredSkills.length}</span>
                      </div>
                  )}
                </div>

                <p className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                  <span>🏢 {vac.organization.name}</span> • <span>Мин. курс: {vac.minCourse}</span>
                </p>
                <p className="text-muted-foreground mb-4 line-clamp-3 text-sm">{vac.description}</p>

                <div className="flex flex-col gap-4 mt-4 border-t pt-4">
                  {isApplied ? (
                    <div className="bg-muted p-3 rounded-md border text-sm">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-muted-foreground">Статус: {application?.status === 'approved' ? 'Приглашение!' : application?.status === 'rejected' ? 'Отказ' : 'На рассмотрении'}</span>
                        {application?.status === 'approved' && <a href={`/api/documents/${application.id}`} target="_blank" className="text-primary underline">Скачать направление</a>}
                      </div>
                      {application?.responseMessage && <div className="mt-2 text-muted-foreground italic">"{application.responseMessage}"</div>}
                    </div>
                  ) : (
                    <div className="flex justify-between items-center w-full">
                        <span className="text-xs text-muted-foreground">{vac.createdAt ? new Date(vac.createdAt).toLocaleDateString("ru-RU") : "Недавно"}</span>
                        <form action={async () => { "use server"; await applyToVacancy(vac.id); }}>
                          {/* Проверка на null для studentProfile */}
                          <Button type="submit" disabled={!studentProfile || (studentProfile.skills.length === 0 && vac.requiredSkills.length > 0)}>Откликнуться</Button>
                        </form>
                    </div>
                  )}
                  {/* Внутри блока isApplied, например, под статусом */}
                  {application?.status === 'pending' && (
                    <form
                      action={async () => {
                        "use server";
                        await deleteApplication(application.id);
                      }}
                      className="mt-2"
                    >
                      <Button variant="link" size="sm" className="text-destructive h-auto p-0 text-xs">
                        Отозвать заявку
                      </Button>
                    </form>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// --- ВСПОМОГАТЕЛЬНЫЕ КОМПОНЕНТЫ (Строго типизированные) ---

interface StatsCardProps {
  icon: ReactNode;
  label: string;
  value: number;
  color?: string;
}

function StatsCard({ icon, label, value, color = "text-foreground" }: StatsCardProps) {
  return (
    <Card>
      <CardContent className="p-4 flex flex-col items-center justify-center text-center">
          <div className={`text-2xl font-bold ${color}`}>{value}</div>
          <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">{icon} {label}</div>
      </CardContent>
    </Card>
  )
}

interface FilterButtonProps {
  active: boolean;
  href: string;
  children: ReactNode;
}

function FilterButton({ active, href, children }: FilterButtonProps) {
  return (
    <Link href={href} scroll={false}>
      <Button variant={active ? 'default' : 'outline'} size="sm" className="rounded-full">{children}</Button>
    </Link>
  )
}