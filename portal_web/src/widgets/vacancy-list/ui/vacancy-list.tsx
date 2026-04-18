// src/widgets/vacancy-list/ui/vacancy-list.tsx
import { db } from "@/db";
import { vacancies, applications } from "@/db/schema";
import { eq, and, desc, gte, inArray, isNotNull } from "drizzle-orm"; // Убрали like
import { VacancyCard } from "@/entities/vacancy/ui/vacancy-card";

type InternshipType = "practice" | "internship" | "job";

interface VacancyListProps {
  searchParams: {
    search?: string;
    type?: string;
    payment?: string;
    course?: string;
  };
}

export async function VacancyList({ searchParams }: VacancyListProps) {
  const { search, type, payment, course } = searchParams;

  // 1. Базовые фильтры SQL (Жесткие критерии)
  const filters = [eq(vacancies.isActive, true)];

  // Тип
  if (type) {
    const types = type.split(",").filter((t): t is InternshipType =>
      ["practice", "internship", "job"].includes(t)
    );
    if (types.length > 0) {
      filters.push(inArray(vacancies.type, types));
    }
  }

  // Оплата
  if (payment === "paid") {
    filters.push(isNotNull(vacancies.salary));
  }

  // Курс
  if (course) {
    const courses = course.split(",").map(Number);
    filters.push(gte(vacancies.minCourse, Math.min(...courses))); 
  }

  // 2. Запрос к БД
  const rawData = await db.query.vacancies.findMany({
    where: and(...filters),
    with: {
      organization: true,
      requiredSkills: { with: { skill: true } },
      applications: {
        where: eq(applications.status, "approved"),
        columns: { id: true }
      }
    },
    orderBy: [desc(vacancies.createdAt)],
  });

  // 3. ✅ JS ПОИСК (И по вакансии, И по компании)
  const data = rawData.filter((vac) => {
    // ❌ Исключаем вакансии от неподтвержденных компаний
    if (vac.organization.verificationStatus !== "approved") return false;

    // ❌ Скрываем вакансии, где набор закрыт (лимит достигнут)
    if (vac.availableSpots && vac.applications.length >= vac.availableSpots) return false;

    if (!search) return true;
    
    // Приводим все к нижнему регистру для нечувствительности к регистру
    const term = decodeURIComponent(search).toLowerCase().trim();
    const title = vac.title.toLowerCase();
    const orgName = vac.organization.name.toLowerCase();

    // Ищем вхождение строки поиска в названии вакансии ИЛИ в названии компании
    return title.includes(term) || orgName.includes(term);
  });

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
    <div>
        <p className="text-muted-foreground mb-4 text-sm">
            Найдено {data.length} предложений {search && `по запросу "${decodeURIComponent(search)}"`}
        </p>
        <div className="grid grid-cols-1 gap-4">
        {data.map((vac) => (
            <VacancyCard key={vac.id} data={vac} />
        ))}
        </div>
    </div>
  );
}