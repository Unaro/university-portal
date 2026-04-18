// src/app/page.tsx
export const dynamic = "force-dynamic";

import { db } from "@/db";
import { vacancies, organizations, users, applications } from "@/db/schema";
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

  // 2. Свежие вакансии (только активные, от подтвержденных компаний и где есть места)
  const rawVacancies = await db.query.vacancies.findMany({
    where: eq(vacancies.isActive, true),
    with: {
      organization: true,
      applications: {
        where: eq(applications.status, "approved"),
        columns: { id: true }
      }
    },
    orderBy: [desc(vacancies.createdAt)],
    limit: 10,
  });

  // Фильтруем подтвержденные организации и наличие мест
  const formattedVacancies = rawVacancies
    .filter(v => v.organization.verificationStatus === "approved")
    .filter(v => !v.availableSpots || v.applications.length < v.availableSpots)
    .slice(0, 6); // Оставляем топ-6

  return <HomeView stats={stats} latestVacancies={formattedVacancies} />;
}