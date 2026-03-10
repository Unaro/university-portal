// src/features/auth/ui/register-form.tsx
"use client";

import { useActionState, useEffect } from "react";
import { registerUser } from "@/app/actions/register"; // Студент
import { registerPartner } from "@/app/actions/register-partner"; // Партнер
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Building2, GraduationCap, User } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// --- ПОД-ФОРМА СТУДЕНТА ---
function StudentRegisterForm() {
  const [state, dispatch, isPending] = useActionState(registerUser, { success: false, message: "" });
  const router = useRouter(); // <--- Хук

  useEffect(() => {
    if (state.message) {
      toast.success(state.message)
    }
    if (state.success) {
      // Мягкий переход на логин
      router.push("/login");
    }
  }, [state, router]);

  return (
    <form action={dispatch} className="space-y-4 animate-in fade-in-50 slide-in-from-bottom-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Имя (Полное)</Label>
          <Input name="name" placeholder="Иван Иванов" required />
        </div>
        <div className="space-y-2">
          <Label>Email</Label>
          <Input name="email" type="email" placeholder="student@university.ru" required />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Пароль</Label>
        <Input name="password" type="password" placeholder="••••••••" required />
      </div>
      <div className="flex items-center space-x-2 pt-2">
        <Checkbox id="terms1" required />
        <label htmlFor="terms1" className="text-sm text-muted-foreground cursor-pointer">
          Я согласен с условиями обработки данных
        </label>
      </div>
      <Button type="submit" className="w-full mt-4 h-11 text-base" disabled={isPending}>
        {isPending ? "Регистрация..." : "Зарегистрироваться как Студент"}
      </Button>
    </form>
  );
}

// --- ПОД-ФОРМА ПАРТНЕРА ---
function PartnerRegisterForm() {
  const [state, dispatch, isPending] = useActionState(registerPartner, { success: false, message: "" });

  useEffect(() => {
    if (state.message) {
      state.success ? toast.success(state.message) : toast.error(state.message);
    }
  }, [state]);

  return (
    <form action={dispatch} className="space-y-4 animate-in fade-in-50 slide-in-from-bottom-2">
      <div className="space-y-2">
         <Label>Название организации</Label>
         <Input name="companyName" placeholder='ООО "Мостовик-Проект"' required />
      </div>
      <div className="space-y-2">
        <Label>ИИН (12 цифр)</Label>
        <Input name="iin" placeholder="123456789012" maxLength={12} required />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <div className="space-y-2">
            <Label>Контактное лицо (ФИО)</Label>
            <Input name="contactName" placeholder="Петров Петр" required />
         </div>
         <div className="space-y-2">
            <Label>Телефон</Label>
            <Input name="phone" placeholder="+7 (999) 000-00-00" required />
         </div>
      </div>
      <div className="space-y-2">
        <Label>Email для входа</Label>
        <Input name="email" type="email" placeholder="hr@company.ru" required />
      </div>
      <div className="space-y-2">
        <Label>Пароль</Label>
        <Input name="password" type="password" placeholder="••••••••" required />
      </div>
      <div className="flex items-center space-x-2 pt-2">
        <Checkbox id="terms2" required />
        <label htmlFor="terms2" className="text-sm text-muted-foreground cursor-pointer">
          Я согласен с условиями обработки данных
        </label>
      </div>
      <Button type="submit" className="w-full mt-4 h-11 text-base" disabled={isPending}>
         {isPending ? "Регистрация..." : "Зарегистрировать компанию"}
      </Button>
    </form>
  );
}

// --- ОБЩИЙ КОМПОНЕНТ ---
export function RegisterForm() {
  return (
    <Tabs defaultValue="student" className="w-full">
      <TabsList className="grid w-full grid-cols-3 h-auto p-1 bg-slate-100 mb-8">
        <TabsTrigger value="student" className="py-3 gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all">
          <GraduationCap className="h-4 w-4" /> Студент
        </TabsTrigger>
        <TabsTrigger value="partner" className="py-3 gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all">
          <Building2 className="h-4 w-4" /> Партнер
        </TabsTrigger>
        <TabsTrigger value="staff" disabled className="py-3 gap-2 opacity-50 cursor-not-allowed">
          <User className="h-4 w-4" /> Сотрудник (Скоро)
        </TabsTrigger>
      </TabsList>

      <TabsContent value="student">
        <StudentRegisterForm />
      </TabsContent>

      <TabsContent value="partner">
        <PartnerRegisterForm />
      </TabsContent>
    </Tabs>
  );
}