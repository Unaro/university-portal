import { applications, vacancies, organizations } from "@/db/schema";

export type ApplicationWithDetails = typeof applications.$inferSelect & {
  vacancy: typeof vacancies.$inferSelect & {
    organization: typeof organizations.$inferSelect;
  };
};

export type VacancyStatus = typeof applications.$inferSelect.status

export type VacancyWithApplications = typeof vacancies.$inferSelect & {
  applications: { 
    status: VacancyStatus;
    universityApprovalStatus: typeof applications.$inferSelect.universityApprovalStatus;
  }[];
};

export interface StudentDashboardProps {
  userId: number;
}

export interface PartnerDashboardProps {
  userId: number;
}
