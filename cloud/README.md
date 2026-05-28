# Cloud Provider Templates

Thu muc nay duoc chuan bi de chua cac template lien quan den cloud provider. Muc tieu la cung cap cac file IaC (Infrastructure as Code), cau hinh managed Kubernetes, va tich hop CI/CD tren cloud de cac team co the tai su dung nhanh chong.

## Noi dung du kien

- **IaC (Infrastructure as Code)**: Terraform modules, CloudFormation stacks, Pulumi programs de khoi tao ha tang tren cloud.
- **Managed Kubernetes**: Cau hinh cho EKS (AWS), GKE (GCP), AKS (Azure) — bao gom cluster setup, node pool, autoscaling, va RBAC.
- **Cloud CI/CD Integrations**: Template cho AWS CodePipeline, GCP Cloud Build, Azure DevOps Pipelines va cac dich vu tuong tu.
- **Container Registry**: Cau hinh ECR (AWS), Artifact Registry (GCP), ACR (Azure).
- **Managed Database**: Template cho RDS, Cloud SQL, Azure SQL, bao gom backup va networking.
- **IAM & Security**: Cau hinh role, policy, service account cho tung cloud provider.

## Cau truc khuyen nghi

```text
cloud/
  aws/
    terraform/
      eks/
      ecr/
      rds/
      iam/
      vpc/
    cloudformation/
    codepipeline/
  gcp/
    terraform/
      gke/
      cloud-run/
      cloud-sql/
      artifact-registry/
    cloud-build/
  azure/
    terraform/
      aks/
      acr/
      azure-sql/
    azure-devops/
```

## Quy tac dat ten

Tuong tu nhu phan on-premise, moi template nen co ten mo ta ro:

- Tool hoac service: `eks`, `gke`, `aks`, `rds`, `cloud-sql`
- Kieu cau hinh: `cluster`, `node-pool`, `vpc`, `iam-role`
- Bien the hoac kich ban: `single-az`, `multi-az`, `ha`, `spot`

Vi du: `eks-cluster-multi-az.tf`, `gke-autopilot-standard.tf`

## Khac biet so voi on-premise

| Tieu chi | On-Premise | Cloud |
| --- | --- | --- |
| Ha tang | Tu quan ly server vat ly, VM, mang noi bo | Cloud provider quan ly (IaaS/PaaS) |
| Kubernetes | Cai dat thu cong bang kubeadm, Rancher | Managed K8s: EKS, GKE, AKS |
| Container Registry | Harbor, Private Registry TLS | ECR, Artifact Registry, ACR |
| Load Balancer | Nginx reverse proxy, NodePort | Cloud LB (ALB, NLB, Cloud Load Balancing) |
| Storage | NFS Server tu cai dat | EBS, EFS, Cloud Filestore, Azure Disk |
| CI/CD | Jenkins, GitLab Runner tu host | CodePipeline, Cloud Build, Azure Pipelines |
| Networking | Cau hinh manual firewall, iptables | VPC, Security Group, Firewall Rules |
| Scaling | HPA + them node thu cong | HPA + Cluster Autoscaler / Node Auto-provisioning |

## Cach them template moi

1. Chon dung cloud provider (`aws/`, `gcp/`, `azure/`).
2. Phan loai theo tool IaC (terraform, cloudformation) hoac dich vu (codepipeline, cloud-build).
3. Dat ten file mo ta ro service, kieu cau hinh va bien the.
4. Them README trong thu muc template de giai thich cach su dung, bien can thay doi, va cac buoc tien quyet.
5. Khong commit secret, access key, account ID cu the, hoac thong tin nay cam.
