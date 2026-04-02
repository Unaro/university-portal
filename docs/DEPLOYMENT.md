# 🚀 Развёртывание University Portal

Руководство по развёртыванию приложения в продакшен.

---

## 📋 Оглавление

- [Требования](#требования)
- [Подготовка окружения](#подготовка-окружения)
- [Docker Compose (Production)](#docker-compose-production)
- [Развёртывание на VPS](#развёртывание-на-vps)
- [Настройка домена и HTTPS](#настройка-домена-и-https)
- [Мониторинг и логи](#мониторинг-и-логи)
- [Резервное копирование](#резервное-копирование)
- [Обновление приложения](#обновление-приложения)
- [Troubleshooting](#troubleshooting)

---

## 📦 Требования

### Минимальные требования

| Компонент | Требование |
|-----------|------------|
| CPU | 2 ядра |
| RAM | 4 GB |
| Disk | 20 GB SSD |
| OS | Linux (Ubuntu 22.04+) |

### Рекомендуемые требования

| Компонент | Требование |
|-----------|------------|
| CPU | 4 ядра |
| RAM | 8 GB |
| Disk | 40 GB SSD |
| OS | Linux (Ubuntu 22.04 LTS) |

### Необходимое ПО

- Docker 24+
- Docker Compose 2.20+
- Git
- SSL-сертификат (Let's Encrypt)

---

## ⚙️ Подготовка окружения

### 1. Установка Docker

```bash
# Обновление пакетов
sudo apt update && sudo apt upgrade -y

# Установка Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Добавление пользователя в группу docker
sudo usermod -aG docker $USER

# Проверка установки
docker --version
docker compose version
```

### 2. Клонирование репозитория

```bash
cd /var/www
git clone <repository-url> university-portal
cd university-portal
```

### 3. Настройка переменных окружения

```bash
# Копирование шаблона
cp .env.example .env

# Генерация секретов
# AUTH_SECRET
openssl rand -base64 32

# DB_PASSWORD
openssl rand -base64 32

# MINIO_ROOT_PASSWORD
openssl rand -base64 32

# Редактирование .env
nano .env
```

### 4. Production .env файл

```bash
# ===========================================
# PRODUCTION ENVIRONMENT
# ===========================================

# --- СЕТЬ ---
SERVER_IP=your-domain.com

# --- БАЗА ДАННЫХ ---
DB_USER=portal_user
DB_PASSWORD=<secure_password_here>
DB_NAME=portal_db
DB_PORT_HOST=5432

# --- АВТОРИЗАЦИЯ ---
AUTH_SECRET=<secure_secret_here>
AUTH_URL=https://your-domain.com
AUTH_TRUST_HOST=true

# --- S3 (MinIO) ---
MINIO_ROOT_USER=portal_admin
MINIO_ROOT_PASSWORD=<secure_password_here>

# Внутренний адрес (для Docker)
S3_ENDPOINT=http://minio:9000
# Внешний адрес (через reverse proxy)
S3_PUBLIC_ENDPOINT=https://s3.your-domain.com

S3_ACCESS_KEY=${MINIO_ROOT_USER}
S3_SECRET_KEY=${MINIO_ROOT_PASSWORD}
S3_BUCKET_NAME=portal-documents
S3_REGION=us-east-1

# --- ПРОЧЕЕ ---
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

---

## 🐳 Docker Compose (Production)

### Production compose.yaml

```yaml
name: university-portal

services:
  # PostgreSQL
  db:
    image: postgres:15-alpine
    restart: always
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER} -d ${DB_NAME}"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - portal-network

  # MinIO
  minio:
    image: minio/minio
    restart: always
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: ${MINIO_ROOT_USER}
      MINIO_ROOT_PASSWORD: ${MINIO_ROOT_PASSWORD}
    volumes:
      - minio_data:/data
    networks:
      - portal-network
    # Не открываем порты наружу напрямую!

  # Web Application
  web:
    build:
      context: portal_web
      args:
        NEXT_PUBLIC_S3_ENDPOINT: ${S3_PUBLIC_ENDPOINT}
    container_name: portal-web
    restart: always
    depends_on:
      db:
        condition: service_healthy
      minio:
        condition: service_started
    env_file:
      - .env
    environment:
      - DATABASE_URL=postgres://${DB_USER}:${DB_PASSWORD}@db:5432/${DB_NAME}
      - NODE_ENV=production
    networks:
      - portal-network

  # Seeder (одноразовый)
  seeder:
    build:
      context: portal_web
      target: seeder
      args:
        NEXT_PUBLIC_S3_ENDPOINT: ${S3_PUBLIC_ENDPOINT}
    container_name: portal-seeder
    depends_on:
      db:
        condition: service_healthy
      minio:
        condition: service_started
    env_file:
      - .env
    environment:
      - DATABASE_URL=postgres://${DB_USER}:${DB_PASSWORD}@db:5432/${DB_NAME}
      - S3_ENDPOINT=http://minio:9000
    entrypoint: ["sh", "-c", "npx drizzle-kit push && npx tsx src/db/seeder.ts"]
    networks:
      - portal-network

  # Nginx Reverse Proxy
  nginx:
    image: nginx:alpine
    container_name: portal-nginx
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
      - certbot-data:/var/www/certbot
    depends_on:
      - web
      - minio
    networks:
      - portal-network

  # Certbot для SSL
  certbot:
    image: certbot/certbot
    container_name: portal-certbot
    volumes:
      - certbot-data:/var/www/certbot
    entrypoint: "/bin/sh -c 'trap exit TERM; while :; do certbot renew; sleep 12h & wait $${!}; done;'"

networks:
  portal-network:
    driver: bridge

volumes:
  postgres_data:
  minio_data:
  certbot-data:
```

### Nginx конфигурация

```nginx
# nginx/nginx.conf
events {
    worker_connections 1024;
}

http {
    # Redirect HTTP to HTTPS
    server {
        listen 80;
        server_name your-domain.com www.your-domain.com;
        
        location /.well-known/acme-challenge/ {
            root /var/www/certbot;
        }
        
        location / {
            return 301 https://$server_name$request_uri;
        }
    }

    # Main Application
    server {
        listen 443 ssl http2;
        server_name your-domain.com www.your-domain.com;

        ssl_certificate /etc/nginx/ssl/fullchain.pem;
        ssl_certificate_key /etc/nginx/ssl/privkey.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers HIGH:!aNULL:!MD5;

        # Web Application
        location / {
            proxy_pass http://web:3000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }

        # MinIO (S3) API
        location /minio/ {
            proxy_pass http://minio:9000/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            
            client_max_body_size 100MB;
        }

        # MinIO Console
        location /minio-console/ {
            proxy_pass http://minio:9001/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
```

---

## 🖥 Развёртывание на VPS

### Пошаговая инструкция

#### Шаг 1: Подготовка сервера

```bash
# SSH подключение
ssh user@your-server-ip

# Обновление системы
sudo apt update && sudo apt upgrade -y

# Установка зависимостей
sudo apt install -y git curl wget

# Установка Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Выход и повторное подключение для применения группы docker
exit
```

#### Шаг 2: Клонирование и настройка

```bash
# Клонирование
cd /var/www
sudo git clone <repository-url> university-portal
sudo chown -R $USER:$USER university-portal
cd university-portal

# Настройка .env
cp .env.example .env
nano .env
```

#### Шаг 3: Получение SSL сертификата

```bash
# Остановка certbot контейнера (если запущен)
docker compose stop certbot

# Получение сертификата
docker run --rm \
  -v $(pwd)/nginx/ssl:/etc/letsencrypt \
  -v certbot-data:/var/www/certbot \
  certbot/certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  -d your-domain.com \
  -d www.your-domain.com \
  --email your-email@example.com \
  --agree-tos \
  --no-eff-email
```

#### Шаг 4: Первый запуск

```bash
# Сборка и запуск
docker compose up --build -d

# Проверка статуса
docker compose ps

# Просмотр логов
docker compose logs -f web
```

#### Шаг 5: Применение миграций

```bash
# Если seeder не сработал автоматически
docker compose run --rm seeder
```

---

## 🔒 Настройка домена и HTTPS

### DNS записи

```
# A запись
your-domain.com    →    your-server-ip
www.your-domain.com →    your-server-ip
```

### Автоматическое обновление SSL

Certbot настроен на автоматическое обновление сертификатов.

Проверка:
```bash
docker compose exec certbot certbot renew --dry-run
```

### Force HTTPS редирект

Настроен в nginx.conf (см. выше).

---

## 📊 Мониторинг и логи

### Docker логи

```bash
# Все логи
docker compose logs -f

# Конкретный сервис
docker compose logs -f web
docker compose logs -f db
docker compose logs -f nginx

# Последние 100 строк
docker compose logs --tail=100 web
```

### Мониторинг ресурсов

```bash
# Использование ресурсов контейнерами
docker stats

# Информация о контейнерах
docker compose ps

# Проверка здоровья
docker compose ps --format "table {{.Name}}\t{{.Status}}\t{{.Health}}"
```

### PostgreSQL мониторинг

```bash
# Подключение к БД
docker compose exec db psql -U portal_user -d portal_db

# Проверка размера БД
SELECT pg_size_pretty(pg_database_size('portal_db'));

# Активные подключения
SELECT count(*) FROM pg_stat_activity;
```

### Uptime мониторинг

Рекомендуется настроить внешний мониторинг:

- **Uptime Kuma** — self-hosted мониторинг
- **Pingdom** — облачный мониторинг
- **Healthchecks.io** — cron мониторинг

---

## 💾 Резервное копирование

### Скрипт бэкапа

```bash
#!/bin/bash
# backup.sh

BACKUP_DIR="/backups/university-portal"
DATE=$(date +%Y%m%d_%H%M%S)
DB_USER="portal_user"
DB_NAME="portal_db"

# Создание директории
mkdir -p $BACKUP_DIR

# Бэкап базы данных
docker compose exec -T db pg_dump -U $DB_USER $DB_NAME > $BACKUP_DIR/db_$DATE.sql

# Бэкап MinIO данных
tar -czf $BACKUP_DIR/minio_$DATE.tar.gz -C /var/lib/docker/volumes/university-portal_minio_data/_data .

# Бэкап .env файла
cp .env $BACKUP_DIR/env_$DATE.backup

# Удаление старых бэкапов (старше 7 дней)
find $BACKUP_DIR -type f -mtime +7 -delete

echo "Backup completed: $DATE"
```

### Автоматизация через cron

```bash
# Редактирование crontab
crontab -e

# Добавление задачи (ежедневно в 3:00)
0 3 * * * /var/www/university-portal/backup.sh >> /var/log/portal_backup.log 2>&1
```

### Восстановление из бэкапа

```bash
# Восстановление БД
docker compose exec -T db psql -U portal_user -d portal_db < backup.sql

# Восстановление MinIO
tar -xzf minio_backup.tar.gz -C /var/lib/docker/volumes/university-portal_minio_data/_data
```

---

## 🔄 Обновление приложения

### Автоматическое обновление (Docker)

```bash
# Переход в директорию проекта
cd /var/www/university-portal

# Получение новых изменений
git pull origin main

# Пересборка и перезапуск
docker compose up -d --build --force-recreate web

# Применение миграций (если есть)
docker compose run --rm seeder
```

### Обновление с нулевым временем простоя

```bash
# Запуск новой версии параллельно
docker compose up -d --build web-new

# Переключение трафика (через nginx upstream)
# См. документацию nginx для blue-green деплоя

# Остановка старой версии
docker compose stop web
docker compose rm -f web
```

### Откат версии

```bash
# Возврат к предыдущему коммиту
git checkout <previous-commit-hash>

# Пересборка
docker compose up -d --build

# Восстановление БД из бэкапа (если нужна миграция вниз)
docker compose exec db psql -U portal_user -d portal_db < backup.sql
```

---

## 🔧 Troubleshooting

### Приложение не запускается

```bash
# Проверка логов
docker compose logs web

# Проверка переменных окружения
docker compose exec web env

# Проверка подключения к БД
docker compose exec web nc -zv db 5432
```

### Ошибки базы данных

```bash
# Проверка здоровья PostgreSQL
docker compose exec db pg_isready

# Перезапуск PostgreSQL
docker compose restart db

# Проверка логов БД
docker compose logs db
```

### Проблемы с SSL

```bash
# Проверка сертификата
openssl s_client -connect your-domain.com:443

# Принудительное обновление
docker compose exec certbot certbot renew --force-renewal
```

### MinIO недоступен

```bash
# Проверка логов MinIO
docker compose logs minio

# Проверка подключения
docker compose exec web curl http://minio:9000/minio/health/live

# Перезапуск MinIO
docker compose restart minio
```

### Очистка кэша Docker

```bash
# Очистка неиспользуемых ресурсов
docker system prune -a

# Очистка кэша build
docker builder prune -a
```

---

## 📈 Масштабирование

### Горизонтальное масштабирование Web

```yaml
# docker-compose.prod.yml
services:
  web:
    deploy:
      replicas: 3
      resources:
        limits:
          cpus: '1'
          memory: 1G
```

### Репликация PostgreSQL

Для production рекомендуется настроить:

- **Streaming Replication** — для отказоустойчивости
- **PgBouncer** — для connection pooling
- **Patroni** — для автоматического failover

### Load Balancing

```nginx
upstream web_servers {
    server web1:3000;
    server web2:3000;
    server web3:3000;
}

server {
    location / {
        proxy_pass http://web_servers;
    }
}
```

---

## 🔐 Безопасность

### Firewall настройки

```bash
# UFW (Uncomplicated Firewall)
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

### Security Best Practices

1. **Не использовать root** для Docker
2. **Регулярно обновлять** пакеты и образы
3. **Ограничить доступ** к БД только из внутренней сети
4. **Использовать secrets** для чувствительных данных
5. **Включить audit logging**

### Сканирование уязвимостей

```bash
# Сканирование образов
docker scout cve <image-name>

# Сканирование кода
npm audit
pnpm audit
```

---

## 📞 Поддержка

При возникновении проблем:

1. Проверьте логи: `docker compose logs -f`
2. Проверьте здоровье сервисов: `docker compose ps`
3. Проверьте переменные окружения
4. Убедитесь, что порты открыты в firewall

---

## 📚 Дополнительные ресурсы

- [Docker Documentation](https://docs.docker.com/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Let's Encrypt](https://letsencrypt.org/)
