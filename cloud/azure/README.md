# Azure Templates

Thu muc nay chua cac tai nguyen lien quan den Microsoft Azure cho DevOps.

## Cau truc

```text
azure/
├── services/        # Gioi thieu cac dich vu Azure + huong dan su dung
│   └── README.md
├── deploy/          # Cau hinh deploy len Azure
│   └── README.md
└── README.md        # (file nay)
```

| Folder | Mo ta | Khi nao vao? |
| --- | --- | --- |
| `services/` | Giai thich tung dich vu Azure la gi, khi nao dung, cach bat dau | "Toi chua biet AKS/ACR la gi" |
| `deploy/` | Cau hinh va huong dan deploy ung dung len Azure | "Toi can file config deploy len AKS/ACR" |

## Cac dich vu Azure chinh

| Nhom | Dich vu | Mo ta ngan |
| --- | --- | --- |
| Compute | AKS | Managed Kubernetes |
| Compute | ACI | Serverless containers |
| Registry | ACR | Docker image registry |
| Database | Azure SQL | Managed relational database |
| Storage | Blob Storage | Object storage |
| Network | VNet | Virtual network |
| Security | Azure AD / Managed Identity | Identity management |
| CI/CD | Azure DevOps Pipelines | Native Azure CI/CD |
| DNS | Azure DNS | Domain name service |
| CDN | Azure CDN | Content delivery network |
| Secrets | Key Vault | Secrets & certificates |
| LB | Azure Front Door | Global load balancer + CDN |

## Luu y

- Khong commit Client Secret, Tenant ID hoac bat ky thong tin xac thuc nao.
- Uu tien su dung Managed Identity thay vi Service Principal key.
- Tat ca template nen su dung bien (variable) cho subscription ID, resource group, region.
- Co the su dung ARM template, Bicep hoac Terraform tuy theo team preference.
