# AWS Pipeline Templates

Thu muc nay chua cac CI/CD pipeline template de deploy ung dung len cac dich vu AWS nhu EKS, ECS, va push image len ECR. Cac template duoc thiet ke de co the tai su dung cho nhieu project, chi can thay doi cac bien (variable) theo tung moi truong.

---

## Noi dung chinh

### 1. Pipeline cho GitHub Actions deploy len EKS/ECS

Cac workflow `.yml` de tich hop voi GitHub Actions, thuc hien:

- Build Docker image va push len ECR.
- Deploy len EKS bang `kubectl apply` hoac Helm chart.
- Deploy len ECS bang `aws ecs update-service` hoac task definition moi.
- Ho tro multi-environment (dev, staging, production) qua GitHub Environments.

**File mau:**

| File | Mo ta |
|------|-------|
| `github-actions-eks-deploy.yml` | Build, push ECR, deploy len EKS bang kubectl/Helm |
| `github-actions-ecs-deploy.yml` | Build, push ECR, update ECS service |
| `github-actions-ecr-push.yml` | Chi build va push image len ECR |

### 2. Pipeline cho GitLab CI push image len ECR

Cac file `.gitlab-ci.yml` template de:

- Build Docker image trong GitLab Runner.
- Login va push image len AWS ECR.
- Trigger deploy len EKS/ECS tu GitLab CI.

**File mau:**

| File | Mo ta |
|------|-------|
| `gitlab-ci-ecr-push.yml` | Build va push image len ECR |
| `gitlab-ci-eks-deploy.yml` | Push image + deploy len EKS |
| `gitlab-ci-ecs-deploy.yml` | Push image + update ECS service |

### 3. CodePipeline / CodeBuild Templates

Template cho bo CI/CD native cua AWS:

- **`buildspec.yml`**: File cau hinh cho CodeBuild, dinh nghia cac phase (install, pre_build, build, post_build).
- **CodePipeline definition**: Cau hinh pipeline voi cac stage Source → Build → Deploy.
- **CodeDeploy `appspec.yml`**: Dinh nghia cach deploy len EC2 hoac ECS (blue/green).

**File mau:**

| File | Mo ta |
|------|-------|
| `buildspec-docker.yml` | CodeBuild: build Docker image va push len ECR |
| `buildspec-maven.yml` | CodeBuild: build Java app bang Maven, chay test |
| `appspec-ecs-blue-green.yml` | CodeDeploy: blue/green deployment cho ECS |
| `codepipeline-eks.json` | CodePipeline definition: GitHub → CodeBuild → EKS |

### 4. Huong dan thuc hanh trien khai co ban (EC2 Hands-on Labs)

Cac huong dan thuc hanh deploy ung dung va cau hinh ha tang EC2 tung buoc (step-by-step):

| File | Mo ta | Giao thuc / Cong nghe |
|------|-------|-----------------------|
| [1. Amazon EC2 Hands-on Lab(Linux)](1.%20EC2/1.%20Amazon%20EC2%20Hands-on%20Lab%28Linux%29.md) | Khoi tao EC2 Linux, SSH from Windows, cai dat httpd, Snapshot/AMI | SSH, HTTP, Apache |
| [2. Amazon EC2 Hands-on Lab(Windows)](1.%20EC2/2.%20Amazon%20EC2%20Hands-on%20Lab%28Windows%29.md) | Khoi tao EC2 Windows Server, giai ma mat khau Administrator, RDP login | RDP, Windows Server |
| [3. Amazon EC2 User Data and Metadata Lab](1.%20EC2/3.%20Amazon%20EC2%20User%20Data%20and%20Metadata%20Lab.md) | Tu dong hoa cai dat Web Server va lay IP dong qua IMDSv2 | User Data, IMDSv2, Bash |
| [4. Amazon EC2 Hands-on Lab(Windows Volume)](1.%20EC2/4.%20Amazon%20EC2%20Hands-on%20Lab%28Windows%20Volume%29.md) | Tao EBS Volume, attach vao instance, online va format NTFS | EBS, Windows Disk Mgmt |
| [5. Amazon EC2 Hands-on Lab(Linux Volume)](1.%20EC2/5.%20Amazon%20EC2%20Hands-on%20Lab%28Linux%20Volume%29.md) | EBS volume, fdisk partition, XFS format, /etc/fstab auto-mount, extend online | EBS, fdisk, XFS, growpart |
| [6. Amazon EC2 Hands-on Lab(Add Member SSH)](1.%20EC2/6.%20Amazon%20EC2%20Hands-on%20Lab%28Add%20Member%20SSH%29.md) | Tao user dev01, cau hinh chmod .ssh (700) va authorized_keys (600) | SSH, Linux Security |

### 5. Huong dan thuc hanh IAM (IAM Hands-on Labs)

Cac huong dan thuc hanh quan ly nguoi dung, nhom va phan quyen tren AWS IAM:

| File | Mo ta | Cong nghe |
|------|-------|-----------|
| [1. Amazon IAM Hands-on Lab(User, Group and Policy)](2.%20IAM/1.%20Amazon%20IAM%20Hands-on%20Lab%28User%2C%20Group%20and%20Policy%29.md) | Tao group AdministratorAccess, tao user, add vao group, tai csv credentials va login console | AWS IAM, AWS Console |
| [2. Amazon IAM Hands-on Lab(AWS CLI and MFA)](2.%20IAM/2.%20Amazon%20IAM%20Hands-on%20Lab%28AWS%20CLI%20and%20MFA%29.md) | Cai dat AWS CLI, phat hanh credentials, cau hinh AWS CLI, cac lenh S3, policy enforce-mfa, kiem tra AccessDenied va cau hinh profile mfa | AWS IAM, AWS CLI |
| [3. Amazon IAM Hands-on Lab(IAM Role for EC2)](2.%20IAM/3.%20Amazon%20IAM%20Hands-on%20Lab%28IAM%20Role%20for%20EC2%29.md) | Tao IAM Role cho phep EC2 truy cap dịch vụ S3, gan role vao EC2 va kiem tra ket noi khong can key | AWS IAM, S3, EC2 |
| [4. Amazon IAM Hands-on Lab(Assume Role with AWS CLI)](2.%20IAM/4.%20Amazon%20IAM%20Hands-on%20Lab%28Assume%20Role%20with%20AWS%20CLI%29.md) | Gỡ quyền trực tiếp của User, tạo Role PowerUserAccess với Custom Trust Policy, và dùng AWS CLI assume-role với profile credentials tạm thời | AWS IAM, AWS CLI, STS |

### 6. Huong dan thuc hanh S3 (S3 Hands-on Labs)

Cac huong dan thuc hanh quan ly thung chua va doi tuong tren AWS S3:

| File | Mo ta | Cong nghe |
|------|-------|-----------|
| [1. Amazon S3 Hands-on Lab(Basic)](3.%20S3/1.%20Amazon%20S3%20Hands-on%20Lab%28Basic%29.md) | Các thao tác cơ bản bao gồm truy cập S3 Console, khởi tạo bucket, tạo folder, tải lên tệp tin và thực hiện di chuyển (move) đối tượng giữa các thư mục | AWS S3, AWS Console |
| [2. Amazon S3 Versioning Lab](3.%20S3/2.%20Amazon%20S3%20Versioning%20Lab.md) | Các bước thực hành bật tính năng Versioning cho bucket S3, tải lên, chỉnh sửa và ghi đè tệp tin để xem phiên bản, thực hiện xóa để kiểm nghiệm Delete Marker và hiển thị phiên bản | AWS S3, AWS Console |
| [3. Amazon S3 Pre-signed URL Lab](3.%20S3/3.%20Amazon%20S3%20Pre-signed%20URL%20Lab.md) | Các bước thực hành kiểm tra cấu hình kết nối AWS CLI, cấu hình chặn truy cập công khai và tạo đường dẫn ký trước để cấp quyền truy cập tạm thời | AWS S3, AWS Console, AWS CLI |
| [4. Amazon S3 Lifecycle Lab](3.%20S3/4.%20Amazon%20S3%20Lifecycle%20Lab.md) | Thực hành tự động chuyển đổi lớp lưu trữ sau 90 ngày sang Glacier và xóa hoàn toàn sau 270 ngày | AWS S3, AWS Console |
| [5. Amazon S3 Static Website Hosting Lab](3.%20S3/5.%20Amazon%20S3%20Static%20Website%20Hosting%20Lab.md) | Thực hành upload mã nguồn qua AWS CLI, bật Static Website Hosting và cấu hình Public Access / Bucket Policy | AWS S3, AWS Console, AWS CLI |
| [6. Amazon S3 Event Notifications Lab](3.%20S3/6.%20Amazon%20S3%20Event%20Notifications%20Lab.md) | Thực hành cấu hình S3 Event Notification kết hợp với Lambda Function, kiểm tra log tự động qua CloudWatch khi tải lên đối tượng | AWS S3, AWS Lambda, AWS Console |

---

## Cau truc khuyen nghi

```text
cloud/aws/deploy/
  github-actions/
    github-actions-eks-deploy.yml
    github-actions-ecs-deploy.yml
    github-actions-ecr-push.yml
  gitlab-ci/
    gitlab-ci-ecr-push.yml
    gitlab-ci-eks-deploy.yml
    gitlab-ci-ecs-deploy.yml
  codepipeline/
    buildspec-docker.yml
    buildspec-maven.yml
    appspec-ecs-blue-green.yml
    codepipeline-eks.json
  1. EC2/
    1. Amazon EC2 Hands-on Lab(Linux).md
    2. Amazon EC2 Hands-on Lab(Windows).md
    3. Amazon EC2 User Data and Metadata Lab.md
    4. Amazon EC2 Hands-on Lab(Windows Volume).md
    5. Amazon EC2 Hands-on Lab(Linux Volume).md
    6. Amazon EC2 Hands-on Lab(Add Member SSH).md
  2. IAM/
    1. Amazon IAM Hands-on Lab(User, Group and Policy).md
    2. Amazon IAM Hands-on Lab(AWS CLI and MFA).md
    3. Amazon IAM Hands-on Lab(IAM Role for EC2).md
  3. S3/
    1. Amazon S3 Hands-on Lab(Basic).md
    2. Amazon S3 Versioning Lab.md
    3. Amazon S3 Pre-signed URL Lab.md
    4. Amazon S3 Lifecycle Lab.md
    5. Amazon S3 Static Website Hosting Lab.md
    6. Amazon S3 Event Notifications Lab.md
  README.md
```

---

## Quy tac dat ten file

Moi file pipeline nen duoc dat ten theo format:

```
<ci-tool>-<cloud-service>-<action>.yml
```

**Giai thich:**

| Thanh phan | Giai thich | Vi du |
|-----------|------------|-------|
| `ci-tool` | Tool CI/CD dang su dung | `github-actions`, `gitlab-ci`, `codepipeline`, `buildspec` |
| `cloud-service` | Dich vu AWS target | `eks`, `ecs`, `ecr`, `s3` |
| `action` | Hanh dong chinh cua pipeline | `deploy`, `push`, `build`, `blue-green` |

**Vi du ten file:**

- `github-actions-eks-deploy.yml` — GitHub Actions deploy len EKS
- `gitlab-ci-ecr-push.yml` — GitLab CI push image len ECR
- `buildspec-docker.yml` — CodeBuild buildspec cho Docker build
- `appspec-ecs-blue-green.yml` — CodeDeploy appspec cho ECS blue/green

---

## Bien can thay doi

Khi su dung cac template, thay doi cac bien sau cho phu hop voi project:

| Bien | Mo ta | Vi du |
|------|-------|-------|
| `AWS_REGION` | Region cua AWS | `ap-southeast-1` |
| `AWS_ACCOUNT_ID` | Account ID cua AWS | `123456789012` |
| `ECR_REPOSITORY` | Ten repository tren ECR | `my-app` |
| `EKS_CLUSTER_NAME` | Ten cluster EKS | `my-cluster` |
| `ECS_SERVICE_NAME` | Ten service ECS | `my-service` |
| `ECS_CLUSTER_NAME` | Ten cluster ECS | `my-ecs-cluster` |
| `ENVIRONMENT` | Moi truong deploy | `dev`, `staging`, `prod` |

---

## Luu y

- Tat ca secret (AWS Access Key, Secret Key) phai duoc luu trong CI/CD secret management (GitHub Secrets, GitLab CI Variables), **khong** hardcode trong file.
- Uu tien su dung OIDC / IAM Role thay vi Access Key khi co the (GitHub Actions ho tro OIDC voi AWS).
- Kiem tra ky quyen IAM cua role/user dung trong pipeline de dam bao nguyen tac least privilege.
- Tham khao thu muc `cloud/aws/services/` de hieu ro tung dich vu AWS duoc su dung trong pipeline.
