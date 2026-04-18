// src/entities/application/ui/application-card.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Badge } from "@/shared/ui/badge";
import { Card } from "@/shared/ui/card";
import { Calendar, Mail, FileText, Download } from "lucide-react";

type ApplicationData = {
  id: number;
  status: "pending" | "approved" | "rejected";
  practiceType?: "educational" | "production" | "pre_diploma" | null;
  projectTheme?: string | null;
  coverLetter: string | null;
  responseMessage: string | null;
  createdAt: Date | null;
  student: {
    id: number;
    course: number | null;
    user: { name: string | null; email: string; image: string | null };
    major: { name: string } | null;
    skills: { skill: { id: number; name: string } }[];
    resume: { bio: string | null; fileUrl: string | null } | null;
  };
  vacancy: { title: string; type: "practice" | "internship" | "job" };
  resumeLink?: string | null;
};

interface ApplicationCardProps {
  data: ApplicationData;
  actionSlot?: React.ReactNode;
}

const practiceTypeMap = {
  educational: "Учебная практика",
  production: "Производственная практика",
  pre_diploma: "Преддипломная практика",
};

export function ApplicationCard({ data, actionSlot }: ApplicationCardProps) {
  const getInitials = (name: string) => name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <Card className="overflow-hidden flex flex-col lg:flex-row">
      {/* ЛЕВАЯ ЧАСТЬ: Профиль */}
      <div className="flex-grow p-6 border-b lg:border-b-0 lg:border-r">
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
                <Badge variant="secondary" className="font-normal text-muted-foreground bg-muted mb-2 inline-block">
                  На вакансию: <span className="font-semibold text-foreground ml-1">{data.vacancy.title}</span>
                </Badge>
                {data.vacancy.type === "practice" && data.practiceType && (
                  <div className="text-xs text-muted-foreground">
                    Тип: <span className="font-semibold">{practiceTypeMap[data.practiceType]}</span>
                  </div>
                )}
              </div>
            </div>

            {data.vacancy.type === "practice" && data.projectTheme && (
              <div className="mt-3 bg-muted/50 p-3 rounded-md text-sm border border-border/50">
                <span className="font-semibold block mb-1">Тема проекта:</span>
                <span className="italic text-muted-foreground">{data.projectTheme}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail size={14} className="text-muted-foreground/60" /> {data.student.user.email}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar size={14} className="text-muted-foreground/60" />
                Отклик: {data.createdAt ? new Date(data.createdAt).toLocaleDateString("ru-RU") : ""}
              </div>
            </div>

            <div className="mt-5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Навыки</p>
              {data.student.skills.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {data.student.skills.map((s) => (
                    <span key={s.skill.id} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary border">
                      {s.skill.name}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-sm text-muted-foreground italic">Не указаны</span>
              )}
            </div>

            <div className="mt-6 pt-4 border-t">
              <div className="flex items-start gap-3">
                <div className="mt-1 bg-muted p-2 rounded text-muted-foreground">
                  <FileText size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Резюме / О себе</p>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-3 italic">
                    {data.student.resume?.bio || "Кандидат не добавил описание."}
                  </p>

                  {data.resumeLink && (
                    <a
                      href={data.resumeLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 mt-3 group"
                    >
                      <Download size={16} className="group-hover:translate-y-0.5 transition-transform" />
                      Скачать полный PDF
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ПРАВАЯ ЧАСТЬ: Слот для действий */}
      <div className="lg:w-[350px] bg-muted/50 p-6 flex flex-col justify-center">
        {actionSlot}
      </div>
    </Card>
  );
}