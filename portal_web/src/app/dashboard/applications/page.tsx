import { ApplicationManagerView } from "@/views/application-manager/ui/application-manager-view";

interface PageProps {
  searchParams?: Promise<{
    status?: string;
  }>;
}

export default async function ApplicationsPage(props: PageProps) {
  const params = await props.searchParams;
  return <ApplicationManagerView searchParams={params} />;
}