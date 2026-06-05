# Harbor Registry Installer

## Muc dich

Folder nay luu huong dan cai Harbor tren AWS EC2 theo dung checklist trien khai cua ban: tao server, tro DNS, cai Docker, cai Certbot, cai Harbor, kiem tra va dang nhap lan dau.

## File trong folder

- `install-harbor.sh.example`
  Bash script mau de gom phan download Harbor, tao `harbor.yml`, xin cert, va chay `prepare/install`.

## Assumption

- Ban dung EC2 voi Ubuntu
- Domain registry da co san va quan ly trong Route 53 hoac DNS provider khac
- Security group mo it nhat port `22`, `80`, `443`
- User dang nhap vao server co quyen `sudo`
- Harbor se chay voi HTTPS tren domain rieng, vi du `registry.example.com`

## Quy trinh trien khai

### I. Tao server

1. Vao AWS EC2.
2. Chon `Launch instance`.
3. Dat ten instance.
4. Chon image `Ubuntu`.
5. Tao hoac chon SSH key pair.
6. Bat cac rule can thiet trong security group.

Toi thieu nen mo:

- `22` de SSH
- `80` de Certbot xac thuc domain
- `443` de truy cap Harbor

### II. Ket noi vao server

Sau khi tao EC2, dung SSH de ket noi vao server.

Vi du:

```bash
ssh -i your-key.pem ubuntu@your-ec2-public-ip
```

### III. Setup domain

Tao DNS record tro ve IP public cua EC2.

Neu dung `A record`:

- Type: `A`
- Name: `registry` hoac subdomain ban muon dung
- Value: IP public cua EC2

Vi du:

```text
registry.example.com -> 18.xx.xx.xx
```

### IV. Cai Docker

Tao thu muc lam viec cho Docker:

```bash
mkdir -p /tools/docker
cd /tools/docker
```

Sau do dung huong dan hoac script trong:

- `templates/shared/docker/install/ubuntu/README.md`
- `templates/shared/docker/install/ubuntu/install-docker-and-compose.sh.example`

Neu ban copy script mau len server, co the chay theo flow:

```bash
chmod +x install-docker-and-compose.sh
./install-docker-and-compose.sh
```

Kiem tra lai:

```bash
docker --version
docker-compose --version
```

### V. Cai Certbot

```bash
sudo apt update -y
sudo apt install certbot -y
```

### VI. Tao thu muc va tai Harbor

```bash
mkdir -p /tools/harbor
cd /tools/harbor
curl -s https://api.github.com/repos/goharbor/harbor/releases/latest | grep browser_download_url | cut -d '"' -f 4 | grep '.tgz$' | wget -i -
tar xvzf harbor-offline-installer*.tgz
cd harbor
cp harbor.yml.tmpl harbor.yml
```

### VII. Setup domain va email cho Certbot

```bash
export DOMAIN="registry.example.com"
export EMAIL="email@example.com"
```

Chay Certbot:

```bash
sudo certbot certonly --standalone -d $DOMAIN --preferred-challenges http --agree-tos -m $EMAIL --keep-until-expiring
```

### VIII. Sua file `harbor.yml`

Mo file:

```bash
vi /tools/harbor/harbor/harbor.yml
```

Can sua toi thieu cac muc sau:

- `hostname`
- `https.certificate`
- `https.private_key`

Vi du:

```yaml
hostname: registry.example.com

https:
  port: 443
  certificate: /etc/letsencrypt/live/registry.example.com/fullchain.pem
  private_key: /etc/letsencrypt/live/registry.example.com/privkey.pem
```

Neu ban giu nguyen mat khau mac dinh trong template, tai khoan dang nhap se la:

- User: `admin`
- Password: `Harbor12345`

Neu ban doi `harbor_admin_password` trong file `harbor.yml`, hay dang nhap bang mat khau moi do.

### IX. Run `prepare`

```bash
cd /tools/harbor/harbor
./prepare
```

### X. Run `install.sh`

```bash
./install.sh
```

### XI. Kiem tra sau cai dat

```bash
docker-compose ps
```

Neu server dung Compose plugin moi, co the dung:

```bash
docker compose ps
```

Co the test them:

```bash
curl -k https://registry.example.com/api/v2.0/ping
```

### XII. Truy cap URL va dang nhap

Mo trinh duyet:

```text
https://your-domain
```

Dang nhap:

- User: `admin`
- Password: `Harbor12345` neu chua doi trong `harbor.yml`

## Cach dung file `install-harbor.sh.example`

Neu ban muon gom mot phan tutorial thanh script, co the dung file mau trong folder nay.

### 1. Copy script mau

```bash
cp install-harbor.sh.example install-harbor.sh
chmod +x install-harbor.sh
```

### 2. Chay pha setup

```bash
DOMAIN=registry.example.com EMAIL=email@example.com bash install-harbor.sh setup
```

Pha nay tuong duong voi:

- cai `certbot`
- tao `/tools/harbor`
- tai Harbor offline installer
- giai nen Harbor
- copy `harbor.yml.tmpl` thanh `harbor.yml`
- chay `certbot certonly`

### 3. Sua `harbor.yml`

Script khong tu sua file `harbor.yml` cho ban. Ban van can mo file va cap nhat:

- `hostname`
- `https.certificate`
- `https.private_key`
- `harbor_admin_password` neu muon doi mat khau mac dinh

### 4. Chay pha install

```bash
bash install-harbor.sh install
```

Pha nay tuong duong voi:

```bash
cd /tools/harbor/harbor
./prepare
./install.sh
docker-compose ps
```

## Luu y

- `certbot --standalone` can port `80` dang ranh trong luc xac thuc domain.
- Harbor khong tu cai Docker, vi vay buoc cai Docker phai duoc hoan tat truoc.
- Lenh tai release dang lay ban Harbor moi nhat tu GitHub. Neu can dong bang version, hay sua lai URL download.
- Neu DNS chua cap nhat xong, Certbot se fail.
- Neu dung cho production, nen review them `harbor_admin_password`, `data_volume`, log, backup, va storage truoc khi dua vao su dung that.
