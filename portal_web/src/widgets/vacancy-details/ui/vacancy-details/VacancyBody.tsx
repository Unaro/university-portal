import { 
  FileText, 
  CheckCircle2,
  Calendar
} from "lucide-react";
import { CardContent } from "@/shared/ui/card";
import { Separator } from "@/shared/ui/separator";
import { VacancyDetailsProps } from "../../model/types";

export function VacancyBody({ data }: Pick<VacancyDetailsProps, "data">) {
  const requirementsList = data.requirements 
    ? data.requirements.split('\n').filter(Boolean) 
    : [];

  return (
    <CardContent className="p-6 md:p-8 space-y-8">
      <section>
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-foreground">
          <FileText className="h-5 w-5 text-primary" /> Описание
        </h3>
        <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
          {data.description}
        </p>
      </section>

      <Separator />

      {requirementsList.length > 0 && (
         <section>
          <h3 className="text-xl font-bold mb-4 text-foreground flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" /> Требования и обязанности
          </h3>
          <ul className="space-y-3">
            {requirementsList.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-muted-foreground bg-muted p-3 rounded-lg">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

       <Separator />

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-muted-foreground bg-muted p-5 rounded-xl border">
          <div>
            <p className="font-semibold text-foreground mb-1">Контакты компании:</p>
            <p>{data.organization.contacts || "Не указаны"}</p>
            {data.organization.website && (
                <a href={data.organization.website} className="text-primary hover:underline">
                    {data.organization.website}
                </a>
            )}
          </div>
          <div className="flex flex-col gap-2 md:items-end">
             <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Опубликовано: {data.createdAt ? new Date(data.createdAt).toLocaleDateString("ru-RU") : "Недавно"}
             </div>
          </div>
       </div>
    </CardContent>
  );
}
