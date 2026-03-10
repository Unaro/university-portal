// src/views/practice-details/ui/practice-details-view.tsx
import { VacancyDetails } from "@/widgets/vacancy-details/ui/vacancy-details";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function PracticeDetailsView(props: any) {
  return (
    <div className="min-h-screen bg-slate-50 pb-10">
      <div className="container mx-auto px-4 py-8">
        <VacancyDetails {...props} />
      </div>
    </div>
  );
}