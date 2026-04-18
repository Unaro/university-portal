// src/features/manage-application/ui/application-manager.tsx
import { db } from "@/db";
import { applications, organizationRepresentatives, vacancies } from "@/db/schema";
import { eq, desc, inArray } from "drizzle-orm";
import { ApplicationCard } from "@/entities/application/ui/application-card";
import { ApplicationResponseForm } from "@/features/manage-application/ui/application-response-form";
import { getFileUrl } from "@/lib/s3";
import { Button } from "@/shared/ui/button";
import { CheckCircle2, XCircle, Clock, Briefcase } from "lucide-react";
import Link from "next/link";
import { StatsCard } from "@/shared/ui";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shared/ui/tabs";

interface ApplicationManagerProps {
  userId: number;
  statusFilter: string;
  vacancyIdFilter?: number;
}

export async function ApplicationManager({ userId, statusFilter, vacancyIdFilter }: ApplicationManagerProps) {
  const rep = await db.query.organizationRepresentatives.findFirst({
    where: eq(organizationRepresentatives.userId, userId),
  });

  if (!rep) {
    return <div className="p-4 text-center text-muted-foreground">Организация не найдена.</div>;
  }

  const orgVacancies = await db.query.vacancies.findMany({
    where: eq(vacancies.organizationId, rep.organizationId),
    columns: { id: true },
  });

  if (orgVacancies.length === 0) {
    return (
      <div className="text-center py-16 bg-card border border-dashed rounded-xl">
        <Briefcase size={32} className="mx-auto mb-3 text-muted-foreground" />
        <h3 className="text-lg font-medium">У вас пока нет вакансий</h3>
        <p className="text-sm text-muted-foreground mt-1 mb-4">
          Создайте первую вакансию, чтобы начать получать отклики.
        </p>
        <Button asChild>
          <Link href="/dashboard/vacancies/new">Создать вакансию</Link>
        </Button>
      </div>
    );
  }

  // Определяем, какие вакансии мы смотрим: либо одну конкретную, либо все вакансии организации
  const vacancyIds = vacancyIdFilter ? [vacancyIdFilter] : orgVacancies.map((v) => v.id);

  const rawApps = await db.query.applications.findMany({
    where: inArray(applications.vacancyId, vacancyIds),
    columns: { id: true, status: true, coverLetter: true, responseMessage: true, createdAt: true, universityApprovalStatus: true, practiceType: true, projectTheme: true },
    with: {
      vacancy: { columns: { title: true, type: true } },
      student: {
        columns: { id: true, course: true, majorId: true },
        with: {
          user: { columns: { name: true, email: true, image: true } },
          major: { columns: { name: true } },
          skills: { with: { skill: { columns: { id: true, name: true } } } },
          resume: { columns: { bio: true, fileUrl: true } },
        },
      },
    },
    orderBy: [desc(applications.createdAt)],
  });

  const visibleApps = rawApps.filter(
    (app) => app.vacancy.type !== "practice" || app.universityApprovalStatus === "approved"
  );

  const stats = {
    total: visibleApps.length,
    pending: visibleApps.filter((a) => a.status === "pending").length,
    approved: visibleApps.filter((a) => a.status === "approved").length,
    rejected: visibleApps.filter((a) => a.status === "rejected").length,
    universityPending: rawApps.filter(a => a.vacancy.type === "practice" && a.universityApprovalStatus === "pending").length,
  };

  const filteredApps = await Promise.all(
    visibleApps
      .filter((app) => statusFilter === "all" || app.status === statusFilter)
      .map(async (app) => ({
        ...app,
        resumeLink: app.student.resume?.fileUrl ? await getFileUrl(app.student.resume.fileUrl) : null,
      }))
  );

  const vacancyQuery = vacancyIdFilter ? `&vacancy=${vacancyIdFilter}` : "";

  return (
    <div className="flex flex-col gap-6">
      {/* Статистика */}
      <div className={`grid gap-3 ${stats.universityPending > 0 ? "grid-cols-2 md:grid-cols-5" : "grid-cols-2 md:grid-cols-4"}`}>
        <StatsCard variant="mini" icon={<Briefcase size={16} />} label="Всего" value={stats.total} />
        <StatsCard variant="mini" icon={<Clock size={16} />} label="Ждут" value={stats.pending} color="text-yellow-600" />
        {stats.universityPending > 0 && (
          <StatsCard variant="mini" icon={<Clock size={16} />} label="В ВУЗе" value={stats.universityPending} color="text-blue-600" />
        )}
        <StatsCard variant="mini" icon={<CheckCircle2 size={16} />} label="Принято" value={stats.approved} color="text-green-600" />
        <StatsCard variant="mini" icon={<XCircle size={16} />} label="Отказы" value={stats.rejected} color="text-red-600" />
      </div>

      {/* Табы фильтрации */}
      <Tabs defaultValue={statusFilter} className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-fit lg:grid-cols-4">
          <TabsTrigger value="all" asChild>
            <Link href={`/dashboard/applications?status=all${vacancyQuery}`} scroll={false} prefetch>
              Все
            </Link>
          </TabsTrigger>
          <TabsTrigger value="pending" asChild>
            <Link href={`/dashboard/applications?status=pending${vacancyQuery}`} scroll={false} prefetch>
              На рассмотрении
            </Link>
          </TabsTrigger>
          <TabsTrigger value="approved" asChild>
            <Link href={`/dashboard/applications?status=approved${vacancyQuery}`} scroll={false} prefetch>
              Приглашены
            </Link>
          </TabsTrigger>
          <TabsTrigger value="rejected" asChild>
            <Link href={`/dashboard/applications?status=rejected${vacancyQuery}`} scroll={false} prefetch>
              Отказы
            </Link>
          </TabsTrigger>
        </TabsList>

        {["all", "pending", "approved", "rejected"].map((status) => (
          <TabsContent key={status} value={status} className="hidden" />
        ))}
      </Tabs>

      {/* Список заявок */}
      {filteredApps.length === 0 ? (
        <div className="text-center py-16 bg-card border border-dashed rounded-xl">
          <Briefcase size={32} className="mx-auto mb-3 text-muted-foreground" />
          <h3 className="text-lg font-medium">Заявок нет</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {statusFilter !== "all" ? "Попробуйте изменить фильтр." : "Студенты еще не откликались на ваши вакансии."}
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredApps.map((app) => (
            <ApplicationCard
              key={app.id}
              data={app}
              actionSlot={
                app.status === "pending" ? (
                  <ApplicationResponseForm applicationId={app.id} />
                ) : (
                  <div className="h-full flex flex-col">
                    <div
                      className={`mb-4 flex items-center gap-2 font-bold text-sm px-3 py-2 rounded-md w-fit ${
                        app.status === "approved"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                          : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                      }`}
                    >
                      {app.status === "approved" ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                      {app.status === "approved" ? "Вы пригласили" : "Вы отказали"}
                    </div>
                    <div className="flex-grow">
                      <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Ваш ответ:</p>
                      <div className="bg-card border rounded-lg p-3 text-sm text-muted-foreground italic relative">
                        <div className="absolute -top-1.5 left-4 w-3 h-3 bg-card border-t border-l transform rotate-45" />
                        &ldquo;{app.responseMessage}&rdquo;
                      </div>
                    </div>
                  </div>
                )
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}