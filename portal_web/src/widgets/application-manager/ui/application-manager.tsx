import { db } from "@/db";
import { applications, organizationRepresentatives } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { ApplicationCard } from "@/entities/application/ui/application-card";
import { ApplicationResponseForm } from "@/features/manage-application/ui/application-response-form";
import { getFileUrl } from "@/lib/s3";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Clock, Briefcase } from "lucide-react";
import Link from "next/link";

interface ApplicationManagerProps {
  userId: number;
  statusFilter: string; // 'all', 'pending', etc.
}

export async function ApplicationManager({ userId, statusFilter }: ApplicationManagerProps) {
  // 1. Находим организацию
  const rep = await db.query.organizationRepresentatives.findFirst({
    where: eq(organizationRepresentatives.userId, userId),
  });

  if (!rep) return <div>Организация не найдена.</div>;

  // 2. Загружаем заявки
  const rawApps = await db.query.applications.findMany({
    with: {
      vacancy: true,
      student: {
        with: {
          user: true,
          resume: true,
          major: true,
          skills: { with: { skill: true } }
        },
      },
    },
    orderBy: [desc(applications.createdAt)],
  });
  
  const myAllApps = rawApps.filter((app) => app.vacancy.organizationId === rep.organizationId);

  // 3. Статистика
  const stats = {
    total: myAllApps.length,
    pending: myAllApps.filter(a => a.status === 'pending').length,
    approved: myAllApps.filter(a => a.status === 'approved').length,
    rejected: myAllApps.filter(a => a.status === 'rejected').length,
  };

  // 4. Фильтрация
  const filteredAppsRaw = myAllApps.filter(app => {
    if (statusFilter === "all") return true;
    return app.status === statusFilter;
  });

  // 5. Ссылки на резюме
  const filteredApps = await Promise.all(
    filteredAppsRaw.map(async (app) => ({
      ...app,
      resumeLink: app.student.resume?.fileUrl ? await getFileUrl(app.student.resume.fileUrl) : null
    }))
  );

  return (
    <div>
      {/* Сводка (Header widget logic part) */}
      <div className="flex gap-4 bg-white p-3 rounded-lg border shadow-sm mb-8 w-fit ml-auto md:ml-0">
           <div className="text-center px-2 border-r"><div className="text-2xl font-bold">{stats.total}</div><div className="text-xs text-slate-500 uppercase">Всего</div></div>
           <div className="text-center px-2 border-r"><div className="text-2xl font-bold text-orange-600">{stats.pending}</div><div className="text-xs text-slate-500 uppercase">Ждут</div></div>
           <div className="text-center px-2"><div className="text-2xl font-bold text-green-600">{stats.approved}</div><div className="text-xs text-slate-500 uppercase">Принято</div></div>
      </div>

      {/* Табы */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <Link href="/dashboard/applications?status=all" scroll={false}><Button variant={statusFilter === 'all' ? 'default' : 'outline'} className="rounded-full h-9">Все</Button></Link>
        <Link href="/dashboard/applications?status=pending" scroll={false}><Button variant={statusFilter === 'pending' ? 'default' : 'outline'} className="rounded-full h-9 gap-2"><Clock size={16}/> На рассмотрении</Button></Link>
        <Link href="/dashboard/applications?status=approved" scroll={false}><Button variant={statusFilter === 'approved' ? 'default' : 'outline'} className="rounded-full h-9 gap-2"><CheckCircle2 size={16}/> Приглашенные</Button></Link>
        <Link href="/dashboard/applications?status=rejected" scroll={false}><Button variant={statusFilter === 'rejected' ? 'default' : 'outline'} className="rounded-full h-9 gap-2"><XCircle size={16}/> Отказы</Button></Link>
      </div>

      {/* Список */}
      {filteredApps.length === 0 ? (
        <div className="text-center py-20 bg-white border border-dashed rounded-xl">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300"><Briefcase size={32} /></div>
          <h3 className="text-lg font-medium text-slate-900">Список пуст</h3>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredApps.map((app) => (
            <ApplicationCard 
              key={app.id} 
              data={app} 
              actionSlot={
                app.status === "pending" ? (
                  <ApplicationResponseForm applicationId={app.id} />
                ) : (
                  <div className="h-full flex flex-col">
                      <div className={`mb-4 flex items-center gap-2 font-bold text-sm px-3 py-2 rounded-md w-fit
                         ${app.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                         {app.status === 'approved' ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                         {app.status === 'approved' ? 'Вы пригласили' : 'Вы отказали'}
                      </div>
                      <div className="flex-grow">
                         <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Ваш ответ:</p>
                         <div className="bg-white border rounded-lg p-3 text-sm text-slate-700 italic relative">
                            <div className="absolute -top-1.5 left-4 w-3 h-3 bg-white border-t border-l transform rotate-45"></div>
                            &ldquo;{app.responseMessage}&rdquo;
                         </div>
                      </div>
                  </div>
                )
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}