// src/app/dashboard/organization/page.tsx
import { auth } from "@/auth";
import { db } from "@/db";
import { organizationRepresentatives } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { OrgSettingsView } from "@/views/organization-settings/ui/org-settings-view";

export default async function OrgSettingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const rep = await db.query.organizationRepresentatives.findFirst({
    where: eq(organizationRepresentatives.userId, parseInt(session.user.id)),
    with: { organization: true },
  });

  if (!rep) return <div className="p-10 text-center">Организация не найдена</div>;

  return <OrgSettingsView initialData={rep.organization} />;
}