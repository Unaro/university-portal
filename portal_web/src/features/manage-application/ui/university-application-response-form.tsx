"use client";

import { useActionState, useEffect } from "react";
import { processUniversityApplication, ManageUniversityAppActionState } from "@/app/actions/manage-university-application"; 
import { Button } from "@/shared/ui/button";
import { Textarea } from "@/shared/ui/textarea";
import { Clock } from "lucide-react";
import { toast } from "sonner";

interface UniversityApplicationResponseFormProps {
  applicationId: number;
}

const initialState: ManageUniversityAppActionState = { success: false, message: "" };

export function UniversityApplicationResponseForm({ applicationId }: UniversityApplicationResponseFormProps) {
  
  const actionWrapper = async (prevState: ManageUniversityAppActionState, formData: FormData) => {
    const message = formData.get("message") as string;
    const action = formData.get("action") as "approved" | "rejected";
    
    return await processUniversityApplication(applicationId, action, message);
  };

  const [state, dispatch, isPending] = useActionState(actionWrapper, initialState);

  useEffect(() => {
    if (state.message) {
      state.success ? toast.success(state.message) : toast.error(state.message);
    }
  }, [state]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium text-sm mb-2">
         <Clock size={16} /> Ожидает решения ВУЗа
      </div>
      <form action={dispatch} className="space-y-3">
        <Textarea
          name="message"
          placeholder="Напишите комментарий или причину отказа..."
          className="min-h-[100px] resize-none bg-card text-sm"
        />
        <div className="grid grid-cols-2 gap-2">
          <Button
            type="submit"
            name="action"
            value="approved"
            disabled={isPending}
            className="bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500 w-full"
          >
            Одобрить
          </Button>
          <Button
            type="submit"
            name="action"
            value="rejected"
            variant="outline"
            disabled={isPending}
            className="text-destructive hover:text-destructive hover:bg-destructive/10 border-border w-full"
          >
            Отклонить
          </Button>
        </div>
      </form>
    </div>
  );
}
