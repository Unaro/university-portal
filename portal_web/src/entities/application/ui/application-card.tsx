import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Calendar, Mail, FileText, Download } from "lucide-react";
// Типы можно уточнить, но для UI достаточно простых интерфейсов
import { Application, Student, User, Vacancy, Skill, Resume } from "@/shared/types/db";

// Тип для пропсов, объединяющий данные
type ApplicationData = Application & {
  student: Student & {
    user: User;
    major: { name: string } | null;
    skills: { skill: Skill }[];
    resume: Resume | null;
  };
  vacancy: Vacancy;
  resumeLink?: string | null;
};

interface ApplicationCardProps {
  data: ApplicationData;
  actionSlot?: React.ReactNode; // Сюда вставим форму или результат
}

export function ApplicationCard({ data, actionSlot }: ApplicationCardProps) {
  const getInitials = (name: string) => name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow border-slate-200">
      <div className="flex flex-col lg:flex-row">
        
        {/* ЛЕВАЯ ЧАСТЬ: Профиль */}
        <div className="flex-grow p-6 border-b lg:border-b-0 lg:border-r border-slate-100">
          <div className="flex items-start gap-4">
            <Avatar className="w-16 h-16 border-2 border-white shadow-sm">
              <AvatarImage src={data.student.user.image || ""} />
              <AvatarFallback className="bg-blue-100 text-blue-700 text-lg font-bold">
                {getInitials(data.student.user.name || "?")}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-grow">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{data.student.user.name}</h3>
                  <p className="text-slate-500 text-sm flex items-center gap-2 mt-1">
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-medium text-xs">
                      {data.student.course} курс
                    </span>
                    <span>•</span>
                    <span>{data.student.major?.name || "Специальность не указана"}</span>
                  </p>
                </div>
                <div className="text-right">
                   <Badge variant="secondary" className="font-normal text-slate-500 bg-slate-50">
                      На вакансию: <span className="font-semibold text-slate-800 ml-1">{data.vacancy.title}</span>
                   </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                 <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Mail size={14} className="text-slate-400" /> {data.student.user.email}
                 </div>
                 <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Calendar size={14} className="text-slate-400" /> 
                    Отклик: {data.createdAt ? new Date(data.createdAt).toLocaleDateString("ru-RU") : ""}
                 </div>
              </div>

              <div className="mt-5">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Навыки</p>
                {data.student.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                        {data.student.skills.map(s => (
                            <span key={s.skill.id} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                {s.skill.name}
                            </span>
                        ))}
                    </div>
                ) : (
                    <span className="text-sm text-slate-400 italic">Не указаны</span>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                 <div className="flex items-start gap-3">
                    <div className="mt-1 bg-slate-100 p-2 rounded text-slate-400">
                       <FileText size={18} />
                    </div>
                    <div>
                       <p className="text-sm font-medium text-slate-900">Резюме / О себе</p>
                       <p className="text-sm text-slate-500 mt-1 line-clamp-3 italic">
                          {data.student.resume?.bio || "Кандидат не добавил описание."}
                       </p>
                       
                       {data.resumeLink && (
                          <a 
                            href={data.resumeLink} 
                            target="_blank" 
                            className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 mt-3 group"
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
        <div className="lg:w-[350px] bg-slate-50/50 p-6 flex flex-col justify-center">
           {actionSlot}
        </div>

      </div>
    </Card>
  );
}