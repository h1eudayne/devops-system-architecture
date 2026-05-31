# GCP Templates

Thu muc nay chua cac tai nguyen lien quan den Google Cloud Platform (GCP) cho DevOps.

## Cau truc

```text
gcp/
├── services/        # Gioi thieu cac dich vu GCP + huong dan su dung
│   └── README.md
├── deploy/          # Cau hinh deploy len GCP
│   └── README.md
└── README.md        # (file nay)
```

| Folder | Mo ta | Khi nao vao? |
| --- | --- | --- |
| `services/` | Giai thich tung dich vu GCP la gi, khi nao dung, cach bat dau | "Toi chua biet GKE/Cloud Run la gi" |
| `deploy/` | Cau hinh va huong dan deploy ung dung len GCP | "Toi can file config deploy len GKE/Cloud Run" |

## Cac dich vu GCP chinh

| Nhom | Dich vu | Mo ta ngan |
| --- | --- | --- |
| Compute | GKE | Managed Kubernetes (Standard & Autopilot) |
| Compute | Cloud Run | Serverless containers |
| Registry | Artifact Registry | Container & package registry |
| Database | Cloud SQL | Managed relational database |
| Storage | Cloud Storage | Object storage (GCS buckets) |
| Network | VPC | Virtual private network |
| Security | IAM & Workload Identity | Identity management |
| CI/CD | Cloud Build / Cloud Deploy | Native GCP CI/CD |
| DNS | Cloud DNS | Domain name service |
| CDN | Cloud CDN | Content delivery network |
| LB | Cloud Load Balancing | Load balancer |
| Secrets | Secret Manager | Secrets management |

## Luu y

- Khong commit Service Account key JSON hoac bat ky thong tin xac thuc nao.
- Uu tien su dung Workload Identity thay vi export key file.
- Tat ca template nen su dung bien (variable) cho project ID, region, ten resource.
