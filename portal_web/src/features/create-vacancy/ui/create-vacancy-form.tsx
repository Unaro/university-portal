// src/app/dashboard/create-vacancy/create-form.tsx
"use client";

import { useActionState, useEffect, useState } from "react";
import { createVacancy, CreateVacancyState } from "@/app/actions/vacancy";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Textarea } from "@/shared/ui/textarea";
import { Card, CardContent } from "@/shared/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { MultiSelect, Option } from "@/shared/ui/multi-select";
import Link from "next/link";
import { toast } from "sonner";
import { Major } from "@/shared/types/db";

interface CreateVacancyFormProps {
  allMajors: Major[]; // Строгий тип из БД
  allSkills: Option[]; // Тип для UI компонента MultiSelect
}

const initialState: CreateVacancyState = { success: false, message: "" };

export function CreateVacancyForm({ allMajors, allSkills }: CreateVacancyFormProps) {
  const [state, dispatch, isPending] = useActionState(createVacancy, initialState);

  // Локальное состояние для MultiSelect и Select
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedMajors, setSelectedMajors] = useState<string[]>([]);
  const [type, setType] = useState("practice");
  const [minCourse, setMinCourse] = useState("1");
  
  // --- TOAST ---
  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast.success("Вакансия успешно опубликована!");
      } else {
        toast.error(state.message);
        // Если есть детальные ошибки полей, можно их тоже вывести
        if (state.errors) {
           console.log(state.errors); // Или вывести общий текст
        }
      }
    }
  }, [state]);
  
  return (
    <Card>
      <CardContent className="pt-6">
        <form action={dispatch} className="space-y-6">
          
          {/* Основная инфо */}
          <div className="space-y-2">
            <Label htmlFor="title">Название позиции *</Label>
            <Input id="title" name="title" placeholder="Java Developer / Стажер" required />
            {state.errors?.title && <p className="text-destructive text-sm">{state.errors.title}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
             {/* Тип */}
             <div className="space-y-2">
                <Label>Тип предложения</Label>
                <input type="hidden" name="type" value={type} />
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="practice">Учебная практика (ВУЗ)</SelectItem>
                    <SelectItem value="internship">Оплачиваемая стажировка</SelectItem>
                    <SelectItem value="job">Постоянная работа</SelectItem>
                  </SelectContent>
                </Select>
             </div>

             {/* Зарплата */}
             <div className="space-y-2">
                <Label htmlFor="salary">Зарплата (если есть)</Label>
                <Input id="salary" name="salary" placeholder="50 000 ₽" />
             </div>
          </div>

          {/* Фильтры студентов */}
          <div className="p-4 bg-muted rounded-lg border space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground">Требования и квоты</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Минимальный курс</Label>
                <input type="hidden" name="minCourse" value={minCourse} />
                <Select value={minCourse} onValueChange={setMinCourse}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6].map(c => (
                          <SelectItem key={c} value={c.toString()}>{c} курс и старше</SelectItem>
                      ))}
                    </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="availableSpots">Количество мест (опционально)</Label>
                <Input id="availableSpots" name="availableSpots" type="number" min="1" placeholder="Например, 4" />
                {state.errors?.availableSpots && <p className="text-destructive text-sm">{state.errors.availableSpots}</p>}
              </div>
            </div>

            <div className="space-y-2">
               <Label>Разрешенные специальности (Пусто = Все)</Label>
               <input type="hidden" name="majors" value={JSON.stringify(selectedMajors)} />
               <MultiSelect 
                  options={allMajors.map(m => ({ label: m.name, value: m.id.toString() }))}
                  selected={selectedMajors}
                  onChange={setSelectedMajors}
                  placeholder="Выберите специальности..."
               />
            </div>

            <div className="space-y-2">
               <Label>Обязательные навыки</Label>
               <input type="hidden" name="skills" value={JSON.stringify(selectedSkills)} />
               <MultiSelect 
                  options={allSkills}
                  selected={selectedSkills}
                  onChange={setSelectedSkills}
                  placeholder="Java, SQL, Git..."
               />
            </div>
          </div>

          {/* Текстовые поля */}
          <div className="space-y-2">
            <Label htmlFor="description">Описание задач *</Label>
            <Textarea id="description" name="description" className="h-24" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="requirements">Дополнительные требования (текст)</Label>
            <Textarea id="requirements" name="requirements" placeholder="Soft skills, английский язык..." />
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Публикация..." : "Опубликовать"}
            </Button>
            <Link href="/dashboard"><Button variant="outline" type="button">Отмена</Button></Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}