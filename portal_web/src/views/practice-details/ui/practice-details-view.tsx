// src/views/practice-details/ui/practice-details-view.tsx
import { VacancyDetails } from "@/widgets/vacancy-details/ui/vacancy-details";
import type { VacancyDetailsProps } from "@/widgets/vacancy-details/ui/vacancy-details";

export function PracticeDetailsView(props: VacancyDetailsProps) {
  return (
    <div className="min-h-screen bg-background pb-10">
      <div className="container mx-auto px-4 py-8">
        <VacancyDetails {...props} />
      </div>
    </div>
  );
}