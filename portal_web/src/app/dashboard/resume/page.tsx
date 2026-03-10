// src/app/dashboard/resume/page.tsx
import { auth } from "@/auth";
import { db } from "@/db";
import { students } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { ResumeEditView } from "@/views/resume-edit/ui/resume-edit-view"; // Импорт View

export default async function ResumePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const studentProfile = await db.query.students.findFirst({
    where: eq(students.userId, parseInt(session.user.id)),
    with: { 
      resume: true 
    },
  });

  if (!studentProfile) {
    return <div className="p-10 text-center">Профиль не найден. Пожалуйста, сначала заполните данные в профиле.</div>;
  }

  return (
    <ResumeEditView 
      initialBio={studentProfile.resume?.bio || ""}
      existingFile={studentProfile.resume?.fileUrl}
    />
  );
}