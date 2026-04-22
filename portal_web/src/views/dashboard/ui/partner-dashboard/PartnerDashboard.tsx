import { db } from "@/db";
import { vacancies, organizationRepresentatives } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import Link from "next/link";
import { Button } from "@/shared/ui/button";
import { Users, Plus } from "lucide-react";
import { PartnerDashboardProps, VacancyWithApplications } from "../../model/types";
import { VacancyCard } from "./VacancyCard";

export async function PartnerDashboard({ userId }: PartnerDashboardProps) {
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
    with: { 
      applications: { 
        columns: { 
          status: true,
          universityApprovalStatus: true
        } 
      } 
    },
    orderBy: [desc(vacancies.createdAt)],
  }) as VacancyWithApplications[];

  return (
    <div className="space-y-6 p-4 print:p-0">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold print:text-xl">Вакансии: {rep.organization.name}</h1>
        <div className="flex gap-2 print:hidden">
          <Button variant="outline" asChild>
            <Link href="/dashboard/applications?status=all" className="flex items-center gap-2">
              <Users size={16} /> Все заявки
            </Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/create-vacancy" className="flex items-center gap-2">
              <Plus size={16} /> Добавить
            </Link>
          </Button>
        </div>
      </div>

      {myVacancies.length === 0 ? (
        <div className="text-center py-12 bg-muted/30 rounded-lg border border-dashed print:border-solid print:border-gray-300">
          <p className="text-lg font-medium mb-2">У вас пока нет вакансий</p>
          <p className="text-sm text-muted-foreground mb-4 print:hidden">Создайте первую вакансию, чтобы начать поиск студентов.</p>
          <Button asChild className="print:hidden"><Link href="/dashboard/create-vacancy">Создать вакансию</Link></Button>
        </div>
      ) : (
        <div className="grid gap-4 print:block print:space-y-4">
          {myVacancies.map((vac) => (
            <div key={vac.id} className="print:break-inside-avoid">
              <VacancyCard vacancy={vac} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
