// src/app/api/documents/[applicationId]/route.ts
import { auth } from "@/auth";
import { db } from "@/db";
import { applications } from "@/db/schema";
import { eq } from "drizzle-orm";
import { renderToStream } from "@react-pdf/renderer";
import { ReferralPDF } from "@/components/documents/referral-pdf";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  // В Next.js 15/16 params — это Promise!
  { params }: { params: Promise<{ applicationId: string }> }
) {
  const session = await auth();
  if (!session?.user) return new NextResponse("Unauthorized", { status: 401 });

  // 1. 👇 ОБЯЗАТЕЛЬНО делаем await перед использованием
  const { applicationId } = await params;
  const appId = parseInt(applicationId);

  if (isNaN(appId)) {
    return new NextResponse("Invalid ID", { status: 400 });
  }

  // 2. Получаем данные заявки
  const application = await db.query.applications.findFirst({
    where: eq(applications.id, appId),
    with: {
      student: { with: { user: true } },
      vacancy: { with: { organization: true } },
    },
  });

  if (!application) return new NextResponse("Not found", { status: 404 });

  // 3. Проверка прав
  const isOwnerStudent = application.student.userId === parseInt(session.user.id);
  if (!isOwnerStudent && session.user.role !== "university_staff") {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const docNumber = `${appId}/${new Date().getFullYear()}`;

  // 4. Рендерим PDF
  // Используем JSX синтаксис (<ReferralPDF />) — это стандарт для react-pdf
  const stream = await renderToStream(
    <ReferralPDF
      studentName={application.student.user.name || "Студент"}
      group={application.student.group || ""}
      companyName={application.vacancy.organization.name}
      vacancyTitle={application.vacancy.title}
      date={new Date()}
      documentNumber={docNumber}
    />
  );

  return new NextResponse(stream as unknown as ReadableStream, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="referral-${appId}.pdf"`,
    },
  });
}