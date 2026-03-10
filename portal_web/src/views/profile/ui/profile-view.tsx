// src/views/profile/ui/profile-view.tsx
import { ProfileSidebar } from "@/entities/session/ui/profile-sidebar";
import { StudentProfileWidget } from "@/widgets/student-profile/ui/student-profile-widget";
import { User, StudentWithSkills, Major, Skill, Resume } from "@/shared/types/db";
import { ApplicationUiItem } from "@/features/application-list/ui/student-application-list";

interface ProfileViewProps {
  user: User;
  studentData: StudentWithSkills | null; // Может быть null, если профиль не создан
  majors: Major[];
  skills: Skill[];
  resumeData: Resume | null;
  applications: ApplicationUiItem[];
}

export function ProfileView({ user, studentData, resumeData, majors, skills, applications }: ProfileViewProps) {
  
  // Подготовка данных для виджета (защита от null)
  const safeProfileData = {
    group: studentData?.group || "",
    majorId: studentData?.majorId?.toString() || "",
    course: studentData?.course?.toString() || "1",
    skills: studentData?.skills.map(s => s.skill.id.toString()) || [],
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="md:col-span-1 space-y-6">
            <ProfileSidebar 
              user={user} 
              details={{ group: studentData?.group }} 
            />
          </div>

          <div className="md:col-span-3">
             <StudentProfileWidget 
                profileData={safeProfileData}
                resumeData={resumeData} // <--- Передаем дальше
                majors={majors}
                skills={skills}
                applications={applications}
             />
          </div>

        </div>
      </div>
    </div>
  );
}