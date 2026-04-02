# 🏗 Архитектура University Portal

Этот документ описывает архитектурные решения и паттерны, используемые в проекте.

---

## 📋 Оглавление

- [Обзор архитектуры](#обзор-архитектуры)
- [Feature-Sliced Design](#feature-sliced-design)
- [Next.js App Router](#nextjs-app-router)
- [Server Components vs Client Components](#server-components-vs-client-components)
- [Server Actions](#server-actions)
- [Работа с базой данных](#работа-с-базой-данных)
- [Аутентификация](#аутентификация)
- [Загрузка файлов](#загрузка-файлов)
- [Валидация данных](#валидация-данных)
- [Управление состоянием](#управление-состоянием)

---

## 📐 Обзор архитектуры

### Диаграмма компонентов

```
┌──────────────────────────────────────────────────────────────────┐
│                         Client Layer                             │
│  ┌────────────┐  ┌────────────┐  ┌────────────────────────────┐  │
│  │   Pages    │  │   Widgets  │  │      UI Components         │  │
│  │  (Views)   │  │            │  │   (shadcn/ui + custom)     │  │
│  └────────────┘  └────────────┘  └────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│                      Business Logic Layer                        │
│  ┌────────────────────┐         ┌─────────────────────────────┐  │
│  │     Features       │         │        Entities             │  │
│  │  (use cases)       │         │   (business models)         │  │
│  └────────────────────┘         └─────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│                       Data Access Layer                          │
│  ┌────────────────────┐         ┌─────────────────────────────┐  │
│  │   Server Actions   │         │       Drizzle ORM           │  │
│  │   (API Routes)     │         │      (Schema + Queries)     │  │
│  └────────────────────┘         └─────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│                      Infrastructure Layer                        │
│  ┌────────────────────┐         ┌─────────────────────────────┐  │
│  │    PostgreSQL      │         │         MinIO S3            │  │
│  │     (Database)     │         │      (File Storage)         │  │
│  └────────────────────┘         └─────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🧩 Feature-Sliced Design

Проект следует методологии **Feature-Sliced Design (FSD)** для организации кода.

### Уровни абстракции

```
src/
├── app/              # Инициализация приложения (роутинг, стили, провайдеры)
├── pages/            # Страницы (в Next.js это app/)
├── widgets/          # Самостоятельные блоки (Header, Sidebar)
├── features/         # Бизнес-сценарии (auth, create-vacancy)
├── entities/         # Бизнес-сущности (User, Vacancy, Organization)
└── shared/           # Переиспользуемый код (UI, утилиты, типы)
```

### Правила зависимостей

```
app → widgets → features → entities → shared
      widgets → features → entities → shared
      features → entities → shared
      entities → shared
```

**Запрещено:**
- `shared` не может импортировать из `entities`, `features`, `widgets`, `pages`
- `entities` не может импортировать из `features`, `widgets`, `pages`

### Пример структуры фичи

```
features/
└── create-vacancy/
    ├── api/              # Server Actions для создания вакансии
    ├── ui/               # UI компоненты фичи
    │   ├── CreateVacancyModal.tsx
    │   └── CreateVacancyForm.tsx
    ├── lib/              # Локальная бизнес-логика
    │   └── validation.ts
    └── index.ts          # Публичный API фичи
```

### Пример структуры сущности

```
entities/
└── vacancy/
    ├── model/            # Типы и данные
    │   ├── types.ts
    │   └── constants.ts
    ├── ui/               # UI компоненты сущности
    │   ├── VacancyCard.tsx
    │   └── VacancyStatus.tsx
    └── index.ts          # Публичный API сущности
```

---

## 🔄 Next.js App Router

### Структура app/

```
src/app/
├── layout.tsx          # Корневой layout (HTML, body, провайдеры)
├── page.tsx            # Главная страница (/)
├── globals.css         # Глобальные стили
├── providers.tsx       # Провайдеры (Theme, Session)
├── login/
│   └── page.tsx        # Страница входа (/login)
├── register/
│   └── page.tsx        # Страница регистрации (/register)
├── dashboard/
│   ├── layout.tsx      # Layout дашборда (с сайдбаром)
│   ├── page.tsx        # Главная дашборда (/dashboard)
│   ├── applications/   # Заявки
│   ├── create-vacancy/ # Создание вакансии
│   └── organization/   # Управление организацией
├── profile/
│   └── [id]/
│       └── page.tsx    # Профиль пользователя (/profile/:id)
├── organizations/
│   └── page.tsx        # Список организаций
├── documents/
│   └── page.tsx        # Учебные материалы
└── api/                # API routes (если нужны)
    └── auth/
        └── [...nextauth]/
            └── route.ts
```

### Layouts

```typescript
// src/app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <SessionProvider>
            {children}
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### Loading и Error UI

```typescript
// loading.tsx - автоматически показывается при загрузке
export default function Loading() {
  return <Spinner />;
}

// error.tsx - автоматически показывается при ошибке
export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div>
      <h2>Произошла ошибка</h2>
      <button onClick={reset}>Попробовать снова</button>
    </div>
  );
}
```

---

## 🖥 Server Components vs Client Components

### Server Components (по умолчанию)

Используются по умолчанию. Не могут использовать хуки React.

```typescript
// ✅ Server Component
export default async function VacancyList() {
  const vacancies = await db.select().from(vacancies);
  
  return (
    <ul>
      {vacancies.map(v => (
        <li key={v.id}>{v.title}</li>
      ))}
    </ul>
  );
}
```

**Преимущества:**
- Выполняются на сервере
- Прямой доступ к БД
- Меньший размер бандла
- SEO-дружелюбны

### Client Components

Требуют директиву `"use client"`.

```typescript
// ✅ Client Component
"use client";

import { useState } from "react";

export function VacancyFilter() {
  const [filter, setFilter] = useState("");
  
  return (
    <input 
      value={filter} 
      onChange={(e) => setFilter(e.target.value)}
    />
  );
}
```

**Когда использовать Client Components:**
- Состояние (useState, useReducer)
- Эффекты (useEffect)
- События (onClick, onChange)
- Browser APIs (localStorage, window)
- Custom hooks

### Паттерн композиции

```typescript
// ✅ Правильно: Server Component с Client Component внутри
// src/app/vacancies/page.tsx
import { VacancyList } from "./VacancyList"; // Server
import { VacancyFilter } from "./VacancyFilter"; // Client

export default async function VacanciesPage() {
  const vacancies = await fetchVacancies();
  
  return (
    <div>
      <VacancyFilter />
      <VacancyList vacancies={vacancies} />
    </div>
  );
}
```

---

## ⚡ Server Actions

Server Actions — это асинхронные функции, выполняющиеся на сервере.

### Базовый пример

```typescript
// src/app/actions/vacancy.ts
"use server";

import { db } from "@/db";
import { vacancies } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createVacancy(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  
  // Валидация
  if (!title || !description) {
    return { error: "Заполните все поля" };
  }
  
  // Вставка в БД
  await db.insert(vacancies).values({
    title,
    description,
    organizationId: 1,
  });
  
  // Обновление кэша
  revalidatePath("/dashboard");
  
  // Редирект
  redirect("/dashboard/vacancies");
}
```

### Использование в формах

```typescript
// Client Component
"use client";

import { createVacancy } from "@/app/actions/vacancy";

export function CreateVacancyForm() {
  return (
    <form action={createVacancy}>
      <input name="title" placeholder="Название" />
      <textarea name="description" placeholder="Описание" />
      <button type="submit">Создать</button>
    </form>
  );
}
```

### Использование с useFormStatus

```typescript
"use client";

import { useFormStatus } from "react-dom";
import { createVacancy } from "@/app/actions/vacancy";

function SubmitButton() {
  const { pending } = useFormStatus();
  
  return (
    <button type="submit" disabled={pending}>
      {pending ? "Создание..." : "Создать"}
    </button>
  );
}

export function CreateVacancyForm() {
  return (
    <form action={createVacancy}>
      <input name="title" />
      <SubmitButton />
    </form>
  );
}
```

### Оптимистичные обновления

```typescript
"use client";

import { useOptimistic } from "react";
import { deleteVacancy } from "@/app/actions/vacancy";

export function VacancyList({ vacancies }: { vacancies: Vacancy[] }) {
  const [optimisticVacancies, setOptimisticVacancies] = useOptimistic(
    vacancies,
    (state, newVacancy: Vacancy) => [...state.filter(v => v.id !== newVacancy.id)]
  );
  
  const handleDelete = async (vacancy: Vacancy) => {
    setOptimisticVacancies(vacancy);
    await deleteVacancy(vacancy.id);
  };
  
  return (
    <ul>
      {optimisticVacancies.map(v => (
        <li key={v.id}>
          {v.title}
          <button onClick={() => handleDelete(v)}>Удалить</button>
        </li>
      ))}
    </ul>
  );
}
```

---

## 🗄 Работа с базой данных

### Drizzle ORM Schema

```typescript
// src/db/schema.ts
import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const vacancies = pgTable("vacancy", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  organizationId: integer("organization_id")
    .references(() => organizations.id),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const organizations = pgTable("organization", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  // ...
});

// Relations
export const vacanciesRelations = relations(vacancies, ({ one }) => ({
  organization: one(organizations, {
    fields: [vacancies.organizationId],
    references: [organizations.id],
  }),
}));
```

### CRUD операции

```typescript
import { db } from "@/db";
import { vacancies, organizations } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";

// CREATE
await db.insert(vacancies).values({
  title: "Разработчик",
  description: "Описание",
  organizationId: 1,
});

// READ
const vacancy = await db
  .select()
  .from(vacancies)
  .where(eq(vacancies.id, 1))
  .limit(1);

// READ с JOIN
const vacanciesWithOrg = await db
  .select({
    vacancy: vacancies,
    organization: organizations,
  })
  .from(vacancies)
  .innerJoin(organizations, eq(vacancies.organizationId, organizations.id));

// UPDATE
await db
  .update(vacancies)
  .set({ title: "Новое название" })
  .where(eq(vacancies.id, 1));

// DELETE
await db
  .delete(vacancies)
  .where(eq(vacancies.id, 1));

// Транзакция
await db.transaction(async (tx) => {
  await tx.insert(vacancies).values({ ... });
  await tx.insert(vacancySkills).values({ ... });
});
```

---

## 🔐 Аутентификация

### NextAuth.js конфигурация

```typescript
// src/auth.ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials.email as string))
          .limit(1);
        
        if (!user || !user.password) return null;
        
        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );
        
        if (!isValid) return null;
        
        return {
          id: user.id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
});
```

### Middleware

```typescript
// middleware.ts
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

export default NextAuth(authConfig).auth;

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
```

### Использование в компонентах

```typescript
import { auth } from "@/auth";

export default async function Dashboard() {
  const session = await auth();
  
  if (!session) {
    redirect("/login");
  }
  
  return <div>Привет, {session.user?.name}!</div>;
}
```

---

## 📁 Загрузка файлов

### S3 клиент

```typescript
// src/lib/s3.ts
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: process.env.S3_REGION || "us-east-1",
  endpoint: process.env.S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY || "",
    secretAccessKey: process.env.S3_SECRET_KEY || "",
  },
});

export async function getPresignedUrl(
  fileName: string,
  fileType: string
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: fileName,
    ContentType: fileType,
  });
  
  return getSignedUrl(s3Client, command, { expiresIn: 3600 });
}
```

### Server Action для загрузки

```typescript
// src/app/actions/upload.ts
"use server";

import { getPresignedUrl } from "@/lib/s3";

export async function uploadFile(file: File): Promise<{ url: string }> {
  const fileName = `${Date.now()}-${file.name}`;
  const uploadUrl = await getPresignedUrl(fileName, file.type);
  
  // Возвращаем URL для загрузки с клиента
  return {
    url: uploadUrl,
    publicUrl: `${process.env.S3_PUBLIC_ENDPOINT}/${process.env.S3_BUCKET_NAME}/${fileName}`,
  };
}
```

---

## ✅ Валидация данных

### Zod схемы

```typescript
// src/lib/validators/vacancy.ts
import { z } from "zod";

export const createVacancySchema = z.object({
  title: z.string().min(3, "Минимум 3 символа"),
  description: z.string().min(10, "Минимум 10 символов"),
  requirements: z.string().optional(),
  salary: z.string().optional(),
  type: z.enum(["practice", "internship", "job"]),
  minCourse: z.number().min(1).max(6),
  allowedMajors: z.array(z.number()).optional(),
  requiredSkills: z.array(z.number()).optional(),
});

export type CreateVacancyInput = z.infer<typeof createVacancySchema>;
```

### Валидация в Server Actions

```typescript
// src/app/actions/vacancy.ts
"use server";

import { createVacancySchema } from "@/lib/validators/vacancy";

export async function createVacancy(formData: FormData) {
  const rawData = Object.fromEntries(formData);
  
  const result = createVacancySchema.safeParse(rawData);
  
  if (!result.success) {
    return { error: result.error.errors };
  }
  
  await db.insert(vacancies).values(result.data);
  
  return { success: true };
}
```

---

## 🔄 Управление состоянием

### Локальное состояние (Client Components)

```typescript
"use client";

import { useState } from "react";

export function VacancyFilter() {
  const [filters, setFilters] = useState({
    type: "",
    minSalary: 0,
  });
  
  return (
    <select 
      value={filters.type}
      onChange={(e) => setFilters({ ...filters, type: e.target.value })}
    >
      <option value="">Все типы</option>
      <option value="practice">Практика</option>
    </select>
  );
}
```

### URL состояние (useQueryState)

```typescript
"use client";

import { useQueryState } from "nuqs";

export function VacancyList() {
  const [page, setPage] = useQueryState("page", {
    defaultValue: 1,
    parse: Number,
  });
  
  return (
    <button onClick={() => setPage(page + 1)}>
      Следующая страница
    </button>
  );
}
```

### Кэширование (Server Components)

```typescript
// Кэш по умолчанию в Server Components
const data = await db.select().from(vacancies);

// Принудительная свежая загрузка
export const dynamic = "force-dynamic";

// Ре-валидация по времени
const data = await fetch("/api/vacancies", {
  next: { revalidate: 3600 }, // 1 час
});
```

---

## 📊 Производительность

### Оптимизации

1. **Server Components** — минимум JavaScript на клиенте
2. **Streaming** — постепенная загрузка страниц
3. **Кэширование** — кэш данных и страниц
4. **Lazy loading** — загрузка компонентов по требованию

### Пример Streaming

```typescript
// src/app/dashboard/page.tsx
import { Suspense } from "react";
import { VacancyList } from "./VacancyList";
import { Stats } from "./Stats";

export default function Dashboard() {
  return (
    <div>
      <Suspense fallback={<StatsSkeleton />}>
        <Stats />
      </Suspense>
      <Suspense fallback={<ListSkeleton />}>
        <VacancyList />
      </Suspense>
    </div>
  );
}
```

---

## 🔒 Безопасность

### Меры безопасности

1. **CSRF защита** — NextAuth автоматически
2. **XSS защита** — экранирование по умолчанию
3. **SQL инъекции** — параметризованные запросы Drizzle
4. **Валидация** — Zod схемы на все входные данные
5. **Аутентификация** — проверка сессий в middleware

### Rate limiting

```typescript
// src/lib/rate-limit.ts
import { Ratelimit } from "@upstash/ratelimit";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "10 s"),
});

export async function checkRateLimit(identifier: string) {
  const { success } = await ratelimit.limit(identifier);
  return success;
}
```
