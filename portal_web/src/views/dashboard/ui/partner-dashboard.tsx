// src/views/dashboard/ui/partner-dashboard.tsx
import { db } from "@/db";
import { vacancies, organizationRepresentatives } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Clock, CheckCircle, Trash2 } from "lucide-react";
import { deleteVacancy } from "@/app/actions/vacancy";

export async function PartnerDashboard({ userId }: { userId: number }) {
  // 1. Получаем организацию
  const rep = await db.query.organizationRepresentatives.findFirst({
    where: eq(organizationRepresentatives.userId, userId),
    with: { organization: true },
  });
  
  if (!rep) return <div className="p-4 bg-yellow-100 rounded text-yellow-800">Организация не найдена. <Link href="/dashboard/register-org" className="underline">Зарегистрировать</Link></div>;

  const myOrg = rep.organization;

  // 2. Получаем вакансии + статистику
  const myVacancies = await db.query.vacancies.findMany({
    where: eq(vacancies.organizationId, myOrg.id),
    with: {
      applications: { columns: { status: true } }
    },
    orderBy: [desc(vacancies.createdAt)],
  });

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow border">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Вакансии компании &quot;{myOrg.name}&quot;</h2>
          <div className="flex gap-2">
              <Link href="/dashboard/organization"><Button variant="outline" size="icon" title="Настройки">⚙️</Button></Link>
              <Link href="/dashboard/applications"><Button variant="secondary">Посмотреть заявки</Button></Link>
              <Link href="/dashboard/create-vacancy"><Button>+ Добавить вакансию</Button></Link>
          </div>
        </div>

        {myVacancies.length === 0 ? (
          <div className="text-center py-10 text-gray-500 border border-dashed rounded-lg">
            <p>У вас пока нет активных вакансий.</p>
            <p className="text-sm">Создайте первую вакансию, чтобы начать поиск студентов.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {myVacancies.map((vac) => {
              const totalApps = vac.applications.length;
              const newApps = vac.applications.filter(a => a.status === 'pending').length;

              return (
                <div key={vac.id} className="p-4 border rounded bg-slate-50 hover:bg-slate-100 transition">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-lg">{vac.title}</h3>
                        <Badge variant="outline" className="text-xs bg-white">
                          {vac.type === 'job' ? 'Работа' : vac.type === 'internship' ? 'Стажировка' : 'Практика'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-1 mb-3">{vac.description}</p>
                      
                      <div className="flex gap-4 text-sm">
                          <div className="flex items-center gap-1 text-slate-700" title="Всего откликов">
                            <Users size={16} /> <span className="font-medium">{totalApps}</span> кандидатов
                          </div>
                          {newApps > 0 && (
                            <div className="flex items-center gap-1 text-orange-600 font-bold bg-orange-50 px-2 py-0.5 rounded-full text-xs">
                              <Clock size={14} /> <span>{newApps} новых</span>
                            </div>
                          )}
                      </div>
                    </div>
                    
                    <div className="text-right flex flex-col gap-2">
                        <div className="text-sm text-green-600 font-medium flex items-center justify-end gap-1">
                          <CheckCircle size={14} /> Активна
                        </div>
                        <Link href="/dashboard/applications">
                          <Button variant="ghost" size="sm" className="h-8">К заявкам →</Button>
                        </Link>
                        <form
                          action={async () => {
                            "use server";
                            await deleteVacancy(vac.id);
                          }}
                        >
                          <Button variant="ghost" size="sm" className="h-8 w-full text-red-500 hover:text-red-700 hover:bg-red-50 gap-2">
                            <Trash2 size={14} /> Удалить
                          </Button>
                        </form>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}