// Seed data constants for Russian companies and example data
// All data is organized in separate variables for easy modification

// ==================== МАЙОРЫ / СПЕЦИАЛЬНОСТИ ====================
export const MAJORS = [
  { name: "Информационные системы и технологии", code: "09.03.02" },
  { name: "Программная инженерия", code: "09.03.04" },
  { name: "Прикладная математика", code: "01.03.04" },
  { name: "Менеджмент", code: "38.03.02" },
  { name: "Экономика", code: "38.03.01" },
];

// ==================== НАВЫКИ ====================
export const SKILLS = [
  { name: "JavaScript" },
  { name: "TypeScript" },
  { name: "React" },
  { name: "Next.js" },
  { name: "Node.js" },
  { name: "Python" },
  { name: "Java" },
  { name: "Spring" },
  { name: "SQL" },
  { name: "PostgreSQL" },
  { name: "Docker" },
  { name: "Git" },
  { name: "Figma" },
  { name: "1C" },
  { name: "C++" },
  { name: "C#" },
];

// ==================== ПОЛЬЗОВАТЕЛИ ====================
export const USERS = [
  // Admin (0)
  { name: "Администратор", email: "admin@university.edu", role: "admin" as const },
  // Staff (1, 2)
  { name: "Иванов Петр Сергеевич", email: "ivanov@university.edu", role: "university_staff" as const },
  { name: "Смирнова Елена Александровна", email: "smirnova@university.edu", role: "university_staff" as const },
  // Reps (3-11)
  { name: "Козлов Дмитрий Михайлович", email: "kozlov@yandex.ru", role: "organization_representative" as const },
  { name: "Нурсултанова Алия Ержановна", email: "nursultanova@sberbank.ru", role: "organization_representative" as const },
  { name: "Волков Сергей", email: "volkov@gazprom.ru", role: "organization_representative" as const },
  { name: "Морозова Анна", email: "morozova@kaspersky.com", role: "organization_representative" as const },
  { name: "Петров Игорь", email: "petrov@lukoil.ru", role: "organization_representative" as const },
  { name: "Соколов Иван", email: "sokolov@mts.ru", role: "organization_representative" as const },
  { name: "Лебедева Мария", email: "lebedeva@vk.company", role: "organization_representative" as const },
  { name: "Кузнецов Артем", email: "kuznetsov@tinkoff.ru", role: "organization_representative" as const },
  { name: "Васильева Ольга", email: "vasilieva@avito.ru", role: "organization_representative" as const },
  // Students (12-31)
  { name: "Ахметов Арман", email: "akhmetov@student.edu", role: "student" as const },
  { name: "Ким Юлия", email: "kim@student.edu", role: "student" as const },
  { name: "Омаров Нурлан", email: "omarov@student.edu", role: "student" as const },
  { name: "Ибраева Сабина", email: "ibraeva@student.edu", role: "student" as const },
  { name: "Тимофеев Алексей", email: "timofeev@student.edu", role: "student" as const },
  { name: "Белов Максим", email: "belov@student.edu", role: "student" as const },
  { name: "Павлова Дарья", email: "pavlova@student.edu", role: "student" as const },
  { name: "Морозов Илья", email: "morozov.i@student.edu", role: "student" as const },
  { name: "Смирнов Денис", email: "smirnov.d@student.edu", role: "student" as const },
  { name: "Козлова Вера", email: "kozlova.v@student.edu", role: "student" as const },
  { name: "Федоров Олег", email: "fedorov@student.edu", role: "student" as const },
  { name: "Николаев Андрей", email: "nikolaev@student.edu", role: "student" as const },
  { name: "Егоров Егор", email: "egorov@student.edu", role: "student" as const },
  { name: "Леонов Лев", email: "leonov@student.edu", role: "student" as const },
  { name: "Григорьев Глеб", email: "grigoriev@student.edu", role: "student" as const },
  { name: "Алексеев Александр", email: "alekseev@student.edu", role: "student" as const },
  { name: "Тихонов Тихон", email: "tikhonov@student.edu", role: "student" as const },
  { name: "Юрьев Юрий", email: "yuriev@student.edu", role: "student" as const },
  { name: "Викторов Виктор", email: "viktorov@student.edu", role: "student" as const },
  { name: "Сергеев Сергей", email: "sergeev@student.edu", role: "student" as const },
];

// ==================== ОРГАНИЗАЦИИ (9) ====================
export const ORGANIZATIONS = [
  { name: "ПАО «Сбербанк»", iin: "7707000001", contacts: "careers@sberbank.ru", description: "Крупнейший банк России.", website: "https://sberbank.ru", verificationStatus: "approved" as const, logo: "/logos/sberbank.png" },
  { name: "ПАО «Яндекс»", iin: "7704000002", contacts: "hr@yandex.ru", description: "Ведущая IT-компания.", website: "https://yandex.ru", verificationStatus: "approved" as const, logo: "/logos/yandex.png" },
  { name: "ПАО «Газпром»", iin: "7705000003", contacts: "recruitment@gazprom.ru", description: "Энергетический гигант.", website: "https://gazprom.ru", verificationStatus: "approved" as const, logo: "/logos/gazprom.png" },
  { name: "АО «Лаборатория Касперского»", iin: "7706000004", contacts: "jobs@kaspersky.com", description: "Кибербезопасность.", website: "https://kaspersky.ru", verificationStatus: "approved" as const, logo: "/logos/kaspersky.png" },
  { name: "ПАО «Лукойл»", iin: "7708000005", contacts: "hr@lukoil.ru", description: "Нефтяная компания.", website: "https://lukoil.ru", verificationStatus: "approved" as const, logo: "/logos/lukoil.png" },
  { name: "ПАО «МТС»", iin: "7709000006", contacts: "careers@mts.ru", description: "Телеком и цифровые сервисы.", website: "https://mts.ru", verificationStatus: "approved" as const, logo: "/logos/mts.png" },
  { name: "ООО «ВКонтакте»", iin: "7743001853", contacts: "hr@vk.company", description: "Социальные сети.", website: "https://vk.company", verificationStatus: "approved" as const, logo: null },
  { name: "АО «Тинкофф Банк»", iin: "7710140679", contacts: "hr@tinkoff.ru", description: "Онлайн-банк.", website: "https://tinkoff.ru", verificationStatus: "approved" as const, logo: null },
  { name: "ООО «Авито»", iin: "7710668352", contacts: "hr@avito.ru", description: "Сервис объявлений.", website: "https://avito.ru", verificationStatus: "approved" as const, logo: null },
];

// ==================== ВАКАНСИИ (50) ====================
const createVacancies = () => {
  const vacs = [];
  const types = ["practice", "internship", "job"] as const;
  const orgCount = 9;

  for (let i = 0; i < 50; i++) {
    const orgIdx = i % orgCount;
    const type = types[i % 3];
    const isPractice = type === "practice";
    
    // Генерируем даты для практик и стажировок
    let startDate: Date | undefined = undefined;
    let endDate: Date | undefined = undefined;
    
    if (type !== "job") {
      startDate = new Date(2026, 5, 1); // 1 июня 2026
      endDate = new Date(2026, 6, 1);   // 1 июля 2026
      // Немного разнообразим даты
      startDate.setDate(startDate.getDate() + (i % 15));
      endDate.setDate(endDate.getDate() + (i % 20) + 15);
    }

    vacs.push({
      title: `${isPractice ? 'Практика:' : type === 'internship' ? 'Стажировка:' : 'Вакансия:'} ${['Frontend', 'Backend', 'Data Science', 'DevOps', 'Mobile', 'QA', 'Analyst', 'Design'][i % 8]} разработчик #${i + 1}`,
      description: `Описание для позиции #${i + 1}. Работа в крупной компании над интересными проектами.`,
      requirements: "Знание современных технологий, ответственность, желание развиваться.",
      organizationIndex: orgIdx,
      isActive: true,
      type: type,
      salary: i % 2 === 0 ? `${50000 + (i * 2000)} ₽` : undefined,
      minCourse: (i % 4) + 1,
      availableSpots: isPractice ? (i % 5) + 1 : undefined,
      startDate,
      endDate,
    });
  }
  return vacs;
};

export const VACANCIES = createVacancies();

// ==================== СВЯЗИ ВАКАНСИЙ (Автогенерация) ====================
export const VACANCY_MAJORS = VACANCIES.map((_, i) => ({ vacancyIndex: i, majorIndex: i % 5 }));
export const VACANCY_SKILLS = VACANCIES.flatMap((_, i) => [
  { vacancyIndex: i, skillIndex: i % 16 },
  { vacancyIndex: i, skillIndex: (i + 1) % 16 }
]);

// ==================== СТУДЕНТЫ (20) ====================
export const STUDENTS = Array.from({ length: 20 }).map((_, i) => ({
  userIndex: 12 + i,
  group: `ГР-${20 + (i % 3)}-${(i % 5) + 1}`,
  course: (i % 4) + 1,
  majorIndex: i % 5,
  currentPracticeType: ["educational", "production", "pre_diploma"][i % 3] as any,
  projectTheme: `Тема проекта студента #${i + 1}`,
}));

export const STUDENT_SKILLS = STUDENTS.flatMap((_, i) => [
  { studentIndex: i, skillIndex: i % 16 },
  { studentIndex: i, skillIndex: (i + 5) % 16 }
]);

export const RESUMES = STUDENTS.map((_, i) => ({
  studentIndex: i,
  bio: `Я студент #${i + 1}, активно изучаю современные технологии и ищу возможности для роста.`,
  fileUrl: `/resumes/student_${i + 1}.pdf`,
}));

// ==================== ЗАЯВКИ (Разнообразные для пагинации) ====================
const createApplications = () => {
  const apps = [];
  // Сделаем 40 заявок, чтобы увидеть пагинацию (по 10 на стр)
  for (let i = 0; i < 40; i++) {
    const studentIdx = i % 20;
    const vacancyIdx = i; // Первые 40 вакансий получат по одному отклику
    const vacancy = VACANCIES[vacancyIdx];
    const isPractice = vacancy.type === "practice";

    apps.push({
      studentIndex: studentIdx,
      vacancyIndex: vacancyIdx,
      status: i % 4 === 0 ? "approved" : i % 5 === 0 ? "rejected" : "pending",
      practiceType: isPractice ? STUDENTS[studentIdx].currentPracticeType : undefined,
      projectTheme: isPractice ? STUDENTS[studentIdx].projectTheme : undefined,
      coverLetter: `Здравствуйте! Очень хочу работать в вашей компании. Отклик #${i + 1}`,
      responseMessage: i % 4 === 0 ? "Приходите на собеседование!" : i % 5 === 0 ? "К сожалению, вы нам не подходите." : undefined,
    });
  }
  return apps;
};

export const APPLICATIONS = createApplications();

export const UNIVERSITY_STAFF = [
  { userIndex: 1, department: "Кафедра ИТ", position: "Зав. кафедрой" },
  { userIndex: 2, department: "Деканат", position: "Методист" },
];

export const ORGANIZATION_REPRESENTATIVES = Array.from({ length: 9 }).map((_, i) => ({
  userIndex: 3 + i,
  organizationIndex: i,
  position: "HR-менеджер",
}));

// Файлы для MinIO (заглушки для новых студентов)
export const MINIO_FILES = [
  ...RESUMES.map(r => ({ path: r.fileUrl.replace(/^\//, ""), content: `Resume of student ${r.studentIndex}` })),
  { path: "logos/sberbank.png", content: "LOGO" },
  { path: "logos/yandex.png", content: "LOGO" },
  { path: "logos/gazprom.png", content: "LOGO" },
  { path: "logos/kaspersky.png", content: "LOGO" },
  { path: "logos/lukoil.png", content: "LOGO" },
  { path: "logos/mts.png", content: "LOGO" },
  { path: "materials/polozhenie_praktika.pdf", content: "PDF" },
];

export const MATERIALS = [
  { title: "Положение о практике", description: "Документ", fileUrl: "/materials/polozhenie_praktika.pdf", category: "regulatory" as const, isPublic: true },
];
