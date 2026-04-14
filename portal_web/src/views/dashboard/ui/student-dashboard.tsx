// src/views/dashboard/ui/student-dashboard.tsx
import { db } from "@/db";
import { students, applications, vacancies, organizations } from "@/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Building2,
  CalendarDays,
  Briefcase,
  GraduationCap,
  BookOpen,
  Coins,
  Download,
  Search,
  Undo2,
} from "lucide-react";
import { deleteApplication } from "@/app/actions/application";
import { ReactNode } from "react";

export const dynamic = 'force-dynamic';

type ApplicationWithDetails = typeof applications.$inferSelect & {
  vacancy: typeof vacancies.$inferSelect & {
    organization: typeof organizations.$inferSelect;
  };
};

interface StudentDashboardProps {
  userId: number;
}

export async function StudentDashboard({ userId }: StudentDashboardProps) {
  const studentProfile = await db.query.students.findFirst({
    where: eq(students.userId, userId),
  });

  if (!studentProfile) {
    return <div className="p-6 text-center text-muted-foreground">Профиль студента не найден.</div>;
  }

  // Загружаем заявки с вложенными данными о вакансии и компании
  const myApplications: ApplicationWithDetails[] = await db.query.applications.findMany({
    where: eq(applications.studentId, studentProfile.id),
    with: {
      vacancy: {
        with: { organization: true },
      },
    },
    orderBy: (apps, { desc }) => [desc(apps.createdAt)],
  });

  const stats = { total: myApplications.length, pending: 0, approved: 0, rejected: 0 };
  myApplications.forEach(app => {
    const status = app.status.trim();
    if (status === 'pending') stats.pending++;
    if (status === 'approved') stats.approved++;
    if (status === 'rejected') stats.rejected++;
  });

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

      {/* СТАТИСТИКА */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard icon={<Clock size={18} />} label="На рассмотрении" value={stats.pending} color="text-yellow-600 dark:text-yellow-400" />
        <StatsCard icon={<CheckCircle size={18} />} label="Приглашения" value={stats.approved} color="text-green-600 dark:text-green-400" />
        <StatsCard icon={<XCircle size={18} />} label="Отказы" value={stats.rejected} color="text-red-600 dark:text-red-400" />
      </div>

      {/* СПИСОК ЗАЯВОК */}
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

// --- ВСПОМОГАТЕЛЬНЫЕ КОМПОНЕНТЫ ---
interface StatsCardProps {
  icon: ReactNode;
  label: string;
  value: number;
  color?: string;
}

function StatsCard({ icon, label, value, color = "text-foreground" }: StatsCardProps) {
  return (
    <div className="bg-card border rounded-lg p-4 flex items-center gap-4">
      <div className={`p-2 rounded-full bg-muted ${color}`}>{icon}</div>
      <div>
        <div className={`text-2xl font-bold ${color}`}>{value}</div>
        <div className="text-sm text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}

function ApplicationCard({ application }: { application: ApplicationWithDetails }) {
  const { vacancy, status, responseMessage, createdAt } = application;
  const rawStatus = status.trim();

  const statusConfig = {
    pending: { label: "На рассмотрении", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200" },
    approved: { label: "Приглашение!", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200" },
    rejected: { label: "Отказ", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200" },
  };
  const currentStatus = statusConfig[rawStatus as keyof typeof statusConfig] || statusConfig.pending;

  // Иконка типа вакансии
  const typeIcon = vacancy.type === 'job' ? <Briefcase size={14} /> : vacancy.type === 'internship' ? <GraduationCap size={14} /> : <BookOpen size={14} />;
  const typeLabel = vacancy.type === 'job' ? 'Работа' : vacancy.type === 'internship' ? 'Стажировка' : 'Практика';

  return (
    <div className="bg-card border rounded-lg p-5 hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3">
        <div>
          <h3 className="text-lg font-semibold text-foreground">{vacancy.title}</h3>
          <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Building2 size={14} /> {vacancy.organization.name}
            </span>
            <span className="flex items-center gap-1.5">
              <CalendarDays size={14} /> {createdAt ? new Date(createdAt).toLocaleDateString("ru-RU") : "Недавно"}
            </span>
          </div>
        </div>
        <Badge className={`${currentStatus.color} border`}>{currentStatus.label}</Badge>
      </div>

      <div className="flex flex-wrap items-center gap-4 mb-3 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5 bg-secondary px-2 py-0.5 rounded text-xs font-medium">
          {typeIcon} {typeLabel}
        </span>
        {vacancy.salary && (
          <span className="flex items-center gap-1.5">
            <Coins size={14} /> {vacancy.salary}
          </span>
        )}
      </div>

      {responseMessage && (
        <div className="bg-muted/50 border-l-4 border-primary p-3 rounded-r mb-4">
          <p className="text-sm italic text-muted-foreground">&quot;{responseMessage}&quot;</p>
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t mt-2">
        {rawStatus === 'approved' ? (
          <a 
            href={`/api/documents/${application.id}`} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-sm font-medium text-primary hover:underline flex items-center gap-1.5"
          >
            <Download size={14} /> Скачать направление
          </a>
        ) : (
          <span className="text-xs text-muted-foreground">Сопроводительное письмо отправлено</span>
        )}

        {rawStatus === 'pending' && (
          <form action={async () => { "use server"; await deleteApplication(application.id); }}>
            <Button variant="outline" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10 flex items-center gap-1.5">
              <Undo2 size={14} /> Отозвать заявку
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}