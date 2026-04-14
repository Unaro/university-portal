# Theme Provider Compatibility Report

> **Дата:** 14 апреля 2026  
> **Цель:** Подготовка всех компонентов для работы с ThemeProvider (поддержка светлой/тёмной темы)

---

## Легенда

| Приоритет | Описание |
|-----------|----------|
| 🔴 **Высокий** | Фоновые элементы (`bg-*`), которые будут слепить в тёмной теме |
| 🟡 **Средний** | Цвета текста (`text-*`), которые будут нечитаемы в тёмной теме |
| 🟢 **Низкий** | Акцентные цвета, иконки, hover-эффекты |
| ⚪ **Пропуск** | shadcn/ui базовые компоненты — не менять |

## Карта замены CSS переменных

| Было (hardcoded) | Стало (CSS variable) |
|-------------------|----------------------|
| `bg-white` / `bg-slate-50` / `bg-gray-50` | `bg-card` / `bg-background` / `bg-muted` |
| `text-slate-900` / `text-gray-900` | `text-foreground` |
| `text-slate-500` / `text-gray-500` / `text-slate-600` | `text-muted-foreground` |
| `bg-slate-100` / `bg-gray-100` | `bg-muted` |
| `border-slate-200` / `border-gray-200` | `border-border` |
| `bg-blue-600` | `bg-primary` |
| `text-blue-600` | `text-primary` |
| `bg-green-100 text-green-700` | `bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400` |
| `bg-red-100 text-red-700` | `bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400` |
| `text-white` (на primary фоне) | `text-primary-foreground` |
| `bg-white/80` | `bg-background/80` |

---

## 1. Views (Страницы) — 12 файлов

### 1.1 `src/views/home/ui/home-view.tsx`
| Строка | Hardcoded | Приоритет | Замена |
|--------|-----------|-----------|--------|
| 16 | `bg-slate-50` | 🔴 | `bg-background` |
| 22 | `bg-slate-50` | 🔴 | `bg-muted` |
| 26 | `text-slate-900` | 🟡 | `text-foreground` |
| 27 | `text-slate-500` | 🟡 | `text-muted-foreground` |

### 1.2 `src/views/auth/ui/register-view.tsx`
| Строка | Hardcoded | Приоритет | Замена |
|--------|-----------|-----------|--------|
| 8 | `bg-slate-50` | 🔴 | `bg-background` |
| 20 | `bg-slate-50` | 🔴 | `bg-background` |

### 1.3 `src/views/auth/ui/login-view.tsx`
| Строка | Hardcoded | Приоритет | Замена |
|--------|-----------|-----------|--------|
| 8 | `bg-slate-50` | 🔴 | `bg-background` |
| 20 | `bg-slate-50` | 🔴 | `bg-background` |

### 1.4 `src/views/profile/ui/profile-view.tsx`
| Строка | Hardcoded | Приоритет | Замена |
|--------|-----------|-----------|--------|
| 36 | `bg-slate-50` | 🔴 | `bg-background` |

### 1.5 `src/views/documents/ui/documents-view.tsx`
| Строка | Hardcoded | Приоритет | Замена |
|--------|-----------|-----------|--------|
| 12 | `bg-slate-50` | 🔴 | `bg-background` |

### 1.6 `src/views/organizations/ui/organizations-view.tsx`
| Строка | Hardcoded | Приоритет | Замена |
|--------|-----------|-----------|--------|
| 13 | `bg-slate-50` | 🔴 | `bg-background` |

### 1.7 `src/views/practice-details/ui/practice-details-view.tsx`
| Строка | Hardcoded | Приоритет | Замена |
|--------|-----------|-----------|--------|
| 7 | `bg-slate-50` | 🔴 | `bg-background` |

### 1.8 `src/views/application-manager/ui/application-manager-view.tsx`
| Строка | Hardcoded | Приоритет | Замена |
|--------|-----------|-----------|--------|
| 21 | `bg-slate-50/50` | 🔴 | `bg-muted/50` |
| 24 | `text-slate-500` | 🟡 | `text-muted-foreground` |
| 24 | `text-blue-600` | 🟡 | `text-primary` |
| 27 | `text-slate-900` | 🟡 | `text-foreground` |
| 28 | `text-slate-500` | 🟡 | `text-muted-foreground` |

### 1.9 `src/views/dashboard/ui/student-dashboard.tsx` (дополнительно)
| Строка | Hardcoded | Приоритет | Замена |
|--------|-----------|-----------|--------|
| 137 | `text-green-600` | 🟢 | `text-green-600 dark:text-green-400` |
| 138 | `text-red-500` | 🟢 | `text-destructive` |
| 168 | `bg-green-100 text-green-800 border-green-200` | 🟢 | добавить `dark:bg-green-900/20 dark:text-green-400 dark:border-green-800` |

### 1.10 `src/views/dashboard/ui/partner-dashboard.tsx` (дополнительно)
| Строка | Hardcoded | Приоритет | Замена |
|--------|-----------|-----------|--------|
| 71 | `text-orange-600 bg-orange-50` | 🟢 | добавить `dark:text-orange-400 dark:bg-orange-900/20` |
| 79 | `text-green-600` | 🟢 | `text-green-600 dark:text-green-400` |

### 1.11 `src/views/dashboard/ui/dashboard-view.tsx`
| Строка | Hardcoded | Приоритет | Замена |
|--------|-----------|-----------|--------|
| 29 | `text-slate-900` | 🟡 | `text-foreground` |
| 30 | `text-slate-500` | 🟡 | `text-muted-foreground` |
| 31 | `text-slate-900` | 🟡 | `text-foreground` |
| 50 | `bg-purple-50 border-purple-200` | 🔴 | `bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800` |
| 52 | `text-purple-900` | 🟡 | `text-purple-900 dark:text-purple-300` |
| 53 | `text-purple-700` | 🟡 | `text-purple-700 dark:text-purple-400` |
| 56 | `bg-purple-600 hover:bg-purple-700` | 🟢 | `bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-400` |

### 1.12 `src/views/vacancy-create/ui/vacancy-create-view.tsx`
| Строка | Hardcoded | Приоритет | Замена |
|--------|-----------|-----------|--------|
| 24 | `text-gray-500` | 🟡 | `text-muted-foreground` |

### 1.13 `src/views/admin/ui/admin-view.tsx`
| Строка | Hardcoded | Приоритет | Замена |
|--------|-----------|-----------|--------|
| 57 | `text-gray-500` | 🟡 | `text-muted-foreground` |
| 61 | `text-gray-500` | 🟡 | `text-muted-foreground` |
| 65 | `text-gray-500` | 🟡 | `text-muted-foreground` |
| 68 | `bg-green-50 border-green-100` | 🔴 | `bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800` |
| 69 | `text-green-700` | 🟡 | `text-green-700 dark:text-green-400` |
| 71 | `text-green-700` | 🟡 | `text-green-700 dark:text-green-400` |
| 80 | `bg-gray-50 text-gray-500` | 🔴 | `bg-muted text-muted-foreground` |
| 87 | `bg-gray-50` | 🔴 | `bg-muted` |
| 91 | `text-gray-500` | 🟡 | `text-muted-foreground` |
| 110 | `bg-green-600` | 🟢 | `bg-green-600 dark:bg-green-500` |

---

## 2. Widgets — 5 файлов

### 2.1 `src/widgets/vacancy-details/ui/vacancy-details.tsx` (дополнительно)
| Строка | Hardcoded | Приоритет | Замена |
|--------|-----------|-----------|--------|
| 97 | `text-green-700 bg-green-50 border-green-100` | 🟢 | добавить `dark:text-green-400 dark:bg-green-900/20 dark:border-green-800` |
| 135 | `text-green-600` | 🟢 | `text-green-600 dark:text-green-400` |

### 2.2 `src/widgets/student-profile/ui/student-profile-widget.tsx`
| Строка | Hardcoded | Приоритет | Замена |
|--------|-----------|-----------|--------|
| 45 | `bg-slate-100` | 🔴 | `bg-muted` |

### 2.3 `src/widgets/organization-list/ui/organization-list.tsx`
| Строка | Hardcoded | Приоритет | Замена |
|--------|-----------|-----------|--------|
| 48 | `text-gray-400` | 🟡 | `text-muted-foreground` |

### 2.4 `src/widgets/application-manager/ui/application-manager.tsx` (дополнительно)
| Строка | Hardcoded | Приоритет | Замена |
|--------|-----------|-----------|--------|
| 69 | `text-orange-600` | 🟢 | `text-orange-600 dark:text-orange-400` |
| 70 | `text-green-600` | 🟢 | `text-green-600 dark:text-green-400` |
| 99 | `bg-green-100 text-green-700` | 🟢 | добавить `dark:bg-green-900/20 dark:text-green-400` |
| 99 | `bg-red-100 text-red-700` | 🟢 | добавить `dark:bg-red-900/20 dark:text-red-400` |

### 2.5 `src/widgets/landing/ui/features.tsx` (дополнительно)
| Строка | Hardcoded | Приоритет | Замена |
|--------|-----------|-----------|--------|
| 31 | `text-green-600 bg-green-100` | 🟢 | добавить `dark:text-green-400 dark:bg-green-900/20` |

---

## 3. Features — 8 файлов

### 3.1 `src/features/application-list/ui/student-application-list.tsx` (дополнительно)
| Строка | Hardcoded | Приоритет | Замена |
|--------|-----------|-----------|--------|
| 33 | `bg-green-600 hover:bg-green-700` | 🟢 | добавить `dark:hover:bg-green-500` |

### 3.2 `src/features/auth/ui/logout-dropdown-item.tsx`
| Строка | Hardcoded | Приоритет | Замена |
|--------|-----------|-----------|--------|
| 16 | `text-red-600 focus:text-red-600 focus:bg-red-50` | 🟢 | `text-destructive focus:text-destructive focus:bg-destructive/10` |

### 3.3 `src/features/edit-resume/ui/resume-form.tsx`
| Строка | Hardcoded | Приоритет | Замена |
|--------|-----------|-----------|--------|
| 50-52 | ~~`bg-slate-50 border-slate-200 text-slate-500`~~ | ⚪ | **ЗАКОММЕНТИРОВАНО** — можно удалить |
| 66 | `text-green-600` | 🟢 | `text-green-600 dark:text-green-400` |

### 3.4 `src/features/edit-organization/ui/org-settings-form.tsx`
| Строка | Hardcoded | Приоритет | Замена |
|--------|-----------|-----------|--------|
| 38 | `bg-slate-100` | 🔴 | `bg-muted` |

### 3.5 `src/features/create-vacancy/ui/create-vacancy-form.tsx`
| Строка | Hardcoded | Приоритет | Замена |
|--------|-----------|-----------|--------|
| 57 | `text-red-500` | 🟡 | `text-destructive` |
| 83 | `bg-slate-50` | 🔴 | `bg-muted` |
| 84 | `text-slate-700` | 🟡 | `text-muted-foreground` |

### 3.6 `src/features/manage-application/ui/application-response-form.tsx` (дополнительно)
| Строка | Hardcoded | Приоритет | Замена |
|--------|-----------|-----------|--------|
| 39 | `text-orange-600` | 🟢 | `text-orange-600 dark:text-orange-400` |
| 55 | `bg-green-600 hover:bg-green-700` | 🟢 | добавить `dark:hover:bg-green-500` |

### 3.7 `src/features/apply-vacancy/ui/apply-button.tsx`
| Строка | Hardcoded | Приоритет | Замена |
|--------|-----------|-----------|--------|
| 32 | `bg-green-100 text-green-800` | 🟢 | `bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400` |

### 3.8 `src/features/manage-materials/ui/material-form.tsx`
| Строка | Hardcoded | Приоритет | Замена |
|--------|-----------|-----------|--------|
| 41 | `bg-green-100 text-green-800` | 🟢 | `bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400` |
| 41 | `bg-red-100 text-red-800` | 🟢 | `bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400` |

---

## 4. Entities — 3 файла

### 4.1 `src/entities/vacancy/ui/vacancy-card.tsx` (дополнительно)
| Строка | Hardcoded | Приоритет | Замена |
|--------|-----------|-----------|--------|
| 33 | `text-green-600 bg-green-50 border-green-100` | 🟢 | добавить `dark:text-green-400 dark:bg-green-900/20 dark:border-green-800` |

### 4.2 `src/entities/organization/ui/organization-card.tsx` (дополнительно)
| Строка | Hardcoded | Приоритет | Замена |
|--------|-----------|-----------|--------|
| 18 | `bg-blue-600, bg-purple-600, bg-green-600...` | 🟢 | Массив цветов для генерации аватара — можно оставить, добавить `text-primary-foreground` |

### 4.3 `src/entities/material/ui/material-row.tsx`
| Строка | Hardcoded | Приоритет | Замена |
|--------|-----------|-----------|--------|
| 17 | `text-gray-500` | 🟡 | `text-muted-foreground` |
| 18 | `bg-gray-100` | 🔴 | `bg-muted` |
| 22 | `text-red-500` | 🟢 | `text-destructive` |
| 23 | `bg-red-50` | 🔴 | `bg-red-50 dark:bg-red-900/20` |
| 26 | `text-blue-500` | 🟢 | `text-primary` |
| 27 | `bg-blue-50` | 🔴 | `bg-primary/10` |
| 31 | `hover:bg-slate-50 hover:border-slate-200` | 🟢 | `hover:bg-muted hover:border-border` |
| 59 | `hover:bg-red-50 hover:text-red-600 hover:border-red-200` | 🟢 | `hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400` |
| 63 | `hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200` | 🟢 | `hover:bg-primary/10 hover:text-primary` |

### 4.4 `src/entities/session/ui/profile-sidebar.tsx`
| Строка | Hardcoded | Приоритет | Замена |
|--------|-----------|-----------|--------|
| 29 | `bg-slate-100 border-white` | 🔴 | `bg-muted border-card` |
| 32 | `bg-slate-100` | 🔴 | `bg-muted` |

---

## 5. Components (документы) — 1 файл

### 5.1 `src/components/documents/referral-pdf.tsx`
| Строка | Hardcoded | Приоритет | Замена |
|--------|-----------|-----------|--------|
| 15 | `borderTopColor: "#000"` | ⚪ | **PDF для печати** — оставить `#000` (это для печати документа) |

---

## 6. shadcn/ui базовые компоненты — НЕ МЕНЯТЬ

| Файл | Строка | Значение | Статус |
|------|--------|----------|--------|
| `src/components/ui/button.tsx` | 14 | `text-white` (в destructive variant) | ⚪ Оставить — стандарт shadcn |
| `src/components/ui/badge.tsx` | 17 | `text-white` (в destructive variant) | ⚪ Оставить — стандарт shadcn |
| `src/components/ui/dialog.tsx` | 41 | `bg-black/50` (overlay backdrop) | ⚪ Оставить — стандарт модалок |

---

## Итоговая статистика

| Категория | Количество |
|-----------|------------|
| Файлов требует исправления | **28** |
| 🔴 Высокий приоритет (фоны) | ~30 |
| 🟡 Средний приоритет (текст) | ~35 |
| 🟢 Низкий приоритет (акценты) | ~45 |
| ⚪ Пропуск (shadcn/pdf) | 4 |

---

## Рекомендуемый порядок исправления

1. **Views** — начать с `home-view.tsx`, `login-view.tsx`, `register-view.tsx` (самые видимые страницы)
2. **Widgets** — `student-profile-widget`, `organization-list`
3. **Features** — `logout-dropdown-item`, `create-vacancy-form`, `material-form`
4. **Entities** — `material-row.tsx`, `profile-sidebar.tsx`
5. **Дополнительные dark: variants** — добавить `dark:` классы к уже исправленным файлам для статусных цветов (green, red, orange)

---

## Заметки

- **Status colors (green/red/orange)**: Для статусных элементов рекомендуется использовать паттерн `bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400` — это сохраняет читаемость в обеих темах
- **Logo colors в organization-card.tsx**: Массив `["bg-blue-600", "bg-purple-600", ...]` используется для генерации плейсхолдеров — можно оставить как есть, т.к. это визуальная идентификация
- **referral-pdf.tsx**: PDF генерация использует фиксированные цвета для печати — это корректно
