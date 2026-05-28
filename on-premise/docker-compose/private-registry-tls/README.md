# Docker Private Registry with TLS

## Muc dich

Folder nay dung de huong dan tao Docker private registry chay bang Docker Compose, luu image local va bat TLS bang self-signed certificate.

## File trong folder

- `docker-compose.yml.example`
  Compose file mau de chay container `registry:2` voi volume data va TLS cert.

## Assumption

- Server dang dung Ubuntu hoac Linux tuong tu
- Docker da duoc cai san
- Co the dung `docker compose` hoac `docker-compose`
- User co quyen `sudo`

Neu server chua cai Docker, co the tham khao:

- `templates/shared/docker/install/ubuntu/install-docker-and-compose.sh.example`

## Cac buoc thuc hien

### 1. Cai cong cu can thiet

```bash
sudo apt update
sudo apt-get install -y openssl
```

### 2. Tao thu muc lam viec

```bash
sudo mkdir -p /tools/registry/
cd /tools/registry
mkdir data certs
```

### 3. Tao self-signed certificate

Cap nhat IP hoac hostname cho phu hop voi server cua ban truoc khi chay lenh.

```bash
openssl req -newkey rsa:4096 -nodes -sha256 \
  -keyout certs/domain.key \
  -subj "/CN=192.168.1.100" \
  -addext "subjectAltName = DNS:192.168.1.100,IP:192.168.1.100" \
  -x509 -days 365 \
  -out certs/domain.crt
```

### 4. Tao file Compose

Copy noi dung tu `docker-compose.yml.example` trong folder nay vao file:

```bash
vi docker-compose.yml
```

Hoac copy truc tiep file mau:

```bash
cp docker-compose.yml.example docker-compose.yml
```

### 5. Chay registry

```bash
docker-compose up -d
```

Neu server dung Compose plugin moi:

```bash
docker compose up -d
```

### 6. Kiem tra registry tren server

Co the kiem tra bang trinh duyet hoac `curl`:

```text
https://192.168.x.x:<PORT>/v2/_catalog
```

Vi du:

```bash
curl -k https://192.168.1.100:5000/v2/_catalog
```

### 7. Thu login tu Docker client

```bash
docker login 192.168.x.x:<PORT>
```

Nhap `username` va `password` bat ky neu registry chua bat authentication.

Luu y:

- Buoc nay co the fail neu Docker client chua trust self-signed certificate.
- Khi chua cau hinh auth, `docker login` chi la buoc kiem tra ket noi TLS, khong phai co che xac thuc that su.

### 8. Trust cert tren Docker client

Thuc hien tren may dang chay lenh `docker login`, `docker pull`, hoac `docker push`.
Can copy file `domain.crt` tu server registry sang may client truoc khi dat vao thu muc certs cua Docker:

```bash
sudo mkdir -p /etc/docker/certs.d/192.168.x.x:<PORT>/
sudo cp certs/domain.crt /etc/docker/certs.d/192.168.x.x:<PORT>/ca.crt
sudo systemctl restart docker
```

Neu file cert dang nam o vi tri khac tren may client, hay doi lai duong dan nguon trong lenh `cp`.

### 9. Login lai sau khi da trust cert

```bash
docker login 192.168.x.x:<PORT>
```

## Noi dung docker-compose.yml

```yaml
version: '3'
services:
  registry:
    image: registry:2
    restart: always
    container_name: registry-server
    ports:
      - "5000:5000"
    volumes:
      - ./data:/var/lib/registry
      - ./certs:/certs:ro
    environment:
      REGISTRY_HTTP_TLS_CERTIFICATE: /certs/domain.crt
      REGISTRY_HTTP_TLS_KEY: /certs/domain.key
```

## Kiem tra nhanh

```bash
docker ps
curl -k https://192.168.1.100:5000/v2/_catalog
docker login 192.168.1.100:5000
```

## Luu y

- Gia tri trong `REGISTRY_HTTP_TLS_CERTIFICATE` va `REGISTRY_HTTP_TLS_KEY` nen la duong dan ben trong container, vi vay dung `/certs/...` thay cho `./certs/...`.
- Self-signed certificate phu hop cho moi truong lab, dev, hoac noi bo. Neu dung cho production, nen thay bang certificate duoc ky hop le.
- Client Docker tren may khac can trust certificate nay hoac duoc cau hinh phu hop truoc khi `docker login` va `docker push`.
- Neu ban muon registry co xac thuc that su, can bo sung authentication nhu `htpasswd`; chi `docker login` khong tu tao auth cho registry.
