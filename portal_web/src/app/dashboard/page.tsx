import { DashboardView } from "@/views/dashboard/ui/dashboard-view";

interface PageProps {
  searchParams?: Promise<{ filter?: string }>;
}

export default async function DashboardPage(props: PageProps) {
  const params = await props.searchParams;
  return <DashboardView searchParams={params} />;
}