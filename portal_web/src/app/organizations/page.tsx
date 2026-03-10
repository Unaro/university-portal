// src/app/organizations/page.tsx
import { OrganizationsView } from "@/views/organizations/ui/organizations-view";

interface PageProps {
  searchParams: Promise<{
    search?: string;
  }>;
}

export default async function OrganizationsPage(props: PageProps) {
  const params = await props.searchParams;
  return <OrganizationsView searchParams={params} />;
}