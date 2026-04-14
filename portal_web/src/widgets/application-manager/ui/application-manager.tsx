// src/features/manage-application/ui/application-manager.tsx
import { db } from "@/db";
import { applications, organizationRepresentatives, vacancies } from "@/db/schema";
import { eq, desc, inArray } from "drizzle-orm";
import { ApplicationCard } from "@/entities/application/ui/application-card";
import { ApplicationResponseForm } from "@/features/manage-application/ui/application-response-form";
import { getFileUrl } from "@/lib/s3";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Clock, Briefcase } from "lucide-react";
import Link from "next/link";

interface ApplicationManagerProps {
  userId: number;
  statusFilter: string;
}

export async function ApplicationManager({ userId, statusFilter }: ApplicationManagerProps) {
  const rep = await db.query.organizationRepresentatives.findFirst({
    where: eq(organizationRepresentatives.userId, userId),
  });

  if (!rep) {
    return <div className="p-6 text-center text-muted-foreground">Организация не найдена.</div>;
  }

  // 1. ID вакансий организации
  const orgVacancies = await db.query.vacancies.findMany({
    where: eq(vacancies.organizationId, rep.organizationId),
    columns: { id: true },
  });

  if (orgVacancies.length === 0) {
    return (
      <div className="p-8 text-center bg-muted/30 rounded-lg border border-dashed">
        <Briefcase className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
        <h3 className="text-lg font-medium mb-2">У вас пока нет вакансий</h3>
        <p className="text-muted-foreground mb-4">Создайте первую вакансию, чтобы начать получать отклики.</p>
        <Button asChild><Link href="/dashboard/vacancies/new">Создать вакансию</Link></Button>
      </div>
    );
  }

  const vacancyIds = orgVacancies.map((v) => v.id);

  // 2. Запрос нужных полей
  const rawApps = await db.query.applications.findMany({
    where: inArray(applications.vacancyId, vacancyIds),
    columns: { id: true, status: true, coverLetter: true, responseMessage: true, createdAt: true },
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

  // 3. Статистика
  const stats = {
    total: rawApps.length,
    pending: rawApps.filter((a) => a.status === "pending").length,
    approved: rawApps.filter((a) => a.status === "approved").length,
    rejected: rawApps.filter((a) => a.status === "rejected").length,
  };

  // 4. Фильтрация + генерация ссылок
  const filteredApps = await Promise.all(
    rawApps
      .filter((app) => statusFilter === "all" || app.status === statusFilter)
      .map(async (app) => ({
        ...app,
        resumeLink: app.student.resume?.fileUrl ? await getFileUrl(app.student.resume.fileUrl) : null,
      }))
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatBadge icon={<Briefcase size={16} />} label="Всего" value={stats.total} />
        <StatBadge icon={<Clock size={16} />} label="Ждут" value={stats.pending} color="text-yellow-600" />
        <StatBadge icon={<CheckCircle2 size={16} />} label="Принято" value={stats.approved} color="text-green-600" />
        <StatBadge icon={<XCircle size={16} />} label="Отказы" value={stats.rejected} color="text-red-600" />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        <FilterTab href="/dashboard/applications?status=all" active={statusFilter === "all"}>Все</FilterTab>
        <FilterTab href="/dashboard/applications?status=pending" active={statusFilter === "pending"}>На рассмотрении</FilterTab>
        <FilterTab href="/dashboard/applications?status=approved" active={statusFilter === "approved"}>Приглашены</FilterTab>
        <FilterTab href="/dashboard/applications?status=rejected" active={statusFilter === "rejected"}>Отказы</FilterTab>
      </div>

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
              data={app} // ✅ Теперь типы совпадают на 100%
              actionSlot={
                app.status === "pending" ? (
                  <ApplicationResponseForm applicationId={app.id} />
                ) : (
                  <div className="h-full flex flex-col">
                    <div className={`mb-4 flex items-center gap-2 font-bold text-sm px-3 py-2 rounded-md w-fit
                      ${app.status === 'approved' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'}`}>
                      {app.status === 'approved' ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                      {app.status === 'approved' ? 'Вы пригласили' : 'Вы отказали'}
                    </div>
                    <div className="flex-grow">
                      <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Ваш ответ:</p>
                      <div className="bg-card border rounded-lg p-3 text-sm text-muted-foreground italic relative">
                        <div className="absolute -top-1.5 left-4 w-3 h-3 bg-card border-t border-l transform rotate-45"></div>
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

// --- ВСПОМОГАТЕЛЬНЫЕ КОМПОНЕНТЫ ---
function StatBadge({ icon, label, value, color = "text-foreground" }: { icon: React.ReactNode; label: string; value: number; color?: string }) {
  return (
    <div className="bg-card border rounded-lg p-3 flex items-center gap-3">
      <div className={`p-2 rounded-full bg-muted ${color}`}>{icon}</div>
      <div>
        <div className={`text-xl font-bold ${color}`}>{value}</div>
        <div className="text-xs text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}

function FilterTab({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link href={href} scroll={false} prefetch>
      <Button variant={active ? "default" : "outline"} size="sm" className="rounded-full h-9 whitespace-nowrap">
        {children}
      </Button>
    </Link>
  );
}