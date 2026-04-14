// src/app/dashboard/organization/settings-form.tsx
"use client";

import { useActionState, useEffect } from "react";
import { updateOrganization, OrgSettingsState } from "@/app/actions/organization-settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { toast } from "sonner";
import type { Organization } from "@/shared/types/db";

export function OrgSettingsForm({ initialData }: { initialData: Organization }) {
  const initialState: OrgSettingsState = { success: false, message: "" };
  const [state, dispatch, isPending] = useActionState(updateOrganization, initialState);

  // --- TOAST EFFECT ---
  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast.success("Данные обновлены!"); // Можно свой текст
      } else {
        toast.error(state.message);
      }
    }
  }, [state]);

  return (
    <Card>
      <CardContent className="pt-6">
        <form action={dispatch} className="space-y-6">
          
          {/* ... (поля формы без изменений: Название, Контакты, Сайт, Описание, Лого) ... */}
          <div className="space-y-2">
            <Label>Название (не меняется)</Label>
            <Input value={initialData.name} disabled className="bg-slate-100" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contacts">Контакты</Label>
            <Input id="contacts" name="contacts" defaultValue={initialData.contacts ?? ""} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="website">Веб-сайт</Label>
            <Input id="website" name="website" defaultValue={initialData.website || ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Описание</Label>
            <Textarea id="description" name="description" defaultValue={initialData.description || ""} className="h-32"/>
          </div>
          <div className="space-y-2">
            <Label htmlFor="logo">Логотип</Label>
            <Input id="logo" name="logo" type="file" accept="image/*" />
          </div>

          {/* УДАЛЕН БЛОК СООБЩЕНИЙ */}

          <div className="flex gap-4">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Сохранение..." : "Сохранить изменения"}
            </Button>
            <Link href="/dashboard"><Button variant="outline" type="button">Назад</Button></Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}