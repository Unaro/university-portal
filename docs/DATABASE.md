# 🗄 База данных University Portal

Документация по схеме базы данных, миграциям и работе с данными.

---

## 📋 Оглавление

- [Обзор](#обзор)
- [Диаграмма ERD](#диаграмма-erd)
- [Таблицы](#таблицы)
- [ENUM типы](#enum-типы)
- [Связи](#связи)
- [Миграции](#миграции)
- [Примеры запросов](#примеры-запросов)
- [Индексы](#индексы)
- [Триггеры](#триггеры)

---

## 📊 Обзор

**СУБД:** PostgreSQL 15  
**ORM:** Drizzle ORM  
**Подход:** Code-First (схема описывается в TypeScript)

### Расположение

```
portal_web/
├── src/
│   └── db/
│       ├── schema.ts       # Описание схемы
│       ├── index.ts        # Экспорт экземпляра db
│       ├── seeder.ts       # Скрипт заполнения
│       └── seed-data.ts    # Тестовые данные
└── drizzle/                # Миграции
    ├── 0000_<name>.sql
    └── ...
```

---

## 📐 Диаграмма ERD

```
┌─────────────────────┐       ┌─────────────────────┐
│       user          │       │       major         │
├─────────────────────┤       ├─────────────────────┤
│ id (PK)             │       │ id (PK)             │
│ name                │       │ name (UNIQUE)       │
│ email (UNIQUE)      │       │ code                │
│ emailVerified       │       └─────────────────────┘
│ image               │                 │
│ password            │                 │ 1:N
│ role (ENUM)         │                 ▼
│ created_at          │       ┌─────────────────────┐
└─────────────────────┘       │      student        │
         │                    ├─────────────────────┤
         │ 1:1                │ id (PK)             │
         ▼                    │ userId (FK → user)  │
┌─────────────────────┐       │ group               │
│     student         │       │ course              │
├─────────────────────┤       │ majorId (FK)        │
│ id (PK)             │       └─────────────────────┘
│ userId (FK → user)  │                 │
│ group               │                 │ 1:N
│ course              │                 ▼
│ majorId (FK)        │       ┌─────────────────────┐
└─────────────────────┘       │     application     │
         │                    ├─────────────────────┤
         │ 1:1                │ id (PK)             │
         ▼                    │ studentId (FK)      │
┌─────────────────────┐       │ vacancyId (FK)      │
│      resume         │       │ status (ENUM)       │
├─────────────────────┤       │ coverLetter         │
│ id (PK)             │       │ responseMessage     │
│ studentId (FK)      │       │ created_at          │
│ bio                 │       └─────────────────────┘
│ fileUrl             │
│ updated_at          │
└─────────────────────┘

┌─────────────────────┐       ┌─────────────────────┐
│       user          │       │   organization      │
├─────────────────────┤       ├─────────────────────┤
│ ...                 │       │ id (PK)             │
└─────────────────────┘       │ name                │
         │ 1:1                │ iin (UNIQUE)        │
         ▼                    │ contacts            │
┌─────────────────────┐       │ description         │
│ organization_rep    │       │ website             │
├─────────────────────┤       │ verificationStatus  │
│ id (PK)             │       │ logo                │
│ userId (FK → user)  │       │ created_at          │
│ organizationId(FK)  │       └─────────────────────┘
│ position            │                 │
└─────────────────────┘       │ 1:N
                              ▼
                    ┌─────────────────────┐
                    │      vacancy        │
                    ├─────────────────────┤
                    │ id (PK)             │
                    │ title               │
                    │ description         │
                    │ requirements        │
                    │ organizationId (FK) │
                    │ isActive            │
                    │ type (ENUM)         │
                    │ salary              │
                    │ minCourse           │
                    │ created_at          │
                    └─────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              │ 1:N           │ 1:N           │
              ▼               ▼               ▼
    ┌─────────────────┐ ┌───────────┐ ┌──────────────┐
    │   application   │ │vacancy_   │ │ vacancy_skill│
    │   (см. выше)    │ │allowed_   │ ├──────────────┤
    └─────────────────┘ │major      │ │ vacancyId    │
                        ├───────────┤ │ skillId      │
                        │ vacancyId │ └──────────────┘
                        │ majorId   │
                        └───────────┘

┌─────────────────────┐       ┌─────────────────────┐
│       skill         │       │      material       │
├─────────────────────┤       ├─────────────────────┤
│ id (PK)             │       │ id (PK)             │
│ name (UNIQUE)       │       │ title               │
└─────────────────────┘       │ description         │
         │                    │ fileUrl             │
         │ N:M                │ category (ENUM)     │
         ▼                    │ isPublic            │
┌─────────────────────┐       │ created_at          │
│    student_skill    │       └─────────────────────┘
├─────────────────────┤
│ studentId (FK)      │
│ skillId (FK)        │
└─────────────────────┘

┌─────────────────────┐
│  university_staff   │
├─────────────────────┤
│ id (PK)             │
│ userId (FK → user)  │
│ department          │
│ position            │
└─────────────────────┘
```

---

## 📋 Таблицы

### user

Пользователи системы (все роли в одной таблице).

| Колонка | Тип | Описание |
|---------|-----|----------|
| `id` | SERIAL | Первичный ключ |
| `name` | TEXT | Имя пользователя |
| `email` | TEXT | Email (уникальный) |
| `emailVerified` | TIMESTAMP | Дата подтверждения email |
| `image` | TEXT | URL аватара |
| `password` | TEXT | Хеш пароля (bcrypt) |
| `role` | role (ENUM) | Роль пользователя |
| `created_at` | TIMESTAMP | Дата создания |

**Индексы:**
- `email` — UNIQUE

---

### student

Профили студентов.

| Колонка | Тип | Описание |
|---------|-----|----------|
| `id` | SERIAL | Первичный ключ |
| `userId` | INTEGER | FK → user.id (UNIQUE) |
| `group` | TEXT | Учебная группа |
| `course` | INTEGER | Курс (1-6) |
| `majorId` | INTEGER | FK → major.id |

**Индексы:**
- `userId` — UNIQUE

---

### major

Справочник специальностей.

| Колонка | Тип | Описание |
|---------|-----|----------|
| `id` | SERIAL | Первичный ключ |
| `name` | TEXT | Название (уникальное) |
| `code` | TEXT | Код специальности |

**Индексы:**
- `name` — UNIQUE

---

### skill

Справочник навыков.

| Колонка | Тип | Описание |
|---------|-----|----------|
| `id` | SERIAL | Первичный ключ |
| `name` | TEXT | Название навыка (уникальное) |

**Индексы:**
- `name` — UNIQUE

---

### organization

Организации-партнёры.

| Колонка | Тип | Описание |
|---------|-----|----------|
| `id` | SERIAL | Первичный ключ |
| `name` | TEXT | Название организации |
| `iin` | TEXT | ИИН/БИН (уникальный) |
| `contacts` | TEXT | Контактная информация |
| `description` | TEXT | Описание |
| `website` | TEXT | Веб-сайт |
| `verificationStatus` | moderation_status (ENUM) | Статус модерации |
| `logo` | TEXT | URL логотипа |
| `created_at` | TIMESTAMP | Дата создания |

**Индексы:**
- `iin` — UNIQUE

---

### vacancy

Вакансии от организаций.

| Колонка | Тип | Описание |
|---------|-----|----------|
| `id` | SERIAL | Первичный ключ |
| `title` | TEXT | Заголовок |
| `description` | TEXT | Описание |
| `requirements` | TEXT | Требования |
| `organizationId` | INTEGER | FK → organization.id |
| `isActive` | BOOLEAN | Активна ли вакансия |
| `type` | internship_type (ENUM) | Тип практики |
| `salary` | TEXT | Зарплата (диапазон) |
| `minCourse` | INTEGER | Минимальный курс |
| `created_at` | TIMESTAMP | Дата создания |

**Индексы:**
- `organizationId`
- `isActive`
- `created_at` (DESC для сортировки)

---

### application

Отклики студентов на вакансии.

| Колонка | Тип | Описание |
|---------|-----|----------|
| `id` | SERIAL | Первичный ключ |
| `studentId` | INTEGER | FK → student.id |
| `vacancyId` | INTEGER | FK → vacancy.id |
| `status` | application_status (ENUM) | Статус отклика |
| `coverLetter` | TEXT | Сопроводительное письмо |
| `responseMessage` | TEXT | Ответ организации |
| `created_at` | TIMESTAMP | Дата создания |

**Индексы:**
- `studentId`
- `vacancyId`
- `status`

---

### resume

Резюме студентов.

| Колонка | Тип | Описание |
|---------|-----|----------|
| `id` | SERIAL | Первичный ключ |
| `studentId` | INTEGER | FK → student.id (UNIQUE) |
| `bio` | TEXT | О себе |
| `fileUrl` | TEXT | URL файла резюме |
| `updated_at` | TIMESTAMP | Дата обновления |

**Индексы:**
- `studentId` — UNIQUE

---

### material

Учебные материалы.

| Колонка | Тип | Описание |
|---------|-----|----------|
| `id` | SERIAL | Первичный ключ |
| `title` | TEXT | Заголовок |
| `description` | TEXT | Описание |
| `fileUrl` | TEXT | URL файла |
| `category` | material_category (ENUM) | Категория |
| `isPublic` | BOOLEAN | Публичный доступ |
| `created_at` | TIMESTAMP | Дата создания |

**Индексы:**
- `category`
- `isPublic`

---

### university_staff

Профили сотрудников университета.

| Колонка | Тип | Описание |
|---------|-----|----------|
| `id` | SERIAL | Первичный ключ |
| `userId` | INTEGER | FK → user.id (UNIQUE) |
| `department` | TEXT | Кафедра/отдел |
| `position` | TEXT | Должность |

**Индексы:**
- `userId` — UNIQUE

---

### organization_representative

Представители организаций.

| Колонка | Тип | Описание |
|---------|-----|----------|
| `id` | SERIAL | Первичный ключ |
| `userId` | INTEGER | FK → user.id (UNIQUE) |
| `organizationId` | INTEGER | FK → organization.id |
| `position` | TEXT | Должность |

**Индексы:**
- `userId` — UNIQUE
- `organizationId`

---

### vacancy_allowed_major

Разрешённые специальности для вакансии (связующая таблица).

| Колонка | Тип | Описание |
|---------|-----|----------|
| `vacancyId` | INTEGER | FK → vacancy.id |
| `majorId` | INTEGER | FK → major.id |

**Первичный ключ:** `(vacancyId, majorId)`

---

### vacancy_skill

Требуемые навыки для вакансии (связующая таблица).

| Колонка | Тип | Описание |
|---------|-----|----------|
| `vacancyId` | INTEGER | FK → vacancy.id |
| `skillId` | INTEGER | FK → skill.id |

**Первичный ключ:** `(vacancyId, skillId)`

---

### student_skill

Навыки студента (связующая таблица).

| Колонка | Тип | Описание |
|---------|-----|----------|
| `studentId` | INTEGER | FK → student.id |
| `skillId` | INTEGER | FK → skill.id |

**Первичный ключ:** `(studentId, skillId)`

---

## 🔣 ENUM типы

### role

Роли пользователей.

```sql
CREATE TYPE role AS ENUM (
  'student',
  'university_staff',
  'organization_representative',
  'admin'
);
```

### moderation_status

Статус модерации (для организаций и вакансий).

```sql
CREATE TYPE moderation_status AS ENUM (
  'pending',    -- На проверке
  'approved',   -- Одобрено
  'rejected'    -- Отклонено
);
```

### application_status

Статус отклика на вакансию.

```sql
CREATE TYPE application_status AS ENUM (
  'pending',    -- На рассмотрении
  'approved',   -- Одобрено
  'rejected'    -- Отклонено
);
```

### internship_type

Тип практики.

```sql
CREATE TYPE internship_type AS ENUM (
  'practice',    -- Учебная практика
  'internship',  -- Стажировка
  'job'          -- Работа
);
```

### material_category

Категория учебного материала.

```sql
CREATE TYPE material_category AS ENUM (
  'regulatory',  -- Нормативные акты
  'template',    -- Шаблоны документов
  'material'     -- Учебные материалы
);
```

---

## 🔗 Связи

### Один к одному (1:1)

| Таблица 1 | Таблица 2 | Поле |
|-----------|-----------|------|
| `user` | `student` | `student.userId` → `user.id` |
| `user` | `university_staff` | `university_staff.userId` → `user.id` |
| `user` | `organization_representative` | `org_rep.userId` → `user.id` |
| `student` | `resume` | `resume.studentId` → `student.id` |

### Один ко многим (1:N)

| Таблица 1 (Parent) | Таблица 2 (Child) | Поле |
|--------------------|-------------------|------|
| `user` | `student` | `student.userId` |
| `major` | `student` | `student.majorId` |
| `student` | `application` | `application.studentId` |
| `organization` | `vacancy` | `vacancy.organizationId` |
| `vacancy` | `application` | `application.vacancyId` |
| `organization` | `organization_representative` | `org_rep.organizationId` |

### Многие ко многим (N:M)

| Таблица 1 | Связующая таблица | Таблица 2 |
|-----------|-------------------|-----------|
| `vacancy` | `vacancy_allowed_major` | `major` |
| `vacancy` | `vacancy_skill` | `skill` |
| `student` | `student_skill` | `skill` |

---

## 🔄 Миграции

### Drizzle Kit команды

```bash
# Применить миграции
pnpm run db:push

# Создать новую миграцию
npx drizzle-kit generate

# Открыть Drizzle Studio (GUI для БД)
npx drizzle-kit studio
```

### Структура миграций

```
drizzle/
├── 0000_initial_schema.sql
├── 0001_add_indexes.sql
├── 0002_add_materials.sql
└── ...
```

### Пример миграции

```sql
-- 0000_initial_schema.sql
CREATE TYPE role AS ENUM ('student', 'university_staff', 'organization_representative', 'admin');

CREATE TABLE "user" (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password TEXT,
  role role DEFAULT 'student' NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE "student" (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL UNIQUE REFERENCES "user"(id) ON DELETE CASCADE,
  "group" TEXT,
  course INTEGER DEFAULT 1
);
```

---

## 📝 Примеры запросов

### Получить все активные вакансии с организацией

```typescript
import { db } from "@/db";
import { vacancies, organizations } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";

const activeVacancies = await db
  .select({
    vacancy: vacancies,
    organization: organizations,
  })
  .from(vacancies)
  .innerJoin(organizations, eq(vacancies.organizationId, organizations.id))
  .where(
    and(
      eq(vacancies.isActive, true),
      eq(organizations.verificationStatus, "approved")
    )
  )
  .orderBy(desc(vacancies.createdAt))
  .limit(10);
```

### Получить студента с резюме и навыками

```typescript
import { db } from "@/db";
import { students, resumes, studentSkills, skills, majors } from "@/db/schema";
import { eq } from "drizzle-orm";

const studentData = await db
  .select({
    student: students,
    resume: resumes,
    skills: skills,
    major: majors,
  })
  .from(students)
  .leftJoin(resumes, eq(students.id, resumes.studentId))
  .leftJoin(studentSkills, eq(students.id, studentSkills.studentId))
  .leftJoin(skills, eq(studentSkills.skillId, skills.id))
  .leftJoin(majors, eq(students.majorId, majors.id))
  .where(eq(students.userId, userId))
  .limit(1);
```

### Получить отклики студента с вакансиями

```typescript
import { db } from "@/db";
import { applications, vacancies, organizations } from "@/db/schema";

const applications = await db
  .select({
    application: applications,
    vacancy: vacancies,
    organization: organizations,
  })
  .from(applications)
  .innerJoin(vacancies, eq(applications.vacancyId, vacancies.id))
  .innerJoin(organizations, eq(vacancies.organizationId, organizations.id))
  .where(eq(applications.studentId, studentId));
```

### Получить вакансию с требованиями

```typescript
import { db } from "@/db";
import { vacancies, vacancySkills, skills, vacancyAllowedMajors, majors } from "@/db/schema";

const vacancyDetails = await db
  .select({
    vacancy: vacancies,
    skill: skills,
    major: majors,
  })
  .from(vacancies)
  .leftJoin(vacancySkills, eq(vacancies.id, vacancySkills.vacancyId))
  .leftJoin(skills, eq(vacancySkills.skillId, skills.id))
  .leftJoin(vacancyAllowedMajors, eq(vacancies.id, vacancyAllowedMajors.vacancyId))
  .leftJoin(majors, eq(vacancyAllowedMajors.majorId, majors.id))
  .where(eq(vacancies.id, vacancyId));
```

### Транзакция: создание вакансии с навыками

```typescript
import { db } from "@/db";

await db.transaction(async (tx) => {
  // Создаём вакансию
  const [vacancy] = await tx
    .insert(vacancies)
    .values({
      title: "Разработчик",
      description: "Описание",
      organizationId: 1,
    })
    .returning();
  
  // Добавляем требуемые навыки
  if (skillIds.length > 0) {
    await tx.insert(vacancySkills).values(
      skillIds.map(skillId => ({
        vacancyId: vacancy.id,
        skillId,
      }))
    );
  }
  
  return vacancy;
});
```

### Агрегация: статистика по откликам

```typescript
import { db } from "@/db";
import { applications } from "@/db/schema";
import { count, eq } from "drizzle-orm";

const stats = await db.transaction(async (tx) => {
  const [pending] = await tx
    .select({ value: count() })
    .from(applications)
    .where(eq(applications.status, "pending"));
  
  const [approved] = await tx
    .select({ value: count() })
    .from(applications)
    .where(eq(applications.status, "approved"));
  
  const [rejected] = await tx
    .select({ value: count() })
    .from(applications)
    .where(eq(applications.status, "rejected"));
  
  return {
    pending: pending.value,
    approved: approved.value,
    rejected: rejected.value,
  };
});
```

---

## 📇 Индексы

### Рекомендуемые индексы

```sql
-- Для ускорения поиска вакансий
CREATE INDEX idx_vacancies_organization ON vacancies(organization_id);
CREATE INDEX idx_vacancies_active ON vacancies(is_active);
CREATE INDEX idx_vacancies_created ON vacancies(created_at DESC);

-- Для ускорения поиска откликов
CREATE INDEX idx_applications_student ON applications(student_id);
CREATE INDEX idx_applications_vacancy ON applications(vacancy_id);
CREATE INDEX idx_applications_status ON applications(status);

-- Для ускорения поиска организаций
CREATE INDEX idx_org_verification ON organizations(verification_status);

-- Для ускорения поиска пользователей
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_email ON users(email);
```

---

## 🔒 Ограничения (Constraints)

### Foreign Keys с каскадным удалением

```typescript
// При удалении пользователя удаляются его профили
userId: integer("user_id")
  .references(() => users.id, { onDelete: "cascade" })

// При удалении организации удаляются вакансии
organizationId: integer("organization_id")
  .references(() => organizations.id, { onDelete: "cascade" })

// При удалении вакансии удаляются отклики
vacancyId: integer("vacancy_id")
  .references(() => vacancies.id, { onDelete: "cascade" })
```

### Unique ограничения

```typescript
// Уникальный email
email: text("email").notNull().unique()

// Уникальный ИИН организации
iin: text("iin").notNull().unique()

// Уникальное название специальности
name: text("name").notNull().unique()

// Уникальное резюме на студента
studentId: ... .unique()
```

---

## 🌱 Seed данные

### Заполнение тестовыми данными

```bash
# Полное заполнение (с очисткой)
pnpm run db:seeder

# Только очистка БД
pnpm run db:clear
```

### Тестовые пользователи

| Роль | Email | Пароль |
|------|-------|--------|
| Admin | admin@university.edu | password123 |
| Student | akhmetov@student.edu | password123 |
| Org Rep | kozlov@yandex.kz | password123 |

См. полную документацию в [SEEDER.md](../portal_web/SEEDER.md).
