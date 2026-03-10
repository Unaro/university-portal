import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { StudentProfileForm } from "@/features/profile-edit/ui/student-profile-form";
import { StudentApplicationList, ApplicationUiItem } from "@/features/application-list/ui/student-application-list";
import { Major, Resume, Skill } from "@/shared/types/db"; // Импортируем строгие типы
import { ResumeForm } from "@/features/edit-resume/ui/resume-form";

interface StudentProfileWidgetProps {
  // Данные для заполнения формы (приходят подготовленными из page.tsx)
  profileData: {
    group: string;
    majorId: string;
    course: string;
    skills: string[]; // Массив ID навыков (строки для формы)
  };
  
  resumeData: Resume | null;

  // Справочники из БД
  majors: Major[];
  skills: Skill[];
  
  // Список заявок (уже приведенный к UI формату)
  applications: ApplicationUiItem[];
}

export function StudentProfileWidget({ 
  profileData, 
  resumeData,
  majors, 
  skills, 
  applications 
}: StudentProfileWidgetProps) {
  
  // 1. Преобразуем навыки в формат { label, value } для MultiSelect
  const skillOptions = skills.map(s => ({ 
    label: s.name, 
    value: s.id.toString() 
  }));

  // 2. Преобразуем специальности (если нужно для селекта, или передаем как есть)
  // В StudentProfileForm мы ожидаем массив объектов с id и name, что соответствует типу Major
  
  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-6 bg-slate-100 p-1 h-auto"> {/* grid-cols-3 */}
        <TabsTrigger value="profile" className="py-2.5">Мои данные</TabsTrigger>
        <TabsTrigger value="activities" className="py-2.5">Мои отклики</TabsTrigger>
        <TabsTrigger value="resume" className="py-2.5">Мое резюме</TabsTrigger> {/* Новая кнопка */}
      </TabsList>

      {/* --- ВКЛАДКА: ПРОФИЛЬ --- */}
      <TabsContent value="profile" className="animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
        <Card>
          <CardHeader>
            <CardTitle>Личная информация</CardTitle>
            <CardDescription>Редактирование информации о курсе, группе и навыках.</CardDescription>
          </CardHeader>
          <CardContent>
             <StudentProfileForm 
                initialData={profileData}
                majors={majors}      // Передаем сырой список Major[]
                skills={skillOptions} // Передаем преобразованный Option[]
             />
          </CardContent>
        </Card>
      </TabsContent>

      {/* --- ВКЛАДКА: АКТИВНОСТИ --- */}
      <TabsContent value="activities" className="animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
        <Card>
          <CardHeader>
            <CardTitle>История откликов</CardTitle>
            <CardDescription>Статус ваших заявок на практику и стажировку.</CardDescription>
          </CardHeader>
          <CardContent>
             <StudentApplicationList applications={applications} />
          </CardContent>
        </Card>
      </TabsContent>

      {/* --- ВКЛАДКА: РЕЗЮМЕ --- */}
      <TabsContent value="resume" className="animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
        <Card>
          <CardHeader>
            <CardTitle>Электронное резюме</CardTitle>
            <CardDescription>Загрузите PDF файл и расскажите о себе.</CardDescription>
          </CardHeader>
          <CardContent>
             <ResumeForm 
                initialBio={resumeData?.bio || ""}
                existingFile={resumeData?.fileUrl}
             />
          </CardContent>
        </Card>
      </TabsContent>

    </Tabs>
  );
}