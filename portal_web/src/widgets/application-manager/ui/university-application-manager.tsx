// src/widgets/application-manager/ui/university-application-manager.tsx
import { db } from "@/db";
import { applications, vacancies } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { ApplicationCard } from "@/entities/application/ui/application-card";
import { UniversityApplicationResponseForm } from "@/features/manage-application/ui/university-application-response-form";
import { getFileUrl } from "@/lib/s3";
import { CheckCircle2, XCircle, Clock, Briefcase } from "lucide-react";

export async function UniversityApplicationManager() {
  const rawApps = await db.query.applications.findMany({
    where: eq(applications.universityApprovalStatus, "pending"),
    columns: { id: true, status: true, coverLetter: true, responseMessage: true, createdAt: true, universityApprovalStatus: true, universityComment: true, practiceType: true, projectTheme: true },
    with: {
      vacancy: { columns: { title: true, type: true, startDate: true, endDate: true } },
      student: {
        columns: { id: true, course: true, majorId: true },
        with: {
          user: { columns: { name: true, email: true, image: true } },
          major: { columns: { name: true } },
          skills: { with: { skill: { columns: { id: true, name: true } } } },
          resume: { columns: { bio: true, fileUrl: true } },
        },
      },
    },
    orderBy: [desc(applications.createdAt)],
  });

  const practiceApps = rawApps.filter((app) => app.vacancy.type === "practice");

  const filteredApps = await Promise.all(
    practiceApps.map(async (app) => ({
      ...app,
      resumeLink: app.student.resume?.fileUrl ? await getFileUrl(app.student.resume.fileUrl) : null,
    }))
  );

  return (
    <div className="space-y-6 mt-10 print:mt-4 print:space-y-4">
      <h2 className="text-xl font-semibold text-foreground print:text-lg">Заявки студентов на практику (Ожидают одобрения ВУЗа)</h2>
      {filteredApps.length === 0 ? (
        <div className="p-10 bg-muted text-muted-foreground rounded border border-dashed text-center print:border-solid print:p-4 print:text-sm">
          Нет заявок на практику, ожидающих вашего одобрения.
        </div>
      ) : (
        <div className="grid gap-6 print:block print:space-y-4">
          {filteredApps.map((app) => (
            <div key={app.id} className="print:break-inside-avoid">
              <ApplicationCard
                data={app}
                actionSlot={
                  <div className="print:hidden">
                    <UniversityApplicationResponseForm applicationId={app.id} />
                  </div>
                }
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}