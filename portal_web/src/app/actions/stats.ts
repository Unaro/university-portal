// src/app/actions/stats.ts
"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { users, vacancies, applications, organizations } from "@/db/schema";
import { eq, count } from "drizzle-orm";

export type AdminStats = {
  totalStudents: number;
  totalCompanies: number;
  activeVacancies: number;
  totalApplications: number;
  successfulHires: number; // Статус 'approved'
};

export async function getAdminStats(): Promise<AdminStats | null> {
  const session = await auth();

  // Проверка прав администратора
  if (!session?.user || session.user.role !== "university_staff") {
    return null;
  }

  try {
    // Выполняем запросы параллельно для скорости
    const [
      studentsCount,
      companiesCount,
      vacanciesCount,
      applicationsCount,
      hiresCount
    ] = await Promise.all([
      // 1. Всего студентов
      db.select({ value: count() }).from(users).where(eq(users.role, "student")),
      
      // 2. Одобренных компаний
      db.select({ value: count() }).from(organizations).where(eq(organizations.verificationStatus, "approved")),
      
      // 3. Активных вакансий
      db.select({ value: count() }).from(vacancies).where(eq(vacancies.isActive, true)),
      
      // 4. Всего заявок
      db.select({ value: count() }).from(applications),
      
      // 5. Успешных трудоустройств (статус approved)
      db.select({ value: count() }).from(applications).where(eq(applications.status, "approved")),
    ]);

    return {
      totalStudents: studentsCount[0].value,
      totalCompanies: companiesCount[0].value,
      activeVacancies: vacanciesCount[0].value,
      totalApplications: applicationsCount[0].value,
      successfulHires: hiresCount[0].value,
    };
  } catch (error) {
    console.error("Stats error:", error);
    return null;
  }
}