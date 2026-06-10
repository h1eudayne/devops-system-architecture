# AWS Pipeline Templates

Thư mục này chứa các CI/CD pipeline template để deploy ứng dụng lên các dịch vụ AWS như EKS, ECS, và push image lên ECR. Các template được thiết kế để có thể tái sử dụng cho nhiều dự án, chỉ cần thay đổi các biến (variable) theo từng môi trường.

---

## Nội dung chính

### 1. Pipeline cho GitHub Actions deploy lên EKS/ECS

Các workflow `.yml` để tích hợp với GitHub Actions, thực hiện:

- Build Docker image và push lên ECR.
- Deploy lên EKS bằng `kubectl apply` hoặc Helm chart.
- Deploy lên ECS bằng `aws ecs update-service` hoặc tạo task definition mới.
- Hỗ trợ đa môi trường (dev, staging, production) qua GitHub Environments.

**File mẫu:**

| File | Mô tả |
|------|-------|
| `github-actions-eks-deploy.yml` | Build, push ECR, deploy lên EKS bằng kubectl/Helm |
| `github-actions-ecs-deploy.yml` | Build, push ECR, cập nhật ECS service |
| `github-actions-ecr-push.yml` | Chỉ build và push image lên ECR |

### 2. Pipeline cho GitLab CI push image lên ECR

Các file `.gitlab-ci.yml` template để:

- Build Docker image trong GitLab Runner.
- Đăng nhập và push image lên AWS ECR.
- Kích hoạt (trigger) deploy lên EKS/ECS từ GitLab CI.

**File mẫu:**

| File | Mô tả |
|------|-------|
| `gitlab-ci-ecr-push.yml` | Build và push image lên ECR |
| `gitlab-ci-eks-deploy.yml` | Push image + deploy lên EKS |
| `gitlab-ci-ecs-deploy.yml` | Push image + cập nhật ECS service |

### 3. CodePipeline / CodeBuild Templates

Template cho bộ CI/CD native của AWS:

- **`buildspec.yml`**: File cấu hình cho CodeBuild, định nghĩa các phase (install, pre_build, build, post_build).
- **CodePipeline definition**: Cấu hình pipeline với các stage Source → Build → Deploy.
- **CodeDeploy `appspec.yml`**: Định nghĩa cách deploy lên EC2 hoặc ECS (blue/green).

**File mẫu:**

| File | Mô tả |
|------|-------|
| `buildspec-docker.yml` | CodeBuild: build Docker image và push lên ECR |
| `buildspec-maven.yml` | CodeBuild: build ứng dụng Java bằng Maven, chạy test |
| `appspec-ecs-blue-green.yml` | CodeDeploy: blue/green deployment cho ECS |
| `codepipeline-eks.json` | CodePipeline definition: GitHub → CodeBuild → EKS |

### 4. Hướng dẫn thực hành triển khai cơ bản (EC2 Hands-on Labs)

Các hướng dẫn thực hành deploy ứng dụng và cấu hình hạ tầng EC2 từng bước (step-by-step):

| File | Mô tả | Giao thức / Công nghệ |
|------|-------|-----------------------|
| [1. Amazon EC2 Hands-on Lab(Linux)](1.%20EC2/1.%20Amazon%20EC2%20Hands-on%20Lab%28Linux%29.md) | Khởi tạo EC2 Linux, SSH từ Windows, cài đặt httpd, Snapshot/AMI | SSH, HTTP, Apache |
| [2. Amazon EC2 Hands-on Lab(Windows)](1.%20EC2/2.%20Amazon%20EC2%20Hands-on%20Lab%28Windows%29.md) | Khởi tạo EC2 Windows Server, giải mã mật khẩu Administrator, đăng nhập RDP | RDP, Windows Server |
| [3. Amazon EC2 User Data and Metadata Lab](1.%20EC2/3.%20Amazon%20EC2%20User%20Data%20and%20Metadata%20Lab.md) | Tự động hóa cài đặt Web Server và lấy IP động qua IMDSv2 | User Data, IMDSv2, Bash |
| [4. Amazon EC2 Hands-on Lab(Windows Volume)](1.%20EC2/4.%20Amazon%20EC2%20Hands-on%20Lab%28Windows%20Volume%29.md) | Tạo EBS Volume, gắn vào instance, online và định dạng NTFS | EBS, Windows Disk Mgmt |
| [5. Amazon EC2 Hands-on Lab(Linux Volume)](1.%20EC2/5.%20Amazon%20EC2%20Hands-on%20Lab%28Linux%20Volume%29.md) | EBS volume, fdisk phân vùng, định dạng XFS, cấu hình auto-mount trong /etc/fstab, mở rộng dung lượng trực tuyến | EBS, fdisk, XFS, growpart |
| [6. Amazon EC2 Hands-on Lab(Add Member SSH)](1.%20EC2/6.%20Amazon%20EC2%20Hands-on%20Lab%28Add%20Member%20SSH%29.md) | Tạo user dev01, cấu hình phân quyền thư mục .ssh (700) và authorized_keys (600) | SSH, Linux Security |

### 5. Hướng dẫn thực hành IAM (IAM Hands-on Labs)

Các hướng dẫn thực hành quản lý người dùng, nhóm và phân quyền trên AWS IAM:

| File | Mô tả | Công nghệ |
|------|-------|-----------|
| [1. Amazon IAM Hands-on Lab(User, Group and Policy)](2.%20IAM/1.%20Amazon%20IAM%20Hands-on%20Lab%28User%2C%20Group%20and%20Policy%29.md) | Tạo nhóm AdministratorAccess, tạo người dùng, thêm vào nhóm, tải thông tin đăng nhập (csv credentials) và đăng nhập giao diện console | AWS IAM, AWS Console |
| [2. Amazon IAM Hands-on Lab(AWS CLI and MFA)](2.%20IAM/2.%20Amazon%20IAM%20Hands-on%20Lab%28AWS%20CLI%20and%20MFA%29.md) | Cài đặt AWS CLI, cấu hình truy cập qua Access Key/Secret Key, các lệnh S3 cơ bản, chính sách ép buộc xác thực MFA, xử lý lỗi AccessDenied và cấu hình profile MFA | AWS IAM, AWS CLI |
| [3. Amazon IAM Hands-on Lab(IAM Role for EC2)](2.%20IAM/3.%20Amazon%20IAM%20Hands-on%20Lab%28IAM%20Role%20for%20EC2%29.md) | Tạo IAM Role cho phép EC2 truy cập dịch vụ S3, gán role vào máy chủ ảo và kiểm tra kết nối không cần key | AWS IAM, S3, EC2 |
| [4. Amazon IAM Hands-on Lab(Assume Role with AWS CLI)](2.%20IAM/4.%20Amazon%20IAM%20Hands-on%20Lab%28Assume%20Role%20with%20AWS%20CLI%29.md) | Gỡ quyền trực tiếp của User, tạo Role PowerUserAccess với Custom Trust Policy, và dùng AWS CLI assume-role với profile credentials tạm thời | AWS IAM, AWS CLI, STS |

### 6. Hướng dẫn thực hành S3 (S3 Hands-on Labs)

Các hướng dẫn thực hành quản lý thùng chứa và đối tượng trên AWS S3:

| File | Mô tả | Công nghệ |
|------|-------|-----------|
| [1. Amazon S3 Hands-on Lab(Basic)](3.%20S3/1.%20Amazon%20S3%20Hands-on%20Lab%28Basic%29.md) | Các thao tác cơ bản bao gồm truy cập S3 Console, khởi tạo bucket, tạo thư mục, tải lên tệp tin và thực hiện di chuyển (move) đối tượng giữa các thư mục | AWS S3, AWS Console |
| [2. Amazon S3 Versioning Lab](3.%20S3/2.%20Amazon%20S3%20Versioning%20Lab.md) | Các bước thực hành bật tính năng quản lý phiên bản (Versioning) cho bucket S3, tải lên, chỉnh sửa và ghi đè tệp tin để xem phiên bản, thực hiện xóa để kiểm nghiệm Delete Marker và hiển thị phiên bản | AWS S3, AWS Console |
| [3. Amazon S3 Pre-signed URL Lab](3.%20S3/3.%20Amazon%20S3%20Pre-signed%20URL%20Lab.md) | Các bước thực hành kiểm tra cấu hình kết nối AWS CLI, cấu hình chặn truy cập công khai và tạo đường dẫn ký trước (Pre-signed URL) để cấp quyền truy cập tạm thời | AWS S3, AWS Console, AWS CLI |
| [4. Amazon S3 Lifecycle Lab](3.%20S3/4.%20Amazon%20S3%20Lifecycle%20Lab.md) | Thực hành cấu hình tự động chuyển đổi lớp lưu trữ sau 90 ngày sang Glacier và xóa hoàn toàn sau 270 ngày | AWS S3, AWS Console |
| [5. Amazon S3 Static Website Hosting Lab](3.%20S3/5.%20Amazon%20S3%20Static%20Website%20Hosting%20Lab.md) | Thực hành upload mã nguồn qua AWS CLI, bật Static Website Hosting và cấu hình Public Access / Bucket Policy | AWS S3, AWS Console, AWS CLI |
| [6. Amazon S3 Event Notifications Lab](3.%20S3/6.%20Amazon%20S3%20Event%20Notifications%20Lab.md) | Thực hành cấu hình S3 Event Notification kết hợp với Lambda Function, kiểm tra log tự động qua CloudWatch khi tải lên đối tượng | AWS S3, AWS Lambda, AWS Console |

### 7. Hướng dẫn thực hành ELB & Auto Scaling (ELB & ASG Hands-on Labs)

Các hướng dẫn thực hành quản lý bộ cân bằng tải và tự động co giãn trên AWS ELB và Auto Scaling:

| File | Mô tả | Công nghệ |
|------|-------|-----------|
| [1. Amazon ELB Hands-on Lab](4.%20ELB%20%26%20Auto%20Scaling/1.%20Amazon%20ELB%20Hands-on%20Lab.md) | Cấu hình cân bằng tải bằng Application Load Balancer (ALB) kết hợp với 2 EC2 instances ở các zone khác nhau chạy script User Data phân biệt | AWS ELB, ALB, EC2, User Data |
| [2. Amazon Auto Scaling Group Hands-on Lab](4.%20ELB%20%26%20Auto%20Scaling/2.%20Amazon%20Auto%20Scaling%20Group%20Hands-on%20Lab.md) | Các bước thực hành chuẩn bị Base Image (Golden Image) từ EC2 gốc bằng cách kích hoạt dịch vụ httpd tự chạy cùng hệ thống và đóng gói thành AMI | AWS ASG, EC2, SSH, AMI, Systemd |

### 8. Hướng dẫn thực hành RDS (RDS Hands-on Labs)

Các hướng dẫn thực hành quản lý và triển khai cơ sở dữ liệu trên Amazon RDS:

| File | Mô tả | Công nghệ |
|------|-------|-----------|
| [1. Amazon RDS Hands-on Lab(Basic)](5.%20RDS/1.%20Amazon%20RDS%20Hands-on%20Lab%28Basic%29.md) | Thực hành tạo một RDS Instance sử dụng tùy chọn Full Configuration với cơ sở dữ liệu MySQL và cấu hình phần cứng db.t3.medium | AWS RDS, MySQL, db.t3.medium |

---

## Cấu trúc khuyến nghị

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
  4. ELB & Auto Scaling/
    1. Amazon ELB Hands-on Lab.md
    2. Amazon Auto Scaling Group Hands-on Lab.md
  5. RDS/
    1. Amazon RDS Hands-on Lab(Basic).md
  README.md
```

---

## Quy tắc đặt tên file

Mỗi file pipeline nên được đặt tên theo định dạng (format):

```
<ci-tool>-<cloud-service>-<action>.yml
```

**Giải thích:**

| Thành phần | Giải thích | Ví dụ |
|-----------|------------|-------|
| `ci-tool` | Công cụ CI/CD đang sử dụng | `github-actions`, `gitlab-ci`, `codepipeline`, `buildspec` |
| `cloud-service` | Dịch vụ AWS đích | `eks`, `ecs`, `ecr`, `s3` |
| `action` | Hành động chính của pipeline | `deploy`, `push`, `build`, `blue-green` |

**Ví dụ tên file:**

- `github-actions-eks-deploy.yml` — GitHub Actions deploy lên EKS
- `gitlab-ci-ecr-push.yml` — GitLab CI push image lên ECR
- `buildspec-docker.yml` — CodeBuild buildspec cho Docker build
- `appspec-ecs-blue-green.yml` — CodeDeploy appspec cho ECS blue/green

---

## Biến cần thay đổi

Khi sử dụng các template, thay đổi các biến sau cho phù hợp với dự án:

| Biến | Mô tả | Ví dụ |
|------|-------|-------|
| `AWS_REGION` | Vùng (Region) của AWS | `ap-southeast-1` |
| `AWS_ACCOUNT_ID` | Account ID của tài khoản AWS | `123456789012` |
| `ECR_REPOSITORY` | Tên repository trên ECR | `my-app` |
| `EKS_CLUSTER_NAME` | Tên cụm (cluster) EKS | `my-cluster` |
| `ECS_SERVICE_NAME` | Tên service ECS | `my-service` |
| `ECS_CLUSTER_NAME` | Tên cluster ECS | `my-ecs-cluster` |
| `ENVIRONMENT` | Môi trường deploy | `dev`, `staging`, `prod` |

---

## Lưu ý quan trọng

- Tất cả secret (AWS Access Key, Secret Key) phải được lưu trong CI/CD secret management (GitHub Secrets, GitLab CI Variables), **không** hardcode trong file.
- Ưu tiên sử dụng OIDC / IAM Role thay vì Access Key khi có thể (GitHub Actions hỗ trợ kết nối OIDC trực tiếp với AWS).
- Kiểm tra kỹ quyền IAM của role/user dùng trong pipeline để đảm bảo nguyên tắc phân quyền tối thiểu (least privilege).
- Tham khảo thư mục `cloud/aws/services/` để hiểu rõ từng dịch vụ AWS được sử dụng trong pipeline.
