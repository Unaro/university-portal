"use client";

import { useActionState, useEffect } from "react";
// 👇 Импортируем тип состояния вместе с функцией
import { processApplication, ManageAppActionState } from "@/app/actions/manage-application"; 
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Clock } from "lucide-react";
import { toast } from "sonner";

interface ApplicationResponseFormProps {
  applicationId: number;
}

// Начальное состояние тоже должно соответствовать типу
const initialState: ManageAppActionState = { success: false, message: "" };

export function ApplicationResponseForm({ applicationId }: ApplicationResponseFormProps) {
  
  // 👇 Строгая типизация prevState вместо any
  const actionWrapper = async (prevState: ManageAppActionState, formData: FormData) => {
    const message = formData.get("message") as string;
    const action = formData.get("action") as "approved" | "rejected";
    
    // Экшен возвращает Promise<ManageAppActionState>, так что типы совпадают
    return await processApplication(applicationId, action, message);
  };

  const [state, dispatch, isPending] = useActionState(actionWrapper, initialState);

  useEffect(() => {
    if (state.message) {
      state.success ? toast.success(state.message) : toast.error(state.message);
    }
  }, [state]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-orange-600 font-medium text-sm mb-2">
         <Clock size={16} /> Ожидает решения
      </div>
      <form action={dispatch} className="space-y-3">
        <Textarea 
          name="message" 
          placeholder="Напишите сообщение кандидату (время собеседования или причина отказа)..." 
          required
          className="min-h-[100px] resize-none bg-white text-sm"
        />
        <div className="grid grid-cols-2 gap-2">
          <Button 
            type="submit" 
            name="action" 
            value="approved" 
            disabled={isPending}
            className="bg-green-600 hover:bg-green-700 w-full"
          >
            Пригласить
          </Button>
          <Button 
            type="submit" 
            name="action" 
            value="rejected" 
            variant="outline"
            disabled={isPending}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 w-full"
          >
            Отказать
          </Button>
        </div>
      </form>
    </div>
  );
}