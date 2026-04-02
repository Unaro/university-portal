# 📚 Документация University Portal

Добро пожаловать в документацию проекта University Portal!

---

## 📋 Оглавление документации

### Основная документация

| Документ | Описание |
|----------|----------|
| [README.md](../README.md) | 🏠 Главная документация проекта |
| [docs/ARCHITECTURE.md](./ARCHITECTURE.md) | 🏗 Архитектура и паттерны проекта |
| [docs/DATABASE.md](./DATABASE.md) | 🗄 Схема базы данных и миграции |
| [docs/DEPLOYMENT.md](./DEPLOYMENT.md) | 🚀 Развёртывание и настройка production |
| [docs/DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) | 👨‍💻 Руководство разработчика |

### Внутренняя документация

| Документ | Описание |
|----------|----------|
| [portal_web/SEEDER.md](../portal_web/SEEDER.md) | 🌱 Документация seeder (тестовые данные) |

---

## 🎯 Быстрые ссылки

### Для новых разработчиков

1. Начните с [README.md](../README.md) — обзор проекта
2. Прочитайте [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) — настройка окружения
3. Изучите [ARCHITECTURE.md](./ARCHITECTURE.md) — понимание структуры
4. Посмотрите [DATABASE.md](./DATABASE.md) — схема данных

### Для развёртывания

1. [DEPLOYMENT.md](./DEPLOYMENT.md) — полное руководство по деплою
2. [DATABASE.md](./DATABASE.md) — миграции и настройка БД
3. [README.md](../README.md) — переменные окружения

### Для работы с кодом

1. [ARCHITECTURE.md](./ARCHITECTURE.md) — Feature-Sliced Design
2. [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) — Code Style и best practices
3. [DATABASE.md](./DATABASE.md) — работа с Drizzle ORM

---

## 📖 Краткое содержание документов

### README.md

Основная документация проекта:

- Описание и возможности
- Технологический стек
- Быстрый старт
- Настройка окружения
- Структура проекта
- Роли пользователей
- Скрипты проекта

### ARCHITECTURE.md

Архитектурные решения:

- Feature-Sliced Design методология
- Next.js App Router
- Server vs Client Components
- Server Actions
- Работа с базой данных (Drizzle ORM)
- Аутентификация (NextAuth.js)
- Загрузка файлов (S3/MinIO)
- Валидация данных (Zod)

### DATABASE.md

Документация базы данных:

- ERD диаграмма
- Описание таблиц
- ENUM типы
- Связи между таблицами
- Миграции (Drizzle Kit)
- Примеры запросов
- Индексы и ограничения

### DEPLOYMENT.md

Руководство по развёртыванию:

- Требования к серверу
- Настройка Docker Compose
- Настройка Nginx и HTTPS
- Мониторинг и логи
- Резервное копирование
- Обновление приложения
- Troubleshooting

### DEVELOPER_GUIDE.md

Руководство разработчика:

- Быстрый старт
- Настройка IDE (VS Code)
- Структура проекта (FSD)
- Разработка фич
- Тестирование (Vitest)
- Code Style
- Git Workflow
- Полезные команды

---

## 🔧 Индексы

### По темам

#### Аутентификация
- [ARCHITECTURE.md - Аутентификация](./ARCHITECTURE.md#аутентификация)
- [DATABASE.md - Таблица user](./DATABASE.md#user)
- [DEVELOPER_GUIDE.md - Server Actions](./DEVELOPER_GUIDE.md#создайте-server-action)

#### База данных
- [DATABASE.md - Схема](./DATABASE.md#диаграмма-erd)
- [DATABASE.md - Миграции](./DATABASE.md#миграции)
- [ARCHITECTURE.md - Drizzle ORM](./ARCHITECTURE.md#работа-с-базой-данных)

#### Развёртывание
- [DEPLOYMENT.md - Docker Compose](./DEPLOYMENT.md#docker-compose-production)
- [DEPLOYMENT.md - Nginx](./DEPLOYMENT.md#nginx-конфигурация)
- [DEPLOYMENT.md - SSL](./DEPLOYMENT.md#настройка-домена-и-https)

#### Разработка
- [DEVELOPER_GUIDE.md - Создание фичи](./DEVELOPER_GUIDE.md#разработка-фич)
- [DEVELOPER_GUIDE.md - Тесты](./DEVELOPER_GUIDE.md#тестирование)
- [DEVELOPER_GUIDE.md - Code Style](./DEVELOPER_GUIDE.md#code-style)

#### Архитектура
- [ARCHITECTURE.md - FSD](./ARCHITECTURE.md#feature-sliced-design)
- [ARCHITECTURE.md - Server Components](./ARCHITECTURE.md#server-components-vs-client-components)
- [ARCHITECTURE.md - Server Actions](./ARCHITECTURE.md#server-actions)

---

## 📞 Контакты

По вопросам документации обращайтесь к команде разработки.

---

## 🤝 Вклад в документацию

Если вы нашли ошибку или хотите улучшить документацию:

1. Создайте ветку `docs/update-description`
2. Внесите изменения
3. Создайте Pull Request

---

**Последнее обновление:** Апрель 2026
