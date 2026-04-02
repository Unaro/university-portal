# 👨‍💻 Руководство разработчика University Portal

Быстрый старт для новых разработчиков проекта.

---

## 📋 Оглавление

- [Быстрый старт](#быстрый-старт)
- [Настройка IDE](#настройка-ide)
- [Структура проекта](#структура-проекта)
- [Разработка фич](#разработка-фич)
- [Тестирование](#тестирование)
- [Code Style](#code-style)
- [Git Workflow](#git-workflow)
- [Полезные команды](#полезные-команды)
- [FAQ](#faq)

---

## 🚀 Быстрый старт

### 1. Требования

Проверьте установленные зависимости:

```bash
node --version    # Должно быть v20+
pnpm --version    # Должно быть 8+
docker --version  # Должно быть 24+
```

### 2. Установка

```bash
# Клонирование репозитория
git clone <repository-url>
cd university-portal

# Установка зависимостей
cd portal_web
pnpm install

# Настройка окружения
cp ../.env.example ../.env
# Отредактируйте .env (см. ниже)
```

### 3. Запуск инфраструктуры

```bash
# Из корня проекта
docker compose up -d db minio
```

### 4. Применение миграций

```bash
cd portal_web
pnpm run db:push
```

### 5. Заполнение тестовыми данными

```bash
pnpm run db:seeder
```

### 6. Запуск приложения

```bash
pnpm dev
```

Приложение доступно по адресу: **http://localhost:3000**

---

## ⚙️ Настройка IDE

### VS Code (рекомендуется)

Установите расширения:

- **ESLint** — линтинг кода
- **Prettier** — форматирование
- **Tailwind CSS IntelliSense** — автодополнение Tailwind
- **TypeScript Hero** — управление импортами
- **Error Lens** — отображение ошибок в строке

### settings.json

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "tailwindCSS.includeLanguages": {
    "typescript": "javascript",
    "typescriptreact": "javascript"
  },
  "files.associations": {
    "*.css": "tailwindcss"
  }
}
```

### .vscode/settings.json

```json
{
  "eslint.workingDirectories": ["portal_web"],
  "typescript.preferences.importModuleSpecifier": "relative"
}
```

---

## 📁 Структура проекта

```
university-portal/
├── portal_web/              # Основное приложение
│   ├── src/
│   │   ├── app/            # Next.js страницы (роутинг)
│   │   ├── components/     # UI компоненты (shadcn/ui)
│   │   ├── db/             # Схема БД и миграции
│   │   ├── entities/       # Бизнес-сущности
│   │   ├── features/       # Бизнес-логика (фичи)
│   │   ├── lib/            # Утилиты и валидаторы
│   │   ├── shared/         # Общие модули
│   │   ├── views/          # Страницы
│   │   └── widgets/        # Композиции компонентов
│   ├── tests/              # Тесты
│   └── public/             # Статика
├── docs/                   # Документация
└── compose.yaml            # Docker Compose
```

### Feature-Sliced Design (FSD)

Проект использует методологию FSD:

```
app/              → Инициализация (роутинг, провайдеры)
  ↓
widgets/          → Самостоятельные блоки (Header, Sidebar)
  ↓
features/         → Сценарии (auth, create-vacancy)
  ↓
entities/         → Сущности (User, Vacancy)
  ↓
shared/           → Переиспользуемый код (UI, утилиты)
```

**Правило:** Зависимости направлены только вниз!

---

## 🛠 Разработка фич

### Создание новой фичи

#### 1. Создайте структуру

```bash
# Пример: feature "отклик на вакансию"
mkdir -p src/features/apply-vacancy/{ui,api,lib}
```

#### 2. Опишите типы

```typescript
// src/features/apply-vacancy/model/types.ts
export interface ApplyVacancyForm {
  coverLetter: string;
  resumeId: number;
}
```

#### 3. Создайте валидатор

```typescript
// src/features/apply-vacancy/lib/validation.ts
import { z } from "zod";

export const applyVacancySchema = z.object({
  coverLetter: z.string().min(10, "Минимум 10 символов"),
  resumeId: z.number(),
});
```

#### 4. Создайте Server Action

```typescript
// src/features/apply-vacancy/api/apply.ts
"use server";

import { db } from "@/db";
import { applications } from "@/db/schema";
import { applyVacancySchema } from "../lib/validation";

export async function applyVacancy(data: ApplyVacancyForm) {
  const result = applyVacancySchema.safeParse(data);
  
  if (!result.success) {
    return { error: result.error };
  }
  
  await db.insert(applications).values({
    studentId: data.resumeId,
    vacancyId: data.vacancyId,
    coverLetter: data.coverLetter,
  });
  
  return { success: true };
}
```

#### 5. Создайте UI компонент

```typescript
// src/features/apply-vacancy/ui/ApplyForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { applyVacancy } from "../api/apply";

export function ApplyForm({ vacancyId }: { vacancyId: number }) {
  const { register, handleSubmit } = useForm();
  
  const onSubmit = async (data: any) => {
    const result = await applyVacancy({ ...data, vacancyId });
    // Handle result
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <textarea {...register("coverLetter")} />
      <button type="submit">Отправить</button>
    </form>
  );
}
```

#### 6. Экспортируйте публичный API

```typescript
// src/features/apply-vacancy/index.ts
export { ApplyForm } from "./ui/ApplyForm";
export { applyVacancy } from "./api/apply";
export type { ApplyVacancyForm } from "./model/types";
```

---

## 🧪 Тестирование

### Запуск тестов

```bash
# Все тесты в режиме watch
pnpm test

# Однократный запуск
pnpm test:run

# С UI интерфейсом
pnpm test:ui

# С покрытием
pnpm test:coverage
```

### Написание тестов

#### Unit тесты

```typescript
// src/lib/validators/auth.test.ts
import { describe, it, expect } from "vitest";
import { loginSchema } from "./auth";

describe("loginSchema", () => {
  it("должен принимать валидный email", () => {
    const result = loginSchema.safeParse({
      email: "test@example.com",
      password: "password123",
    });
    
    expect(result.success).toBe(true);
  });
  
  it("должен отклонять невалидный email", () => {
    const result = loginSchema.safeParse({
      email: "invalid",
      password: "password123",
    });
    
    expect(result.success).toBe(false);
  });
});
```

#### Component тесты

```typescript
// src/components/Button.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Button } from "./Button";

describe("Button", () => {
  it("должен рендерить children", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });
  
  it("должен быть disabled", () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
```

### Best Practices для тестов

1. **Один тест — одна проверка**
2. **Описательные названия тестов**
3. **Arrange-Act-Assert паттерн**
4. **Избегайте тестирования реализации**
5. **Используйте тестовые данные**

---

## 📝 Code Style

### TypeScript

```typescript
// ✅ Используйте типы вместо any
interface User {
  id: number;
  name: string;
}

// ✅ Используйте union types для ограниченных значений
type Status = "pending" | "approved" | "rejected";

// ✅ Используйте generics для переиспользования
function wrapInArray<T>(item: T): T[] {
  return [item];
}
```

### React

```typescript
// ✅ Используйте функциональные компоненты
export function VacancyCard({ vacancy }: VacancyCardProps) {
  return <div>{vacancy.title}</div>;
}

// ✅ Используйте деструктуризацию пропсов
function UserCard({ user, role }: { user: User; role: string }) {
  // ...
}

// ✅ Избегайте избыточных переменных
return <Button variant="primary">OK</Button>;
// Вместо:
const variant = "primary";
const children = "OK";
return <Button variant={variant}>{children}</Button>;
```

### Server Components

```typescript
// ✅ Server Component по умолчанию
export default async function VacancyList() {
  const vacancies = await db.select().from(vacancies);
  return <ul>{vacancies.map(...)}</ul>;
}

// ✅ Client Component только когда нужно
"use client";

export function VacancyFilter() {
  const [filter, setFilter] = useState("");
  // ...
}
```

### Именование

```typescript
// ✅ Компоненты: PascalCase
export function VacancyCard() {}

// ✅ Функции/переменные: camelCase
const getVacancies = () => {};

// ✅ Константы: UPPER_SNAKE_CASE
const MAX_FILE_SIZE = 1024 * 1024;

// ✅ Типы/Интерфейсы: PascalCase
interface UserData {}
type UserRole = "admin" | "user";

// ✅ Файлы: kebab-case для файлов, PascalCase для компонентов
// vacancy-card.tsx (файл)
// VacancyCard.tsx (компонент)
```

### ESLint правила

Основные правила в `eslint.config.mjs`:

```javascript
// Обязательные правила
"no-unused-vars": "error"
"no-console": "warn"
"@typescript-eslint/explicit-function-return-type": "off"
"@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }]
```

---

## 🌿 Git Workflow

### Ветки

```
main          → Продакшен версия
develop       → Основная ветка разработки
feature/*     → Новые фичи
bugfix/*      → Исправление багов
hotfix/*      → Срочные исправления в main
```

### Создание фичи

```bash
# Обновление develop
git checkout develop
git pull origin develop

# Создание ветки фичи
git checkout -b feature/add-vacancy-filter

# Коммиты (Conventional Commits)
git commit -m "feat: добавить фильтрацию вакансий"
git commit -m "fix: исправить ошибку сортировки"
git commit -m "test: добавить тесты валидации"

# Пуш ветки
git push -u origin feature/add-vacancy-filter
```

### Conventional Commits

```
feat:     Новая фича
fix:      Исправление бага
docs:     Документация
style:    Форматирование, отступы
refactor: Рефакторинг без изменений функционала
test:     Добавление тестов
chore:    Настройка сборки, зависимости
```

### Pull Request

1. Создайте PR из вашей ветки в `develop`
2. Опишите изменения
3. Дождитесь code review
4. Исправьте замечания
5. После аппрува — merge

### Шаблон PR

```markdown
## Описание
Краткое описание изменений

## Тип изменений
- [ ] ✨ Фича
- [ ] 🐛 Багфикс
- [ ] 📝 Документация
- [ ] ♻️ Рефакторинг

## Чеклист
- [ ] Код отформатирован
- [ ] Тесты написаны
- [ ] Документация обновлена

## Скриншоты (если применимо)
```

---

## 💻 Полезные команды

### Разработка

```bash
pnpm dev              # Запуск в режиме разработки
pnpm build            # Сборка продакшена
pnpm start            # Запуск продакшена
pnpm lint             # Проверка ESLint
pnpm lint:fix         # Автофикс ESLint
```

### База данных

```bash
pnpm db:push          # Применить миграции
pnpm db:seeder        # Заполнить тестовыми данными
pnpm db:clear         # Очистить БД
npx drizzle-kit studio # Открыть Drizzle Studio
```

### Тесты

```bash
pnpm test             # Запуск тестов (watch)
pnpm test:run         # Однократный запуск
pnpm test:ui          # Тесты с UI
pnpm test:coverage    # Тесты с покрытием
```

### Docker

```bash
docker compose up -d          # Запуск инфраструктуры
docker compose down           # Остановка
docker compose logs -f web    # Логи приложения
docker compose ps             # Статус контейнеров
```

---

## ❓ FAQ

### Q: Как добавить новую зависимость?

```bash
cd portal_web
pnpm add <package-name>
pnpm add -D <package-name>  # dev dependency
```

### Q: Как создать новую миграцию?

```bash
# Измените schema.ts
# Затем примените изменения
pnpm db:push
```

### Q: Где хранить секреты?

Только в `.env` файле (не коммитьте в Git!).

### Q: Как отладить Server Component?

Добавьте `console.log()` — вывод будет в терминале Next.js.

### Q: Как работать с формами?

Используйте React Hook Form + Zod валидацию:

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { mySchema } from "./validation";

const form = useForm({
  resolver: zodResolver(mySchema),
});
```

### Q: Как добавить новую страницу?

Создайте папку в `src/app/`:

```
src/app/my-page/
└── page.tsx    # Страница /my-page
```

### Q: Как работать с изображениями?

Используйте Next.js Image компонент:

```typescript
import Image from "next/image";

<Image 
  src="/logo.png" 
  alt="Logo" 
  width={200} 
  height={100} 
/>
```

### Q: Как обновить зависимости?

```bash
pnpm outdated       # Показать устаревшие пакеты
pnpm update         # Обновить пакеты
pnpm update -g      # Обновить глобальные пакеты
```

---

## 📚 Ресурсы

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Drizzle ORM](https://orm.drizzle.team)
- [shadcn/ui](https://ui.shadcn.com)
- [Feature-Sliced Design](https://feature-sliced.design)

---

## 🆘 Помощь

Возникли вопросы? Обратитесь к:

- [Основной документации](../README.md)
- [Архитектуре](./ARCHITECTURE.md)
- [Документации БД](./DATABASE.md)
- [Документации развёртывания](./DEPLOYMENT.md)
