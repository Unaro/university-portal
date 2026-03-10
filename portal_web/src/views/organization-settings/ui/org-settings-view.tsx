// src/views/organization-settings/ui/org-settings-view.tsx
import { OrgSettingsForm } from "@/features/edit-organization/ui/org-settings-form";
import { Organization } from "@/shared/types/db"; // Строгий тип

export function OrgSettingsView({ initialData }: { initialData: Organization }) {
  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Настройки организации</h1>
      <OrgSettingsForm initialData={initialData} />
    </div>
  );
}