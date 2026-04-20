import { BackButton } from "@/shared/ui/back-button";
import { Card } from "@/shared/ui/card";
import { VacancyDetailsProps } from "../../model/types";
import { VacancyHeader } from "./VacancyHeader";
import { VacancyBody } from "./VacancyBody";

export function VacancyDetails(props: VacancyDetailsProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <BackButton 
        label="Назад к поиску" 
        variant="ghost" 
        className="mb-6 pl-0 hover:bg-transparent hover:text-primary" 
      />

      <Card className="mb-8 overflow-hidden border-none shadow-lg">
        <VacancyHeader {...props} />
        <VacancyBody data={props.data} />
      </Card>
    </div>
  );
}
