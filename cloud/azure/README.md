# Azure Templates

Thu muc nay se chua cac template IaC va cau hinh lien quan den Microsoft Azure.

## Cac dich vu du kien

### Compute & Container

- **AKS (Azure Kubernetes Service)**: Cluster, node pool, managed identity, Azure CNI, autoscaler.
- **Azure Container Instances (ACI)**: Container group (truong hop don gian, khong can K8s).
- **ACR (Azure Container Registry)**: Registry, repository, task (automated build), geo-replication.

### Database & Storage

- **Azure SQL Database**: Server, database, firewall rule, elastic pool.
- **Azure Database for MySQL / PostgreSQL**: Flexible server, configuration.
- **Azure Blob Storage**: Storage account, container, lifecycle management, SAS token.
- **Azure Files**: File share, mount cho AKS persistent volume.

### Networking & Security

- **Virtual Network (VNet)**: Subnet, NSG (Network Security Group), peering.
- **Azure Load Balancer / Application Gateway**: Frontend IP, backend pool, rule.
- **Azure AD & RBAC**: Managed identity, role assignment, service principal.
- **Key Vault**: Secret, certificate, access policy.

### CI/CD

- **Azure DevOps Pipelines**: azure-pipelines.yml template, stage, job, task.
- **Azure DevOps Releases**: Release pipeline, environment, approval gate.
- **GitHub Actions + Azure**: Action de login, deploy len AKS, push len ACR.

## Cau truc khuyen nghi

```text
azure/
  terraform/
    aks/
    acr/
    azure-sql/
    blob-storage/
    vnet/
    iam/
    key-vault/
  azure-devops/
  arm-templates/
```

## Luu y

- Su dung bien (variable) cho subscription ID, resource group, region, ten resource de co the tai su dung.
- Khong commit client secret, tenant ID thuc te, hoac bat ky thong tin xac thuc nao.
- Uu tien Managed Identity thay vi service principal voi client secret khi chay tren Azure.
- Co the su dung ARM Templates hoac Bicep ben canh Terraform tuy theo quy uoc cua team.
