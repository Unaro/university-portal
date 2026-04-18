// src/features/vacancy-filter/ui/vacancy-filter.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { Checkbox } from "@/shared/ui/checkbox";
import { Label } from "@/shared/ui/label";
import { Card } from "@/shared/ui/card";
import { Separator } from "@/shared/ui/separator";
import { Search, Filter } from "lucide-react";

export function VacancyFilter() {
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  // 1. Обработка поиска (Debounce чтобы не спамить в URL)
  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) params.set("search", term);
    else params.delete("search");
    replace(`?${params.toString()}`, { scroll: false });
  }, 300);

  // 2. Обработка чекбоксов
  // type: 'practice' | 'internship' | 'job'
  // payment: 'paid'
  const handleFilter = (key: string, value: string, checked: boolean) => {
    const params = new URLSearchParams(searchParams);
    const current = params.get(key)?.split(",") || []; // Поддержка множественного выбора через запятую

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

    // Сбрасываем пагинацию при изменении фильтров
    params.delete("page");
    
    replace(`?${params.toString()}`, { scroll: false });
  };

  const resetFilters = () => {
    replace("?");
  };

  // Хелпер для проверки, активен ли чекбокс
  const isChecked = (key: string, value: string) => {
      const val = searchParams.get(key);
      return val?.split(",").includes(value) || false;
  };

  return (
    <div className="space-y-6">
      {/* ПОИСК (Мобильный + Десктоп) */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Поиск по названию..."
          className="pl-10 bg-card"
          defaultValue={searchParams.get("search")?.toString()}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      {/* САЙДБАР С ФИЛЬТРАМИ (Desktop) */}
      <Card className="p-4 border-muted bg-muted/50 hidden lg:block">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold flex items-center gap-2"><Filter className="h-4 w-4" /> Фильтры</h3>
          <Button variant="ghost" size="sm" className="h-auto px-2 text-xs text-muted-foreground hover:text-destructive" onClick={resetFilters}>Сбросить</Button>
        </div>
        
        <div className="space-y-5">
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
                {[1, 2, 3, 4].map(course => (
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