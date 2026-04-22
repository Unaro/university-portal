import { db } from "@/db";
import { students, applications } from "@/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { Button, StatsCard } from "@/shared/ui";
import {
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Search,
} from "lucide-react";
import { ApplicationWithDetails, StudentDashboardProps } from "../../model/types";
import { ApplicationCard } from "./ApplicationCard";
import { getStatusCounts } from "../../utils";

export async function StudentDashboard({ userId }: StudentDashboardProps) {
  const studentProfile = await db.query.students.findFirst({
    where: eq(students.userId, userId),
    with: { user: true },
  });

  if (!studentProfile) {
    return <div className="p-6 text-center text-muted-foreground">Профиль студента не найден.</div>;
  }

  const myApplications: ApplicationWithDetails[] = await db.query.applications.findMany({
    where: eq(applications.studentId, studentProfile.id),
    with: {
      vacancy: {
        with: { organization: true },
      },
    },
    orderBy: (apps, { desc }) => [desc(apps.createdAt)],
  });

  const stats = { 
    total: myApplications.length, 
    pending: getStatusCounts("pending", myApplications), 
    approved: getStatusCounts("approved", myApplications), 
    rejected: getStatusCounts("rejected", myApplications) 
  };

  return (
    <div className="space-y-6 p-4 max-w-4xl mx-auto print:p-0 print:max-w-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold print:text-xl">Мои заявки</h1>
          <p className="hidden print:block text-sm text-muted-foreground mt-1">
            Студент: <span className="font-semibold text-black">{studentProfile.user?.name || "Имя не указано"}</span>
          </p>
        </div>
        <Button variant="outline" asChild className="print:hidden">
          <Link href="/practices" className="flex items-center gap-2">
            <Search size={16} />
            <span>Искать вакансии</span>
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 print:grid-cols-3">
        <StatsCard icon={<Clock size={18} />} label="На рассмотрении" value={stats.pending} color="text-yellow-600 dark:text-yellow-400" />
        <StatsCard icon={<CheckCircle size={18} />} label="Приглашения" value={stats.approved} color="text-green-600 dark:text-green-400" />
        <StatsCard icon={<XCircle size={18} />} label="Отказы" value={stats.rejected} color="text-red-600 dark:text-red-400" />
      </div>

      {myApplications.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-muted/30 rounded-lg border border-dashed print:border-solid print:border-gray-300">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Заявок пока нет</h3>
          <p className="text-muted-foreground text-center max-w-md mb-4 print:hidden">
            Вы еще не откликались на вакансии. Перейдите в каталог, чтобы найти подходящие варианты.
          </p>
          <Button asChild className="print:hidden">
            <Link href="/practices">Перейти к вакансиям</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 print:block print:space-y-4">
          {myApplications.map((app) => (
            <div key={app.id} className="print:break-inside-avoid">
              <ApplicationCard application={app} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
