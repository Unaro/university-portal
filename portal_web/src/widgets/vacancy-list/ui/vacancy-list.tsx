// src/widgets/vacancy-list/ui/vacancy-list.tsx
import { db } from "@/db";
import { vacancies, applications, organizations, vacancySkills, students, vacancyAllowedMajors } from "@/db/schema";
import { eq, and, desc, inArray, isNotNull, or, ilike, sql, isNull, count, SQL, exists, notExists, lte, gte } from "drizzle-orm"; 
import { VacancyCard } from "@/entities/vacancy/ui/vacancy-card";
import { Pagination } from "@/shared/ui/pagination";
import { auth } from "@/auth";

type InternshipType = "practice" | "internship" | "job";

interface VacancyListProps {
  searchParams: {
    search?: string;
    type?: string;
    payment?: string;
    course?: string;
    page?: string;
    onlyMyMajor?: string;
    dateFrom?: string;
    dateTo?: string;
  };
}

export async function VacancyList({ searchParams }: VacancyListProps) {
  const session = await auth();
  const { search, type, payment, course, page = "1", onlyMyMajor, dateFrom, dateTo } = searchParams;
  const currentPage = Number(page) || 1;
  const limit = 10;
  const offset = (currentPage - 1) * limit;

  // 1. Формируем SQL фильтры
  const sqlFilters: (SQL | undefined)[] = [
    eq(vacancies.isActive, true),
    eq(organizations.verificationStatus, "approved")
  ];

  // Фильтр по специальности студента
  const shouldApplyMajorFilter = session?.user?.role === "student" && onlyMyMajor !== "false";
  if (shouldApplyMajorFilter) {
    const student = await db.query.students.findFirst({
      where: eq(students.userId, parseInt(session.user.id)),
      columns: { majorId: true }
    });

    if (student?.majorId) {
      sqlFilters.push(or(
        notExists(db.select().from(vacancyAllowedMajors).where(eq(vacancyAllowedMajors.vacancyId, vacancies.id))),
        exists(db.select().from(vacancyAllowedMajors).where(and(eq(vacancyAllowedMajors.vacancyId, vacancies.id), eq(vacancyAllowedMajors.majorId, student.majorId))))
      ));
    }
  }

  if (search) {
    const term = `%${decodeURIComponent(search).toLowerCase().trim()}%`;
    sqlFilters.push(or(ilike(vacancies.title, term), ilike(organizations.name, term)));
  }

  if (type) {
    const types = type.split(",").filter((t): t is InternshipType => ["practice", "internship", "job"].includes(t));
    if (types.length > 0) sqlFilters.push(inArray(vacancies.type, types));
  }

  if (payment === "paid") sqlFilters.push(isNotNull(vacancies.salary));

  // --- НОВАЯ ЛОГИКА ДАТ (Строгое соответствие периоду) ---
  if (dateFrom && dateTo) {
    const from = new Date(dateFrom);
    const to = new Date(dateTo);
    if (!isNaN(from.getTime()) && !isNaN(to.getTime())) {
      // Вакансия должна начинаться ДО или В дату начала студента
      // И заканчиваться ПОСЛЕ или В дату окончания студента
      sqlFilters.push(and(
        or(isNull(vacancies.startDate), lte(vacancies.startDate, from)),
        or(isNull(vacancies.endDate), gte(vacancies.endDate, to))
      ));
    }
  }

  if (course) {
    const selectedCourse = Number(course);
    if (!isNaN(selectedCourse)) sqlFilters.push(sql`${vacancies.minCourse} <= ${selectedCourse}`);
  }

  sqlFilters.push(or(
    isNull(vacancies.availableSpots),
    sql`${vacancies.availableSpots} > (SELECT count(*) FROM ${applications} WHERE ${applications.vacancyId} = ${vacancies.id} AND ${applications.status} = 'approved')`
  ));

  const finalFilter = and(...sqlFilters.filter((f): f is SQL => f !== undefined));

  // 2. Получаем общее количество записей
  const [totalResult] = await db
    .select({ value: count() })
    .from(vacancies)
    .innerJoin(organizations, eq(vacancies.organizationId, organizations.id))
    .where(finalFilter);
  
  const totalItems = totalResult.value;
  const totalPages = Math.ceil(totalItems / limit);

  // 3. Запрос основных данных (db.select для скорости)
  const paginatedData = await db
    .select({
      vacancy: vacancies,
      organization: organizations,
    })
    .from(vacancies)
    .innerJoin(organizations, eq(vacancies.organizationId, organizations.id))
    .where(finalFilter)
    .orderBy(desc(vacancies.createdAt))
    .limit(limit)
    .offset(offset);

  const vacancyIds = paginatedData.map(v => v.vacancy.id);

  // 4. Оптимизированная дозагрузка (Без N+1)
  const allSkills = vacancyIds.length > 0 ? await db.query.vacancySkills.findMany({
    where: inArray(vacancySkills.vacancyId, vacancyIds),
    with: { skill: true }
  }) : [];

  const allApprovedCounts = vacancyIds.length > 0 ? await db
    .select({ vacancyId: applications.vacancyId, count: count() })
    .from(applications)
    .where(and(inArray(applications.vacancyId, vacancyIds), eq(applications.status, "approved")))
    .groupBy(applications.vacancyId) : [];

  const data = paginatedData.map((item) => ({
    ...item.vacancy,
    organization: item.organization,
    requiredSkills: allSkills.filter(s => s.vacancyId === item.vacancy.id),
    applications: Array(allApprovedCounts.find(c => c.vacancyId === item.vacancy.id)?.count || 0).fill({})
  }));

  if (data.length === 0) {
    return (
      <div className="text-center py-20 bg-muted rounded-xl border border-dashed">
        <p className="text-muted-foreground text-lg">Ничего не найдено 🕵️‍♂️</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
        <div>
          <p className="text-muted-foreground mb-4 text-sm">Найдено {totalItems} предложений</p>
          <div className="grid grid-cols-1 gap-4">
            {data.map((vac) => <VacancyCard key={vac.id} data={vac} />)}
          </div>
        </div>
        <Pagination currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
}
