// src/widgets/vacancy-list/ui/vacancy-list.tsx
import { db } from "@/db";
import { vacancies, applications, organizations } from "@/db/schema";
import { eq, and, desc, gte, inArray, isNotNull, or, ilike, sql, isNull, count, SQL } from "drizzle-orm"; 
import { VacancyCard } from "@/entities/vacancy/ui/vacancy-card";
import { Pagination } from "@/shared/ui/pagination";

type InternshipType = "practice" | "internship" | "job";

interface VacancyListProps {
  searchParams: {
    search?: string;
    type?: string;
    payment?: string;
    course?: string;
    page?: string;
  };
}

export async function VacancyList({ searchParams }: VacancyListProps) {
  const { search, type, payment, course, page = "1" } = searchParams;
  const currentPage = Number(page) || 1;
  const limit = 10;
  const offset = (currentPage - 1) * limit;

  // 1. Формируем SQL фильтры
  const sqlFilters: (SQL | undefined)[] = [
    eq(vacancies.isActive, true),
    eq(organizations.verificationStatus, "approved")
  ];

  // Поиск по названию или компании
  if (search) {
    const term = `%${decodeURIComponent(search).toLowerCase().trim()}%`;
    sqlFilters.push(or(
      ilike(vacancies.title, term),
      ilike(organizations.name, term)
    ));
  }

  // Тип
  if (type) {
    const types = type.split(",").filter((t): t is InternshipType =>
      ["practice", "internship", "job"].includes(t)
    );
    if (types.length > 0) {
      sqlFilters.push(inArray(vacancies.type, types));
    }
  }

  // Оплата
  if (payment === "paid") {
    sqlFilters.push(isNotNull(vacancies.salary));
  }

  // Курс
  if (course) {
    const courses = course.split(",").map(Number);
    sqlFilters.push(gte(vacancies.minCourse, Math.min(...courses))); 
  }

  // Фильтр по свободным местам: мест либо нет (null), либо их больше чем approved заявок
  sqlFilters.push(or(
    isNull(vacancies.availableSpots),
    sql`${vacancies.availableSpots} > (SELECT count(*) FROM ${applications} WHERE ${applications.vacancyId} = ${vacancies.id} AND ${applications.status} = 'approved')`
  ));

  // Очищаем массив фильтров от undefined
  const finalFilter = and(...sqlFilters.filter((f): f is SQL => f !== undefined));

  // 2. Получаем общее количество записей для пагинации
  const [totalResult] = await db
    .select({ value: count() })
    .from(vacancies)
    .innerJoin(organizations, eq(vacancies.organizationId, organizations.id))
    .where(finalFilter);
  
  const totalItems = totalResult.value;
  const totalPages = Math.ceil(totalItems / limit);

  // 3. Запрос основных данных с пагинацией через db.select
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

  // Дозагружаем навыки и approvedCount для каждого элемента
  const data = await Promise.all(paginatedData.map(async (item) => {
    const skillsData = await db.query.vacancySkills.findMany({
      where: eq(vacancies.id, item.vacancy.id),
      with: { skill: true }
    });
    
    const appsCount = await db.select({ value: count() })
      .from(applications)
      .where(and(eq(applications.vacancyId, item.vacancy.id), eq(applications.status, "approved")));

    return {
      ...item.vacancy,
      organization: item.organization,
      requiredSkills: skillsData,
      applications: Array(appsCount[0].value).fill({}) // Для совместимости с VacancyCardProps
    };
  }));

  // Если ничего не найдено
  if (data.length === 0) {
    return (
      <div className="text-center py-20 bg-muted rounded-xl border border-dashed">
        <p className="text-muted-foreground text-lg">Ничего не найдено 🕵️‍♂️</p>
        <p className="text-sm text-muted-foreground/60">
            {search ? `По запросу "${search}" нет результатов.` : "Измените параметры фильтров."}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
        <div>
          <p className="text-muted-foreground mb-4 text-sm">
              Найдено {totalItems} предложений {search && `по запросу "${decodeURIComponent(search)}"`}
          </p>
          <div className="grid grid-cols-1 gap-4">
          {data.map((vac) => (
              <VacancyCard key={vac.id} data={vac} />
          ))}
          </div>
        </div>

        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
        />
    </div>
  );
}
