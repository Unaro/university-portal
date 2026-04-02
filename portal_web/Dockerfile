# 1. Исходный образ (Base)
FROM node:20-alpine AS base

# 2. Стадия зависимостей (Deps)
FROM base AS deps
# libc6-compat нужен для некоторых библиотек (например, sharp или image processing)
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Устанавливаем pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Копируем package.json и lock-файл
COPY package.json pnpm-lock.yaml ./
# Устанавливаем зависимости
RUN pnpm install --frozen-lockfile

# 3. Стадия сборки (Builder)
FROM base AS builder
WORKDIR /app
# Устанавливаем pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Ловим аргумент из compose.yaml
ARG NEXT_PUBLIC_S3_ENDPOINT

# Делаем его доступным для команды pnpm run build
ENV NEXT_PUBLIC_S3_ENDPOINT=$NEXT_PUBLIC_S3_ENDPOINT

# Отключаем телеметрию Next.js (ускоряет сборку)
ENV NEXT_TELEMETRY_DISABLED 1

# Запускаем билд
RUN pnpm run build

# 4. Стадия для seeder (Seeder)
FROM base AS seeder
WORKDIR /app
RUN apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 5. Финальная стадия (Runner)
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

# Копируем файлы для seeder
COPY --from=builder --chown=nextjs:nodejs /app/src ./src
COPY --from=builder --chown=nextjs:nodejs /app/drizzle.config.ts ./
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./
COPY --from=builder --chown=nextjs:nodejs /app/scripts ./scripts
# Копируем node_modules со стадии seeder
COPY --from=seeder /app/node_modules ./node_modules

USER nextjs

# Открываем порт
EXPOSE 3000
ENV PORT 3000

# Команда запуска
CMD ["node", "server.js"]