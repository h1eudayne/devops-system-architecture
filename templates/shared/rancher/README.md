# Shared Docker Compose Template for Rancher Server

## Template hien co

- `docker-compose.yml.example`
  Docker Compose file mau de cai dat Rancher Server bang Docker.

## Khi nao nen dung

- Ban muon quan ly nhieu cum Kubernetes tu mot giao dien web duy nhat
- Ban muon cai nhanh Rancher tren mot server rieng (khong can cai len K8s)
- Server da co Docker va da gan o cung rieng vao `/data` (xem `shared/storage/mount-disk.sh.example`)

## Yeu cau truoc khi cai

- Docker da duoc cai dat tren server
- O cung da duoc mount vao `/data` (de du lieu Rancher luu tren o cung rieng, khong mat khi server loi)
- Port `80` va `443` chua bi chiem boi dich vu khac

## Can doi gi truoc khi dung

- Doi phien ban Rancher image neu can (mac dinh: `rancher/rancher:v2.9.2`)
- Doi duong dan volume neu muon luu data o vi tri khac (mac dinh: `/data/rancher/data`)
- Doi port neu server da dung port `80`/`443` cho dich vu khac

## Cach dung nhanh

### 1. Copy file mau

```bash
cp docker-compose.yml.example docker-compose.yml
```

### 2. Tao thu muc data (neu chua co)

```bash
sudo mkdir -p /data/rancher/data
```

### 3. Chay Rancher

Neu he thong dung Compose plugin moi:

```bash
docker compose up -d
```

Neu he thong dung `docker-compose` kieu cu:

```bash
docker-compose up -d
```

### 4. Kiem tra trang thai

```bash
docker compose ps
docker logs rancher-server
```

### 5. Truy cap Rancher UI

Mo trinh duyet va truy cap:

```
https://<IP-server>
```

Lan dau truy cap, Rancher se yeu cau dat mat khau admin.
Lay mat khau bootstrap tu log:

```bash
docker logs rancher-server 2>&1 | grep "Bootstrap Password:"
```

## Noi dung template

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

## Luu y

- Volume `/data/rancher/data` se luu toan bo du lieu cua Rancher (cau hinh, database noi bo, certificate). Khi server bi loi, chi can mount lai o cung va chay lai container la phuc hoi duoc.
- Rancher chay o che do `privileged` vi can quyen truy cap Docker socket va mang cua host.
- Container tu dong khoi dong lai khi server reboot nho `restart: unless-stopped`.
- Rancher su dung self-signed certificate. Trinh duyet se canh bao "khong an toan" - day la binh thuong. Co the cau hinh Let's Encrypt hoac cert rieng sau.
- Neu muon nang cap Rancher, chi can doi tag image (vd: `v2.9.3`) va chay lai `docker compose up -d`.
