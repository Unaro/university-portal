// src/features/organization-search/ui/organization-search.tsx
"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function OrganizationSearch() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("search", term);
    } else {
      params.delete("search");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  const currentSearch = searchParams.get("search")?.toString();

  return (
    <div className="relative w-full md:w-[400px] flex items-center">
      <Search className="absolute left-3 h-4 w-4 text-muted-foreground z-10 pointer-events-none" />
      <Input
        placeholder="Поиск компании или отрасли..."
        className="bg-white w-full pl-10 h-11 text-base shadow-sm"
        defaultValue={currentSearch}
        onChange={(e) => handleSearch(e.target.value)}
      />
      {currentSearch && (
        <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-1 h-8 w-8 hover:bg-transparent"
            onClick={() => handleSearch("")}
        >
            <X className="h-4 w-4 text-muted-foreground hover:text-primary" />
        </Button>
      )}
    </div>
  );
}