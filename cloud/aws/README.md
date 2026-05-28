# AWS Templates

Thu muc nay se chua cac template IaC va cau hinh lien quan den Amazon Web Services (AWS).

## Cac dich vu du kien

### Compute & Container

- **EKS (Elastic Kubernetes Service)**: Cluster setup, node group, Fargate profile, IRSA (IAM Roles for Service Accounts).
- **ECS (Elastic Container Service)**: Task definition, service, Fargate launch type.
- **ECR (Elastic Container Registry)**: Repository, lifecycle policy, image scanning.

### Database & Storage

- **RDS (Relational Database Service)**: Instance, subnet group, parameter group, automated backup.
- **S3 (Simple Storage Service)**: Bucket, policy, lifecycle rule, static website hosting.
- **EFS (Elastic File System)**: File system, mount target, access point.

### Networking & Security

- **VPC**: Subnet, route table, NAT gateway, internet gateway.
- **Security Group**: Ingress/egress rule cho tung dich vu.
- **IAM**: Role, policy, user, group, service-linked role.
- **ACM (Certificate Manager)**: TLS certificate cho domain.

### CI/CD

- **CodePipeline**: Pipeline, stage, action — tich hop voi CodeBuild va CodeDeploy.
- **CodeBuild**: Build project, buildspec.yml template.
- **CodeDeploy**: Deployment group, appspec.yml template.

## Cau truc khuyen nghi

```text
aws/
  terraform/
    eks/
    ecr/
    ecs/
    rds/
    s3/
    vpc/
    iam/
  cloudformation/
  codepipeline/
```

## Luu y

- Tat ca template nen su dung bien (variable) cho region, account ID, ten resource de co the tai su dung cho nhieu project.
- Khong commit AWS Access Key, Secret Key, hoac bat ky thong tin xac thuc nao.
- Uu tien su dung Terraform module de tai su dung va chia se giua cac team.
