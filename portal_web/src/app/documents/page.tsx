// src/app/documents/page.tsx
export const dynamic = "force-dynamic";

import { auth } from "@/auth"; // Добавляем auth
import { db } from "@/db";
import { materials } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { getFileUrl } from "@/lib/s3";
import { DocumentsView } from "@/views/documents/ui/documents-view";

export default async function DocumentsPage() {
  const session = await auth();
  const isAdmin = session?.user?.role === "university_staff";

  // Загружаем материалы
  const materialsRaw = await db
    .select()
    .from(materials)
    .where(eq(materials.isPublic, true))
    .orderBy(desc(materials.createdAt));

  const items = await Promise.all(
    materialsRaw.map(async (m) => ({
      ...m,
      downloadUrl: await getFileUrl(m.fileUrl) || "#",
    }))
  );

  return <DocumentsView materials={items} isAdmin={isAdmin} />;
}