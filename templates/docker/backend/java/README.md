# Docker Templates for Java Backend

## Template hien co

| Template | Java | Runtime | Mo ta |
|----------|------|---------|-------|
| `maven-jar-openjdk8-jre-alpine.Dockerfile.example` | 8 | `openjdk8-jre-base` (Alpine) | Multi-stage, Maven build, non-root user |
| `maven-jar-temurin17-jre-alpine.Dockerfile.example` | 17 | `eclipse-temurin:17-jre-alpine` | Multi-stage, Maven build, timezone VN |

## Khi nao nen dung template nao

- **Java 8** (`openjdk8-jre-alpine`): Du an cu van chay Java 8, can non-root user, image size nho nhat.
- **Java 17** (`temurin17-jre-alpine`): Du an Spring Boot 3.x hoac bat ky project can Java 17+. Co san timezone Asia/Ho_Chi_Minh.

## Can doi gi truoc khi dung

### Chung cho ca 2 template

- Doi ten file JAR trong lenh `COPY` va `ENTRYPOINT` cho dung voi artifact Maven thuc te
- Doi `EXPOSE 8080` neu ung dung nghe o cong khac
- Neu du an can profile, Maven Wrapper, hoac build command khac, cap nhat lenh `mvn install -DskipTests=true`
- Neu ung dung can bien moi truong cho database, Redis, mail, hoac secret, truyen bang `-e` hoac `--env-file` khi chay container

### Rieng cho Java 8

- Doi gia tri mac dinh cua `ARG APP_JAR` hoac truyen `--build-arg APP_JAR=...` khi build
- Doi user runtime neu ban muon dat theo ten he thong cua tung du an

### Rieng cho Java 17

- Doi ten JAR `spring-boot-ecommerce-0.0.1-SNAPSHOT.jar` thanh ten JAR thuc te cua project
- Neu khong can timezone Vietnam, co the bo dong `RUN rm -f /etc/localtime ...`

---

## Cach dung nhanh

### Java 8

1. Copy `maven-jar-openjdk8-jre-alpine.Dockerfile.example` thanh `Dockerfile`.
2. Doi `APP_JAR` hoac build voi `docker build --build-arg APP_JAR=your-artifact.jar -t your-app .`

### Java 17

1. Copy `maven-jar-temurin17-jre-alpine.Dockerfile.example` thanh `Dockerfile`.
2. Doi ten JAR trong `COPY` va `ENTRYPOINT` cho dung voi project.
3. Build: `docker build -t your-app:v1 .`

---

## Vi du build va run

### Java 8

```powershell
docker build `
  --build-arg APP_JAR=shoe-ShoppingCart-0.0.1-SNAPSHOT.jar `
  -t shoe-shoppingcart .
```

```powershell
docker run --name shoe-shoppingcart `
  -p 8080:8080 `
  -e SPRING_DATASOURCE_URL="jdbc:mysql://host.docker.internal:3306/shoeshop" `
  -e SPRING_DATASOURCE_USERNAME="root" `
  -e SPRING_DATASOURCE_PASSWORD="secret" `
  shoe-shoppingcart
```

### Java 17

```bash
docker build -t ecommerce-backend:v1 .
```

```bash
docker run --name ecommerce-backend \
  -p 8080:8080 \
  -e SPRING_DATASOURCE_URL="jdbc:mysql://<DB_IP>:3306/<DB_NAME>" \
  -e SPRING_DATASOURCE_USERNAME="root" \
  -e SPRING_DATASOURCE_PASSWORD="secret" \
  ecommerce-backend:v1
```

Neu ung dung khong phai Spring Boot, hay thay cac bien `SPRING_*` bang bien moi truong thuc te ma project dang doc.

---

## Template nay giai quyet gi

- Build project Maven thanh runnable JAR trong build stage
- Dong goi runtime gon hon bang JRE thay vi full JDK
- Don gian hoa `ENTRYPOINT` bang cach chay truc tiep file JAR
- (Java 8) Chay container bang non-root user
- (Java 17) Tu dong set timezone Asia/Ho_Chi_Minh

## Template nay chua giai quyet gi

- Chua tu dong biet ten JAR cua tung project, ban van can sua thu cong
- Chua tu dong inject secret hay profile, ban can truyen luc `docker run`, `docker compose`, hoac CI
- Chua co `healthcheck`, volume, hoac log path vi moi project co cach khac nhau

## Luu y

- Ca 2 template giu cach build giong mau goc bang `mvn install -DskipTests=true`.
- **Java 8**: Runtime dung `openjdk8-jre-base` de gon, chay bang non-root user.
- **Java 17**: Runtime dung `eclipse-temurin:17-jre-alpine` — image chinh thuc cua Adoptium, nhe va duoc bao tri tot.
- Neu project se build image trong GitLab CI va push len registry, co the ghep template voi `templates/gitlab-ci/continuous-delivery/docker/docker-image-server-tag-manual.yml`.
