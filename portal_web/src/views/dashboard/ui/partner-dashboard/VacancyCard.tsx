import Link from "next/link";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Users, Clock, CheckCircle, Trash2, Eye, EyeOff } from "lucide-react";
import { deleteVacancy, toggleVacancyStatus } from "@/app/actions/vacancy";
import { VacancyWithApplications } from "../../model/types";
import { getStatusCounts } from "../../utils";

interface VacancyCardProps {
  vacancy: VacancyWithApplications;
}

export function VacancyCard({ vacancy }: VacancyCardProps) {
  const isPractice = vacancy.type === "practice";

  // Те, что партнер может видеть (уже одобрено ВУЗом или не практика)
  const visibleApps = vacancy.applications.filter(a => 
    !isPractice || a.universityApprovalStatus === "approved"
  );

  // Те, что висят на модерации в ВУЗе (только для практик)
  const universityPending = isPractice 
    ? vacancy.applications.filter(a => a.universityApprovalStatus === "pending").length
    : 0;

  const total = visibleApps.length;
  const pending = visibleApps.filter(a => a.status === "pending").length;
  const approved = visibleApps.filter(a => a.status === "approved").length;

  const isFull = vacancy.availableSpots ? approved >= vacancy.availableSpots : false;

  return (
    <div className={`p-5 border rounded-lg bg-card hover:shadow-md transition ${!vacancy.isActive ? "opacity-60" : ""}`}>
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-lg">{vacancy.title}</h3>
            <Badge variant="outline" className="text-xs bg-muted">
              {vacancy.type === "job" ? "Работа" : vacancy.type === "internship" ? "Стажировка" : "Практика"}
            </Badge>
            {!vacancy.isActive && <Badge variant="destructive" className="text-xs">Скрыта</Badge>}
            {isFull && <Badge variant="destructive" className="text-xs">Набор закрыт</Badge>}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{vacancy.description}</p>

          <div className="flex flex-wrap gap-3 text-sm">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Users size={15} /> <span className="font-medium">{total}</span> активных заявок
            </div>
            
            {vacancy.availableSpots && (
              <div className={`flex items-center gap-1.5 font-medium px-2 py-0.5 rounded-full text-xs ${isFull ? "bg-red-50 text-red-600 dark:bg-red-900/20" : "bg-blue-50 text-blue-600 dark:bg-blue-900/20"}`}>
                Места: {approved} / {vacancy.availableSpots}
              </div>
            )}

            {pending > 0 && (
              <div className="flex items-center gap-1.5 text-yellow-600 dark:text-yellow-400 font-medium bg-yellow-50 dark:bg-yellow-900/20 px-2 py-0.5 rounded-full text-xs">
                <Clock size={14} /> {pending} новых
              </div>
            )}

            {universityPending > 0 && (
              <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-medium bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-full text-xs border border-blue-100 dark:border-blue-800">
                <Clock size={14} /> {universityPending} на модерации ВУЗа
              </div>
            )}

            {approved > 0 && (
              <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400 font-medium bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full text-xs">
                <CheckCircle size={14} /> {approved} приглашено
              </div>
            )}
          </div>
        </div>

        <div className="flex sm:flex-col gap-2 sm:items-end min-w-[140px]">
          <Button variant="secondary" size="sm" asChild className="w-full">
            <Link href={`/dashboard/applications?vacancy=${vacancy.id}`}>К заявкам →</Link>
          </Button>
          
          <form action={async () => { "use server"; await toggleVacancyStatus(vacancy.id); }} className="w-full">
            <Button variant="outline" size="sm" className="w-full gap-2">
              {vacancy.isActive ? <><EyeOff size={14} /> Скрыть</> : <><Eye size={14} /> Опубликовать</>}
            </Button>
          </form>

          <form action={async () => { "use server"; await deleteVacancy(vacancy.id); }} className="w-full">
            <Button variant="ghost" size="sm" className="w-full text-destructive hover:bg-destructive/10 gap-2">
              <Trash2 size={14} /> Удалить
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
