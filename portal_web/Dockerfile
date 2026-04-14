# 1. Base
FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate

# 2. Dependencies (кешируется отдельно)
FROM base AS deps
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# 3. Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG NEXT_PUBLIC_S3_ENDPOINT
ENV NEXT_PUBLIC_S3_ENDPOINT=$NEXT_PUBLIC_S3_ENDPOINT
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm run build

# 4. Runner (production)
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Безопасность
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Next.js Standalone
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# ОПЦИОНАЛЬНО: файлы для сидера/миграций (только если планируете запускать их внутри контейнера)
# Для чистого production эти строки можно закомментировать
# COPY --from=deps /app/node_modules ./node_modules
# COPY --from=builder /app/src ./src
# COPY --from=builder /app/drizzle.config.ts ./
# COPY drizzle ./drizzle

USER nextjs
EXPOSE 3000
ENV PORT=3000
CMD ["node", "server.js"]