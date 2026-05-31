# Cloud Templates

Thu muc nay chua cac tai nguyen DevOps cho cac nha cung cap Cloud (AWS, GCP, Azure).

## Cau truc

```text
cloud/
├── aws/
│   ├── services/        # Dich vu AWS la gi + huong dan
│   ├── deploy/          # Cau hinh deploy len AWS
│   └── README.md
├── gcp/
│   ├── services/        # Dich vu GCP la gi + huong dan
│   ├── deploy/          # Cau hinh deploy len GCP
│   └── README.md
├── azure/
│   ├── services/        # Dich vu Azure la gi + huong dan
│   ├── deploy/          # Cau hinh deploy len Azure
│   └── README.md
└── README.md            # (file nay)
```

## Giai thich 2 folder con

| Folder | Mo ta | Khi nao vao? |
| --- | --- | --- |
| `services/` | Gioi thieu tung dich vu cloud: no la gi, khi nao dung, cach bat dau | Nguoi moi muon hieu dich vu cloud |
| `deploy/` | Cau hinh va huong dan deploy ung dung len cloud | Can file config/template deploy len cloud |

## So sanh voi on-premise

| | On-Premise | Cloud |
| --- | --- | --- |
| Kubernetes | Tu cai K8s (kubeadm) | Managed: EKS / GKE / AKS |
| Registry | Harbor / Private Registry | ECR / Artifact Registry / ACR |
| Database | Tu cai MariaDB / MySQL | RDS / Cloud SQL / Azure SQL |
| Storage | NFS Server | S3 / GCS / Blob Storage |
| Load Balancer | Nginx reverse proxy | Cloud Load Balancer |
| CI/CD | GitLab CI / Jenkins (self-hosted) | CodePipeline / Cloud Build / Azure DevOps |

## Luu y chung

- **Khong commit** secret, access key, service account key, hoac bat ky thong tin xac thuc nao.
- Su dung **bien moi truong** hoac **secret manager** cho cac gia tri nhay cam.
- Uu tien **IAM Role / Workload Identity / Managed Identity** thay vi static key.
