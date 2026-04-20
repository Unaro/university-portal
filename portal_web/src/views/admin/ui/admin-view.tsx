// src/views/admin/ui/admin-view.tsx
import { db } from "@/db";
import { organizations } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import Link from "next/link";
import { verifyOrganization } from "@/app/actions/admin";
import { getFileUrl } from "@/lib/s3";
import { getAdminStats } from "@/app/actions/stats";
import Image from "next/image";
import { StatsCard, BackButton } from "@/shared/ui";
import { UniversityApplicationManager } from "@/widgets/application-manager/ui/university-application-manager";

export async function AdminView() {
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
        <BackButton variant="outline" label="Назад" />
      </div>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <StatsCard variant="mini" label="Студентов" value={stats.totalStudents}/>
          <StatsCard variant="mini" label="Компаний" value={stats.totalCompanies}/>
          <StatsCard variant="mini" label="Заявок" value={stats.totalApplications}/>
          <StatsCard variant="mini" color="text-green-700 dark:text-green-400" className="bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800" label="Трудоустроено" value={stats.successfulHires}/>
        </div>
      )}

      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-foreground">Заявки организаций</h2>
        {orgsWithLogos.length === 0 ? (
          <div className="p-10 bg-muted text-muted-foreground rounded border border-dashed text-center">
            Все заявки обработаны.
          </div>
        ) : (
          <div className="grid gap-6">
            {orgsWithLogos.map((org) => (
               <Card key={org.id}>
                  <CardHeader className="bg-muted border-b pb-4">
                      <div className="flex justify-between items-start">
                        <div>
                            <CardTitle>{org.name}</CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">ИИН: {org.iin}</p>
                        </div>
                        {org.logoUrl && (
                            <Image 
                              src={org.logoUrl} 
                              alt="Logo" 
                              width={40} 
                              height={40} 
                              className="object-contain" 
                            />
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
                               <Button className="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-400">Одобрить</Button>
                            </form>
                        </div>
                     </div>
                  </CardContent>
               </Card>
            ))}
          </div>
        )}
      </div>

      <UniversityApplicationManager />
    </div>
  );
}