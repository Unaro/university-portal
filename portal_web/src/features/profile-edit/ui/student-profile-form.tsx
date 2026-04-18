// src/app/dashboard/profile/profile-form.tsx
"use client";

import { useActionState, useState, useEffect } from "react"; // <--- Добавь useEffect
import { updateStudentProfile, ProfileState } from "@/app/actions/profile";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Card, CardContent } from "@/shared/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { MultiSelect, Option } from "@/shared/ui/multi-select";
import Link from "next/link";
import { toast } from "sonner";

interface ProfileFormProps {
  initialData: {
    group: string;
    majorId: string;
    course: string;
    skills: string[];
    currentPracticeType: "educational" | "production" | "pre_diploma" | null;
    projectTheme: string | null;
  };
  majors: { id: number; name: string }[];
  skills: Option[];
}

const initialState: ProfileState = { success: false, message: "" };

export function StudentProfileForm({ initialData, majors, skills }: ProfileFormProps) {
  const [state, dispatch, isPending] = useActionState(updateStudentProfile, initialState);
  
  const [selectedSkills, setSelectedSkills] = useState<string[]>(initialData.skills);
  const [selectedMajor, setSelectedMajor] = useState<string>(initialData.majorId);
  const [selectedCourse, setSelectedCourse] = useState<string>(initialData.course);
  const [selectedPracticeType, setSelectedPracticeType] = useState<string>(initialData.currentPracticeType || "");

  // --- МАГИЯ TOAST ---
  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast.success(state.message);
      } else {
        toast.error(state.message);
      }
    }
  }, [state]); // Срабатывает при изменении ответа от сервера
  // -------------------

  return (
    <Card>
      <CardContent className="pt-6">
        <form action={dispatch} className="space-y-6">
          
          {/* ... (поля формы без изменений: Группа, Курс, Специальность) ... */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="group">Учебная группа</Label>
              <Input id="group" name="group" defaultValue={initialData.group} placeholder="ИВТ-41" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="course">Курс</Label>
              <input type="hidden" name="course" value={selectedCourse} />
              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger><SelectValue placeholder="Выберите курс" /></SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6].map((c) => (
                    <SelectItem key={c} value={c.toString()}>{c} курс</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Специальность (Major)</Label>
            <input type="hidden" name="majorId" value={selectedMajor} />
            <Select value={selectedMajor} onValueChange={setSelectedMajor}>
              <SelectTrigger><SelectValue placeholder="Выберите специальность" /></SelectTrigger>
              <SelectContent>
                {majors.map((m) => (
                  <SelectItem key={m.id} value={m.id.toString()}>{m.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Текущий тип практики</Label>
              <input type="hidden" name="currentPracticeType" value={selectedPracticeType} />
              <Select value={selectedPracticeType} onValueChange={setSelectedPracticeType}>
                <SelectTrigger><SelectValue placeholder="Укажите тип практики" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="educational">Учебная практика</SelectItem>
                  <SelectItem value="production">Производственная практика</SelectItem>
                  <SelectItem value="pre_diploma">Преддипломная практика</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="projectTheme">Тема проекта (опционально)</Label>
              <Input id="projectTheme" name="projectTheme" defaultValue={initialData.projectTheme || ""} placeholder="Разработка модуля..." />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Мои навыки</Label>
            <input type="hidden" name="skills" value={JSON.stringify(selectedSkills)} />
            <MultiSelect
              options={skills}
              selected={selectedSkills}
              onChange={setSelectedSkills}
              placeholder="Выберите технологии..."
            />
          </div>

          {/* МЫ УДАЛИЛИ БЛОК ВЫВОДА ОШИБКИ ТУТ, ТАК КАК ТЕПЕРЬ ЕСТЬ TOAST */}

          <div className="flex gap-4">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Сохранение..." : "Сохранить профиль"}
            </Button>
            <Link href="/dashboard">
              <Button variant="outline" type="button">На главную</Button>
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}