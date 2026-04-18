// src/app/practices/[id]/page.tsx
import { auth } from "@/auth";
import { db } from "@/db";
import { vacancies, applications, students } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { notFound } from "next/navigation";
import { PracticeDetailsView } from "@/views/practice-details/ui/practice-details-view";
import { getFileUrl } from "@/lib/s3";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PracticeDetailsPage({ params }: PageProps) {
  const session = await auth();
  const { id } = await params;
  const vacancyId = parseInt(id);

  if (isNaN(vacancyId)) notFound();

  // 1. Загружаем вакансию с организацией и навыками
  const vacancy = await db.query.vacancies.findFirst({
    where: eq(vacancies.id, vacancyId),
    with: {
      organization: true,
      requiredSkills: {
        with: { skill: true }
      },
      applications: {
        where: eq(applications.status, "approved"),
        columns: { id: true }
      }
    }
  });

  if (!vacancy || vacancy.organization.verificationStatus !== "approved" || (!vacancy.isActive && session?.user?.role !== "admin")) notFound();

  const isFull = vacancy.availableSpots ? vacancy.applications.length >= vacancy.availableSpots : false;

  // 2. Проверяем статус отклика и возможность откликнуться, а так же залогинен ли сам пользователь
  let isApplied = false;
  let canApply = false;
  let isLoggined = false;

  if (session?.user?.id && session.user.role === "student") {
    const studentId = parseInt(session.user.id);
    
    // Получаем профиль студента
    const studentProfile = await db.query.students.findFirst({
      where: eq(students.userId, studentId),
      with: { skills: true }
    });

    if (studentProfile) {
      // Проверяем, есть ли уже заявка
      const application = await db.query.applications.findFirst({
        where: and(
          eq(applications.studentId, studentProfile.id),
          eq(applications.vacancyId, vacancyId)
        )
      });
      
      isApplied = !!application;
      isLoggined = true
      // Проверка на возможность отклика (заполнены навыки + есть места + вакансия активна)
      canApply = studentProfile.skills.length > 0 && !isFull && (vacancy.isActive ?? false);
    }
  }

  // 3. Получаем ссылку на логотип
  const logoUrl = vacancy.organization.logo 
    ? await getFileUrl(vacancy.organization.logo) 
    : null;

  // Форматируем данные для виджета
  const formattedData = {
    ...vacancy,
    organization: {
      ...vacancy.organization,
      logoUrl,
    },
    skills: vacancy.requiredSkills.map(rs => rs.skill),
    approvedCount: vacancy.applications.length,
  };

  return (
    <PracticeDetailsView 
      data={formattedData}
      isApplied={isApplied}
      canApply={canApply}
      isLoggined={isLoggined}
      isFull={isFull}
    />
  );
}