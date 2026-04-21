import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { X } from "lucide-react";
import Link from "next/link";
import { ApplicationManager } from "@/widgets/application-manager/ui/application-manager";
import { db } from "@/db";
import { vacancies } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Button, BackButton } from "@/shared/ui";

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
    <div className="p-6 md:p-10 max-w-7xl mx-auto bg-background min-h-screen print:p-0 print:min-h-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 print:mb-4">
        <div>
          <div className="print:hidden">
            <BackButton 
              label="Назад в дашборд" 
              variant="link" 
              className="text-sm text-muted-foreground hover:text-primary p-0 h-auto mb-2 transition-colors" 
            />
          </div>
          <h1 className="text-3xl font-bold text-foreground print:text-2xl">Управление откликами</h1>
          {vacancyTitle ? (
             <div className="flex items-center gap-2 mt-1">
                <p className="text-muted-foreground print:text-sm">Отклики на вакансию: <span className="font-semibold text-foreground underline decoration-primary/30 decoration-2 underline-offset-4">{vacancyTitle}</span></p>
                <div className="print:hidden">
                  <Link href="/dashboard/applications">
                     <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-destructive hover:bg-destructive/10">
                        <X size={12} /> Сбросить фильтр
                     </Button>
                  </Link>
                </div>
             </div>
          ) : (
            <p className="text-muted-foreground mt-1 print:text-sm">Просматривайте кандидатов и принимайте решения</p>
          )}
        </div>
      </div>

      <div className="print:mt-4">
        <ApplicationManager 
          userId={parseInt(session.user.id)} 
          statusFilter={currentStatus} 
          vacancyIdFilter={vacancyId}
          page={page}
        />
      </div>
    </div>
  );
}
