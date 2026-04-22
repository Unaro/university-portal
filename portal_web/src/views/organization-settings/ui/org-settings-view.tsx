// src/views/organization-settings/ui/org-settings-view.tsx
import { OrgSettingsForm } from "@/features/edit-organization/ui/org-settings-form";
import { Organization } from "@/shared/types/db"; // Строгий тип
import { Badge } from "@/shared/ui";

const VERIFICATION_CONFIG = {
  pending: {text: "На рассмотрении", color: "text-amber-500 outline-amber-300/80"},
  approved: {text: "Подтверждена", color: "text-green-500 outline-green-500/80 "},
  rejected: {text: "Отклонена", color: "text-red-500 outline-red-700/80"},
}


export function OrgSettingsView({ initialData }: { initialData: Organization }) {
  return (
    <div className="max-w-2xl mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Настройки организации</h1>
        <span className={`rounded-xl p-2 font-medium ${VERIFICATION_CONFIG[initialData.verificationStatus].color}`}>
          {VERIFICATION_CONFIG[initialData.verificationStatus].text}
        </span>
      </div>
      
      <OrgSettingsForm initialData={initialData} />
    </div>
  );
}