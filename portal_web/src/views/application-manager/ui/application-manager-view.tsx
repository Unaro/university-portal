import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ApplicationManager } from "@/widgets/application-manager/ui/application-manager";

interface PageProps {
  searchParams?: {
    status?: string;
  };
}

export async function ApplicationManagerView({ searchParams }: PageProps) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "organization_representative") return <div>Доступ запрещен.</div>;

  const currentStatus = searchParams?.status || "all";

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto bg-slate-50/50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <Link href="/dashboard" className="text-sm text-slate-500 hover:text-blue-600 flex items-center gap-1 mb-2 transition-colors">
            <ArrowLeft size={14} /> Назад в дашборд
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">Управление откликами</h1>
          <p className="text-slate-500 mt-1">Просматривайте кандидатов и принимайте решения</p>
        </div>
      </div>

      <ApplicationManager 
        userId={parseInt(session.user.id)} 
        statusFilter={currentStatus} 
      />
    </div>
  );
}