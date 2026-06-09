# AWS Templates

Thu muc nay chua cac tai nguyen lien quan den Amazon Web Services (AWS) cho DevOps.

## Cau truc

```text
aws/
├── services/        # Gioi thieu cac dich vu AWS + huong dan su dung
│   └── README.md
├── deploy/          # Cau hinh deploy len AWS
│   └── README.md
├── templates/       # Mau cau hinh JSON/YAML cho cac dich vu (S3, IAM)
└── README.md        # (file nay)
```

| Folder | Mo ta | Khi nao vao? |
| --- | --- | --- |
| `services/` | Giai thich tung dich vu AWS la gi, khi nao dung, cach bat dau | "Toi chua biet EKS/ECS/ECR la gi" |
| `deploy/` | Cau hinh va huong dan deploy ung dung len AWS | "Toi can file config deploy len EKS/ECR" |
| `templates/` | Mẫu cấu hình JSON/YAML phục vụ phân quyền và quản lý tài nguyên | "Toi can tim cac file JSON mau cho S3 Bucket Policy hoac IAM Policy" |

## Cac dich vu AWS chinh

| Nhom | Dich vu | Mo ta ngan |
| --- | --- | --- |
| Compute | EKS | Managed Kubernetes |
| Compute | ECS | Container orchestration |
| Compute | Auto Scaling | Tu dong co gian he thong |
| Registry | ECR | Docker image registry |
| Database | RDS | Managed relational database |
| Storage | S3 | Object storage |
| Storage | EFS | Shared file system |
| Network | VPC | Virtual private network |
| Network | ELB | Elastic load balancer |
| Security | IAM | Identity & access management |
| TLS | ACM | Certificate manager |
| CI/CD | CodePipeline | Native AWS CI/CD |
| DNS | Route 53 | Domain name service |
| CDN | CloudFront | Content delivery network |

## Luu y

- Khong commit AWS Access Key, Secret Key, hoac bat ky thong tin xac thuc nao.
- Uu tien su dung Terraform module hoac CloudFormation de tai su dung.
- Tat ca template nen su dung bien (variable) cho region, account ID, ten resource.
