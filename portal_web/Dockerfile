# 1. Исходный образ (Base)
FROM node:20-alpine AS base

# 2. Стадия зависимостей (Deps)
FROM base AS deps
# libc6-compat нужен для некоторых библиотек (например, sharp или image processing)
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Копируем package.json
COPY package.json package-lock.json* ./
# Устанавливаем зависимости
RUN npm ci

# 3. Стадия сборки (Builder)
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Ловим аргумент из compose.yaml
ARG NEXT_PUBLIC_S3_ENDPOINT

# Делаем его доступным для команды npm run build
ENV NEXT_PUBLIC_S3_ENDPOINT=$NEXT_PUBLIC_S3_ENDPOINT

# Отключаем телеметрию Next.js (ускоряет сборку)
ENV NEXT_TELEMETRY_DISABLED 1

# Запускаем билд
RUN npm run build

# 4. Финальная стадия (Runner)
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Создаем системного пользователя (безопасность)
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Копируем статику (картинки, стили)
COPY --from=builder /app/public ./public

# Копируем сгенерированный standalone сервер
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Копируем папку миграций (чтобы Drizzle мог их найти, если понадобится)
# COPY --from=builder --chown=nextjs:nodejs /app/drizzle ./drizzle

USER nextjs

# Открываем порт
EXPOSE 3000
ENV PORT 3000

# Команда запуска
CMD ["node", "server.js"]