// src/views/admin/ui/admin-view.tsx
import { auth } from "@/auth";
import { db } from "@/db";
import { organizations } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { verifyOrganization } from "@/app/actions/admin";
import { getFileUrl } from "@/lib/s3";
import { getAdminStats } from "@/app/actions/stats";

export async function AdminView() {
  const session = await auth();

  if (!session?.user) redirect("/login");
  if (session.user.role !== "university_staff") {
    return <div className="p-10">Доступ запрещен.</div>;
  }

  const stats = await getAdminStats();

  const pendingOrgs = await db.query.organizations.findMany({
    where: eq(organizations.verificationStatus, "pending"),
    with: {
      representatives: { with: { user: true } }
    },
    orderBy: [desc(organizations.createdAt)],
  });

  const orgsWithLogos = await Promise.all(
    pendingOrgs.map(async (org) => {
      let logoUrl = null;
      if (org.logo) {
        logoUrl = await getFileUrl(org.logo);
      }
      return { ...org, logoUrl };
    })
  );

  return (
    <div className="p-10 max-w-6xl mx-auto min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Панель модератора</h1>
        <Link href="/dashboard">
          <Button variant="outline">← Назад</Button>
        </Link>
      </div>

      {/* <div className="mb-6 flex gap-4">
      </div> */}

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm text-gray-500">Студентов</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold">{stats.totalStudents}</div></CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm text-gray-500">Компаний</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold">{stats.totalCompanies}</div></CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm text-gray-500">Заявок</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold">{stats.totalApplications}</div></CardContent>
          </Card>
          <Card className="bg-green-50 border-green-100">
            <CardHeader className="pb-2"><CardTitle className="text-sm text-green-700">Трудоустроено</CardTitle></CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-green-700">{stats.successfulHires}</div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Заявки организаций</h2>
        {orgsWithLogos.length === 0 ? (
          <div className="p-10 bg-gray-50 text-gray-500 rounded border border-dashed text-center">
            Все заявки обработаны.
          </div>
        ) : (
          <div className="grid gap-6">
            {orgsWithLogos.map((org) => (
               <Card key={org.id} className="overflow-hidden">
                  <CardHeader className="bg-gray-50 border-b pb-4">
                      <div className="flex justify-between items-start">
                        <div>
                            <CardTitle>{org.name}</CardTitle>
                            <p className="text-sm text-gray-500 mt-1">ИИН: {org.iin}</p>
                        </div>
                        {org.logoUrl && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={org.logoUrl} alt="Logo" className="w-10 h-10 object-contain" />
                        )}
                      </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                     <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2 text-sm">
                           <p>Контакты: {org.contacts}</p>
                           <p>Представитель: {org.representatives[0]?.user.name} ({org.representatives[0]?.user.email})</p>
                        </div>
                        <div className="flex justify-end gap-3">
                            <form action={async () => { "use server"; await verifyOrganization(org.id, "rejected"); }}>
                               <Button variant="destructive">Отклонить</Button>
                            </form>
                            <form action={async () => { "use server"; await verifyOrganization(org.id, "approved"); }}>
                               <Button className="bg-green-600">Одобрить</Button>
                            </form>
                        </div>
                     </div>
                  </CardContent>
               </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}