// src/app/profile/page.tsx
import { auth } from "@/auth";
import { db } from "@/db";
import { students, majors, skills, applications } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { redirect } from "next/navigation";
import { ProfileView } from "@/views/profile/ui/profile-view";
import { ApplicationUiItem } from "@/features/application-list/ui/student-application-list";
import { getFileUrl } from "@/lib/s3";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) redirect("/login");

  const user = session.user;

  if (user.role !== "student") {
     redirect("/dashboard");
  }

  // 1. Грузим профиль с ПОЛНЫМИ данными навыков
  const studentData = await db.query.students.findFirst({
    where: eq(students.userId, parseInt(user.id)),
    with: { 
      skills: {
        with: {
          skill: true 
        }
      },
      resume: true
    },
  });

  const allMajors = await db.select().from(majors);
  const allSkills = await db.select().from(skills);
  
  // 2. Грузим отклики
  const myApplications = await db.query.applications.findMany({
    where: eq(applications.studentId, studentData?.id || 0),
    with: { 
        vacancy: { with: { organization: true } } 
    },
    orderBy: [desc(applications.createdAt)]
  });

  const formattedApps: ApplicationUiItem[] = myApplications.map(app => ({
      id: app.id,
      vacancyTitle: app.vacancy.title,
      companyName: app.vacancy.organization.name,
      date: app.createdAt,
      status: app.status
  }));

  // Генерируем ссылку на резюме для передачи во View
  const resumeData = studentData?.resume ? {
    ...studentData.resume,
    fileUrl: studentData.resume.fileUrl ? await getFileUrl(studentData.resume.fileUrl) || null : null
  } : null;

  return (
    <ProfileView 
       user={user}
       studentData={studentData || null}
       resumeData={resumeData}
       majors={allMajors}
       skills={allSkills}
       applications={formattedApps}
    />
  );
}