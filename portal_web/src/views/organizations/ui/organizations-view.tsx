// src/views/organizations/ui/organizations-view.tsx
import { OrganizationSearch } from "@/features/organization-search/ui/organization-search";
import { OrganizationList } from "@/widgets/organization-list/ui/organization-list";

interface OrganizationsViewProps {
  searchParams: {
    search?: string;
  };
}

export function OrganizationsView({ searchParams }: OrganizationsViewProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        {/* HEADER СТРАНИЦЫ */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-10">
          <div>
             <h1 className="text-3xl font-bold text-primary mb-2">Каталог партнеров</h1>
             <p className="text-muted-foreground text-lg">
               Проверенные компании для вашей карьеры
             </p>
          </div>

          {/* ПОИСК (Feature) */}
          <OrganizationSearch />
        </div>

        {/* СПИСОК (Widget) */}
        <OrganizationList searchQuery={searchParams.search} />
      </div>
    </div>
  );
}