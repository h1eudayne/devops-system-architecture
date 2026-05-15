# Repo Structure

## Nguyen tac to chuc

Repo nay nen duoc to chuc theo 3 tang:

1. `templates/`
Chua file pipeline thuc te, copy ra la dung duoc sau khi thay bien.

2. `docs/`
Chua quy uoc dat ten, cach viet template, checklist review va quy tac bao mat.

3. `catalog/`
Chua danh muc tra cuu nhanh: template nao danh cho provider nao, ngon ngu nao, case nao.

## Taxonomy khuyen nghi

```text
templates/
  github-actions/
    continuous-integration/
      java/
      nodejs/
      python/
      dotnet/
      go/
      php/
      docker/
    continuous-delivery/
      java/
      nodejs/
      python/
      dotnet/
      go/
      php/
      docker/
    continuous-deployment/
      java/
      nodejs/
      python/
      dotnet/
      go/
      php/
      docker/
  gitlab-ci/
    continuous-integration/
      java/
      nodejs/
      python/
      dotnet/
      go/
      php/
      docker/
    continuous-delivery/
      java/
      nodejs/
      python/
      dotnet/
      go/
      php/
      docker/
    continuous-deployment/
      java/
      nodejs/
      python/
      dotnet/
      go/
      php/
      docker/
  jenkins/
    continuous-integration/
      java/
      nodejs/
      python/
      shared/
    continuous-delivery/
      java/
      nodejs/
      python/
      shared/
    continuous-deployment/
      java/
      nodejs/
      python/
      shared/
    install/
      ubuntu/
    reverse-proxy/
  shared/
    docker/
      compose/
        backend-mariadb/
      install/
        ubuntu/
      java/
      registry/
        harbor/
        private-registry-tls/
      vuejs/
    mysql/
      install/
        ubuntu/
    nginx/
```

## Quy tac phan loai pipeline

- `continuous-integration`
  Chi build, test, lint, scan, package. Khong thay doi moi truong chay.

- `continuous-delivery`
  Tao artifact san sang release hoac deploy toi moi truong trung gian.
  Neu production van can approve, manual gate, hoac thao tac phat hanh rieng, xep vao nhom nay.

- `continuous-deployment`
  Sau khi qua dieu kien, pipeline tu dong deploy toi moi truong dich ma khong co approve step trong pipeline.
  Nhung template co `restart service`, `kubectl apply`, `helm upgrade`, `scp + run`, `docker service update` thuong thuoc nhom nay.

## Cach chia theo use-case

Trong moi thu muc ngon ngu, dat ten file theo use-case thay vi ten project. Nhu vay sau nay tim theo nhu cau se nhanh hon.

Vi du:

- `maven-test.yml`
- `maven-test-sonarqube.yml`
- `jar-server-tag.yml`
- `docker-k8s-main.yml`
- `npm-release-main.yml`

## Neu mot template qua lon

Khi mot template can them tai lieu huong dan rieng, hay doi sang cau truc folder:

```text
templates/gitlab-ci/continuous-deployment/java/maven-jar-server-tag/
  README.md
  pipeline.yml
  variables.example.env
```

Kieu nay phu hop voi template co:

- nhieu bien moi truong
- yeu cau chuan bi server
- rollback thu cong
- script deploy di kem

## Quy uoc metadata

Moi template nen co metadata trong `catalog/templates.yml` gom:

- `id`
- `provider`
- `delivery_model`
- `language`
- `scenario`
- `file`
- `trigger`
- `deployment_target`
- `notes`

Tai nguyen dung chung khong thuoc rieng mot provider, nhu Dockerfile mau, Nginx config mau hoac helper script dung lai cho nhieu template, co the dat trong `templates/shared/`.

## Huong phat trien repo

Giai doan 1:

- Gom cac file dang co vao dung thu muc
- Tach ro delivery model
- Dat ten file thong nhat
- Them catalog

Giai doan 2:

- Chuan hoa variable naming
- Them README theo tung nhom ngon ngu
- Them template cho GitHub Actions va Jenkins

Giai doan 3:

- Them script validate YAML
- Them checklist review truoc khi dua template vao repo
- Them example project mapping variable
