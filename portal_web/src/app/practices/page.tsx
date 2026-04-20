import { auth } from "@/auth";
import { PracticesView } from "@/views/practices/ui/practices-view";

interface PageProps {
  searchParams: Promise<{
    search?: string;
    type?: string;
    course?: string;
    page?: string;
    onlyMyMajor?: string;
    dateFrom?: string;
    dateTo?: string;
  }>;
}

export default async function PracticesPage(props: PageProps) {
  const session = await auth();
  const params = await props.searchParams;
  const isStudent = session?.user?.role === "student";

  return <PracticesView searchParams={params} isStudent={isStudent} />;
}