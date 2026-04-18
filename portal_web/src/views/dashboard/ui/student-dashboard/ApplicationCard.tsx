import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { deleteApplication } from "@/app/actions/application";
import {
  Building2,
  CalendarDays,
  Briefcase,
  GraduationCap,
  BookOpen,
  Coins,
  Download,
  Undo2,
} from "lucide-react";
import { ApplicationWithDetails } from "../../model/types";
import { formatDate } from "@/shared/utils";

const statusConfig = {
  pending: { label: "На рассмотрении", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200" },
  approved: { label: "Приглашение!", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200" },
  rejected: { label: "Отказ", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-green-200" },
};

const vacanciesConfig = {
  job: { label: "Работа", icon: <Briefcase size={14} /> },
  internship: { label: "Стажировка", icon: <GraduationCap size={14} /> },
  practice: { label: "Практика", icon: <BookOpen size={14} /> },
};

export function ApplicationCard({ application }: { application: ApplicationWithDetails }) {
  const { vacancy, status, responseMessage, createdAt } = application;

  const currentStatus = statusConfig[status] || statusConfig.pending;

  const typeIcon = vacanciesConfig[vacancy.type]?.icon || <BookOpen size={14} />;
  const typeLabel = vacanciesConfig[vacancy.type]?.label || 'Неизвестно';

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
              <CalendarDays size={14} /> {formatDate(createdAt)}
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
        {status === 'approved' ? (
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

        {status === 'pending' && (
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
