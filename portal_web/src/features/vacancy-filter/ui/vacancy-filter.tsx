// src/features/vacancy-filter/ui/vacancy-filter.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { useTransition } from "react";
import { Input } from "@/shared/ui/input";
import { Button, RadioGroup, RadioGroupItem } from "@/shared/ui";
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

  // 1. Обработка поиска (Debounce 300ms)
  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) params.set("search", term);
    else params.delete("search");
    params.delete("page");
    startTransition(() => {
        replace(`?${params.toString()}`, { scroll: false });
    });
  }, 300);

  // 2. Обработка чекбоксов (Мгновенно, так как клик - редкое действие)
  const handleFilter = (key: string, value: string, checked: boolean) => {
    const params = new URLSearchParams(searchParams);
    const current = params.get(key)?.split(",") || [];
    let updated = checked ? [...current, value] : current.filter(v => v !== value);

    if (updated.length > 0) params.set(key, updated.join(","));
    else params.delete(key);
    params.delete("page");
    startTransition(() => {
        replace(`?${params.toString()}`, { scroll: false });
    });
  };

  // 3. Обработка дат (Debounce 500ms, чтобы не спамить при вводе с клавиатуры)
  const handleDateChangeDebounced = useDebouncedCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("page");
    startTransition(() => {
        replace(`?${params.toString()}`, { scroll: false });
    });
  }, 500);

  const resetFilters = () => {
    startTransition(() => {
        replace("?");
    });
  };

  const isChecked = (key: string, value: string) => searchParams.get(key)?.split(",").includes(value) || false;

  return (
    <div className={`space-y-6 transition-all duration-300 ${isPending ? "opacity-60 grayscale-[0.5]" : ""}`}>
      {/* ПОИСК */}
      <div className="relative">
        {isPending ? (
          <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary animate-spin" />
        ) : (
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        )}
        <Input
          placeholder="Поиск по названию..."
          className="pl-10 bg-card"
          defaultValue={searchParams.get("search")?.toString()}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      <Card className="p-4 border-muted bg-muted/50 hidden lg:block relative">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold flex items-center gap-2"><Filter className="h-4 w-4" /> Фильтры</h3>
          <Button variant="ghost" size="sm" className="h-auto px-2 text-xs text-muted-foreground hover:text-destructive" onClick={resetFilters}>Сбросить</Button>
        </div>
        
        <div className="space-y-5">
          {isStudent && (
            <>
              <div>
                <h4 className="text-sm font-medium mb-3 text-primary">Персонализация</h4>
                <div className="space-y-2">
                  <FilterCheckbox 
                    label="Только для моей специальности" 
                    checked={searchParams.get("onlyMyMajor") !== "false"} 
                    onCheckedChange={(c) => {
                      const params = new URLSearchParams(searchParams);
                      if (!c) params.set("onlyMyMajor", "false");
                      else params.delete("onlyMyMajor");
                      params.delete("page");
                      startTransition(() => replace(`?${params.toString()}`, { scroll: false }));
                    }} 
                  />
                </div>
              </div>
              <Separator />
            </>
          )}

          <div>
            <h4 className="text-sm font-medium mb-3">Тип практики</h4>
            <div className="space-y-2">
              <FilterCheckbox label="Учебная/Производственная" checked={isChecked("type", "practice")} onCheckedChange={(c) => handleFilter("type", "practice", c as boolean)} />
              <FilterCheckbox label="Стажировка" checked={isChecked("type", "internship")} onCheckedChange={(c) => handleFilter("type", "internship", c as boolean)} />
              <FilterCheckbox label="Постоянная работа" checked={isChecked("type", "job")} onCheckedChange={(c) => handleFilter("type", "job", c as boolean)} />
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h4 className="text-sm font-medium mb-3 text-orange-600 dark:text-orange-400">Период прохождения</h4>
            <div className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="dateFrom" className="text-[10px] uppercase text-muted-foreground font-bold">С даты</Label>
                <Input id="dateFrom" type="date" className="h-8 text-xs bg-card" 
                  defaultValue={searchParams.get("dateFrom") || ""}
                  onChange={(e) => handleDateChangeDebounced("dateFrom", e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="dateTo" className="text-[10px] uppercase text-muted-foreground font-bold">По дату</Label>
                <Input id="dateTo" type="date" className="h-8 text-xs bg-card" 
                  defaultValue={searchParams.get("dateTo") || ""}
                  onChange={(e) => handleDateChangeDebounced("dateTo", e.target.value)} />
              </div>
            </div>
          </div>

          <Separator />

          <div>
             <h4 className="text-sm font-medium mb-3">Я студент</h4>
             <RadioGroup 
                value={searchParams.get("course") || ""} 
                onValueChange={(val: string) => {
                  const params = new URLSearchParams(searchParams);
                  if (val) params.set("course", val); else params.delete("course");
                  params.delete("page");
                  startTransition(() => replace(`?${params.toString()}`, { scroll: false }));
                }}
             >
                {[1, 2, 3, 4, 5, 6].map(course => (
                    <div key={course} className="flex items-center space-x-2">
                        <RadioGroupItem value={course.toString()} id={`course-${course}`} />
                        <Label htmlFor={`course-${course}`} className="text-sm leading-none cursor-pointer font-normal">{course} курса</Label>
                    </div>
                ))}
             </RadioGroup>
          </div>

          <Separator />
          
          <div>
             <h4 className="text-sm font-medium mb-3">Условия</h4>
             <div className="space-y-2">
                <FilterCheckbox label="Оплачиваемая" checked={isChecked("payment", "paid")} onCheckedChange={(c) => handleFilter("payment", "paid", c as boolean)} />
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
      <Label htmlFor={label} className="text-sm leading-none cursor-pointer font-normal">{label}</Label>
    </div>
  );
}
