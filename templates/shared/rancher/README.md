# Shared Templates for Rancher Server

## Cau truc thu muc

```
rancher/
├── docker-compose/
│   └── docker-compose.yml.example    # Cai bang Docker Compose
├── docker-run/
│   └── install-rancher.sh.example    # Cai bang docker run
└── README.md
```

## So sanh 2 cach cai

| Tieu chi               | Docker Compose                          | Docker Run                             |
|------------------------|------------------------------------------|----------------------------------------|
| Do phuc tap            | Can file YAML                            | Mot lenh duy nhat                      |
| Quan ly                | `docker compose up/down/restart`         | `docker start/stop/restart`            |
| Phu hop khi            | Muon quan ly nhieu service cung luc      | Chi cai moi Rancher, don gian nhanh    |
| Yeu cau them           | Docker Compose plugin                    | Chi can Docker                         |

## Luu y ve lenh Docker Compose

Co 2 bien the lenh Docker Compose, chon phu hop voi phien ban da cai:

| Bien the               | Lenh                    | Khi nao dung                                              |
|------------------------|-------------------------|-----------------------------------------------------------|
| Plugin (Docker >= 20)  | `docker compose up -d`  | Docker Desktop hoac cai Docker Engine >= 20 + Compose V2  |
| Standalone binary      | `docker-compose up -d`  | Server cai `docker-compose` rieng (goi apt/yum)           |

Kiem tra bien the dang co:

```bash
# Kiem tra plugin (Compose V2)
docker compose version

# Kiem tra standalone binary (Compose V1)
docker-compose version
```

---

## Cach 1: Docker Compose

### Template

- `docker-compose/docker-compose.yml.example`
  Docker Compose file mau de cai dat Rancher Server.

### Cach dung

```bash
# Copy file mau
cp docker-compose/docker-compose.yml.example docker-compose.yml

# Tao thu muc data
sudo mkdir -p /data/rancher
```

**Neu dung Docker Compose plugin (V2 - Docker >= 20):**

```bash
# Chay Rancher
docker compose up -d

# Kiem tra trang thai
docker compose ps
docker compose logs -f rancher-server
```

**Neu dung Docker Compose standalone binary (V1):**

```bash
# Chay Rancher
docker-compose up -d

# Kiem tra trang thai
docker-compose ps
docker-compose logs -f rancher-server
```

### Noi dung template

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

---

## Cach 2: Docker Run

### Template

- `docker-run/install-rancher.sh.example`
  Script cai dat Rancher Server bang lenh `docker run`.

### Cach dung

```bash
# Copy file mau
cp docker-run/install-rancher.sh.example install-rancher.sh

# Chinh sua phien ban hoac duong dan neu can
nano install-rancher.sh

# Chay script
chmod +x install-rancher.sh
./install-rancher.sh
```

### Lenh docker run tuong duong

```bash
docker run \
  --name rancher-server \
  -d \
  --restart=unless-stopped \
  -p 80:80 \
  -p 443:443 \
  -v /data/rancher:/var/lib/rancher \
  --privileged \
  rancher/rancher:v2.14.1
```

---

## Yeu cau truoc khi cai

- Docker da duoc cai dat tren server
- O cung da duoc mount vao `/data` (de du lieu Rancher luu tren o cung rieng, khong mat khi server loi)
- Port `80` va `443` chua bi chiem boi dich vu khac

## Can doi gi truoc khi dung

- Doi phien ban Rancher image neu can (mac dinh: `rancher/rancher:v2.9.2`)
- Doi duong dan volume neu muon luu data o vi tri khac
- Doi port neu server da dung port `80`/`443` cho dich vu khac

## Truy cap Rancher UI

Mo trinh duyet va truy cap:

```
https://<IP-server>
```

Lan dau truy cap, Rancher se yeu cau dat mat khau admin.
Lay mat khau bootstrap tu log:

```bash
docker logs rancher-server 2>&1 | grep "Bootstrap Password:"
```

## Luu y

- Volume `/data/rancher` se luu toan bo du lieu cua Rancher (cau hinh, database noi bo, certificate). Khi server bi loi, chi can mount lai o cung va chay lai container la phuc hoi duoc.
- Rancher chay o che do `privileged` vi can quyen truy cap Docker socket va mang cua host.
- Container tu dong khoi dong lai khi server reboot nho `restart: unless-stopped`.
- Rancher su dung self-signed certificate. Trinh duyet se canh bao "khong an toan" - day la binh thuong. Co the cau hinh Let's Encrypt hoac cert rieng sau.
- Neu muon nang cap Rancher, chi can doi tag image (vd: `v2.9.3`) va chay lai container.

## Cac lenh quan ly thuong dung

**Dung Docker Compose plugin (V2):**

```bash
# Xem log
docker compose logs -f rancher-server

# Dung Rancher
docker compose down

# Khoi dong lai
docker compose restart

# Chay lai sau khi chinh sua docker-compose.yml
docker compose up -d
```

**Dung Docker Compose standalone binary (V1):**

```bash
# Xem log
docker-compose logs -f rancher-server

# Dung Rancher
docker-compose down

# Khoi dong lai
docker-compose restart

# Chay lai sau khi chinh sua docker-compose.yml
docker-compose up -d
```

**Hoac quan ly truc tiep bang Docker:**

```bash
# Xem log
docker logs -f rancher-server

# Dung Rancher
docker stop rancher-server

# Khoi dong lai
docker restart rancher-server

# Xoa container (data van con trong /data/rancher)
docker rm -f rancher-server
```
