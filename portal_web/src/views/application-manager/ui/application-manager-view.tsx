import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ArrowLeft, X } from "lucide-react";
import Link from "next/link";
import { ApplicationManager } from "@/widgets/application-manager/ui/application-manager";
import { db } from "@/db";
import { vacancies } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Button } from "@/shared/ui/button";

interface PageProps {
  searchParams?: {
    status?: string;
    vacancy?: string;
    page?: string;
  };
}

export async function ApplicationManagerView({ searchParams }: PageProps) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "organization_representative") return <div>Доступ запрещен.</div>;

  const currentStatus = searchParams?.status || "all";
  const vacancyId = searchParams?.vacancy ? parseInt(searchParams.vacancy) : undefined;
  const page = searchParams?.page || "1";

  let vacancyTitle = "";
  if (vacancyId) {
    const vacancy = await db.query.vacancies.findFirst({
      where: eq(vacancies.id, vacancyId),
      columns: { title: true }
    });
    if (vacancy) vacancyTitle = vacancy.title;
  }

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto bg-background min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 mb-2 transition-colors">
            <ArrowLeft size={14} /> Назад в дашборд
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Управление откликами</h1>
          {vacancyTitle ? (
             <div className="flex items-center gap-2 mt-1">
                <p className="text-muted-foreground">Отклики на вакансию: <span className="font-semibold text-foreground underline decoration-primary/30 decoration-2 underline-offset-4">{vacancyTitle}</span></p>
                <Link href="/dashboard/applications">
                   <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-destructive hover:bg-destructive/10">
                      <X size={12} /> Сбросить фильтр
                   </Button>
                </Link>
             </div>
          ) : (
            <p className="text-muted-foreground mt-1">Просматривайте кандидатов и принимайте решения</p>
          )}
        </div>
      </div>

      <ApplicationManager 
        userId={parseInt(session.user.id)} 
        statusFilter={currentStatus} 
        vacancyIdFilter={vacancyId}
        page={page}
      />
    </div>
  );
}
