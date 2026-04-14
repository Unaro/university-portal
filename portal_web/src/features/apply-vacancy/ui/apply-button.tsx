// src/features/apply-vacancy/ui/apply-button.tsx
"use client";

import { useActionState, useEffect } from "react";
import { applyToVacancy } from "@/app/actions/application";
import { ActionResponse } from "@/shared/types/action";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ApplyButtonProps {
  vacancyId: number;
  isApplied: boolean; // Уже откликался?
  disabled?: boolean; // Например, профиль не заполнен
  className?: string;
}

const initialState: ActionResponse = { success: false, message: "" };

export function ApplyButton({ vacancyId, isApplied, disabled, className }: ApplyButtonProps) {
  // Мы используем bind, чтобы передать ID в экшен, не создавая скрытых инпутов
  const applyWithId = applyToVacancy.bind(null, vacancyId);
  const [state, dispatch, isPending] = useActionState(applyWithId, initialState);

  useEffect(() => {
    if (state.message) {
      state.success ? toast.success(state.message) : toast.error(state.message);
    }
  }, [state]);

  if (isApplied || state.success) {
    return (
      <Button disabled variant="secondary" className={`bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 opacity-100 ${className}`}>
        ✓ Вы откликнулись
      </Button>
    );
  }

  return (
    <form action={dispatch} className={className}>
      <Button type="submit" size="lg" className="w-full shadow-md" disabled={isPending || disabled}>
        {isPending ? "Отправка..." : "Откликнуться"}
      </Button>
    </form>
  );
}