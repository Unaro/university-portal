import { FileText, Download } from "lucide-react";
import { ApplicationData } from "../../model/types";

interface ResumeSectionProps {
  resume: ApplicationData["student"]["resume"];
  resumeLink?: string | null;
}

export function ResumeSection({ resume, resumeLink }: ResumeSectionProps) {
  return (
    <div className="mt-6 pt-4 border-t">
      <div className="flex items-start gap-3">
        <div className="mt-1 bg-muted p-2 rounded text-muted-foreground">
          <FileText size={18} />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">Резюме / О себе</p>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-3 italic">
            {resume?.bio || "Кандидат не добавил описание."}
          </p>

          {resumeLink && (
            <a
              href={resumeLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 mt-3 group"
            >
              <Download size={16} className="group-hover:translate-y-0.5 transition-transform" />
              Скачать полный PDF
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
