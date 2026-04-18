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
    <div className="space-y-6 p-4 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Мои заявки</h1>
        <Button variant="outline" asChild>
          <Link href="/practices" className="flex items-center gap-2">
            <Search size={16} />
            <span>Искать вакансии</span>
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard icon={<Clock size={18} />} label="На рассмотрении" value={stats.pending} color="text-yellow-600 dark:text-yellow-400" />
        <StatsCard icon={<CheckCircle size={18} />} label="Приглашения" value={stats.approved} color="text-green-600 dark:text-green-400" />
        <StatsCard icon={<XCircle size={18} />} label="Отказы" value={stats.rejected} color="text-red-600 dark:text-red-400" />
      </div>

      {myApplications.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-muted/30 rounded-lg border border-dashed">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Заявок пока нет</h3>
          <p className="text-muted-foreground text-center max-w-md mb-4">
            Вы еще не откликались на вакансии. Перейдите в каталог, чтобы найти подходящие варианты.
          </p>
          <Button asChild>
            <Link href="/practices">Перейти к вакансиям</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {myApplications.map((app) => (
            <ApplicationCard key={app.id} application={app} />
          ))}
        </div>
      )}
    </div>
  );
}
