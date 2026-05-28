# GitLab CI for Docker Continuous Delivery

## Template hien co

- `docker-image-server-tag-manual.yml`
  Su dung cho project da co `Dockerfile`, build image bang runner, push len private registry, va giu buoc deploy container o che do manual khi tao tag.

Template nay duoc xep vao `continuous-delivery` vi image da duoc build + push san sang release, nhung buoc deploy van can manual approval trong GitLab.

## Khi nao nen dung

- Project da co `Dockerfile` trong repo
- Runner va server dich deu co Docker Engine
- Co private registry de push va pull image
- Muon dat version image theo `tag + short sha`
- Muon co manual gate truoc khi thay container dang chay

## Bien can quan tam

- `REGISTRY_URL`
  Domain hoac host cua Docker registry. Nen khai bao trong GitLab CI/CD Variables.
- `REGISTRY_USER`
  User duoc phep push va pull image.
- `REGISTRY_PASSWORD`
  Mat khau hoac token cua registry. Nen de o masked/protected variable.
- `REGISTRY_PROJECT`
  Namespace hoac project trong registry.
- `DOCKER_IMAGE`
  Ten image day du. Mac dinh dung format `registry/project/app:tag_shortsha`.
- `DOCKER_CONTAINER`
  Ten container se bi replace khi deploy.
- `DOCKERFILE_PATH`
  Duong dan toi Dockerfile trong repo. Mac dinh la `Dockerfile`.
- `DOCKER_BUILD_CONTEXT`
  Build context cho lenh `docker build`. Mac dinh la `.`
- `HOST_PORT`
  Cong publish ra host.
- `CONTAINER_PORT`
  Cong ma ung dung nghe ben trong container.
- `DOCKER_RUN_OPTIONS`
  Noi de them `--restart`, `-e`, `-v`, `--network` neu moi project can khac nhau.
- `SERVER`
  GitLab Runner tag duoc phep build va deploy.

## Ghep voi shared templates

- Dockerfile Java Maven multi-stage tham khao tai `templates/shared/docker/java/maven-jar-openjdk8-jre-alpine.Dockerfile.example`
- Neu app can chay cung MariaDB tren cung host, tham khao `templates/shared/docker/compose/backend-mariadb/docker-compose.yml.example`

## Assumption va gioi han

- Deploy script dang replace mot container bang `docker rm -f` va `docker run`
- Template nay chua dung `docker compose`, `healthcheck`, `rollback script`, hoac `blue-green deployment`
- Runner co quyen goi `docker login`, `docker build`, `docker push`, `docker pull`, `docker run`
- Log sau deploy duoc xem bang `docker logs`

## Goi y rollback

- Redeploy lai tag truoc do neu registry van giu image cu
- Hoac doi tam `DOCKER_IMAGE` thanh tag can rollback roi chay lai job `deploy`
