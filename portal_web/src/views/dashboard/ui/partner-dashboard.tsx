// src/views/dashboard/ui/partner-dashboard.tsx
import { db } from "@/db";
import { vacancies, organizationRepresentatives } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Clock, CheckCircle, Trash2, Plus, Settings } from "lucide-react";
import { deleteVacancy } from "@/app/actions/vacancy";

export async function PartnerDashboard({ userId }: { userId: number }) {
  const rep = await db.query.organizationRepresentatives.findFirst({
    where: eq(organizationRepresentatives.userId, userId),
    with: { organization: true },
  });

  if (!rep) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-bold mb-2">Организация не найдена</h2>
        <Button asChild><Link href="/register?role=organization">Зарегистрировать</Link></Button>
      </div>
    );
  }

  const myVacancies = await db.query.vacancies.findMany({
    where: eq(vacancies.organizationId, rep.organization.id),
    with: { applications: { columns: { status: true } } },
    orderBy: [desc(vacancies.createdAt)],
  });

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Вакансии: {rep.organization.name}</h1>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/applications?status=all" className="flex items-center gap-2">
              <Users size={16} /> Все заявки
            </Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/vacancies/new" className="flex items-center gap-2">
              <Plus size={16} /> Добавить
            </Link>
          </Button>
        </div>
      </div>

      {myVacancies.length === 0 ? (
        <div className="text-center py-12 bg-muted/30 rounded-lg border border-dashed">
          <p className="text-lg font-medium mb-2">У вас пока нет вакансий</p>
          <p className="text-sm text-muted-foreground mb-4">Создайте первую вакансию, чтобы начать поиск студентов.</p>
          <Button asChild><Link href="/dashboard/vacancies/new">Создать вакансию</Link></Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {myVacancies.map((vac) => {
            const total = vac.applications.length;
            const pending = vac.applications.filter((a) => a.status === "pending").length;
            const approved = vac.applications.filter((a) => a.status === "approved").length;

            return (
              <div key={vac.id} className="p-5 border rounded-lg bg-card hover:shadow-md transition">
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-lg">{vac.title}</h3>
                      <Badge variant="outline" className="text-xs bg-muted">
                        {vac.type === "job" ? "Работа" : vac.type === "internship" ? "Стажировка" : "Практика"}
                      </Badge>
                      {!vac.isActive && <Badge variant="destructive" className="text-xs">Скрыта</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{vac.description}</p>

                    <div className="flex flex-wrap gap-3 text-sm">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Users size={15} /> <span className="font-medium">{total}</span> откликов
                      </div>
                      {pending > 0 && (
                        <div className="flex items-center gap-1.5 text-yellow-600 dark:text-yellow-400 font-medium bg-yellow-50 dark:bg-yellow-900/20 px-2 py-0.5 rounded-full text-xs">
                          <Clock size={14} /> {pending} новых
                        </div>
                      )}
                      {approved > 0 && (
                        <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400 font-medium bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full text-xs">
                          <CheckCircle size={14} /> {approved} приглашено
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex sm:flex-col gap-2 sm:items-end min-w-[140px]">
                    <Button variant="secondary" size="sm" asChild className="w-full">
                      <Link href={`/dashboard/applications?vacancy=${vac.id}`}>К заявкам →</Link>
                    </Button>
                    <form action={async () => { "use server"; await deleteVacancy(vac.id); }} className="w-full">
                      <Button variant="ghost" size="sm" className="w-full text-destructive hover:bg-destructive/10 gap-2">
                        <Trash2 size={14} /> Удалить
                      </Button>
                    </form>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}