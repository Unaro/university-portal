// src/features/edit-resume/ui/resume-form.tsx
"use client";

import { useActionState, useEffect } from "react";
import { saveResume, ResumeActionState } from "@/app/actions/resume";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { toast } from "sonner"; // Добавляем toast для красоты

const initialState: ResumeActionState = { success: false, message: "" };

export function ResumeForm({ 
  initialBio, 
  existingFile 
}: { 
  initialBio: string; 
  existingFile?: string | null;
}) {
  const [state, dispatch, isPending] = useActionState(saveResume, initialState);

  // Добавляем уведомления
  useEffect(() => {
    if (state.message && state.success ) {
      toast.success(state.message);
    } else if (state.message) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <Card>
      <CardContent className="pt-6">
        <form action={dispatch} className="space-y-6">
          
          <div className="space-y-2">
            <Label htmlFor="bio">О себе / Сопроводительное письмо</Label>
            <Textarea 
              id="bio" 
              name="bio" 
              defaultValue={initialBio}
              placeholder="Расскажите о своем опыте и целях..." 
              className="min-h-[120px]"
            />
          </div>

          {/* <div className="bg-slate-50 p-4 rounded border border-slate-200">
            <Label className="mb-2 block">Ваши навыки</Label>
            <div className="text-sm text-slate-500 mb-3">
              Навыки автоматически подтягиваются из вашего профиля.
            </div>
            <Link href="/profile">
              <Button variant="secondary" size="sm" type="button">
                Настроить навыки
              </Button>
            </Link>
          </div> */}

          <div className="space-y-2">
            <Label htmlFor="file">Файл резюме (PDF)</Label>
            <Input id="file" name="file" type="file" accept="application/pdf" />
            {existingFile && (
              <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                <span>📄</span> Файл уже загружен. Загрузите новый, чтобы заменить.
              </p>
            )}
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Сохранение..." : "Сохранить резюме"}
            </Button>
            <Link href="/dashboard">
              <Button variant="outline" type="button">Назад</Button>
            </Link>
          </div>
          
        </form>
      </CardContent>
    </Card>
  );
}