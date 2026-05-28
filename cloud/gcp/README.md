# GCP Templates

Thu muc nay se chua cac template IaC va cau hinh lien quan den Google Cloud Platform (GCP).

## Cac dich vu du kien

### Compute & Container

- **GKE (Google Kubernetes Engine)**: Cluster (Standard va Autopilot), node pool, workload identity, network policy.
- **Cloud Run**: Service, revision, traffic splitting, domain mapping.
- **Compute Engine**: Instance template, managed instance group (neu can).

### Database & Storage

- **Cloud SQL**: Instance (MySQL, PostgreSQL), database, user, backup configuration.
- **Cloud Storage**: Bucket, IAM binding, lifecycle rule, CORS config.
- **Filestore**: Instance, NFS mount cho GKE persistent volume.

### Networking & Security

- **VPC**: Subnet, firewall rule, Cloud NAT, Cloud Router.
- **IAM**: Service account, role binding, workload identity federation.
- **Secret Manager**: Secret version, access policy.

### CI/CD & Registry

- **Cloud Build**: cloudbuild.yaml template, trigger, substitution variable.
- **Artifact Registry**: Docker repository, cleanup policy.
- **Cloud Deploy**: Delivery pipeline, target, release.

## Cau truc khuyen nghi

```text
gcp/
  terraform/
    gke/
    cloud-run/
    cloud-sql/
    cloud-storage/
    vpc/
    iam/
    artifact-registry/
  cloud-build/
  cloud-deploy/
```

## Luu y

- Su dung bien (variable) cho project ID, region, zone, ten resource de co the tai su dung.
- Khong commit service account key JSON, OAuth token, hoac bat ky thong tin xac thuc nao.
- Uu tien Workload Identity thay vi export service account key khi chay tren GKE.
