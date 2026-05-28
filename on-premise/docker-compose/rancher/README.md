# Cai Rancher bang Docker Compose

Huong dan su dung file `docker-compose.yml.example` de cai dat Rancher Server tren may chu Linux.

---

## Yeu cau truoc khi bat dau

- Docker da duoc cai dat (`docker --version`)
- Docker Compose da duoc cai dat (plugin hoac standalone)
- Port `80` va `443` chua bi chiem boi dich vu khac
- O cung da duoc mount vao `/data` (neu can luu data tren o cung rieng)

Kiem tra phien ban Docker Compose dang co:

```bash
# Compose V2 (plugin)
docker compose version

# Compose V1 (standalone binary)
docker-compose version
```

---

## Buoc 1: Chuan bi file cau hinh

Copy file mau va dat ten lai:

```bash
cp docker-compose.yml.example docker-compose.yml
```

Noi dung file mau:

```yaml
version: '3'

services:
  rancher-server:
    image: rancher/rancher:v2.9.2
    container_name: rancher-server
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /data/rancher/data:/var/lib/rancher
    privileged: true
```

Chinh sua neu can:

| Truong         | Mac dinh                  | Ghi chu                                              |
|----------------|---------------------------|------------------------------------------------------|
| `image`        | `rancher/rancher:v2.9.2`  | Doi tag neu muon dung phien ban khac                 |
| `ports`        | `80:80`, `443:443`        | Doi port trai neu server da dung port nay            |
| `volumes`      | `/data/rancher/data`      | Doi duong dan neu muon luu data o vi tri khac        |

---

## Buoc 2: Tao thu muc luu data

```bash
sudo mkdir -p /data/rancher/data
```

> **Luu y:** Thu muc nay luu toan bo du lieu Rancher (cau hinh, database noi bo, certificate).
> Khi server bi loi, chi can mount lai o cung va chay lai container la phuc hoi duoc.

---

## Buoc 3: Chay Rancher

**Neu dung Docker Compose plugin (V2 - Docker >= 20):**

```bash
docker compose up -d
```

**Neu dung Docker Compose standalone binary (V1):**

```bash
docker-compose up -d
```

Kiem tra container da chay chua:

```bash
# Plugin V2
docker compose ps

# Standalone V1
docker-compose ps
```

---

## Buoc 4: Truy cap Rancher UI

Mo trinh duyet va truy cap:

```
https://<IP-server>
```

Lan dau truy cap, Rancher se yeu cau dat mat khau admin.
Lay mat khau bootstrap tu log:

```bash
docker logs rancher-server 2>&1 | grep "Bootstrap Password:"
```

> **Luu y:** Rancher su dung self-signed certificate. Trinh duyet se canh bao "khong an toan" - day la binh thuong. Co the cau hinh Let's Encrypt hoac cert rieng sau.

---

## Cac lenh quan ly thuong dung

**Docker Compose plugin (V2):**

```bash
# Xem log theo thoi gian thuc
docker compose logs -f rancher-server

# Dung Rancher
docker compose down

# Khoi dong lai
docker compose restart

# Chay lai sau khi sua docker-compose.yml
docker compose up -d
```

**Docker Compose standalone binary (V1):**

```bash
# Xem log theo thoi gian thuc
docker-compose logs -f rancher-server

# Dung Rancher
docker-compose down

# Khoi dong lai
docker-compose restart

# Chay lai sau khi sua docker-compose.yml
docker-compose up -d
```

---

## Nang cap Rancher

1. Doi tag image trong `docker-compose.yml` (vi du: `rancher/rancher:v2.9.3`)
2. Pull image moi va chay lai container:

**Plugin V2:**

```bash
docker compose pull
docker compose up -d
```

**Standalone V1:**

```bash
docker-compose pull
docker-compose up -d
```

> Data trong `/data/rancher/data` duoc giu nguyen khi nang cap.
