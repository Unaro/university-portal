import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Badge } from "@/shared/ui/badge";
import { Mail, Calendar } from "lucide-react";
import { ApplicationData } from "../../model/types";

interface ProfileSectionProps {
  data: ApplicationData;
}

export function ProfileSection({ data }: ProfileSectionProps) {
  const getInitials = (name: string) => name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="flex items-start gap-4">
      <Avatar className="w-16 h-16 border-2 border-card shadow-sm">
        <AvatarImage src={data.student.user.image || ""} />
        <AvatarFallback className="bg-primary/10 text-primary text-lg font-bold">
          {getInitials(data.student.user.name || "?")}
        </AvatarFallback>
      </Avatar>

      <div className="flex-grow">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div>
            <h3 className="text-xl font-bold text-foreground">{data.student.user.name}</h3>
            <p className="text-muted-foreground text-sm flex items-center gap-2 mt-1">
              <span className="bg-muted px-2 py-0.5 rounded text-foreground font-medium text-xs">
                {data.student.course} курс
              </span>
              <span>•</span>
              <span>{data.student.major?.name || "Специальность не указана"}</span>
            </p>
          </div>
          <div className="text-right">
            <Badge variant="secondary" className="font-normal text-muted-foreground bg-muted">
              На вакансию: <span className="font-semibold text-foreground ml-1">{data.vacancy.title}</span>
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail size={14} className="text-muted-foreground/60" /> {data.student.user.email}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar size={14} className="text-muted-foreground/60" />
            Отклик: {data.createdAt ? new Date(data.createdAt).toLocaleDateString("ru-RU") : ""}
          </div>
        </div>
      </div>
    </div>
  );
}
