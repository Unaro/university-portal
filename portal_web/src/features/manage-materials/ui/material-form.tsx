// src/app/dashboard/admin/materials/material-form.tsx
"use client";

import { useActionState } from "react";
import { createMaterial, MaterialState } from "@/app/actions/material";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const initialState: MaterialState = { success: false, message: "" };

export function MaterialForm() {
  const [state, dispatch, isPending] = useActionState(createMaterial, initialState);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Добавить новый материал</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={dispatch} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Название</Label>
            <Input id="title" name="title" placeholder="Дневник практики (шаблон)" required />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Описание</Label>
            <Textarea id="description" name="description" placeholder="Краткое описание..." />
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">Файл</Label>
            <Input id="file" name="file" type="file" required />
          </div>

          {state.message && (
            <div className={`p-3 rounded text-sm font-medium ${state.success ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'}`}>
              {state.message}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="category">Категория</Label>
            <Select name="category" defaultValue="material">
              <SelectTrigger>
                <SelectValue placeholder="Выберите категорию" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="material">Полезные материалы</SelectItem>
                <SelectItem value="regulatory">Нормативные акты</SelectItem>
                <SelectItem value="template">Шаблоны заявлений</SelectItem>
              </SelectContent>
            </Select>
          </div>          

          <Button type="submit" disabled={isPending}>
            {isPending ? "Загрузка..." : "Загрузить материал"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}