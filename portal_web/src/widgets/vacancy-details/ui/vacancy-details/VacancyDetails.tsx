import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { VacancyDetailsProps } from "../../model/types";
import { VacancyHeader } from "./VacancyHeader";
import { VacancyBody } from "./VacancyBody";

export function VacancyDetails(props: VacancyDetailsProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/practices">
        <Button variant="ghost" className="mb-6 pl-0 hover:bg-transparent hover:text-primary gap-2">
          <ArrowLeft className="h-4 w-4" /> Назад к поиску
        </Button>
      </Link>

      <Card className="mb-8 overflow-hidden border-none shadow-lg">
        <VacancyHeader {...props} />
        <VacancyBody data={props.data} />
      </Card>
    </div>
  );
}
