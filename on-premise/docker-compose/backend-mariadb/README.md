# Shared Docker Compose Template for Backend + MariaDB

## Template hien co

- `docker-compose.yml.example`
  Docker Compose file mau de chay mot ung dung backend cung MariaDB tren cung mot server.

## Khi nao nen dung

- Ban da co san Docker image cho backend
- Ung dung can mot MariaDB chay cung server
- Muon co mot file Compose don gian de copy va doi lai image, port, va bien moi truong

## Can doi gi truoc khi dung

- Doi `APP_IMAGE` thanh image thuc te cua ung dung
- Doi `MYSQL_ROOT_PASSWORD`, `MYSQL_DATABASE`, `MYSQL_USER`, `MYSQL_PASSWORD`
- Doi `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` neu backend cua ban dung ten bien moi truong khac
- Doi `APP_HOST_PORT` neu ung dung khong publish ra cong `8082`
- Doi `DB_HOST_PORT` neu ban muon expose MariaDB tren cong khac hoac bo han mapping port neu khong can truy cap DB tu ben ngoai

## Cach dung nhanh

### 1. Copy file mau

```bash
cp docker-compose.yml.example docker-compose.yml
```

### 2. Review va sua cac gia tri can tuy bien

Co the sua truc tiep trong file `docker-compose.yml` hoac truyen qua bien moi truong khi chay.

Vi du:

```bash
export APP_IMAGE="shoeshop:v3"
export MYSQL_ROOT_PASSWORD="change-root-password"
export MYSQL_DATABASE="shoeshop"
export MYSQL_USER="shoeshop"
export MYSQL_PASSWORD="change-app-password"
export DB_NAME="shoeshop"
export DB_USER="shoeshop"
export DB_PASSWORD="change-app-password"
```

### 3. Chay stack

Neu he thong dung Compose plugin moi:

```bash
docker compose up -d
```

Neu he thong dung `docker-compose` kieu cu:

```bash
docker-compose up -d
```

### 4. Kiem tra nhanh

```bash
docker compose ps
docker logs <backend-container>
docker logs <mariadb-container>
```

## Noi dung template

```yaml
version: '3.8'
services:
  db1:
    image: mariadb:10.6
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD:-change-me-root-password}
      MYSQL_DATABASE: ${MYSQL_DATABASE:-app_db}
      MYSQL_USER: ${MYSQL_USER:-app_user}
      MYSQL_PASSWORD: ${MYSQL_PASSWORD:-change-me-app-password}
    volumes:
      - mariadb_data:/var/lib/mysql
    ports:
      - "${DB_HOST_PORT:-3307}:3306"

  app-backend:
    image: ${APP_IMAGE:-your-backend-image:latest}
    restart: always
    depends_on:
      - db1
    ports:
      - "${APP_HOST_PORT:-8082}:8080"
    environment:
      DB_HOST: ${DB_HOST:-db1}
      DB_PORT: ${DB_PORT:-3306}
      DB_NAME: ${DB_NAME:-app_db}
      DB_USER: ${DB_USER:-app_user}
      DB_PASSWORD: ${DB_PASSWORD:-change-me-app-password}

volumes:
  mariadb_data:
```

## Luu y

- Service `db1` se la hostname de backend ket noi toi MariaDB ben trong mang Docker.
- `depends_on` chi giup sap thu tu khoi dong, khong dam bao MariaDB da san sang nhan ket noi. Neu backend cua ban khong co retry DB, co the can bo sung healthcheck hoac startup retry.
- Neu backend khong can truy cap MariaDB tu ben ngoai host, nen bo phan `ports` cua service `db1` de giam be mat expose.
- Template nay khong dat `container_name` de giu cho file linh hoat hon khi tai su dung tren nhieu may hoac nhieu stack.
