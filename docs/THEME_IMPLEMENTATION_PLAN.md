# 🌓 План реализации поддержки тем оформления

> **Статус:** Не реализовано (инфраструктура готова)  
> **Дата:** 14 апреля 2026  
> **Приоритет:** Средний

---

## 📋 Текущее состояние

| Компонент | Статус | Примечание |
|-----------|--------|------------|
| CSS переменные (`:root` / `.dark`) | ✅ Готово | `src/app/globals.css` |
| Tailwind dark mode variant | ✅ Готово | `@custom-variant dark (&:is(.dark *))` |
| `next-themes` dependency | ✅ Установлен | v0.4.6 в `package.json` |
| ThemeProvider компонент | ❌ Не создан | Файл отсутствует |
| ThemeProvider в layout | ❌ Не подключён | `providers.tsx` имеет только `SessionProvider` |
| UI переключатель темы | ❌ Не создан | Нет кнопки/меню |
| `suppressHydrationWarning` | ❌ Не установлен | Нужен на `<html>` |
| Документация | ⚠️ Несоответствие | `ARCHITECTURE.md` описывает ThemeProvider, но его нет в коде |

---

## 🎯 Цели

1. Пользователь может переключать тему (light / dark / system)
2. Выбор темы сохраняется в `localStorage`
3. Тема применяется ко всему UI консистивно
4. Нет гидратационных конфликтов между сервером и клиентом

---

## 📝 План реализации

### Шаг 1: Создать ThemeProvider компонент

**Файл:** `src/components/ui/theme-provider.tsx`

```tsx
"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
```

**Требования:**
- Обернуть в `"use client"` (next-themes использует хуки)
- Пробросить все пропсы в `NextThemesProvider`

---

### Шаг 2: Подключить ThemeProvider в Providers

**Файл:** `src/app/providers.tsx`

**Текущий код:**
```tsx
"use client";

import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
```

**Новый код:**
```tsx
"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/components/ui/theme-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}
```

**Параметры:**
| Параметр | Значение | Описание |
|----------|----------|----------|
| `attribute` | `"class"` | Переключает через `.dark` класс на `<html>` |
| `defaultTheme` | `"system"` | По умолчанию использует системную тему ОС |
| `enableSystem` | `true` | Позволяет использовать системную тему |
| `disableTransitionOnChange` | `true` | Убирает моргание при переключении |

---

### Шаг 3: Добавить suppressHydrationWarning

**Файл:** `src/app/layout.tsx`

**Изменить:**
```tsx
// Было:
<html lang="ru" className="h-full">

// Стало:
<html lang="ru" className="h-full" suppressHydrationWarning>
```

**Зачем:** next-themes определяет тему на клиенте, что может отличаться от серверного рендера. `suppressHydrationWarning` подавляет предупреждение гидратации.

---

### Шаг 4: Создать компонент переключателя темы

**Файл:** `src/components/ui/theme-toggle.tsx`

```tsx
"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ThemeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Переключить тему</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Светлая
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Тёмная
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          Системная
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

**Требования:**
- Использует `lucide-react` иконки (уже установлены)
- Использует `shadcn/ui` DropdownMenu (уже установлен)
- Три опции: light, dark, system

---

### Шаг 5: Разместить переключатель в Header

**Файл:** `src/widgets/header/ui/header.tsx`

**Задача:** Добавить `ThemeToggle` в правую часть хедера (рядом с профилем/авторизацией).

**Пример:**
```tsx
import { ThemeToggle } from "@/components/ui/theme-toggle";

// ... в JSX хедера:
<div className="flex items-center gap-2">
  <ThemeToggle />
  {/* existing auth/profile buttons */}
</div>
```

---

### Шаг 6: Обновить документацию

**Файл:** `docs/ARCHITECTURE.md`

**Задача:** Убедиться что пример Layout соответствует реальному коду.

**Изменить секцию Layouts:**
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
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <SessionProvider>
            {children}
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

**Добавить секцию "Темы оформления":**
```markdown
## 🌓 Темы оформления

Проект поддерживает светлую, тёмную и системную темы.

### Провайдер темы

ThemeProvider обёрнут в providers.tsx вместе с SessionProvider.

### Переключение темы

Компонент ThemeToggle в хедере позволяет переключать тему.
Выбор сохраняется в localStorage.

### CSS переменные

Все цвета определены в globals.css через CSS custom properties.
Тёмная тема активируется через .dark класс на <html>.
```

---

### Шаг 7: Тестирование

**Чек-лист:**

- [ ] Приложение запускается без ошибок гидратации
- [ ] По умолчанию применяется системная тема
- [ ] Переключение на светлую тему работает
- [ ] Переключение на тёмную тему работает
- [ ] Переключение на системную тему работает
- [ ] Выбор сохраняется после перезагрузки страницы
- [ ] Все компоненты корректно выглядят в обеих темах
- [ ] Toaster (Sonner) синхронизирован с темой
- [ ] Нет моргания/мигания при загрузке страницы

---

### Шаг 8: (Опционально) Добавить кастомные темы

**Если потребуется расширить beyond light/dark:**

1. Создать систему CSS переменных для дополнительных тем (например, "blue", "green")
2. Добавить `ThemeProvider` с `themes={['light', 'dark', 'blue', 'green']}`
3. Создать UI для выбора дополнительных тем

---

## 📂 Файлы для создания/изменения

| Действие | Файл |
|----------|------|
| **Создать** | `src/components/ui/theme-provider.tsx` |
| **Создать** | `src/components/ui/theme-toggle.tsx` |
| **Изменить** | `src/app/providers.tsx` |
| **Изменить** | `src/app/layout.tsx` |
| **Изменить** | `src/widgets/header/ui/header.tsx` |
| **Изменить** | `docs/ARCHITECTURE.md` |

---

## ⏱ Оценка усилий

| Шаг | Сложность |
|-----|-----------|
| Шаг 1: ThemeProvider | 5 мин |
| Шаг 2: Providers update | 5 мин |
| Шаг 3: suppressHydrationWarning | 1 мин |
| Шаг 4: ThemeToggle component | 15 мин |
| Шаг 5: Header integration | 10 мин |
| Шаг 6: Documentation update | 10 мин |
| Шаг 7: Testing | 20 мин |
| **ИТОГО** | **~1 час** |

---

## 🔗 Ресурсы

- [next-themes documentation](https://github.com/pacocoursey/next-themes)
- [shadcn/ui theming guide](https://ui.shadcn.com/docs/theming)
- [Tailwind CSS dark mode](https://tailwindcss.com/docs/dark-mode)
