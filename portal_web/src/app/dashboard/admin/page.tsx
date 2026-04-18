import { auth } from "@/auth";
import { AdminView } from "@/views/admin/ui/admin-view";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user) redirect("/login");
  if (!(session.user.role === "university_staff" || session.user.role === "admin")) {
    return <div className="p-10">Доступ запрещен.</div>;
  }
    
  return <AdminView />;
}