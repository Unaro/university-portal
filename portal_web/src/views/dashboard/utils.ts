import { VacancyStatus, VacancyWithApplications } from "./model/types";

export function getStatusCounts(status: VacancyStatus | null, applications: VacancyWithApplications["applications"]) {
  if (!status) return 0;
  return applications.filter((a) => a.status === status).length;
}