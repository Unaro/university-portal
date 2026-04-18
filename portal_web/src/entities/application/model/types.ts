export type ApplicationData = {
  id: number;
  status: "pending" | "approved" | "rejected";
  coverLetter: string | null;
  responseMessage: string | null;
  createdAt: Date | null;
  student: {
    id: number;
    course: number | null;
    user: { name: string | null; email: string; image: string | null };
    major: { name: string } | null;
    skills: { skill: { id: number; name: string } }[];
    resume: { bio: string | null; fileUrl: string | null } | null;
  };
  vacancy: { title: string; type: "practice" | "internship" | "job" };
  resumeLink?: string | null;
};

export interface ApplicationCardProps {
  data: ApplicationData;
  actionSlot?: React.ReactNode;
}
