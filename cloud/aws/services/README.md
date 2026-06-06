# AWS Services cho DevOps / CI-CD

Thu muc nay mo ta cac dich vu AWS thuong duoc su dung trong quy trinh DevOps va CI/CD. Moi dich vu duoc trinh bay voi ten, mo ta ngan, truong hop su dung va huong dan co ban de bat dau.

---

## Muc luc

| # | Dich vu | Mo ta ngan |
|---|---------|------------|
| 1 | [EC2 (Amazon Elastic Compute Cloud)](1. EC2/1. Amazon EC2.md) | Virtual server (May chu ao) |
| 2 | [EKS](#2-eks---elastic-kubernetes-service) | Managed Kubernetes |
| 3 | [ECS](#3-ecs---elastic-container-service) | Container orchestration |
| 4 | [ECR](#4-ecr---elastic-container-registry) | Docker image registry |
| 5 | [RDS](#5-rds---relational-database-service) | Managed database |
| 6 | [S3 (Amazon Simple Storage Service)](3. S3/1. Amazon S3.md) | Object storage |
| 7 | [VPC](#6-vpc---virtual-private-cloud) | Virtual network |
| 8 | [IAM (Identity & Access Management)](2. IAM/1. Amazon IAM.md) | Identity & access management |
| 9 | [CodePipeline / CodeBuild / CodeDeploy](#8-codepipeline--codebuild--codedeploy) | CI/CD native AWS |
| 10 | [Route 53](#9-route-53) | DNS |
| 11 | [CloudFront](#10-cloudfront) | CDN |
| 12 | [ACM](#11-acm---certificate-manager) | TLS certificates |
| 13 | [EFS](#12-efs---elastic-file-system) | Shared file storage |

---

## 1. EC2 - Elastic Compute Cloud

**Danh sach tai lieu hoc tap va huong dan chi tiet:**

### Tai lieu ly thuyet (Theory Documents)
- [1. Amazon EC2](1. EC2/1. Amazon EC2.md): So sanh cau hinh EC2 voi PC/Laptop vat ly, cac khai niem co ban nhu AMI, Instance Type, EBS.
- [2. Amazon EC2 Lifecycle](1. EC2/2. Amazon EC2 Lifecycle.md): Vong doi cua EC2 (EBS-backed va Instance Store-backed) voi so do Mermaid va cach tinh phi.
- [3. Amazon EC2 Security Group](1. EC2/3. Amazon EC2 Security Group.md): Tuong lua ao, co che Stateful, quy tac Inbound/Outbound.
- [6. Amazon EC2 User Data and Metadata](1. EC2/6. Amazon EC2 User Data and Metadata.md): Chay script tu dong khi khoi tao (User Data) va truy xuat thong tin he thong (Metadata IMDSv2).
- [8. Amazon EC2 Use Cases](1. EC2/8. Amazon EC2 Use Cases.md): Cac truong hop su dung pho bien nhu Lift & Shift, All-in-One, Compute Cluster, self-managed DB, Kubernetes nodes.
- [9. Amazon EBS](1. EC2/9. Amazon EBS.md): Chi tiet ve dich vu block storage cho EC2 va cac dong o cung (gp2/gp3, io1/io2, st1, sc1).

### Huong dan thuc hanh (Hands-on Labs)
- [4. Amazon EC2 Hands-on Lab(Linux)](1. EC2/4. Amazon EC2 Hands-on Lab(Linux).md) (Lien ket den thuc hanh deploy): Khoi tao EC2 Linux, cau hinh SG, sua loi khoa SSH tren Windows, cai dat httpd va tao AMI/Snapshot.
- [5. Amazon EC2 Hands-on Lab(Windows)](1. EC2/5. Amazon EC2 Hands-on Lab(Windows).md) (Lien ket den thuc hanh deploy): Khoi tao EC2 Windows Server, mo RDP 3389 va giai ma mat khau Administrator.
- [7. Amazon EC2 User Data and Metadata Lab](1. EC2/7. Amazon EC2 User Data and Metadata Lab.md) (Lien ket den thuc hanh deploy): Su dung User Data de tu dong cai Web Server va lay IP dong qua IMDSv2.
- [10. Amazon EC2 Hands-on Lab(Windows Volume)](1. EC2/10. Amazon EC2 Hands-on Lab(Windows Volume).md) (Lien ket den thuc hanh deploy): Tao, gan va dinh dang EBS Volume phu tren Windows Server (Disk Management).
- [11. Amazon EC2 Hands-on Lab(Linux Volume)](1. EC2/11. Amazon EC2 Hands-on Lab(Linux Volume).md) (Lien ket den thuc hanh deploy): Tao, gan, phan vung (fdisk), dinh dang XFS, cau hinh auto-mount (/etc/fstab) va mo rong truc tuyen (growpart, xfs_growfs).
- [12. Amazon EC2 Hands-on Lab(Add Member SSH)](1. EC2/12. Amazon EC2 Hands-on Lab(Add Member SSH).md) (Lien ket den thuc hanh deploy): Tao user moi, phan quyen thu muc .ssh (700) va authorized_keys (600), cau hinh SSH key cho thanh vien du an.

**No la gi:**
EC2 la dich vu cung cap server ao (Virtual Machine) theo yeu cau tren ha tang dam may cua AWS. Ban co thay doi linh hoat RAM, CPU, GPU, o cung va he dieu hanh tuy y trong vai phut.

**Khi nao su dung:**
- Khi can mot server Linux/Windows doc lap de tu cai dat web server, database, app server.
- Lam node cho cum Kubernetes tu quan ly.
- Chay cac service backend truyen thong hoac background jobs.

---

## 2. EKS - Elastic Kubernetes Service

**No la gi:**
EKS la dich vu Kubernetes duoc quan ly boi AWS. AWS se lo phan control plane (API server, etcd, scheduler), ban chi can quan ly worker node hoac su dung Fargate de chay pod serverless. EKS tuong thich hoan toan voi Kubernetes open-source nen co the su dung kubectl, Helm, va cac tool K8s thong thuong.

**Khi nao su dung:**
- Khi can chay ung dung container hoa o quy mo lon voi kha nang tu dong scale.
- Khi team da quen voi Kubernetes va can managed control plane de giam chi phi van hanh.
- Khi can tich hop sau voi cac dich vu AWS khac nhu ALB, IAM, CloudWatch.

**Huong dan co ban:**
1. Cai dat `eksctl` va `kubectl` tren may local.
2. Chay `eksctl create cluster --name my-cluster --region ap-southeast-1 --nodegroup-name workers --node-type t3.medium --nodes 2`.
3. Cau hinh kubeconfig: `aws eks update-kubeconfig --name my-cluster --region ap-southeast-1`.
4. Kiem tra cluster: `kubectl get nodes`.
5. Deploy ung dung: `kubectl apply -f deployment.yaml`.

---

## 3. ECS - Elastic Container Service

**No la gi:**
ECS la dich vu container orchestration cua AWS, cho phep chay Docker container ma khong can tu quan ly Kubernetes. ECS ho tro hai launch type: EC2 (tu quan ly instance) va Fargate (serverless, AWS quan ly infra). ECS tich hop chat voi ALB, IAM, CloudWatch va cac dich vu AWS khac.

**Khi nao su dung:**
- Khi can chay container don gian ma khong can do phuc tap cua Kubernetes.
- Khi muon su dung Fargate de chay serverless container, khong can quan ly server.
- Khi toan bo ha tang da nam tren AWS va can tich hop native.

**Huong dan co ban:**
1. Tao ECS Cluster tren AWS Console hoac Terraform.
2. Tao Task Definition dinh nghia container image, CPU, memory, port mapping.
3. Tao Service de chay va duy tri so luong task mong muon.
4. Gan Application Load Balancer (ALB) de phan phoi traffic.
5. Cau hinh Auto Scaling cho service theo CPU/memory utilization.

---

## 4. ECR - Elastic Container Registry

**No la gi:**
ECR la dich vu Docker container registry duoc quan ly boi AWS. No cho phep luu tru, quan ly va deploy Docker image mot cach an toan. ECR ho tro image scanning de phat hien lo hong bao mat, lifecycle policy de tu dong don dep image cu, va tich hop truc tiep voi EKS, ECS.

**Khi nao su dung:**
- Khi can private Docker registry tren AWS de luu tru image cho pipeline CI/CD.
- Khi muon quet bao mat (vulnerability scanning) cho image truoc khi deploy.
- Khi su dung EKS hoac ECS va can pull image nhanh trong cung region.

**Huong dan co ban:**
1. Tao repository: `aws ecr create-repository --repository-name my-app`.
2. Login Docker vao ECR: `aws ecr get-login-password --region ap-southeast-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.ap-southeast-1.amazonaws.com`.
3. Build va tag image: `docker build -t my-app . && docker tag my-app:latest <ecr-uri>:latest`.
4. Push image: `docker push <ecr-uri>:latest`.
5. Cau hinh lifecycle policy de tu dong xoa image cu (giu lai 10 image gan nhat).

---

## 5. RDS - Relational Database Service

**No la gi:**
RDS la dich vu database quan ly cua AWS, ho tro nhieu engine nhu MySQL, PostgreSQL, MariaDB, Oracle, SQL Server va Amazon Aurora. AWS lo cac cong viec nhu patching, backup, replication, failover. RDS cho phep tao read replica, Multi-AZ deployment de dam bao high availability.

**Khi nao su dung:**
- Khi ung dung can relational database ma khong muon tu quan ly server database.
- Khi can automated backup, point-in-time recovery va Multi-AZ failover.
- Khi muon dung read replica de scale read workload.

**Huong dan co ban:**
1. Tao DB subnet group gom cac private subnet trong VPC.
2. Tao Security Group cho phep ket noi tu application (port 3306/5432).
3. Tao RDS instance qua Console hoac Terraform, chon engine, instance class, storage.
4. Bat Multi-AZ neu can high availability.
5. Luu connection string vao AWS Secrets Manager, khong hardcode trong code.

---

## 6. S3 - Simple Storage Service

**Danh sach tai lieu hoc tap va huong dan chi tiet:**

### Tai lieu ly thuyet (Theory Documents)
- [1. Amazon S3](3. S3/1. Amazon S3.md): Định nghĩa dịch vụ, các khái niệm cốt lõi (Bucket, Object, Key), tính năng nổi bật và các trường hợp sử dụng.

**No la gi:**
S3 la dich vu object storage cua AWS voi do ben (durability) 99.999999999%. S3 cho phep luu tru bat ky loai file nao voi dung luong khong gioi han. No duoc su dung rong rai de luu artifact, backup, static website hosting, log storage va lam backend cho Terraform state.

**Khi nao su dung:**
- Khi can luu tru artifact tu pipeline CI/CD (build output, Docker context, Helm chart).
- Khi can backend cho Terraform remote state.
- Khi can luu tru backup database, log file, hoac static asset.

**Huong dan co ban:**
1. Tao bucket: `aws s3 mb s3://my-project-artifacts --region ap-southeast-1`.
2. Bat versioning: `aws s3api put-bucket-versioning --bucket my-project-artifacts --versioning-configuration Status=Enabled`.
3. Cau hinh lifecycle rule de chuyen object cu sang Glacier hoac xoa sau N ngay.
4. Cau hinh bucket policy de gioi han quyen truy cap.
5. Su dung cho Terraform backend: cau hinh `backend "s3"` trong file Terraform.

---

## 7. VPC - Virtual Private Cloud

**No la gi:**
VPC la mang ao rieng tren AWS, cho phep ban dinh nghia dai IP, subnet, route table, va kiem soat luu luong mang. Moi tai nguyen AWS (EC2, EKS, RDS) deu chay trong mot VPC. VPC la nen tang networking cho toan bo ha tang tren AWS.

**Khi nao su dung:**
- Bat buoc khi trien khai bat ky tai nguyen nao tren AWS.
- Khi can tach biet moi truong (dev, staging, production) bang cac VPC rieng.
- Khi can ket noi on-premise voi AWS qua VPN hoac Direct Connect.

**Huong dan co ban:**
1. Tao VPC voi CIDR block (vd: `10.0.0.0/16`).
2. Tao public subnet (co Internet Gateway) va private subnet (co NAT Gateway).
3. Cau hinh route table cho tung loai subnet.
4. Tao Security Group va Network ACL de kiem soat traffic.
5. Tao NAT Gateway trong public subnet de private subnet co the truy cap internet.

---

## 8. IAM - Identity & Access Management

**Danh sach tai lieu hoc tap va huong dan chi tiet:**

### Tai lieu ly thuyet (Theory Documents)
- [1. Amazon IAM](2. IAM/1. Amazon IAM.md): Nhiệm vụ định danh và phân quyền, quản lý ai (who) và cái gì (what) có thể access như thế nào, các use case của IAM (ABAC, Multi-account, Guardrails, Least privilege).
- [2. Amazon IAM Concept](2. IAM/2. Amazon IAM Concept.md): Các khái niệm cốt lõi của IAM bao gồm User, Group, Role, và Permission (Policy) để đảm bảo tiêu chí về Security.
- [3. Amazon IAM Policy](2. IAM/3. Amazon IAM Policy.md): Tìm hiểu về chính sách phân quyền, cấu trúc Statement, phân loại Inline vs Managed Policies và tiêu chí lựa chọn.
- [4. Amazon IAM User](2. IAM/4. Amazon IAM User.md): Đại diện cho hồ sơ người dùng trên AWS, phương thức truy cập qua Console/Programmatic và nguyên tắc cấp quyền mặc định.
- [5. Amazon IAM Role](2. IAM/5. Amazon IAM Role.md): Vai trò phân quyền, so sánh khái niệm, ứng dụng gắn vào EC2/Lambda, cross-account assume-role và tầm quan trọng trong troubleshooting.
- [6. Amazon IAM Group](2. IAM/6. Amazon IAM Group.md): Nhóm người dùng, phân chia quyền theo phòng ban/vai trò, cơ chế kế thừa quyền và các quy tắc xung đột, lồng nhau.
- [7. Amazon IAM Policy vs Resource Policy](2. IAM/7. Amazon IAM Policy vs Resource Policy.md): So sánh Identity-based Policy (IAM Policy) và Resource-based Policy (Resource Policy), cơ chế kết hợp quyền hạn (Union/Deny) và mẹo xử lý sự cố sử dụng AWS Root Account.

### Huong dan thuc hanh (Hands-on Labs)
- [8. Amazon IAM Hands-on Lab(User, Group and Policy)](2. IAM/8. Amazon IAM Hands-on Lab(User, Group and Policy).md) (Lien ket den thuc hanh deploy): Thực hành tạo nhóm người dùng có quyền quản trị, thêm người dùng mới, tải csv credentials và đăng nhập console để kiểm nghiệm.
- [9. Amazon IAM Hands-on Lab(AWS CLI and MFA)](2. IAM/9. Amazon IAM Hands-on Lab(AWS CLI and MFA).md) (Lien ket den thuc hanh deploy): Thực hành cài đặt AWS CLI, cấu hình thông tin xác thực qua Access Key / Secret Key, các câu lệnh S3 cơ bản, thiết lập policy bắt buộc xác thực MFA, kiểm nghiệm lỗi AccessDenied trên CLI và cấu hình profile mfa để truy cập thành công.
- [10. Amazon IAM Hands-on Lab(IAM Role for EC2)](2. IAM/10. Amazon IAM Hands-on Lab(IAM Role for EC2).md) (Lien ket den thuc hanh deploy): Thực hành tạo IAM Role cho phép EC2 truy cập dịch vụ S3, gán role vào máy chủ và xác thực kết nối không cần key.
- [11. Amazon IAM Hands-on Lab(Assume Role with AWS CLI)](2. IAM/11. Amazon IAM Hands-on Lab(Assume Role with AWS CLI).md) (Lien ket den thuc hanh deploy): Thực hành cấu hình giả lập vai trò (Assume Role) qua AWS CLI và tệp credentials sử dụng thông tin xác thực tạm thời từ AWS STS.

**No la gi:**
IAM la dich vu quan ly quyen truy cap tren AWS. IAM cho phep tao user, group, role va policy de kiem soat ai duoc phep lam gi voi tai nguyen AWS. Trong DevOps, IAM role duoc su dung cho EC2 instance, EKS pod (IRSA), Lambda function va CI/CD pipeline.

**Khi nao su dung:**
- Khi can cap quyen cho pipeline CI/CD de push image, deploy len EKS/ECS.
- Khi can cau hinh IRSA (IAM Roles for Service Accounts) cho pod tren EKS.
- Khi can tao service role cho cac dich vu AWS tuong tac voi nhau.

**Huong dan co ban:**
1. Tao IAM Policy dinh nghia quyen cu the (vd: chi cho phep push image len ECR).
2. Tao IAM Role va attach policy.
3. Cau hinh trust relationship de chi dinh ai/service nao duoc assume role.
4. Voi EKS: cau hinh OIDC provider va tao IRSA de pod co the su dung AWS API.
5. Ap dung nguyen tac least privilege — chi cap dung quyen can thiet.

---

## 9. CodePipeline / CodeBuild / CodeDeploy

**No la gi:**
Day la bo ba dich vu CI/CD native cua AWS. **CodePipeline** la orchestrator dieu phoi toan bo pipeline. **CodeBuild** la dich vu build serverless, chay cac buoc build/test dua tren `buildspec.yml`. **CodeDeploy** tu dong hoa viec deploy len EC2, ECS, Lambda voi cac chien luoc nhu rolling, blue/green.

**Khi nao su dung:**
- Khi muon xay dung pipeline CI/CD hoan toan tren AWS ma khong can tool ben ngoai.
- Khi da su dung CodeCommit hoac muon tich hop voi GitHub/Bitbucket qua AWS.
- Khi can blue/green deployment cho ECS hoac Lambda.

**Huong dan co ban:**
1. Tao CodeBuild project voi `buildspec.yml` dinh nghia cac buoc build, test, push image.
2. Tao CodeDeploy application va deployment group (neu deploy len EC2/ECS).
3. Tao CodePipeline ket noi: Source (GitHub/CodeCommit) → Build (CodeBuild) → Deploy (CodeDeploy/ECS).
4. Cau hinh IAM role cho tung dich vu voi quyen phu hop.
5. Bat CloudWatch Events/EventBridge de trigger pipeline tu dong khi co code push.

---

## 10. Route 53

**No la gi:**
Route 53 la dich vu DNS cua AWS, ho tro dang ky domain, quan ly DNS record va health check. Route 53 ho tro nhieu routing policy nhu simple, weighted, latency-based, geolocation va failover. No tich hop voi cac dich vu AWS khac nhu ALB, CloudFront, S3 de tao alias record.

**Khi nao su dung:**
- Khi can quan ly DNS cho ung dung deploy tren AWS.
- Khi can cau hinh domain tro ve ALB, CloudFront hoac S3 static website.
- Khi can failover DNS tu dong giua cac region.

**Huong dan co ban:**
1. Tao Hosted Zone cho domain (vd: `myapp.com`).
2. Cap nhat nameserver tai nha dang ky domain tro ve Route 53.
3. Tao A record (Alias) tro ve ALB hoac CloudFront distribution.
4. Cau hinh health check de Route 53 tu dong failover khi endpoint khong healthy.
5. Su dung CNAME hoac Alias record cho subdomain (vd: `api.myapp.com`).

---

## 11. CloudFront

**No la gi:**
CloudFront la dich vu CDN (Content Delivery Network) cua AWS, phan phoi noi dung tu cac edge location tren toan cau. CloudFront giup giam latency, tang toc do tai trang va giam tai cho origin server. No ho tro cache static content, dynamic content, video streaming va WebSocket.

**Khi nao su dung:**
- Khi can phan phoi static asset (JS, CSS, image) nhanh cho nguoi dung toan cau.
- Khi muon dat CDN truoc ALB de cache API response va giam tai backend.
- Khi can HTTPS cho S3 static website hosting.

**Huong dan co ban:**
1. Tao CloudFront Distribution voi origin la S3 bucket hoac ALB.
2. Cau hinh cache behavior (TTL, query string forwarding, header forwarding).
3. Gan SSL certificate tu ACM (chi ho tro cert o region `us-east-1`).
4. Tao Route 53 alias record tro ve CloudFront distribution.
5. Cau hinh Origin Access Control (OAC) neu origin la S3 de chan truy cap truc tiep.

---

## 12. ACM - Certificate Manager

**No la gi:**
ACM la dich vu quan ly TLS/SSL certificate mien phi cua AWS. ACM tu dong cap, gia han certificate cho cac domain cua ban. Certificate tu ACM co the gan vao ALB, CloudFront, API Gateway ma khong can tu quan ly file cert/key.

**Khi nao su dung:**
- Khi can HTTPS cho ung dung phia sau ALB hoac CloudFront.
- Khi muon tu dong gia han certificate ma khong can thao tac thu cong.
- Khi can wildcard certificate (vd: `*.myapp.com`) cho nhieu subdomain.

**Huong dan co ban:**
1. Request certificate trong ACM Console hoac CLI: `aws acm request-certificate --domain-name myapp.com --subject-alternative-names *.myapp.com --validation-method DNS`.
2. Tao DNS validation record trong Route 53 (ACM se huong dan cu the).
3. Doi ACM xac nhan va cap certificate (thuong mat vai phut voi DNS validation).
4. Gan certificate vao ALB Listener (HTTPS 443) hoac CloudFront Distribution.
5. Doi voi CloudFront, certificate bat buoc phai o region `us-east-1`.

---

## 13. EFS - Elastic File System

**No la gi:**
EFS la dich vu shared file storage (NFS) cua AWS. EFS cho phep nhieu EC2 instance hoac EKS pod mount cung mot file system dong thoi. No tu dong scale dung luong theo nhu cau, khong can provision truoc. EFS phu hop cho cac workload can shared storage nhu CMS, media processing, machine learning.

**Khi nao su dung:**
- Khi nhieu pod tren EKS can doc/ghi chung mot thu muc (ReadWriteMany).
- Khi can shared storage cho ung dung stateful chay tren nhieu instance.
- Khi can persistent storage co the mount tu nhieu Availability Zone.

**Huong dan co ban:**
1. Tao EFS file system qua Console hoac Terraform.
2. Tao mount target trong moi subnet ma EKS node dang chay.
3. Cau hinh Security Group cho phep NFS traffic (port 2049) tu EKS node.
4. Cai dat EFS CSI Driver tren EKS: `kubectl apply -k "github.com/kubernetes-sigs/aws-efs-csi-driver/deploy/kubernetes/overlays/stable"`.
5. Tao PersistentVolume va PersistentVolumeClaim su dung EFS file system ID.

---

## Luu y chung

- Tat ca cac dich vu tren nen duoc cau hinh bang IaC (Terraform, CloudFormation) de dam bao reproducibility.
- Khong commit AWS Access Key, Secret Key, hoac bat ky thong tin xac thuc nao vao repository.
- Uu tien su dung IAM Role thay vi Access Key khi co the.
- Tham khao thu muc `cloud/aws/deploy/` de xem cac deploy template tich hop voi cac dich vu nay.
