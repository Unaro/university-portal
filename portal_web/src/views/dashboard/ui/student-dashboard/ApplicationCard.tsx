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

const practiceTypeMap = {
  educational: "Учебная",
  production: "Производственная",
  pre_diploma: "Преддипломная",
};

export function ApplicationCard({ application }: { application: ApplicationWithDetails }) {
  const { vacancy, status, universityApprovalStatus, practiceType, projectTheme, responseMessage, createdAt } = application;

  const currentStatus = statusConfig[status] || statusConfig.pending;

  const typeIcon = vacanciesConfig[vacancy.type]?.icon || <BookOpen size={14} />;
  const typeLabel = vacanciesConfig[vacancy.type]?.label || 'Неизвестно';

  const isPractice = vacancy.type === 'practice';
  let displayStatus = currentStatus;
  
  if (isPractice && status === 'pending') {
    if (universityApprovalStatus === 'pending') {
       displayStatus = { label: "Ожидает одобрения ВУЗа", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200" };
    } else if (universityApprovalStatus === 'rejected') {
       displayStatus = { label: "Отклонено ВУЗом", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200" };
    }
  }

  return (
    <div className="bg-card border rounded-lg p-5 hover:shadow-md transition-shadow print:shadow-none print:border-b print:border-gray-300 print:border-x-0 print:border-t-0 print:rounded-none print:p-0 print:py-4 print:mb-4">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3 print:flex-row print:mb-2">
        <div>
          <h3 className="text-lg font-semibold text-foreground print:text-black">{vacancy.title}</h3>
          <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-muted-foreground print:text-black">
            <span className="flex items-center gap-1.5">
              <Building2 size={14} className="print:hidden" /> {vacancy.organization.name}
            </span>
            <span className="flex items-center gap-1.5">
              <CalendarDays size={14} className="print:hidden" /> {formatDate(createdAt)}
            </span>
          </div>
        </div>
        <Badge className={`${displayStatus.color} border print:bg-transparent print:border-none print:text-black print:p-0 print:font-bold`}>
          {displayStatus.label}
        </Badge>
      </div>

      <div className="flex flex-wrap items-center gap-4 mb-3 text-sm text-muted-foreground print:text-black print:mb-2">
        <span className="flex items-center gap-1.5 bg-secondary px-2 py-0.5 rounded text-xs font-medium print:bg-transparent print:p-0 print:text-black">
          <span className="print:hidden">{typeIcon}</span> {typeLabel}
          {isPractice && practiceType && ` (${practiceTypeMap[practiceType]})`}
        </span>
        {vacancy.salary && (
          <span className="flex items-center gap-1.5">
            <Coins size={14} className="print:hidden" /> {vacancy.salary}
          </span>
        )}
      </div>

      {isPractice && projectTheme && (
        <div className="mb-4 text-sm bg-muted/30 p-2 rounded border border-border/50 print:bg-transparent print:border-none print:p-0 print:mb-2">
          <span className="text-muted-foreground print:text-black">Тема проекта: </span>
          <span className="font-medium text-foreground print:text-black">{projectTheme}</span>
        </div>
      )}

      {responseMessage && (
        <div className="bg-muted/50 border-l-4 border-primary p-3 rounded-r mb-4 print:bg-transparent print:border-none print:p-0 print:mb-2">
          <p className="text-sm italic text-muted-foreground print:text-black"><span className="print:font-bold print:not-italic print:mr-1 print:hidden">Ответ:</span>&quot;{responseMessage}&quot;</p>
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t mt-2 print:hidden">
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
