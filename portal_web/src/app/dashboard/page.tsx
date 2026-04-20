import { DashboardView } from "@/views/dashboard";

interface PageProps {
  searchParams?: Promise<{ filter?: string }>;
}

export default async function DashboardPage(props: PageProps) {
  return <DashboardView />;
}