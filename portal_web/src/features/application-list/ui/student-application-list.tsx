// src/features/application-list/ui/student-application-list.tsx
import { Badge } from "@/components/ui/badge";
import { Briefcase } from "lucide-react";
import { ApplicationStatus } from "@/shared/types/db";


export interface ApplicationUiItem {
  id: number;
  vacancyTitle: string;
  companyName: string;
  date: Date | null;
  status: ApplicationStatus | string; 
}

export function StudentApplicationList({ applications }: { applications: ApplicationUiItem[] }) {
  if (applications.length === 0) {
    return <div className="text-center text-muted-foreground py-8">История откликов пуста.</div>;
  }

  return (
    <div className="space-y-4">
      {applications.map((app) => (
        <div key={app.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg hover:shadow-sm transition-shadow gap-4 bg-white">
          <div>
            <h4 className="font-bold text-lg">{app.vacancyTitle}</h4>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <Briefcase className="h-3 w-3" /> {app.companyName}
              <span>•</span>
              <span>{app.date ? new Date(app.date).toLocaleDateString("ru-RU") : "Недавно"}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
             {app.status === "approved" && <Badge className="bg-green-600 hover:bg-green-700">Приглашение</Badge>}
             {app.status === "rejected" && <Badge variant="destructive">Отказ</Badge>}
             {app.status === "pending" && <Badge variant="secondary">На рассмотрении</Badge>}
          </div>
        </div>
      ))}
    </div>
  );
}