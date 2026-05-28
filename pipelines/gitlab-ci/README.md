# GitLab CI Templates

Noi luu cac template `.gitlab-ci.yml` da tach theo `delivery model -> language -> use-case`.

## Cau truc khuyen nghi

```text
templates/gitlab-ci/
  continuous-integration/
    java/
    nodejs/
    python/
  continuous-delivery/
    java/
    nodejs/
    python/
  continuous-deployment/
    java/
    nodejs/
    python/
```

## Cach xep nhom

- `continuous-integration`
  Build, test, lint, scan, package; khong deploy.

- `continuous-delivery`
  Tao artifact san sang release hoac deploy toi moi truong van con manual gate.

- `continuous-deployment`
  Tu dong deploy vao moi truong dich sau khi pipeline pass.

## Quy tac nhanh

- Mot file = mot use-case ro rang
- Khong dat ten theo ten project
- Dat template vao dung `delivery model` truoc khi chia theo language
- Neu template co README rieng, uu tien doi sang dang folder template
