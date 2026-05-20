# Huong Dan Trien Khai Du An Fullstack

Tai lieu tong hop cac buoc trien khai mot du an fullstack theo mo hinh:

```
MariaDB (Database) → Backend (Spring Boot) → Frontend (Angular)
```

Trien khai tren Kubernetes (Rancher) voi Docker image duoc build thu cong va push len Docker Hub.

---

## Muc luc

- [I. Setup Database (MariaDB)](#i-setup-database-mariadb)
- [II. Dua file du an vao server](#ii-dua-file-du-an-vao-server)
- [III. Build Docker Frontend](#iii-build-docker-frontend)
- [IV. Import du lieu vao Database](#iv-import-du-lieu-vao-database)
- [V. Build Docker Backend](#v-build-docker-backend)
- [VI. Cau hinh Firewall va Nginx](#vi-cau-hinh-firewall-va-nginx)
- [VII. Deploy len Kubernetes (Rancher)](#vii-deploy-len-kubernetes-rancher)

---

## I. Setup Database (MariaDB)

> Tai lieu tham khao: [`shared/mysql/install/ubuntu/README.md`](../../templates/shared/mysql/install/ubuntu/README.md)

### 1. Tao server database

- Tao 1 VM/VPS rieng cho database.
- **Luu y**: Tao 1 disk rieng va mount vao de luu data, tranh mat du lieu khi server gap su co.

### 2. Cai dat MariaDB

```bash
apt update -y
apt install mariadb-server -y
```

### 3. Cau hinh cho phep ket noi tu ben ngoai

```bash
vi /etc/mysql/mariadb.conf.d/50-server.cnf
```

Tim dong `bind-address` va doi thanh:

```ini
bind-address = 0.0.0.0
```

Restart MariaDB:

```bash
systemctl restart mariadb
```

### 4. Kiem tra

```bash
mysql
```

```sql
SELECT VERSION();
SHOW DATABASES;
```

---

## II. Dua file du an vao server

### 1. Copy file tu may local vao server

```bash
scp <file> <user>@<ip>:/tmp
```

### 2. Tao thu muc du an

```bash
mkdir -p /root/projects
mv /tmp/<file> /root/projects/
```

### 3. Giai nen

```bash
apt install unzip -y
cd /root/projects
unzip <ten-file>.zip
```

### 4. Cai Docker

> Tai lieu tham khao: [`shared/docker/install/ubuntu/README.md`](../../templates/shared/docker/install/ubuntu/README.md)

```bash
apt install docker.io -y
```

---

## III. Build Docker Frontend

> Tai lieu tham khao:
> - Dockerfile: [`docker/frontend/angular/README.md`](../../templates/docker/frontend/angular/README.md)
> - Nginx config: [`docker/frontend/angular/nginx.conf.example`](../../templates/docker/frontend/angular/nginx.conf.example)

### 1. Chuan bi file

Trong thu muc du an frontend, can co 2 file:
- `Dockerfile` (copy tu [`npm-dist-nginx-alpine.Dockerfile.example`](../../templates/docker/frontend/angular/npm-dist-nginx-alpine.Dockerfile.example))
- `nginx.conf` (copy tu [`nginx.conf.example`](../../templates/docker/frontend/angular/nginx.conf.example))

**Noi dung file `Dockerfile`:**

```dockerfile
## build stage ##
FROM node:18.18-alpine AS build
WORKDIR /app
COPY . .
RUN npm install --force
RUN npm run build

## run stage ##
FROM nginx:alpine

# Doi `angular-ecommerce` thanh ten project thuc te cua ban.
COPY --from=build /app/dist/angular-ecommerce /usr/share/nginx/html

# Copy cau hinh Nginx de fix loi 404 khi dung Angular routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Noi dung file `nginx.conf`:**

```nginx
server {
    listen 80;

    location / {
        root   /usr/share/nginx/html;
        index  index.html index.htm;

        # Bat buoc cho Angular: Neu khong tim thay file, tra ve index.html
        try_files $uri $uri/ /index.html;
    }
}
```

### 2. Build Docker image

```bash
cd /root/projects/<frontend-folder>
docker build -t ecommerce-front:v1 .
```

- `ecommerce-front` la ten image
- `v1` la version

### 3. Kiem tra image da build

```bash
docker images
```

### 4. Push len Docker Hub

```bash
# Dang nhap Docker Hub
docker login

# Tag image theo format Docker Hub
docker tag ecommerce-front:v1 <username-docker>/ecommerce-front:v1

# Kiem tra
docker images

# Push
docker push <username-docker>/ecommerce-front:v1
```

Len Docker Hub kiem tra image da duoc push thanh cong.

---

## IV. Import du lieu vao Database

### 1. Vao thu muc chua file SQL

```bash
cd /root/projects/<database-folder>
pwd && ls
```

### 2. Vao MySQL/MariaDB

```bash
mysql
```

### 3. Chay cac file SQL

```sql
source <path>/file.sql;
```

### 4. Kiem tra

```sql
SHOW DATABASES;
USE <ten-database>;
SHOW TABLES;
```

---

## V. Build Docker Backend

> Tai lieu tham khao:
> - Dockerfile: [`docker/backend/java/README.md`](../../templates/docker/backend/java/README.md)

### 1. Kiem tra cau hinh ket noi database

```bash
vi src/main/resources/application.properties
```

Dam bao cac thong so ket noi database dung:

```properties
spring.datasource.url=jdbc:mysql://<DB_IP>:3306/<DB_NAME>
spring.datasource.username=<DB_USER>
spring.datasource.password=<DB_PASSWORD>
```

### 2. Chuan bi file Dockerfile

Copy tu [`maven-jar-temurin17-jre-alpine.Dockerfile.example`](../../templates/docker/backend/java/maven-jar-temurin17-jre-alpine.Dockerfile.example) (Java 17) hoac [`maven-jar-openjdk8-jre-alpine.Dockerfile.example`](../../templates/docker/backend/java/maven-jar-openjdk8-jre-alpine.Dockerfile.example) (Java 8).

**Noi dung file `Dockerfile` (Java 17 + ConfigMap support):**

```dockerfile
## build stage ##
FROM maven:3.8.3-openjdk-17 AS build

WORKDIR ./src
COPY . .

RUN mvn install -DskipTests=true

## run stage ##
FROM eclipse-temurin:17-jre-alpine

# Set timezone ve Asia/Ho_Chi_Minh
RUN rm -f /etc/localtime && ln -s /usr/share/zoneinfo/Asia/Ho_Chi_Minh /etc/localtime

# Doi ten JAR cho dung voi artifact thuc te cua du an.
COPY --from=build src/target/spring-boot-ecommerce-0.0.1-SNAPSHOT.jar /run/spring-boot-ecommerce-0.0.1-SNAPSHOT.jar

EXPOSE 8080

# Dung voi K8s ConfigMap: mount application.properties vao /config/ roi tro spring.config.location den do.
# Neu khong dung ConfigMap, bo "--spring.config.location=..." di.
ENTRYPOINT ["java", "-jar", "/run/spring-boot-ecommerce-0.0.1-SNAPSHOT.jar", "--spring.config.location=/config/application.properties"]
```

> **Luu y**: Tham so `--spring.config.location` phai nam **ben trong** mang JSON cua `ENTRYPOINT`.
> Phan nam ngoai dau `]` se bi Docker bo qua.

### 3. Build Docker image

```bash
cd /root/projects/<backend-folder>
docker build -t ecommerce-backend:v1 .
```

- `ecommerce-backend` la ten image
- `v1` la version

### 4. Push len Docker Hub

```bash
docker tag ecommerce-backend:v1 <username-docker>/ecommerce-backend:v1
docker push <username-docker>/ecommerce-backend:v1
```

---

## VI. Cau hinh Firewall va Nginx

### 1. Mo cong 3306 cho MariaDB (tren server database)

```bash
sudo ufw allow 3306
```

> Luu y bao mat: Chi nen mo cho IP cu the thay vi mo toan bo.
> ```bash
> sudo ufw allow from <BACKEND_IP> to any port 3306 proto tcp
> ```

### 2. Cau hinh Nginx cho Frontend (Angular)

> Tai lieu tham khao: [`docker/frontend/angular/README.md` > Nginx config](../../templates/docker/frontend/angular/README.md)

File `nginx.conf` nam chung thu muc voi `Dockerfile`:

```nginx
server {
    listen 80;

    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;

        try_files $uri $uri/ /index.html;
    }
}
```

Trong `Dockerfile` frontend phai co dong:

```dockerfile
COPY nginx.conf /etc/nginx/conf.d/default.conf
```

---

## VII. Deploy len Kubernetes (Rancher)

> Tai lieu tham khao:
> - Rancher: [`shared/rancher/README.md`](../../templates/shared/rancher/README.md)
> - K8s Fullstack YAML: [`kubernetes/full-stack/README.md`](../../templates/kubernetes/full-stack/README.md)
> - Ingress: [`kubernetes/ingress/README.md`](../../templates/kubernetes/ingress/README.md)

### 1. Tao Project chung tren Rancher

Vao **Dashboard → Projects/Namespaces → Create Project**.

### 2. Tao Namespace

Tao namespace cho du an (vd: `ecommerce`).

### 3. Tao ConfigMap cho Backend

Tao ConfigMap chua `application.properties` de backend doc cau hinh tu K8s thay vi hardcode trong image.

> Tai lieu tham khao: [`kubernetes/configmap/README.md`](../../templates/kubernetes/configmap/README.md)
> Template: [`configmap-spring-properties.yml.example`](../../templates/kubernetes/configmap/configmap-spring-properties.yml.example)

**Noi dung file ConfigMap:**

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: ecommerce-backend-application-properties-configmap
  namespace: ecommerce
data:
  # Luu y: ten key phai trung voi ten file da setup trong Dockerfile (spring.config.location)
  application.properties: |
    spring.datasource.url=jdbc:mysql://192.168.1.115:3306/full-stack-ecommerce #chu y thay doi dia chi IP cua ban
    spring.datasource.username=ecommerceapp
    spring.datasource.password=StrongPa55WorD
    spring.datasource.driverClassName=com.mysql.cj.jdbc.Driver
    spring.datasource.sql-script-encoding=UTF-8

    spring.jpa.properties.hibernate.globally_quoted_identifiers=true
    spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
    spring.jpa.hibernate.ddl-auto=none
    spring.jpa.show-sql=true
    spring.jpa.properties.hibernate.format_sql=true

    spring.data.rest.base-path=/api
    spring.data.rest.detection-strategy=ANNOTATED

    allowed.origins=http://ecommerce.devopsedu.vn

    okta.oauth2.client-id=0oab0lzwjoN1Rjsar5d7
    okta.oauth2.issuer=https://dev-82108115.okta.com/oauth2/default
```

Apply ConfigMap:

```bash
kubectl apply -f ecommerce-backend-configmap.yml
```

Kiem tra:

```bash
kubectl get configmap -n ecommerce
```

### 4. Apply file YAML fullstack

Su dung template [`fullstack-rolling-clusterip-ingress.yml.example`](../../templates/kubernetes/full-stack/fullstack-rolling-clusterip-ingress.yml.example).

Thay the cac placeholder va apply. Lam rieng cho **frontend** va **backend** (2 file YAML rieng).

**Vi du file YAML cho Backend (voi ConfigMap volume mount):**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app: ecommerce-backend
  name: ecommerce-backend-deployment
  namespace: ecommerce
spec:
  replicas: 1
  revisionHistoryLimit: 11
  selector:
    matchLabels:
      app: ecommerce-backend
  strategy:
    rollingUpdate:
      maxSurge: 25%
      maxUnavailable: 25%
    type: RollingUpdate
  template:
    metadata:
      labels:
        app: ecommerce-backend
      namespace: ecommerce
    spec:
      containers:
        - image: voduchieu1/ecommerce-backend:v1
          imagePullPolicy: Always
          name: ecommerce-backend
          ports:
            - containerPort: 8080
              name: tcp
              protocol: TCP
          volumeMounts:
            - name: app-config
              mountPath: /config
      volumes:
        - name: app-config
          configMap:
            name: ecommerce-backend-application-properties-configmap
---
apiVersion: v1
kind: Service
metadata:
  name: ecommerce-backend-service
  namespace: ecommerce
spec:
  internalTrafficPolicy: Cluster
  ipFamilies:
    - IPv4
  ipFamilyPolicy: SingleStack
  ports:
    - name: tcp
      port: 8080
      protocol: TCP
      targetPort: 8080
  selector:
    app: ecommerce-backend
  sessionAffinity: None
  type: ClusterIP
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ecommerce-backend-ingress
  namespace: ecommerce
spec:
  ingressClassName: nginx
  rules:
    - host: api-ecommerce.h1eudayne.tech
      http:
        paths:
          - backend:
              service:
                name: ecommerce-backend-service
                port:
                  number: 8080
            path: /
            pathType: Prefix
```

Apply:

```bash
kubectl apply -f ecommerce-backend.yml
```

> Nho chon dung namespace khi apply.

**Vi du file YAML cho Frontend:**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app: ecommerce-frontend
  name: ecommerce-frontend-deployment
  namespace: ecommerce
spec:
  replicas: 1
  revisionHistoryLimit: 11
  selector:
    matchLabels:
      app: ecommerce-frontend
  strategy:
    rollingUpdate:
      maxSurge: 25%
      maxUnavailable: 25%
    type: RollingUpdate
  template:
    metadata:
      labels:
        app: ecommerce-frontend
      namespace: ecommerce
    spec:
      containers:
        - image: voduchieu1/ecommerce-frontend:v1
          imagePullPolicy: Always
          name: ecommerce-frontend
          ports:
            - containerPort: 80
              name: tcp
              protocol: TCP
---
apiVersion: v1
kind: Service
metadata:
  name: ecommerce-frontend-service
  namespace: ecommerce
spec:
  internalTrafficPolicy: Cluster
  ipFamilies:
    - IPv4
  ipFamilyPolicy: SingleStack
  ports:
    - name: tcp
      port: 80
      protocol: TCP
      targetPort: 80
  selector:
    app: ecommerce-frontend
  sessionAffinity: None
  type: ClusterIP
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ecommerce-frontend-ingress
  namespace: ecommerce
spec:
  ingressClassName: nginx
  rules:
    - host: ecommerce.h1eudayne.tech
      http:
        paths:
          - backend:
              service:
                name: ecommerce-frontend-service
                port:
                  number: 80
            path: /
            pathType: Prefix
```

Apply:

```bash
kubectl apply -f ecommerce-frontend.yml
```

### 5. Add host tren may client (neu chua co DNS)

```bash
# Tren may can truy cap, them vao /etc/hosts (Linux) hoac C:\Windows\System32\drivers\etc\hosts (Windows)
<ip-loadbalancer> <domain-frontend>
<ip-loadbalancer> <domain-backend>
```

### 6. Kiem tra

```bash
kubectl get all -n <namespace>
kubectl get ingress -n <namespace>
kubectl get configmap -n <namespace>
```

Truy cap domain tren trinh duyet de kiem tra.

---

## Tong Quan Lien Ket Template

| Buoc | Template | Duong dan |
|------|----------|-----------|
| Cai MariaDB | MySQL install scripts | [`shared/mysql/install/ubuntu/`](../../templates/shared/mysql/install/ubuntu/README.md) |
| Cai Docker | Docker install scripts | [`shared/docker/install/ubuntu/`](../../templates/shared/docker/install/ubuntu/README.md) |
| Dockerfile Frontend | Angular Dockerfile | [`docker/frontend/angular/`](../../templates/docker/frontend/angular/README.md) |
| Nginx config | Angular nginx.conf | [`docker/frontend/angular/nginx.conf.example`](../../templates/docker/frontend/angular/nginx.conf.example) |
| Dockerfile Backend | Java Dockerfile | [`docker/backend/java/`](../../templates/docker/backend/java/README.md) |
| K8s Fullstack YAML | Deployment + Service + Ingress | [`kubernetes/full-stack/`](../../templates/kubernetes/full-stack/README.md) |
| K8s ConfigMap | ConfigMap cho Spring Boot | [`kubernetes/configmap/`](../../templates/kubernetes/configmap/README.md) |
| Rancher | Cai dat Rancher Server | [`shared/rancher/`](../../templates/shared/rancher/README.md) |
| Ingress Nginx | Cai Ingress Controller | [`shared/ingress-nginx/install/ubuntu/`](../../templates/shared/ingress-nginx/install/ubuntu/README.md) |

---

## Luu y chung

- Luon kiem tra `application.properties` cua backend truoc khi build image de dam bao ket noi database dung.
- Khong commit mat khau database vao repo. Dung bien moi truong hoac secret management.
- Nen test image chay local bang `docker run` truoc khi push va deploy len Kubernetes.
- Sau khi deploy, kiem tra log pod de xac nhan ung dung khoi dong thanh cong:

```bash
kubectl logs -f deployment/<app-name>-deployment -n <namespace>
```
