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
│ id (PK)             │       │ currentPrType (ENUM)│
│ userId (FK → user)  │       │ projectTheme        │
│ group               │       └─────────────────────┘
│ course              │                 │
│ majorId (FK)        │                 │ 1:N
└─────────────────────┘                 ▼
         │                    ┌─────────────────────┐
         │ 1:1                │     application     │
         ▼                    ├─────────────────────┤
┌─────────────────────┐       │ id (PK)             │
│      resume         │       │ studentId (FK)      │
├─────────────────────┤       │ vacancyId (FK)      │
│ id (PK)             │       │ status (ENUM)       │
│ studentId (FK)      │       │ univStatus (ENUM)   │
│ bio                 │       │ practiceType (ENUM) │
│ fileUrl             │       │ projectTheme        │
│ updated_at          │       │ createdAt           │
└─────────────────────┘       └─────────────────────┘

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
                    │ organizationId (FK) │
                    │ isActive            │
                    │ type (ENUM)         │
                    │ availableSpots      │
                    │ startDate           │
                    │ endDate             │
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
```

---

## 📋 Таблицы

### student

Профили студентов.

| Колонка | Тип | Описание |
|---------|-----|----------|
| `id` | SERIAL | Первичный ключ |
| `userId` | INTEGER | FK → user.id (UNIQUE) |
| `group` | TEXT | Учебная группа |
| `course` | INTEGER | Курс (1-6) |
| `majorId` | INTEGER | FK → major.id |
| `currentPracticeType` | student_practice_type | Текущий тип практики (учебная, производственная и т.д.) |
| `projectTheme` | TEXT | Тема проекта/диплома |

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
| `isActive` | BOOLEAN | Активна ли вакансия (контролируется работодателем) |
| `type` | internship_type (ENUM) | Тип: практика, стажировка, работа |
| `salary` | TEXT | Зарплата (диапазон) |
| `minCourse` | INTEGER | Минимальный курс для подачи заявки |
| `availableSpots` | INTEGER | Количество доступных мест |
| `startDate` | TIMESTAMP | Дата начала практики/стажировки |
| `endDate` | TIMESTAMP | Дата окончания |
| `created_at` | TIMESTAMP | Дата создания |

---

### application

Отклики студентов на вакансии. Содержат "слепок" (frozen snapshot) данных студента на момент отклика.

| Колонка | Тип | Описание |
|---------|-----|----------|
| `id` | SERIAL | Первичный ключ |
| `studentId` | INTEGER | FK → student.id |
| `vacancyId` | INTEGER | FK → vacancy.id |
| `status` | application_status | Статус со стороны КОМПАНИИ |
| `universityApprovalStatus` | university_approval_status | Статус со стороны ВУЗа |
| `universityStaffId` | INTEGER | Кто из сотрудников ВУЗа обработал заявку |
| `universityComment` | TEXT | Комментарий/причина отказа от ВУЗа |
| `practiceType` | student_practice_type | Тип практики (слепок из профиля студента) |
| `projectTheme` | TEXT | Тема проекта (слепок из профиля студента) |
| `coverLetter` | TEXT | Сопроводительное письмо |
| `responseMessage` | TEXT | Ответ организации (обязателен при отказе) |
| `created_at` | TIMESTAMP | Дата создания |

---

## 🔣 ENUM типы

### university_approval_status

Статус модерации заявки на практику со стороны университета.

```sql
CREATE TYPE university_approval_status AS ENUM (
  'not_required', -- Для обычных вакансий и стажировок
  'pending',      -- Ожидает одобрения ВУЗа (для практик)
  'approved',     -- Одобрено ВУЗом -> становится доступно компании
  'rejected'      -- Отклонено ВУЗом
);
```

### student_practice_type

Типы практик в учебном процессе.

```sql
CREATE TYPE student_practice_type AS ENUM (
  'educational', -- Учебная
  'production',  -- Производственная
  'pre_diploma'  -- Преддипломная
);
```

---

## 🌱 Seed данные

Система включает мощный скрипт заполнения данных для тестирования всех сценариев, включая пагинацию.

```bash
# Запуск в Docker (рекомендуется)
docker compose --profile dev up seeder --build --force-recreate
```

**Тестовый набор данных:**
- **9 организаций** (подтвержденные и одна `pending` для тестов).
- **50 вакансий** (5 страниц пагинации).
- **20 студентов** с заполненными профилями и резюме.
- **40 откликов** с различными статусами модерации.

Полный список учетных данных выводится в консоль после завершения работы сидера.
