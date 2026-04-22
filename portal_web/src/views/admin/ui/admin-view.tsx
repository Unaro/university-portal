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
    <div className="p-10 max-w-6xl mx-auto min-h-screen print:p-0 print:min-h-0">
      <div className="flex justify-between items-center mb-6 print:mb-4">
        <h1 className="text-3xl font-bold print:text-2xl">Панель модератора</h1>
        <div className="print:hidden">
          <BackButton variant="outline" label="Назад" />
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 print:mb-6">
          <StatsCard variant="mini" label="Студентов" value={stats.totalStudents}/>
          <StatsCard variant="mini" label="Компаний" value={stats.totalCompanies}/>
          <StatsCard variant="mini" label="Заявок" value={stats.totalApplications}/>
          <StatsCard variant="mini" color="text-green-700 dark:text-green-400" className="bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800" label="Трудоустроено" value={stats.successfulHires}/>
        </div>
      )}

      <div className="space-y-6 print:space-y-4">
        <h2 className="text-xl font-semibold text-foreground print:text-lg">Заявки организаций</h2>
        {orgsWithLogos.length === 0 ? (
          <div className="p-10 bg-muted text-muted-foreground rounded border border-dashed text-center print:border-solid print:p-4">
            Все заявки обработаны.
          </div>
        ) : (
          <div className="grid gap-6 print:block print:space-y-4">
            {orgsWithLogos.map((org) => (
               <Card key={org.id} className="print:shadow-none print:border-gray-200 print:break-inside-avoid">
                  <CardHeader className="bg-muted border-b pb-4 print:bg-transparent print:p-3">
                      <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="print:text-base">{org.name}</CardTitle>
                            <p className="text-sm text-muted-foreground mt-1 print:text-xs">ИИН: {org.iin}</p>
                        </div>
                        {org.logoUrl && (
                            <Image 
                              src={org.logoUrl} 
                              alt="Logo" 
                              width={40} 
                              height={40} 
                              unoptimized
                              className="object-contain print:w-8 print:h-8" 
                            />
                        )}
                      </div>
                  </CardHeader>
                  <CardContent className="pt-6 print:pt-3 print:pb-3">
                     <div className="grid md:grid-cols-2 gap-6 print:grid-cols-1 print:gap-2">
                        <div className="space-y-2 text-sm print:text-xs print:space-y-1">
                           <p>Контакты: {org.contacts}</p>
                           <p>Представитель: {org.representatives[0]?.user.name} ({org.representatives[0]?.user.email})</p>
                        </div>
                        <div className="flex justify-end gap-3 print:hidden">
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

      <div className="mt-8 print:mt-6">
        <UniversityApplicationManager />
      </div>
    </div>
  );
}