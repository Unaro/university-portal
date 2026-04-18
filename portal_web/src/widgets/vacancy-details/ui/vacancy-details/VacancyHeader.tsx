import { Building2, MapPin } from "lucide-react";
import { Badge } from "@/shared/ui/badge";
import { ApplyButton } from "@/features/apply-vacancy";
import { VacancyDetailsProps } from "../../model/types";
import Image from "next/image";

export function VacancyHeader({ data, isApplied, canApply, isLoggined, isFull }: VacancyDetailsProps) {
  return (
    <div className="bg-muted/50 p-6 md:p-8 border-b">
      <div className="flex flex-col md:flex-row justify-between gap-6 items-start">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground mb-3">{data.title}</h1>

          <div className="flex flex-wrap gap-4 text-muted-foreground mb-6">
             <div className="flex items-center gap-2 font-medium text-primary bg-card px-3 py-1 rounded-full border shadow-sm">
                {data.organization.logoUrl ? (
                    <Image 
                      src={data.organization.logoUrl} 
                      alt="Logo" 
                      width={20} 
                      height={20} 
                      className="object-contain" 
                    />
                ) : (
                    <Building2 className="h-4 w-4" />
                )}
                {data.organization.name}
             </div>
             {data.organization.contacts && (
                <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" /> {data.organization.contacts.split(',')[0]}
                </div>
             )}
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="bg-card border text-sm py-1">
                {data.type === 'job' ? 'Работа' : data.type === 'internship' ? 'Стажировка' : 'Практика'}
            </Badge>
            {data.availableSpots && (
              <Badge variant="secondary" className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 border-blue-100 dark:border-blue-800 text-sm py-1">
                Свободно мест: {data.availableSpots - data.approvedCount} из {data.availableSpots}
              </Badge>
            )}
            {data.skills.map((skill, i) => (
              <Badge key={i} variant="outline" className="bg-transparent text-sm py-1">
                {skill.name}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-start md:items-end gap-4 min-w-[200px]">
          {data.salary && (
              <span className="text-2xl font-bold text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded-lg border border-green-100 dark:border-green-800">
                {data.salary}
              </span>
          )}
          
          {isLoggined && (
            <div className="w-full flex flex-col gap-2">
              <ApplyButton
                vacancyId={data.id}
                isApplied={isApplied}
                disabled={!canApply || isFull}
              />
              {!isApplied && !isFull && !canApply && (
                  <p className="text-xs text-destructive text-center">Заполните профиль для отклика</p>
              )}
              {!isApplied && isFull && (
                  <p className="text-xs text-destructive text-center font-medium">Свободных мест больше нет</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
