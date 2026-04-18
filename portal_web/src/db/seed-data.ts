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
  // Admin
  {
    name: "Администратор",
    email: "admin@university.edu",
    role: "admin" as const,
  },
  // University Staff
  {
    name: "Иванов Петр Сергеевич",
    email: "ivanov@university.edu",
    role: "university_staff" as const,
  },
  {
    name: "Смирнова Елена Александровна",
    email: "smirnova@university.edu",
    role: "university_staff" as const,
  },
  // Organization Representatives
  {
    name: "Козлов Дмитрий Михайлович",
    email: "kozlov@yandex.kz",
    role: "organization_representative" as const,
  },
  {
    name: "Нурсултанова Алия Ержановна",
    email: "nursultanova@sberbank.ru",
    role: "organization_representative" as const,
  },
  {
    name: "Волков Сергей",
    email: "volkov@gazprom.ru",
    role: "organization_representative" as const,
  },
  {
    name: "Морозова Анна",
    email: "morozova@kaspersky.com",
    role: "organization_representative" as const,
  },
  {
    name: "Соколов Иван",
    email: "sokolov@mts.ru",
    role: "organization_representative" as const,
  },
  {
    name: "Лебедева Мария",
    email: "lebedeva@vk.company",
    role: "organization_representative" as const,
  },
  // Students
  {
    name: "Ахметов Арман",
    email: "akhmetov@student.edu",
    role: "student" as const,
  },
  {
    name: "Ким Юлия",
    email: "kim@student.edu",
    role: "student" as const,
  },
  {
    name: "Омаров Нурлан",
    email: "omarov@student.edu",
    role: "student" as const,
  },
  {
    name: "Ибраева Сабина",
    email: "ibraeva@student.edu",
    role: "student" as const,
  },
  {
    name: "Тимофеев Алексей",
    email: "timofeev@student.edu",
    role: "student" as const,
  },
];

// ==================== ОРГАНИЗАЦИИ (РОССИЙСКИЕ КОМПАНИИ) ====================
export const ORGANIZATIONS = [
  {
    name: "ПАО «Сбербанк»",
    iin: "7707000001",
    contacts: "careers@sberbank.ru, +7 (495) 500-55-50",
    description:
      "Крупнейший банк в России, предоставляющий широкий спектр финансовых услуг и цифровых решений.",
    website: "https://sberbank.ru",
    verificationStatus: "approved" as const,
    logo: "/logos/sberbank.png",
  },
  {
    name: "ПАО «Яндекс»",
    iin: "7704000002",
    contacts: "hr@yandex.ru",
    description:
      "Ведущая российская технологическая компания, разрабатывающая интернет-сервисы и продукты на основе машинного обучения.",
    website: "https://yandex.ru",
    verificationStatus: "approved" as const,
    logo: "/logos/yandex.png",
  },
  {
    name: "ПАО «Газпром»",
    iin: "7705000003",
    contacts: "recruitment@gazprom.ru, +7 (495) 719-30-01",
    description:
      "Крупнейшая нефтегазовая компания России. Занимается разведкой, добычей и переработкой углеводородов.",
    website: "https://gazprom.ru",
    verificationStatus: "approved" as const,
    logo: "/logos/gazprom.png",
  },
  {
    name: "АО «Лаборатория Касперского»",
    iin: "7706000004",
    contacts: "jobs@kaspersky.com",
    description:
      "Международная компания, специализирующаяся на разработке решений в области информационной безопасности.",
    website: "https://kaspersky.ru",
    verificationStatus: "approved" as const,
    logo: "/logos/kaspersky.png",
  },
  {
    name: "ПАО «Лукойл»",
    iin: "7708000005",
    contacts: "hr@lukoil.ru, +7 (495) 627-44-80",
    description:
      "Одна из крупнейших нефтегазовых компаний мира. Занимается добычей, переработкой и сбытом нефти и газа.",
    website: "https://lukoil.ru",
    verificationStatus: "approved" as const,
    logo: "/logos/lukoil.png",
  },
  {
    name: "ПАО «МТС»",
    iin: "7709000006",
    contacts: "careers@mts.ru",
    description:
      "Крупнейший российский оператор сотовой связи и поставщик цифровых услуг.",
    website: "https://mts.ru",
    verificationStatus: "approved" as const,
    logo: "/logos/mts.png",
  },
  {
    name: "ООО «ВКонтакте»",
    iin: "7743001853",
    contacts: "hr@vk.company",
    description:
      "Российская технологическая компания, развивающая экосистему сервисов (VK, Одноклассники, Почта Mail.ru).",
    website: "https://vk.company",
    verificationStatus: "pending" as const,
    logo: null,
  },
];

// ==================== ВАКАНСИИ ====================
export const VACANCIES = [
  {
    title: "Стажер-разработчик JavaScript/TypeScript",
    description:
      "Приглашаем студента старших курсов на стажировку по направлению frontend/backend разработки. Вы будете работать над реальными проектами под руководством опытных наставников.",
    requirements:
      "Знание JavaScript/TypeScript, опыт работы с React или Node.js, желание учиться и развиваться.",
    organizationIndex: 1, // Яндекс
    isActive: true,
    type: "internship" as const,
    salary: undefined, // Неоплачиваемая стажировка
    minCourse: 3,
  },
  {
    title: "Младший Python-разработчик",
    description:
      "Открыта вакансия на позицию младшего разработчика в команду backend-разработки. Работа с большими данными, создание API, интеграция с внешними системами.",
    requirements:
      "Знание Python, понимание ООП, опыт работы с SQL, базовые знания Django или FastAPI.",
    organizationIndex: 0, // Сбербанк
    isActive: true,
    type: "job" as const,
    salary: "180 000 - 250 000 ₽",
    minCourse: 4,
  },
  {
    title: "Стажер в отдел цифровых решений (Практика)",
    description:
      "Стажировка для студентов технических специальностей. Участие в разработке банковских приложений, работа с микросервисной архитектурой.",
    requirements:
      "Знание Java или C#, понимание принципов REST API, готовность работать 20-30 часов в неделю.",
    organizationIndex: 0, // Сбербанк
    isActive: true,
    type: "practice" as const,
    salary: "40 000 ₽",
    minCourse: 2,
  },
  {
    title: "Frontend-разработчик (React)",
    description:
      "Разработка пользовательских интерфейсов для экосистемы сервисов. Работа в команде опытных разработчиков, код-ревью, митапы.",
    requirements:
      "Опыт работы с React, знание TypeScript, понимание принципов responsive design, опыт работы с Git.",
    organizationIndex: 1, // Яндекс
    isActive: true,
    type: "job" as const,
    salary: "220 000 - 350 000 ₽",
    minCourse: 4,
  },
  {
    title: "Стажер-аналитик данных",
    description:
      "Анализ данных, построение отчетов и дашбордов, работа с SQL и Python. Возможность перехода на полную занятость после окончания вуза.",
    requirements:
      "Знание SQL, Python, базовая статистика, внимательность к деталям.",
    organizationIndex: 0, // Сбербанк
    isActive: true,
    type: "internship" as const,
    salary: undefined, // Неоплачиваемая стажировка
    minCourse: 3,
  },
  {
    title: "Java-разработчик (Graduate Program)",
    description:
      "Программа для выпускников и студентов последних курсов. Работа над международными проектами, менторство, обучение.",
    requirements:
      "Знание Java, Spring, SQL, английский язык не ниже Intermediate.",
    organizationIndex: 3, // Лаборатория Касперского
    isActive: false,
    type: "job" as const,
    salary: "300 000 - 450 000 ₽",
    minCourse: 4,
  },
  {
    title: "Летняя практика: Информационная безопасность",
    description:
      "Участие в разработке и тестировании антивирусных решений. Исследование угроз безопасности, анализ вредоносного ПО.",
    requirements:
      "Знание C++, Python, понимание принципов сетевой безопасности, желание развиваться в сфере кибербезопасности.",
    organizationIndex: 3, // Лаборатория Касперского
    isActive: true,
    type: "practice" as const,
    salary: undefined, // Неоплачиваемая стажировка
    minCourse: 3,
  },
  {
    title: "Стажер в IT-отдел",
    description:
      "Поддержка и развитие внутренних корпоративных систем. Работа с базами данных, написание скриптов автоматизации.",
    requirements:
      "Базовые знания SQL, Python или PowerShell, ответственность, внимательность к деталям.",
    organizationIndex: 2, // Газпром
    isActive: true,
    type: "internship" as const,
    salary: undefined, // Неоплачиваемая стажировка
    minCourse: 2,
  },
  {
    title: "Производственная практика в телеком-отделе",
    description:
      "Участие в разработке и тестировании телекоммуникационных систем. Работа с сетевыми протоколами и оборудованием.",
    requirements:
      "Знание основ сетевых технологий, Linux, желание учиться. Опыт работы с Docker будет преимуществом.",
    organizationIndex: 5, // МТС
    isActive: true,
    type: "practice" as const,
    salary: "30 000 ₽",
    minCourse: 2,
  },
  {
    title: "Преддипломная практика: Аналитика и СУБД",
    description:
      "Практика для выпускников. Проектирование архитектуры баз данных для высоконагруженных систем.",
    requirements:
      "Отличное знание SQL, понимание принципов работы реляционных СУБД.",
    organizationIndex: 1, // Яндекс
    isActive: true,
    type: "practice" as const,
    salary: "50 000 ₽",
    minCourse: 4,
  },
  {
    title: "Стажер UX/UI дизайнер (Скрытая вакансия)",
    description:
      "Стажировка в социальной сети. Вакансия не должна отображаться, так как компания еще не подтверждена.",
    requirements:
      "Знание Figma, наличие портфолио.",
    organizationIndex: 6, // ВКонтакте
    isActive: true,
    type: "internship" as const,
    salary: undefined,
    minCourse: 2,
  }
];

// ==================== СВЯЗИ ВАКАНСИЙ СО СПЕЦИАЛЬНОСТЯМИ ====================
export const VACANCY_MAJORS = [
  // JavaScript стажер (Яндекс) - для ИС и ПИ
  { vacancyIndex: 0, majorIndex: 0 },
  { vacancyIndex: 0, majorIndex: 1 },
  // Python разработчик (Сбербанк) - для ПИ и Прикладной математики
  { vacancyIndex: 1, majorIndex: 1 },
  { vacancyIndex: 1, majorIndex: 2 },
  // Стажер в банк (Сбербанк) - для всех технических
  { vacancyIndex: 2, majorIndex: 0 },
  { vacancyIndex: 2, majorIndex: 1 },
  { vacancyIndex: 2, majorIndex: 2 },
  // Frontend React (Яндекс) - для ИС и ПИ
  { vacancyIndex: 3, majorIndex: 0 },
  { vacancyIndex: 3, majorIndex: 1 },
  // Аналитик данных (Сбербанк) - для Прикладной математики и ПИ
  { vacancyIndex: 4, majorIndex: 2 },
  { vacancyIndex: 4, majorIndex: 1 },
  // Java Касперского - для ПИ
  { vacancyIndex: 5, majorIndex: 1 },
  // Стажер по ИБ (Касперский) - для ПИ и ИС
  { vacancyIndex: 6, majorIndex: 1 },
  { vacancyIndex: 6, majorIndex: 0 },
  // Стажер в Газпром - для всех технических
  { vacancyIndex: 7, majorIndex: 0 },
  { vacancyIndex: 7, majorIndex: 1 },
  // МТС телекоммуникации - для ИС и ПИ
  { vacancyIndex: 8, majorIndex: 0 },
  { vacancyIndex: 8, majorIndex: 1 },
  // Практика СУБД (Яндекс)
  { vacancyIndex: 9, majorIndex: 0 },
  { vacancyIndex: 9, majorIndex: 1 },
];

// ==================== СВЯЗИ ВАКАНСИЙ С НАВЫКАМИ ====================
export const VACANCY_SKILLS = [
  // JavaScript стажер (Яндекс)
  { vacancyIndex: 0, skillIndex: 0 }, // JavaScript
  { vacancyIndex: 0, skillIndex: 1 }, // TypeScript
  { vacancyIndex: 0, skillIndex: 2 }, // React
  { vacancyIndex: 0, skillIndex: 4 }, // Node.js
  // Python разработчик (Сбербанк)
  { vacancyIndex: 1, skillIndex: 5 }, // Python
  { vacancyIndex: 1, skillIndex: 8 }, // SQL
  { vacancyIndex: 1, skillIndex: 9 }, // PostgreSQL
  // Стажер в банк (Сбербанк)
  { vacancyIndex: 2, skillIndex: 6 }, // Java
  { vacancyIndex: 2, skillIndex: 8 }, // SQL
  // Frontend React (Яндекс)
  { vacancyIndex: 3, skillIndex: 0 }, // JavaScript
  { vacancyIndex: 3, skillIndex: 1 }, // TypeScript
  { vacancyIndex: 3, skillIndex: 2 }, // React
  { vacancyIndex: 3, skillIndex: 11 }, // Git
  // Аналитик данных (Сбербанк)
  { vacancyIndex: 4, skillIndex: 5 }, // Python
  { vacancyIndex: 4, skillIndex: 8 }, // SQL
  // Java Касперского
  { vacancyIndex: 5, skillIndex: 6 }, // Java
  { vacancyIndex: 5, skillIndex: 7 }, // Spring
  { vacancyIndex: 5, skillIndex: 8 }, // SQL
  // Стажер по ИБ (Касперский)
  { vacancyIndex: 6, skillIndex: 14 }, // C++
  { vacancyIndex: 6, skillIndex: 5 }, // Python
  // Стажер в Газпром
  { vacancyIndex: 7, skillIndex: 8 }, // SQL
  { vacancyIndex: 7, skillIndex: 5 }, // Python
  // МТС телекоммуникации
  { vacancyIndex: 8, skillIndex: 10 }, // Docker
  { vacancyIndex: 8, skillIndex: 11 }, // Git
  // Практика СУБД (Яндекс)
  { vacancyIndex: 9, skillIndex: 8 }, // SQL
  { vacancyIndex: 9, skillIndex: 9 }, // PostgreSQL
];

// ==================== СТУДЕНТЫ ====================
export const STUDENTS = [
  {
    userIndex: 9, // Ахметов Арман
    group: "ИС-20-1",
    course: 3,
    majorIndex: 0, // Информационные системы
    currentPracticeType: "production" as const,
    projectTheme: "Разработка портала для ВУЗа",
  },
  {
    userIndex: 10, // Ким Юлия
    group: "ПИ-19-1",
    course: 4,
    majorIndex: 1, // Программная инженерия
    currentPracticeType: "pre_diploma" as const,
    projectTheme: "Оптимизация баз данных для высоконагруженных систем",
  },
  {
    userIndex: 11, // Омаров Нурлан
    group: "ИС-21-2",
    course: 2,
    majorIndex: 0, // Информационные системы
    currentPracticeType: "educational" as const,
    projectTheme: "Разработка микросервиса на Java",
  },
  {
    userIndex: 12, // Ибраева Сабина
    group: "МЕН-20-1",
    course: 3,
    majorIndex: 3, // Менеджмент
    currentPracticeType: "production" as const,
    projectTheme: "Анализ бизнес-процессов ИТ-компании",
  },
  {
    userIndex: 13, // Тимофеев Алексей
    group: "ПИ-20-1",
    course: 3,
    majorIndex: 1, // Программная инженерия
    currentPracticeType: "production" as const,
    projectTheme: "Создание UI/UX дизайна мобильного приложения",
  },
];

// ==================== НАВЫКИ СТУДЕНТОВ ====================
export const STUDENT_SKILLS = [
  // Ахметов Арман
  { studentIndex: 0, skillIndex: 0 }, // JavaScript
  { studentIndex: 0, skillIndex: 1 }, // TypeScript
  { studentIndex: 0, skillIndex: 2 }, // React
  { studentIndex: 0, skillIndex: 4 }, // Node.js
  // Ким Юлия
  { studentIndex: 1, skillIndex: 5 }, // Python
  { studentIndex: 1, skillIndex: 8 }, // SQL
  { studentIndex: 1, skillIndex: 9 }, // PostgreSQL
  { studentIndex: 1, skillIndex: 11 }, // Git
  // Омаров Нурлан
  { studentIndex: 2, skillIndex: 6 }, // Java
  { studentIndex: 2, skillIndex: 7 }, // Spring
  { studentIndex: 2, skillIndex: 8 }, // SQL
  // Ибраева Сабина
  { studentIndex: 3, skillIndex: 13 }, // 1C
  { studentIndex: 3, skillIndex: 8 }, // SQL
  // Тимофеев Алексей
  { studentIndex: 4, skillIndex: 0 }, // JavaScript
  { studentIndex: 4, skillIndex: 2 }, // React
  { studentIndex: 4, skillIndex: 3 }, // Next.js
  { studentIndex: 4, skillIndex: 12 }, // Figma
];

// ==================== РЕЗЮМЕ ====================
export const RESUMES = [
  {
    studentIndex: 0,
    bio: "Студент 3 курса, специализируюсь на веб-разработке. Имею опыт создания SPA на React и Node.js. Ищу стажировку в IT-компании.",
    fileUrl: "/resumes/akhmetov.pdf",
  },
  {
    studentIndex: 1,
    bio: "Студент 4 курса, интересуюсь backend-разработкой и базами данных. Изучаю Python и PostgreSQL. Готова к работе над серьезными проектами.",
    fileUrl: "/resumes/kim.pdf",
  },
  {
    studentIndex: 2,
    bio: "Студент 2 курса, изучаю Java и Spring Framework. Хочу развиваться в направлении enterprise-разработки.",
    fileUrl: "/resumes/omarov.pdf",
  },
  {
    studentIndex: 3,
    bio: "Студент 3 курса по направлению Менеджмент. Интересуюсь управлением проектами и бизнес-аналитикой.",
    fileUrl: "/resumes/ibraeva.pdf",
  },
  {
    studentIndex: 4,
    bio: "Студент 3 курса, увлекаюсь frontend-разработкой и UI/UX дизайном. Создал несколько проектов на Next.js.",
    fileUrl: "/resumes/timofeev.pdf",
  },
];

// ==================== ЗАЯВКИ НА ВАКАНСИИ ====================
export const APPLICATIONS = [
  {
    studentIndex: 0, // Ахметов
    vacancyIndex: 0, // JavaScript стажер (Яндекс)
    status: "pending" as const,
    coverLetter:
      "Здравствуйте! Меня заинтересовала ваша вакансия. Имею опыт работы с JavaScript и React, готов учиться и развиваться в вашей компании.",
  },
  {
    studentIndex: 0, // Ахметов
    vacancyIndex: 3, // Frontend React (Яндекс)
    status: "approved" as const,
    coverLetter:
      "Очень хочу попасть в команду Яндекс! Мечтаю работать над продуктами, которыми пользуются миллионы.",
    responseMessage:
      "Ваша кандидатура одобрена. Приглашаем на собеседование в понедельник в 14:00.",
  },
  {
    studentIndex: 1, // Ким
    vacancyIndex: 1, // Python разработчик (Сбербанк)
    status: "pending" as const,
    coverLetter:
      "Имею хорошие знания Python и SQL, изучаю PostgreSQL. Готова приступить к работе.",
  },
  {
    studentIndex: 1, // Ким
    vacancyIndex: 4, // Аналитик данных (Сбербанк)
    status: "approved" as const,
    coverLetter:
      "Интересуюсь анализом данных, имею опыт работы с pandas и numpy в учебных проектах.",
    responseMessage:
      "Отлично! Мы рассмотрели ваше резюме и хотели бы пригласить вас на техническое интервью.",
  },
  {
    studentIndex: 2, // Омаров
    vacancyIndex: 2, // Стажер в банк (Сбербанк - ПРАКТИКА)
    status: "rejected" as const,
    practiceType: "educational" as const,
    projectTheme: "Изучение внутренних процессов банковской сферы",
    coverLetter:
      "Хочу пройти стажировку в банке для получения опыта enterprise-разработки.",
    responseMessage:
      "К сожалению, мы выбрали других кандидатов. Желаем удачи в поиске стажировки!",
  },
  {
    studentIndex: 2, // Омаров
    vacancyIndex: 5, // Java Касперского
    status: "pending" as const,
    coverLetter:
      "Мечтаю работать в международной компании. Изучаю Java и Spring, готов показать хорошие результаты.",
  },
  {
    studentIndex: 4, // Тимофеев
    vacancyIndex: 3, // Frontend React (Яндекс)
    status: "pending" as const,
    coverLetter:
      "Увлекаюсь frontend-разработкой, имею опыт создания проектов на Next.js. Буду рад возможности работать в Яндекс!",
  },
  {
    studentIndex: 0, // Ахметов
    vacancyIndex: 6, // ИБ (Касперский - ПРАКТИКА)
    status: "pending" as const,
    practiceType: "production" as const,
    projectTheme: "Разработка портала для ВУЗа",
    coverLetter:
      "Интересуюсь информационной безопасностью, хочу развиваться в этой сфере. Готов учиться и применять свои знания на практике.",
  },
  {
    studentIndex: 2, // Омаров
    vacancyIndex: 7, // Стажер в Газпром
    status: "pending" as const,
    coverLetter:
      "Хочу получить опыт работы в крупной нефтегазовой компании. Готов выполнять задачи по автоматизации и поддержке систем.",
  },
  {
    studentIndex: 3, // Ибраева
    vacancyIndex: 8, // Телеком (МТС - ПРАКТИКА)
    status: "pending" as const,
    practiceType: "production" as const,
    projectTheme: "Анализ бизнес-процессов ИТ-компании",
    coverLetter: "Очень заинтересована в практике в вашей компании.",
  },
  {
    studentIndex: 1, // Ким
    vacancyIndex: 9, // СУБД (Яндекс - ПРАКТИКА)
    status: "pending" as const,
    practiceType: "pre_diploma" as const,
    projectTheme: "Оптимизация баз данных для высоконагруженных систем",
    coverLetter: "Обожаю базы данных и оптимизацию запросов. Готова работать и учиться.",
  }
];

// ==================== ПРЕПОДАВАТЕЛИ ====================
export const UNIVERSITY_STAFF = [
  {
    userIndex: 1, // Иванов П.С.
    department: "Кафедра информационных систем",
    position: "Доцент",
  },
  {
    userIndex: 2, // Смирнова Е.А.
    department: "Кафедра программной инженерии",
    position: "Старший преподаватель",
  },
];

// ==================== ПРЕДСТАВИТЕЛИ ОРГАНИЗАЦИЙ ====================
export const ORGANIZATION_REPRESENTATIVES = [
  {
    userIndex: 3, // Козлов Д.М.
    organizationIndex: 1, // Яндекс
    position: "HR-директор",
  },
  {
    userIndex: 4, // Нурсултанова А.Е.
    organizationIndex: 0, // Сбербанк
    position: "Менеджер по персоналу",
  },
  {
    userIndex: 5, // Волков Сергей
    organizationIndex: 2, // Газпром
    position: "HR-специалист",
  },
  {
    userIndex: 6, // Морозова Анна
    organizationIndex: 3, // Лаборатория Касперского
    position: "Recruiter",
  },
  {
    userIndex: 7, // Соколов Иван
    organizationIndex: 5, // МТС
    position: "HR",
  },
  {
    userIndex: 8, // Лебедева Мария
    organizationIndex: 6, // VK
    position: "HR",
  },
];

// ==================== ФАЙЛЫ ДЛЯ MINIO ====================
// Содержимое тестовых файлов для загрузки в MinIO
export const MINIO_FILES = [
  // Резюме студентов
  { path: "resumes/akhmetov.pdf", content: "Резюме: Ахметов Арман\nСпециальность: Информационные системы и технологии\nНавыки: JavaScript, TypeScript, React, Node.js" },
  { path: "resumes/kim.pdf", content: "Резюме: Ким Юлия\nСпециальность: Программная инженерия\nНавыки: Python, SQL, PostgreSQL, Git" },
  { path: "resumes/omarov.pdf", content: "Резюме: Омаров Нурлан\nСпециальность: Информационные системы и технологии\nНавыки: Java, Spring, SQL" },
  { path: "resumes/ibraeva.pdf", content: "Резюме: Ибраева Сабина\nСпециальность: Менеджмент\nНавыки: 1C, SQL, Управление проектами" },
  { path: "resumes/timofeev.pdf", content: "Резюме: Тимофеев Алексей\nСпециальность: Программная инженерия\nНавыки: JavaScript, React, Next.js, Figma" },

  // Материалы
  { path: "materials/polozhenie_praktika.pdf", content: "ПОЛОЖЕНИЕ О ПРАКТИКЕ СТУДЕНТОВ\n\n1. Общие положения\n1.1. Настоящее положение регламентирует порядок прохождения производственной практики студентами университета.\n1.2. Производственная практика является обязательной частью образовательной программы." },
  { path: "materials/shablon_dnevnika.docx", content: "ДНЕВНИК ПРАКТИКИ\n\nСтудент: ______________________\nГруппа: ______________________\nМесто практики: ______________" },
  { path: "materials/metodichka_otchet.pdf", content: "МЕТОДИЧЕСКИЕ УКАЗАНИЯ ПО НАПИСАНИЮ ОТЧЕТА\n\n1. Структура отчета:\n   - Титульный лист\n   - Содержание\n   - Введение\n   - Основная часть\n   - Заключение" },
  { path: "materials/spisok_kompaniy.xlsx", content: "СПИСОК КОМПАНИЙ-ПАРТНЕРОВ\n\n1. ПАО «Сбербанк»\n2. ПАО «Яндекс»\n3. ПАО «Газпром»\n4. АО «Лаборатория Касперского»" },
  { path: "materials/dogovor_praktika.pdf", content: "ДОГОВОР О ПРОХОЖДЕНИИ ПРАКТИКИ\n\nг. Москва                                              \"___\" _________ 20__ г.\n\nУниверситет в лице ________________" },
  { path: "materials/pamyatka.pdf", content: "ПАМЯТКА СТУДЕНТУ-ПРАКТИКАНТУ\n\n1. В первый день практики:\n   - Представьтесь руководителю\n   - Изучите правила распорядка" },
  { path: "materials/prikaz_napravlenie.pdf", content: "ПРИКАЗ О НАПРАВЛЕНИИ НА ПРАКТИКУ\n\ng. Москва                                              \"___\" _________ 20__ г." },
  { path: "materials/kalendar_plan.xlsx", content: "КАЛЕНДАРНЫЙ ПЛАН ПРАКТИКИ\n\n| Этап | Сроки | Ответственный |\n|------|-------|---------------|" },

  // Логотипы (заглушки)
  { path: "logos/sberbank.png", content: "SBERBANK_LOGO" },
  { path: "logos/yandex.png", content: "YANDEX_LOGO" },
  { path: "logos/gazprom.png", content: "GAZPROM_LOGO" },
  { path: "logos/kaspersky.png", content: "KASPERSKY_LOGO" },
  { path: "logos/lukoil.png", content: "LUKOIL_LOGO" },
  { path: "logos/mts.png", content: "MTS_LOGO" },
];

// ==================== МАТЕРИАЛЫ ====================
export const MATERIALS = [
  {
    title: "Положение о практике студентов",
    description:
      "Официальный документ, регламентирующий порядок прохождения производственной практики студентами университета.",
    fileUrl: "/materials/polozhenie_praktika.pdf",
    category: "regulatory" as const,
    isPublic: true,
  },
  {
    title: "Шаблон дневника практики",
    description:
      "Образец заполнения дневника практики для студентов всех специальностей.",
    fileUrl: "/materials/shablon_dnevnika.docx",
    category: "template" as const,
    isPublic: true,
  },
  {
    title: "Методические указания по написанию отчета",
    description:
      "Рекомендации по оформлению и содержанию отчета по производственной практике.",
    fileUrl: "/materials/metodichka_otchet.pdf",
    category: "material" as const,
    isPublic: true,
  },
  {
    title: "Список компаний-партнеров",
    description:
      "Актуальный перечень организаций, предоставляющих места для практики студентам.",
    fileUrl: "/materials/spisok_kompaniy.xlsx",
    category: "material" as const,
    isPublic: true,
  },
  {
    title: "Договор о прохождении практики",
    description:
      "Типовая форма трехстороннего договора между университетом, студентом и организацией.",
    fileUrl: "/materials/dogovor_praktika.pdf",
    category: "template" as const,
    isPublic: true,
  },
  {
    title: "Памятка студенту-практиканту",
    description:
      "Краткое руководство с основными правилами и рекомендациями для студентов на практике.",
    fileUrl: "/materials/pamyatka.pdf",
    category: "material" as const,
    isPublic: true,
  },
  {
    title: "Приказ о направлении на практику",
    description:
      "Образец приказа о направлении студентов на производственную практику.",
    fileUrl: "/materials/prikaz_napravlenie.pdf",
    category: "template" as const,
    isPublic: false,
  },
  {
    title: "Календарный план практики",
    description:
      "График прохождения практики с указанием ключевых этапов и сроков.",
    fileUrl: "/materials/kalendar_plan.xlsx",
    category: "material" as const,
    isPublic: true,
  },
];
