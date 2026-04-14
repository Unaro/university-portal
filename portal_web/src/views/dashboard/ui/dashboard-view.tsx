// src/views/dashboard/ui/dashboard-view.tsx
import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { StudentDashboard } from "./student-dashboard"; // Мы создадим это
import { PartnerDashboard } from "./partner-dashboard"; // И это
import Link from "next/link";

interface DashboardViewProps {
  searchParams?: {
    filter?: string;
  };
}

export async function DashboardView({ searchParams }: DashboardViewProps) {
  const session = await auth();
  
  if (!session?.user?.id) redirect("/login");

  const userRole = session.user.role;
  const userId = parseInt(session.user.id);
  const filterType = searchParams?.filter || "all";

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl min-h-screen">
      {/* ОБЩИЙ HEADER СТРАНИЦЫ */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-8">
        <div>
           <h1 className="text-3xl font-bold text-foreground">Личный кабинет</h1>
           <p className="text-muted-foreground mt-1">
              Роль: <span className="font-medium text-foreground">
                {userRole === 'organization_representative' ? 'Партнер' :
                 userRole === 'student' ? 'Студент' : 'Сотрудник ВУЗа'}
              </span>
           </p>
        </div>
      </div>

      {/* РОУТИНГ ПО РОЛЯМ */}
      {userRole === "student" && (
        <StudentDashboard userId={userId} filterType={filterType} />
      )}

      {userRole === "organization_representative" && (
        <PartnerDashboard userId={userId} />
      )}

      {userRole === "university_staff" && (
        <div className="space-y-6">
           <div className="p-8 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg flex justify-between items-center">
             <div>
                <h2 className="text-2xl font-bold text-purple-900 dark:text-purple-300 mb-2">Панель управления ВУЗа</h2>
                <p className="text-purple-700 dark:text-purple-400">Управляйте заявками организаций и доступом к порталу.</p>
             </div>
             <Link href="/dashboard/admin">
               <Button size="lg" className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-400">
                 Перейти к модерации
               </Button>
             </Link>
           </div>
        </div>
      )}
    </div>
  );
}