export interface VacancyDetailsProps {
  data: {
    id: number;
    title: string;
    description: string;
    requirements?: string | null;
    salary?: string | null;
    type: string;
    createdAt: Date | null;
    organization: {
      name: string;
      logo?: string | null;
      logoUrl?: string | null;
      contacts?: string | null;
      website?: string | null;
    };
    skills: { name: string }[];
  };
  isApplied: boolean;
  canApply: boolean;
  isLoggined: boolean;
}
