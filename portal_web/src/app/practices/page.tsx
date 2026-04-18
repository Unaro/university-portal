// src/app/practices/page.tsx

export const dynamic = "force-dynamic";

import { PracticesView } from "@/views/practices/ui/practices-view";

interface PageProps {
  searchParams: Promise<{
    search?: string;
    type?: string;
    course?: string;
    page?: string;
  }>;
}

export default async function PracticesPage(props: PageProps) {
  const params = await props.searchParams;
  return <PracticesView searchParams={params} />;
}