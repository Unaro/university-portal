import { ApplicationData } from "../../model/types";

interface SkillsSectionProps {
  skills: ApplicationData["student"]["skills"];
}

export function SkillsSection({ skills }: SkillsSectionProps) {
  return (
    <div className="mt-5">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Навыки</p>
      {skills.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {skills.map((s) => (
            <span key={s.skill.id} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary border">
              {s.skill.name}
            </span>
          ))}
        </div>
      ) : (
        <span className="text-sm text-muted-foreground italic">Не указаны</span>
      )}
    </div>
  );
}
