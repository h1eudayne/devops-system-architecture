# MySQL Server Install on Ubuntu

## Huong dan hien co

- Cai `mysql-server` tren Ubuntu bang APT.
- Chay `mysql_secure_installation` de thiet lap bao mat co ban.
- Kiem tra service MySQL sau khi cai.
- Tao database va user rieng cho ung dung.

## Khi nao nen dung

- Server dich dung Ubuntu.
- Can cai MySQL truc tiep tren host thay vi chay bang Docker.
- Can database cho backend hoac ung dung web tren cung server.
- Muon co checklist cai dat nhanh, de copy len server moi.

## Yeu cau truoc khi cai

- Dang nhap bang user co quyen `sudo`.
- Server co ket noi internet de tai package tu Ubuntu APT repository.
- Da xac dinh truoc ten database, user ung dung va mat khau can tao.
- Neu server co firewall, can mo port `3306` chi khi that su can truy cap tu may khac.

## Cai dat nhanh

### 1. Cap nhat package index

```bash
sudo apt update
```

### 2. Cai MySQL Server

```bash
sudo apt install mysql-server
```

Neu muon bo qua cau hoi xac nhan cua APT:

```bash
sudo apt install -y mysql-server
```

### 3. Kiem tra service

```bash
sudo systemctl status mysql
```

Neu MySQL chua chay:

```bash
sudo systemctl enable mysql
sudo systemctl start mysql
```

### 4. Chay cau hinh bao mat

```bash
sudo mysql_secure_installation
```

Goi y khi tra loi:

- `VALIDATE PASSWORD COMPONENT`: chon `Y` neu muon bat policy mat khau manh, chon `N` neu dang cai nhanh cho moi truong dev.
- `Remove anonymous users`: chon `Y`.
- `Disallow root login remotely`: chon `Y`.
- `Remove test database`: chon `Y`.
- `Reload privilege tables`: chon `Y`.

### 5. Dang nhap MySQL bang root local

Tren Ubuntu, tai khoan `root` cua MySQL thuong dung plugin xac thuc qua `sudo`:

```bash
sudo mysql
```

Kiem tra version:

```sql
SELECT VERSION();
```

Thoat MySQL:

```sql
exit;
```

## Tao database va user cho ung dung

Dang nhap:

```bash
sudo mysql
```

Tao database va user:

```sql
CREATE DATABASE app_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'app_user'@'localhost' IDENTIFIED BY 'change-me-strong-password';
GRANT ALL PRIVILEGES ON app_db.* TO 'app_user'@'localhost';
FLUSH PRIVILEGES;
```

Kiem tra:

```sql
SHOW DATABASES;
SELECT user, host FROM mysql.user;
```

Neu ung dung nam tren server khac va can ket noi tu xa, thay `localhost` bang IP hoac subnet cu the thay vi dung `%` neu khong can:

```sql
CREATE USER 'app_user'@'10.0.0.%' IDENTIFIED BY 'change-me-strong-password';
GRANT ALL PRIVILEGES ON app_db.* TO 'app_user'@'10.0.0.%';
FLUSH PRIVILEGES;
```

## Cho phep ket noi tu xa

Chi lam phan nay neu backend khong chay cung server voi MySQL.

Mo file cau hinh:

```bash
sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf
```

Doi dong:

```text
bind-address = 127.0.0.1
```

Thanh IP server hoac `0.0.0.0` neu bat buoc listen moi interface:

```text
bind-address = 0.0.0.0
```

Restart MySQL:

```bash
sudo systemctl restart mysql
```

Neu dung UFW, chi mo port cho IP duoc phep:

```bash
sudo ufw allow from 10.0.0.10 to any port 3306 proto tcp
```

## Lenh kiem tra nhanh

```bash
sudo systemctl status mysql
sudo ss -ltnp | grep 3306
mysql --version
```

Kiem tra dang nhap bang user ung dung:

```bash
mysql -u app_user -p app_db
```

## Loi thuong gap

### Unable to locate package mysql-server

Chay lai:

```bash
sudo apt update
```

Neu van loi, kiem tra Ubuntu repository trong:

```bash
cat /etc/apt/sources.list
```

### Access denied for user root

Thu dang nhap bang:

```bash
sudo mysql
```

Thay vi:

```bash
mysql -u root -p
```

### Khong ket noi duoc tu may khac

Kiem tra 4 diem:

- `bind-address` trong `/etc/mysql/mysql.conf.d/mysqld.cnf`
- User MySQL co dung `host` duoc phep ket noi khong
- Firewall tren server co mo port `3306` khong
- Security group hoac firewall cloud co cho phep IP nguon khong

## Luu y bao mat

- Khong dung user `root` cho ung dung.
- Khong commit mat khau database vao repo.
- Khong mo port `3306` ra internet neu khong co ly do ro rang.
- Neu phai truy cap tu xa, uu tien gioi han theo IP nguon va dung mat khau manh.
- Nen backup database dinh ky truoc khi nang cap package hoac thay doi cau hinh.
