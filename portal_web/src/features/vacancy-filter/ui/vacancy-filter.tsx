// src/features/vacancy-filter/ui/vacancy-filter.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { useTransition } from "react";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { Checkbox } from "@/shared/ui/checkbox";
import { Label } from "@/shared/ui/label";
import { Card } from "@/shared/ui/card";
import { Separator } from "@/shared/ui/separator";
import { Search, Filter, Loader2 } from "lucide-react";

interface VacancyFilterProps {
  isStudent?: boolean;
}

export function VacancyFilter({ isStudent }: VacancyFilterProps) {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const [isPending, startTransition] = useTransition();

  // 1. Обработка поиска
  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) params.set("search", term);
    else params.delete("search");
    
    params.delete("page");
    
    startTransition(() => {
        replace(`?${params.toString()}`, { scroll: false });
    });
  }, 300);

  // 2. Обработка чекбоксов
  const handleFilter = (key: string, value: string, checked: boolean) => {
    const params = new URLSearchParams(searchParams);
    const current = params.get(key)?.split(",") || [];

    let updated: string[];
    if (checked) {
        updated = [...current, value];
    } else {
        updated = current.filter(v => v !== value);
    }

    if (updated.length > 0) {
        params.set(key, updated.join(","));
    } else {
        params.delete(key);
    }

    params.delete("page");
    
    startTransition(() => {
        replace(`?${params.toString()}`, { scroll: false });
    });
  };

  const resetFilters = () => {
    startTransition(() => {
        replace("?");
    });
  };

  const isChecked = (key: string, value: string) => {
      const val = searchParams.get(key);
      return val?.split(",").includes(value) || false;
  };

  return (
    <div className={`space-y-6 transition-opacity duration-200 ${isPending ? "opacity-70 pointer-events-none" : ""}`}>
      {/* ПОИСК */}
      <div className="relative">
        {isPending ? (
          <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary animate-spin" />
        ) : (
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        )}
        <Input
          placeholder="Поиск по названию..."
          className="pl-10 bg-card transition-all focus:ring-primary/20"
          defaultValue={searchParams.get("search")?.toString()}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      {/* САЙДБАР С ФИЛЬТРАМИ */}
      <Card className="p-4 border-muted bg-muted/50 hidden lg:block relative overflow-hidden">
        {isPending && <div className="absolute inset-0 bg-background/10 backdrop-blur-[1px] z-10" />}
        
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold flex items-center gap-2"><Filter className="h-4 w-4" /> Фильтры</h3>
          <Button variant="ghost" size="sm" className="h-auto px-2 text-xs text-muted-foreground hover:text-destructive" onClick={resetFilters}>Сбросить</Button>
        </div>
        
        <div className="space-y-5">
          {isStudent && (
            <>
              <div>
                <h4 className="text-sm font-medium mb-3">Персонализация</h4>
                <div className="space-y-2">
                  <FilterCheckbox 
                    label="Только для моей специальности" 
                    // По умолчанию true, если нет 'false'
                    checked={searchParams.get("onlyMyMajor") !== "false"} 
                    onCheckedChange={(c) => {
                      const params = new URLSearchParams(searchParams);
                      // Если снимаем галочку -> ставим 'false'
                      if (!c) params.set("onlyMyMajor", "false");
                      // Если ставим -> удаляем 'false' (возвращаем дефолт) или ставим 'true'
                      else params.delete("onlyMyMajor");
                      
                      params.delete("page");
                      startTransition(() => {
                        replace(`?${params.toString()}`, { scroll: false });
                      });
                    }} 
                  />
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Тип занятости */}
          <div>
            <h4 className="text-sm font-medium mb-3">Тип практики</h4>
            <div className="space-y-2">
              <FilterCheckbox label="Учебная/Производственная" checked={isChecked("type", "practice")} onCheckedChange={(c) => handleFilter("type", "practice", c as boolean)} />
              <FilterCheckbox label="Стажировка" checked={isChecked("type", "internship")} onCheckedChange={(c) => handleFilter("type", "internship", c as boolean)} />
              <FilterCheckbox label="Постоянная работа" checked={isChecked("type", "job")} onCheckedChange={(c) => handleFilter("type", "job", c as boolean)} />
            </div>
          </div>
          
          <Separator />
          
          {/* Условия */}
          <div>
             <h4 className="text-sm font-medium mb-3">Условия</h4>
             <div className="space-y-2">
                {/* Фильтр "Оплачиваемая" - проверяем salary IS NOT NULL */}
                <FilterCheckbox label="Оплачиваемая" checked={isChecked("payment", "paid")} onCheckedChange={(c) => handleFilter("payment", "paid", c as boolean)} />
             </div>
          </div>

          <Separator />

          {/* Курс */}
          <div>
             <h4 className="text-sm font-medium mb-3">Для курса</h4>
             <div className="space-y-2">
                {[1, 2, 3, 4, 5, 6].map(course => (
                    <FilterCheckbox 
                        key={course} 
                        label={`${course} курс`} 
                        checked={isChecked("course", course.toString())} 
                        onCheckedChange={(c) => handleFilter("course", course.toString(), c as boolean)} 
                    />
                ))}
             </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function FilterCheckbox({ label, checked, onCheckedChange }: { label: string, checked: boolean, onCheckedChange: (c: boolean) => void }) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox id={label} checked={checked} onCheckedChange={onCheckedChange} />
      <Label htmlFor={label} className="text-sm leading-none cursor-pointer font-normal">
        {label}
      </Label>
    </div>
  );
}
