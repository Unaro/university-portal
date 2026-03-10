// src/app/page.tsx
export const dynamic = "force-dynamic";

import { db } from "@/db";
import { vacancies, organizations, users } from "@/db/schema";
import { eq, and, desc, count } from "drizzle-orm";
import { HomeView } from "@/views/home/ui/home-view";

export default async function HomePage() {
  // 1. Статистика
  const [stats] = await Promise.all([
    db.transaction(async (tx) => {
      const [vacs] = await tx.select({ value: count() }).from(vacancies).where(eq(vacancies.isActive, true));
      const [orgs] = await tx.select({ value: count() }).from(organizations).where(eq(organizations.verificationStatus, "approved"));
      const [studs] = await tx.select({ value: count() }).from(users).where(eq(users.role, "student"));
      return { vacancies: vacs.value, organizations: orgs.value, students: studs.value };
    })
  ]);

  // 2. Свежие вакансии
  const activeVacancies = await db
    .select({
      // Выбираем поля, соответствующие схеме VacancyCardProps
      // Drizzle вернет объект, который мы потом смерджим
      vacancy: vacancies,
      organization: organizations
    })
    .from(vacancies)
    .innerJoin(organizations, eq(vacancies.organizationId, organizations.id))
    .where(
      and(
        eq(vacancies.isActive, true),
        eq(organizations.verificationStatus, "approved")
      )
    )
    .orderBy(desc(vacancies.createdAt))
    .limit(6);

  // Приводим к плоскому виду для карточки
  const formattedVacancies = activeVacancies.map(v => ({
    ...v.vacancy,
    organization: v.organization
  }));

  return <HomeView stats={stats} latestVacancies={formattedVacancies} />;
}