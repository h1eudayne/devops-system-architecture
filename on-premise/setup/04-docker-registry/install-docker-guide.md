# Shared Docker Install Scripts for Ubuntu

## Template hien co

- `install-docker-and-compose.sh.example`
  Bash script de cai Docker Engine va standalone Docker Compose tren Ubuntu bang APT + binary download.
- `install-jenkins.sh.example`
  Bash script de cai Jenkins tren Ubuntu bang APT repository chinh thuc cua Jenkins va Java 21.

## Khi nao nen dung

- Server dich dung Ubuntu
- Can bootstrap nhanh Docker tren may moi
- Muon giu luon ca lenh `docker-compose` kieu cu de tuong thich voi script hien co
- Can cai nhanh Jenkins controller tren Ubuntu bang package chinh thuc

## Can doi gi truoc khi dung

- Chay script bang user co quyen `sudo`
- Kiem tra lai phien ban Ubuntu va repository Docker truoc khi chay tren moi truong production
- Neu he thong da chuyen sang `docker compose` plugin, co the doi script theo cach cai plugin chinh chu thay vi binary `docker-compose`
- Kiem tra lai version Java va Jenkins repository key truoc khi chay tren moi truong production
- Neu server khong dung `ufw`, hay sua hoac bo dong mo cong trong script Jenkins

## Luu y

- Script nay giu nguyen flow tu mau goc de de copy dung nhanh.
- File duoc dat duoi dang `.example` de nhac nguoi dung review lai truoc khi chay tren server that.
