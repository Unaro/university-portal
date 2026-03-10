// src/views/resume-edit/ui/resume-edit-view.tsx
import { ResumeForm } from "@/features/edit-resume/ui/resume-form";

interface ResumeEditViewProps {
  initialBio: string;
  existingFile?: string | null;
}

export function ResumeEditView({ initialBio, existingFile }: ResumeEditViewProps) {
  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Моё резюме</h1>
      <ResumeForm 
        initialBio={initialBio}
        existingFile={existingFile}
      />
    </div>
  );
}