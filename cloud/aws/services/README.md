# AWS Services cho DevOps / CI-CD

Thư mục này mô tả các dịch vụ AWS thường được sử dụng trong quy trình DevOps và CI/CD. Mỗi dịch vụ được trình bày với tên, mô tả ngắn, trường hợp sử dụng và hướng dẫn cơ bản để bắt đầu.

---

## Mục lục

| # | Dịch vụ | Mô tả ngắn |
|---|---------|------------|
| 01 | [EC2 (Amazon Elastic Compute Cloud)](1. EC2/1. Amazon EC2.md) | Máy chủ ảo (Virtual Server) |
| 02 | [IAM (Identity & Access Management)](2. IAM/1. Amazon IAM.md) | Quản lý định danh & quyền truy cập (IAM) |
| 03 | [S3 (Amazon Simple Storage Service)](3. S3/1. Amazon S3.md) | Lưu trữ đối tượng (Object Storage) |
| 04 | [ELB & Auto Scaling (Cân bằng tải & Co giãn)](4. ELB & Auto Scaling/1. Amazon ELB.md) | Bộ cân bằng tải và Co giãn tự động (ELB & ASG) |
| 05 | [RDS (Relational Database Service)](5. RDS/1. Amazon RDS Overview.md) | Cơ sở dữ liệu quan hệ được quản lý (Managed SQL Database) |
| 06 | [DynamoDB (Amazon DynamoDB)](6. DynamoDB/1. Amazon DynamoDB Overview.md) | Cơ sở dữ liệu NoSQL được quản lý (Managed NoSQL Database) |
| 07 | [EKS (Elastic Kubernetes Service)](7. EKS.md) | Dịch vụ Kubernetes được quản lý (Managed Kubernetes) |
| 08 | [ECS (Elastic Container Service)](8. ECS.md) | Điều phối container (Container Orchestration) |
| 09 | [ECR (Elastic Container Registry)](9. ECR.md) | Kho lưu trữ Docker image (Docker Registry) |
| 10 | [VPC (Virtual Private Cloud)](10. VPC.md) | Mạng ảo dùng riêng (Virtual Private Cloud) |
| 11 | [CodePipeline / CodeBuild / CodeDeploy](11. CodePipeline.md) | Bộ dịch vụ CI/CD nguyên bản của AWS (Pipeline) |
| 12 | [Route 53](12. Route 53.md) | Hệ thống phân giải tên miền (DNS) |
| 13 | [CloudFront](13. CloudFront.md) | Mạng phân phối nội dung (CDN) |
| 14 | [ACM (Certificate Manager)](14. ACM.md) | Quản lý chứng chỉ bảo mật TLS/SSL (ACM) |
| 15 | [EFS (Elastic File System)](15. EFS.md) | Hệ thống tệp lưu trữ dùng chung (Shared Storage) |

---

## Lưu ý chung

- Tất cả các dịch vụ trên nên được cấu hình bằng IaC (Terraform, CloudFormation) để đảm bảo tính tái sử dụng và đồng bộ.
- Không commit AWS Access Key, Secret Key, hoặc bất kỳ thông tin xác thực nào vào repository.
- Ưu tiên sử dụng IAM Role thay vì Access Key khi có thể.
- Tham khảo thư mục `cloud/aws/deploy/` để xem các deploy template tích hợp với các dịch vụ này.
