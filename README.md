# University Portal 🎓

**Платформа для управления практикой и трудоустройством студентов университета**

---

## 📋 Оглавление

- [Описание](#описание)
- [Возможности](#возможности)
- [Технологический стек](#технологический-стек)
- [Архитектура](#архитектура)
- [Быстрый старт](#быстрый-старт)
- [Настройка окружения](#настройка-окружения)
- [Скрипты проекта](#скрипты-проекта)
- [Структура проекта](#структура-проекта)
- [База данных](#база-данных)
- [Аутентификация и роли](#аутентификация-и-роли)
- [Загрузка файлов](#загрузка-файлов)
- [Тестирование](#тестирование)
- [Docker и развёртывание](#docker-и-развёртывание)
- [CI/CD](#cicd)
- [Вклад в проект](#вклад-в-проект)

---

## 📖 Описание

University Portal — это полнофункциональное веб-приложение, которое соединяет три ключевые стороны образовательного процесса:

- **Студентов** — поиск и отклик на вакансии для прохождения практики и трудоустройства
- **Представителей организаций** — публикация вакансий и управление откликами
- **Университет** — модерация организаций и вакансий, контроль трудоустройства студентов

Платформа автоматизирует процесс организации практики, предоставляя удобный интерфейс для всех участников.

---

## ✨ Возможности

### Для студентов
- 📝 Просмотр доступных вакансий с фильтрацией
- 📤 Отправка откликов на вакансии с сопроводительным письмом
- 📄 Создание и редактирование резюме
- 📊 Отслеживание статуса заявок
- 💼 Управление профилем и навыками

### Для представителей организаций
- 🏢 Публикация и редактирование вакансий
- 👥 Управление откликами студентов
- 📋 Просмотр резюме кандидатов
- 🏷️ Настройка требований к вакансиям (навыки, специальности)

### Для университета
- ✅ Модерация организаций и вакансий
- 📊 Мониторинг статистики трудоустройства
- 📚 Управление учебными материалами
- 🔐 Администрирование пользователей

### Общие возможности
- 🔐 Ролевая модель доступа (3 роли)
- 🌓 Тёмная/светлая тема оформления
- 📱 Адаптивный дизайн
- 📄 Генерация PDF-документов
- 📁 Загрузка файлов в S3-хранилище

---

## 🛠 Технологический стек

### Frontend
| Технология | Версия | Назначение |
|------------|--------|------------|
| **Next.js** | 16.0.3 | React-фреймворк с App Router |
| **React** | 19.2.0 | UI-библиотека |
| **TypeScript** | 5.x | Статическая типизация |
| **Tailwind CSS** | 4.x | CSS-фреймворк |
| **shadcn/ui** | latest | Компоненты интерфейса |
| **Radix UI** | latest | Примитивы компонентов |
| **Lucide React** | 0.554.0 | Иконки |
| **React Hook Form** | 7.66.1 | Управление формами |
| **Zod** | 4.1.13 | Валидация схем |
| **next-themes** | 0.4.6 | Управление темами |

### Backend
| Технология | Версия | Назначение |
|------------|--------|------------|
| **Next.js Server Actions** | — | Серверная бизнес-логика |
| **NextAuth.js (Auth.js)** | 5.0.0-beta.30 | Аутентификация |
| **Drizzle ORM** | 0.44.7 | ORM для работы с БД |
| **PostgreSQL** | 15 | Реляционная база данных |
| **bcryptjs** | 3.0.3 | Хеширование паролей |

### Инфраструктура
| Технология | Версия | Назначение |
|------------|--------|------------|
| **Docker** | latest | Контейнеризация |
| **Docker Compose** | latest | Оркестрация контейнеров |
| **MinIO** | latest | S3-совместимое файловое хранилище |
| **Node.js** | 20 | JavaScript-рантайм |

### Тестирование
| Технология | Версия | Назначение |
|------------|--------|------------|
| **Vitest** | 4.1.0 | Тестовый раннер |
| **Testing Library** | 16.3.2 | Утилиты для тестирования компонентов |
| **Happy-DOM / jsdom** | latest | Окружение для тестов |
| **@vitest/ui** | 4.1.0 | UI для тестов |

### DevTools
| Технология | Версия | Назначение |
|------------|--------|------------|
| **ESLint** | 9 | Линтинг кода |
| **Drizzle Kit** | 0.31.7 | Миграции БД |
| **tsx** | 4.20.6 | Выполнение TypeScript |
| **Babel React Compiler** | 1.0.0 | Компиляция React |

---

## 🏗 Архитектура

### Общая архитектура

```
┌─────────────────────────────────────────────────────────┐
│                    Client (Browser)                     │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│              Next.js Application (Port 3000)            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │
│  │   Pages     │  │   Server    │  │    API Routes   │  │
│  │   (App)     │  │   Actions   │  │                 │  │
│  └─────────────┘  └─────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────┘
         │                    │                    │
         ▼                    ▼                    ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│   PostgreSQL    │  │     MinIO       │  │   Auth.js       │
│   (Database)    │  │   (File Store)  │  │   (Sessions)    │
│   Port: 5432    │  │   Port: 9000    │  │                 │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

### Слои приложения (Feature-Sliced Design)

```
src/
├── app/              # Next.js App Router (роутинг и страницы)
├── features/         # Бизнес-логика по доменам
├── entities/         # Бизнес-сущности (модели данных)
├── widgets/          # Композиция features + entities
├── views/            # Страницы уровня приложения
├── components/       # Переиспользуемые UI-компоненты
├── shared/           # Общие утилиты и типы
├── lib/              # Библиотеки, валидаторы, утилиты
└── db/               # Схема БД, миграции, seeder
```

### Основные модули

| Модуль | Описание |
|--------|----------|
| `auth` | Аутентификация, регистрация, управление сессиями |
| `vacancy` | Управление вакансиями (CRUD, фильтрация) |
| `application` | Отклики на вакансии, статусы |
| `organization` | Профили организаций, модерация |
| `resume` | Резюме студентов, навыки |
| `materials` | Учебные материалы, документы |

---

## 🚀 Быстрый старт

### Требования

- **Node.js** 20.x или выше
- **pnpm** 8.x или выше
- **Docker** и **Docker Compose** (для локальной инфраструктуры)
- **Git**

### Установка

#### 1. Клонирование репозитория

```bash
git clone <repository-url>
cd university-portal
```

#### 2. Установка зависимостей

```bash
cd portal_web
pnpm install
```

#### 3. Настройка переменных окружения

```bash
# Скопировать шаблон .env.example в корень проекта
cp .env.example .env

# Отредактировать .env (см. раздел "Настройка окружения")
```

#### 4. Запуск инфраструктуры (PostgreSQL + MinIO)

```bash
# Из корня проекта (где находится compose.yaml)
docker compose up -d
```

Проверка статуса контейнеров:
```bash
docker compose ps
```

#### 5. Применение миграций базы данных

```bash
cd portal_web
pnpm run db:push
```

#### 6. Заполнение тестовыми данными (опционально)

```bash
pnpm run db:seeder
```

#### 7. Запуск приложения

```bash
# Режим разработки
pnpm dev

# Продакшен сборка
pnpm build
pnpm start
```

Приложение будет доступно по адресу: **http://localhost:3000**

---

## ⚙️ Настройка окружения

### Файл `.env`

Скопируйте `.env.example` в `.env` и настройте переменные:

```bash
# --- СЕТЬ ---
SERVER_IP=localhost

# --- БАЗА ДАННЫХ PostgreSQL ---
DB_USER=portal_user
DB_PASSWORD=<сгенерируйте_безопасный_пароль>
DB_NAME=portal_db
DB_PORT_HOST=5432
DATABASE_URL=postgres://${DB_USER}:${DB_PASSWORD}@db:5432/${DB_NAME}

# --- АВТОРИЗАЦИЯ (NextAuth) ---
AUTH_SECRET=<сгенерируйте_секрет>
AUTH_URL=http://${SERVER_IP}:3000
AUTH_TRUST_HOST=true

# --- S3 ХРАНИЛИЩЕ (MinIO) ---
MINIO_ROOT_USER=portal_admin
MINIO_ROOT_PASSWORD=<сгенерируйте_пароль>
S3_ENDPOINT=http://minio:9000
S3_PUBLIC_ENDPOINT=http://${SERVER_IP}:9000
S3_ACCESS_KEY=${MINIO_ROOT_USER}
S3_SECRET_KEY=${MINIO_ROOT_PASSWORD}
S3_BUCKET_NAME=portal-documents
S3_REGION=us-east-1
```

### Генерация секретов

```bash
# Пароль для БД/MinIO (минимум 32 символа)
openssl rand -base64 32

# Или через Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# AUTH_SECRET для NextAuth
npx auth-secret
```

### Переменные окружения

| Переменная | Описание | По умолчанию |
|------------|----------|--------------|
| `SERVER_IP` | IP-адрес сервера для внешнего доступа | `localhost` |
| `DB_USER` | Пользователь PostgreSQL | `portal_user` |
| `DB_PASSWORD` | Пароль PostgreSQL | — |
| `DB_NAME` | Имя базы данных | `portal_db` |
| `DB_PORT_HOST` | Порт PostgreSQL на хосте | `5432` |
| `DATABASE_URL` | URL подключения к БД | — |
| `AUTH_SECRET` | Секретный ключ NextAuth | — |
| `AUTH_URL` | URL приложения | `http://localhost:3000` |
| `AUTH_TRUST_HOST` | Доверие к хосту | `true` |
| `MINIO_ROOT_USER` | Пользователь MinIO | `portal_admin` |
| `MINIO_ROOT_PASSWORD` | Пароль MinIO | — |
| `S3_ENDPOINT` | Внутренний адрес S3 | `http://minio:9000` |
| `S3_PUBLIC_ENDPOINT` | Внешний адрес S3 | `http://localhost:9000` |
| `S3_ACCESS_KEY` | Ключ доступа S3 | — |
| `S3_SECRET_KEY` | Секретный ключ S3 | — |
| `S3_BUCKET_NAME` | Имя бакета | `portal-documents` |
| `S3_REGION` | Регион S3 | `us-east-1` |

---

## 📜 Скрипты проекта

| Команда | Описание |
|---------|----------|
| `pnpm dev` | Запуск в режиме разработки (http://localhost:3000) |
| `pnpm build` | Сборка продакшен-версии |
| `pnpm start` | Запуск продакшен-сервера |
| `pnpm lint` | Проверка кода ESLint |
| `pnpm db:push` | Применение миграций базы данных |
| `pnpm db:seeder` | Заполнение БД и MinIO тестовыми данными |
| `pnpm db:clear` | Очистка БД (без MinIO) |
| `pnpm test` | Запуск тестов в режиме watch |
| `pnpm test:ui` | Запуск тестов с UI-интерфейсом |
| `pnpm test:run` | Однократный запуск тестов |
| `pnpm test:coverage` | Запуск тестов с отчётом о покрытии |

---

## 📁 Структура проекта

```
university-portal/
├── .github/
│   └── workflows/
│       └── ci.yml              # CI/CD конфигурация
├── portal_web/                 # Основное веб-приложение
│   ├── src/
│   │   ├── app/                # Next.js App Router
│   │   │   ├── actions/        # Server Actions
│   │   │   ├── api/            # API endpoints
│   │   │   ├── dashboard/      # Личный кабинет
│   │   │   ├── documents/      # Документы
│   │   │   ├── login/          # Страница входа
│   │   │   ├── organizations/  # Организации
│   │   │   ├── practices/      # Практики
│   │   │   ├── profile/        # Профиль пользователя
│   │   │   ├── register/       # Регистрация
│   │   │   ├── layout.tsx      # Корневой layout
│   │   │   ├── page.tsx        # Главная страница
│   │   │   └── providers.tsx   # Провайдеры (Theme, Session)
│   │   ├── db/                 # Работа с базой данных
│   │   │   ├── schema.ts       # Схема БД (Drizzle)
│   │   │   ├── index.ts        # Экспорт db
│   │   │   ├── seeder.ts       # Скрипт заполнения
│   │   │   └── seed-data.ts    # Тестовые данные
│   │   ├── entities/           # Бизнес-сущности
│   │   │   ├── application/    # Сущность заявки
│   │   │   ├── material/       # Сущность материала
│   │   │   ├── organization/   # Сущность организации
│   │   │   ├── session/        # Сущность сессии
│   │   │   └── vacancy/        # Сущность вакансии
│   │   ├── features/           # Бизнес-логика
│   │   │   ├── application-list/
│   │   │   ├── apply-vacancy/
│   │   │   ├── auth/
│   │   │   ├── create-vacancy/
│   │   │   ├── edit-organization/
│   │   │   ├── edit-resume/
│   │   │   ├── manage-application/
│   │   │   ├── manage-materials/
│   │   │   ├── organization-search/
│   │   │   ├── profile-edit/
│   │   │   └── vacancy-filter/
│   │   ├── lib/                # Библиотеки и утилиты
│   │   │   ├── validators/     # Zod-схемы
│   │   │   ├── password.ts     # Утилиты паролей
│   │   │   ├── s3.ts           # S3-клиент
│   │   │   ├── utils.ts        # Общие утилиты
│   │   │   └── *.test.ts       # Тесты утилит
│   │   ├── shared/             # Общие модули
│   │   │   └── types/          # Типы TypeScript
│   │   ├── views/              # Страницы приложения
│   │   │   └── home/           # Главная страница
│   │   ├── widgets/            # Композиции компонентов
│   │   └── tests/              # Тестовые утилиты
│   │       └── setup.ts        # Setup для тестов
│   ├── tests/                  # E2E и интеграционные тесты
│   ├── public/                 # Статические файлы
│   ├── drizzle/                # Миграции БД
│   ├── auth.config.ts          # Конфигурация NextAuth
│   ├── auth.ts                 # Инициализация NextAuth
│   ├── components.json         # Конфигурация shadcn/ui
│   ├── compose.yaml            # Docker Compose (в корне)
│   ├── Dockerfile              # Docker-образ приложения
│   ├── drizzle.config.ts       # Конфигурация Drizzle ORM
│   ├── eslint.config.mjs       # Конфигурация ESLint
│   ├── middleware.ts           # Next.js middleware
│   ├── next.config.ts          # Конфигурация Next.js
│   ├── package.json            # Зависимости и скрипты
│   ├── pnpm-lock.yaml          # Lock-файл pnpm
│   ├── postcss.config.mjs      # Конфигурация PostCSS
│   ├── tsconfig.json           # Конфигурация TypeScript
│   ├── vitest.config.ts        # Конфигурация Vitest
│   └── SEEDER.md               # Документация seeder
├── .dockerignore               # Игнорирование для Docker
├── .env.example                # Шаблон переменных окружения
├── .gitignore                  # Игнорирование для Git
└── README.md                   # Эта документация
```

---

## 🗄 База данных

### Схема данных

#### Основные таблицы

| Таблица | Описание |
|---------|----------|
| `user` | Пользователи системы (все роли) |
| `student` | Профили студентов |
| `university_staff` | Профили сотрудников университета |
| `organization_representative` | Представители организаций |
| `organization` | Организации-партнёры |
| `vacancy` | Вакансии |
| `application` | Отклики на вакансии |
| `resume` | Резюме студентов |
| `material` | Учебные материалы |
| `major` | Специальности |
| `skill` | Навыки |

#### Связующие таблицы

| Таблица | Описание |
|---------|----------|
| `vacancy_allowed_major` | Разрешённые специальности для вакансии |
| `vacancy_skill` | Требуемые навыки для вакансии |
| `student_skill` | Навыки студента |

### ENUM типы

```typescript
// Роли пользователей
type Role = "student" | "university_staff" | "organization_representative" | "admin";

// Статус модерации ВУЗом (для заявок на практику)
type UnivApprovalStatus = "not_required" | "pending" | "approved" | "rejected";

// Тип практики студента
type StudentPracticeType = "educational" | "production" | "pre_diploma";

// Статус отклика (со стороны компании)
type ApplicationStatus = "pending" | "approved" | "rejected";
```

### Миграции

В проекте настроена автоматическая синхронизация схемы при старте контейнера. Для ручного управления:

```bash
# Применить миграции вручную
pnpm run db:push

# Просмотр базы через GUI (drizzle-kit)
npx drizzle-kit studio
```

---

## 🔐 Аутентификация и роли

### Ролевая модель

| Роль | Описание | Доступ |
|------|----------|--------|
| `student` | Студент | Просмотр вакансий, отклики, резюме |
| `organization_representative` | Представитель организации | Публикация вакансий, управление откликами |
| `university_staff` | Сотрудник университета | Модерация, статистика |
| `admin` | Администратор | Полный доступ |

### Аутентификация

- **Провайдер**: Credentials (email + пароль)
- **Хранение сессий**: Database (PostgreSQL)
- **Хеширование**: bcryptjs
- **Механизм**: NextAuth.js (Auth.js) v5

### Защищённые роуты

- `/dashboard/*` — личный кабинет
- `/profile/*` — профиль пользователя
- `/organizations/*` — управление организациями
- `/practices/*` — управление практиками

### Публичные роуты

- `/` — главная страница
- `/login` — вход
- `/register` — регистрация
- `/documents` — учебные материалы

---

## 📁 Загрузка файлов

### S3-хранилище (MinIO)

Приложение использует MinIO для хранения файлов:

- **Резюме** (PDF, DOCX)
- **Логотипы организаций** (PNG, JPG)
- **Учебные материалы** (PDF, DOCX, PPTX)

### Конфигурация S3

```typescript
// src/lib/s3.ts
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.S3_REGION || "us-east-1",
  endpoint: process.env.S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY || "",
    secretAccessKey: process.env.S3_SECRET_KEY || "",
  },
});
```

### Presigned URL

Для загрузки файлов используются presigned URL (безопасный доступ):

```typescript
import { getPresignedUrl } from "@/lib/s3";

const uploadUrl = await getPresignedUrl(fileName, fileType);
```

---

## 🧪 Тестирование

### Запуск тестов

```bash
# Все тесты в режиме watch
pnpm test

# Однократный запуск
pnpm test:run

# С UI-интерфейсом
pnpm test:ui

# С отчётом о покрытии
pnpm test:coverage
```

### Структура тестов

```
src/
├── lib/
│   ├── password.test.ts      # Тесты хеширования паролей
│   └── validators/
│       ├── auth.test.ts      # Тесты валидации аутентификации
│       ├── material.test.ts  # Тесты валидации материалов
│       ├── organization.test.ts
│       ├── resume.test.ts
│       └── vacancy.test.ts
└── tests/
    └── setup.ts              # Setup для тестов
```

### Конфигурация Vitest

```typescript
// vitest.config.ts
{
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/tests/setup.ts"],
    include: ["src/**/*.{test,spec}.{js,ts,jsx,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
    },
  },
}
```

---

## 🐳 Docker и развёртывание

### Сервисы Docker Compose

| Сервис | Описание | Порт |
|--------|----------|------|
| `db` | PostgreSQL 15 | 5432 |
| `minio` | MinIO S3 | 9000 (API), 9001 (Console) |
| `web` | Next.js приложение | 3000 |
| `seeder` | Скрипт заполнения БД | — |

### Запуск в Docker

```bash
# Сборка и запуск всех сервисов
docker compose up --build

# Запуск в фоновом режиме
docker compose up -d

# Просмотр логов
docker compose logs -f web

# Остановка
docker compose down

# Остановка с удалением томов
docker compose down -v
```

### Dockerfile

Многостадийная сборка:

1. **base** — базовый образ Node.js 20
2. **deps** — установка зависимостей
3. **builder** — сборка Next.js
4. **seeder** — подготовка для seeder
5. **runner** — финальный образ для запуска

### Переменные для Docker

```yaml
# compose.yaml
services:
  web:
    build:
      args:
        NEXT_PUBLIC_S3_ENDPOINT: ${S3_PUBLIC_ENDPOINT}
    environment:
      - DATABASE_URL=postgres://...@db:5432/...
```

---

## 🔧 CI/CD

### GitHub Actions

Конфигурация: `.github/workflows/ci.yml`

#### Jobs

1. **Lint & Type Check**
   - Проверка ESLint
   - Проверка типов TypeScript

2. **Tests**
   - Запуск тестов
   - Загрузка отчёта о покрытии

3. **Build**
   - Сборка Next.js
   - Сохранение артефакта

### Триггеры

- Push в ветки `main`, `develop`
- Pull Request в ветки `main`, `develop`

### Concurrency

Автоматическая отмена предыдущих запусков при новом пуше.

---

## 🤝 Вклад в проект

### Ветка разработки

```bash
# Создание новой ветки
git checkout -b feature/your-feature-name

# Ветка должна быть основана на develop
git checkout develop
git pull
git checkout -b feature/your-feature-name
```

### Коммиты

Следуйте [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: добавить фильтрацию вакансий
fix: исправить ошибку авторизации
docs: обновить документацию API
style: исправить форматирование кода
refactor: рефакторинг модуля вакансий
test: добавить тесты валидации
chore: обновить зависимости
```

### Pull Request

1. Создайте ветку от `develop`
2. Внесите изменения
3. Добавьте тесты (если применимо)
4. Убедитесь, что CI проходит
5. Создайте PR в ветку `develop`

---

## 📄 Лицензия

MIT

---

## 📚 Документация

Подробная документация проекта доступна в папке [`docs/`](./docs/):

| Документ | Описание |
|----------|----------|
| [🏗 Архитектура](./docs/ARCHITECTURE.md) | Архитектурные решения, FSD, Server Components, Server Actions |
| [🗄 База данных](./docs/DATABASE.md) | Схема БД, миграции, примеры запросов |
| [🚀 Развёртывание](./docs/DEPLOYMENT.md) | Docker Compose, Nginx, SSL, мониторинг, бэкапы |
| [👨‍💻 Руководство разработчика](./docs/DEVELOPER_GUIDE.md) | Быстрый старт, Code Style, тестирование, Git workflow |

---

## 📞 Контакты

По вопросам обращайтесь к команде разработки.
