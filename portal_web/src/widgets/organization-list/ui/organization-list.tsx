// src/widgets/organization-list/ui/organization-list.tsx
import { db } from "@/db";
import { organizations, vacancies } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { OrganizationCard } from "@/entities/organization/ui/organization-card";
import { getFileUrl } from "@/lib/s3";

interface OrganizationListProps {
  searchQuery?: string;
}

export async function OrganizationList({ searchQuery }: OrganizationListProps) {
  // 1. Загружаем одобренные организации вместе с активными вакансиями
  const allOrgs = await db.query.organizations.findMany({
    where: eq(organizations.verificationStatus, "approved"),
    with: {
      vacancies: {
        where: eq(vacancies.isActive, true),
        columns: { id: true } // Нам нужно только количество
      }
    },
    orderBy: [desc(organizations.createdAt)],
  });

  // 2. Фильтрация и подготовка данных (в памяти)
  const filteredOrgs = allOrgs.filter((org) => {
    if (!searchQuery) return true;
    const term = searchQuery.toLowerCase();
    return (
      org.name.toLowerCase().includes(term) ||
      (org.description && org.description.toLowerCase().includes(term))
    );
  });

  // 3. Получаем ссылки на логотипы (S3)
  const orgsWithLogos = await Promise.all(
    filteredOrgs.map(async (org) => ({
      ...org,
      vacanciesCount: org.vacancies.length,
      logo: org.logo ? await getFileUrl(org.logo) : null
    }))
  );

  if (orgsWithLogos.length === 0) {
    return (
      <div className="text-center py-20">
        <h3 className="text-xl font-semibold text-muted-foreground">Компании не найдены 🏢</h3>
        <p className="text-sm text-muted-foreground/60 mt-2">Попробуйте изменить запрос</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {orgsWithLogos.map((org) => (
        <OrganizationCard key={org.id} data={org} />
      ))}
    </div>
  );
}