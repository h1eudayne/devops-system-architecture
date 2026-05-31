# DevOps CI/CD Templates & On-Premise Infrastructure

Repository nay tap trung luu tru va tai su dung toan bo tai nguyen DevOps da duoc chuan hoa: pipeline CI/CD, Kubernetes manifest, Dockerfile, Docker Compose stack, bash script cai dat, huong dan setup ha tang on-premise va cau hinh Nginx.

## Muc tieu

- **To chuc ro rang**: tach biet `on-premise` (ha tang tu quan), `cloud` (nha cung cap), `pipelines` (CI/CD) va `dockerfiles` (image build).
- **De tim, de copy, de mo rong**: moi tai nguyen dat dung vi tri theo chuc nang va nen tang.
- **Tach ro CI / CD / CD**: `continuous integration`, `continuous delivery` va `continuous deployment` duoc phan loai rieng biet.
- **Chuan hoa ten file**: tat ca template deu tuan theo quy tac dat ten thong nhat.
- **San sang cho cloud**: cau truc `cloud/` san sang mo rong khi can trien khai tren AWS, GCP, Azure.

## Cau truc tong quan

```text
.
├── on-premise/              # Ha tang on-premise tu quan ly
│   ├── setup/               # Huong dan cai dat tung buoc
│   ├── workflow/            # Quy trinh van hanh
│   ├── scripts/             # Bash scripts cai dat tu dong
│   ├── kubernetes/          # K8s manifest templates
│   ├── docker-compose/      # Docker Compose stacks
│   └── nginx/               # Nginx config templates
├── cloud/                   # Cloud providers (placeholder)
│   ├── aws/
│   ├── gcp/
│   └── azure/
├── pipelines/               # CI/CD Pipeline templates
│   ├── gitlab-ci/
│   ├── github-actions/
│   └── jenkins/
├── dockerfiles/             # Dockerfile templates
│   ├── backend/
│   └── frontend/
├── docs/                    # Tai lieu bo sung
│   ├── REPO-STRUCTURE.md
│   ├── TEMPLATE-GUIDELINES.md
│   └── k8s/
├── catalog/
│   └── templates.yml        # Danh muc template YAML
└── .gitignore
```

## Giai thich tung folder

### Cap goc (root level)

| Folder | Mo ta |
| --- | --- |
| `on-premise/` |  Toan bo tai nguyen lien quan ha tang on-premise: huong dan, script, manifest K8s, Docker Compose, Nginx |
| `cloud/` |  Placeholder cho cac cloud provider (AWS, GCP, Azure) - san sang mo rong |
| `pipelines/` |  Pipeline templates cho GitLab CI, GitHub Actions, Jenkins - phan loai theo delivery model |
| `dockerfiles/` |  Dockerfile mau cho backend (Java) va frontend (Angular, VueJS) |
| `docs/` |  Tai lieu bo sung: cau truc repo, quy tac viet template, tham khao K8s |
| `catalog/` |  File `templates.yml` liet ke danh muc tat ca template hien co |

### Ben trong `on-premise/`

| Folder | Mo ta |
| --- | --- |
| `setup/` |  Huong dan cai dat chi tiet (markdown) cho Docker, K8s, Jenkins, Harbor, Rancher, MySQL, NFS |
| `workflow/` |  Quy trinh van hanh thuc te, vi du: import du lieu SQL qua NFS tren K8s |
| `scripts/` |  Bash script tu dong hoa cai dat: Docker, K8s cluster, Helm, Ingress Nginx, Metrics Server, NFS, Harbor, Rancher, Jenkins, Storage |
| `kubernetes/` |  K8s YAML manifest templates: Namespace, Pod, Deployment, Service, Ingress, ConfigMap, Secret, HPA, Storage, StatefulSet, Redis, Full-stack, Load Balancer |
| `docker-compose/` |  Docker Compose stack mau: backend + MariaDB, private registry TLS, Rancher |
| `nginx/` |  Nginx config: reverse proxy, SPA, load balancer |

### Ben trong `pipelines/`

| Folder | Mo ta |
| --- | --- |
| `gitlab-ci/` | Pipeline `.gitlab-ci.yml` cho GitLab, phan theo CI / CD / CD |
| `github-actions/` | Workflow `.yml` cho GitHub Actions (placeholder) |
| `jenkins/` | Jenkinsfile va Groovy scripts cho Jenkins pipeline |

### Ben trong `dockerfiles/`

| Folder | Mo ta |
| --- | --- |
| `backend/java/` | Dockerfile mau cho Java backend (OpenJDK 8, Temurin 17) |
| `frontend/angular/` | Dockerfile + Nginx config cho Angular SPA |
| `frontend/vuejs/` | Dockerfile cho VueJS SPA |

## Quy tac dat ten pipeline

Mau duong dan:

```text
pipelines/<provider>/<delivery-model>/<language>/<scenario>.yml
```

Vi du:

- `pipelines/gitlab-ci/continuous-integration/java/maven-test.yml`
- `pipelines/gitlab-ci/continuous-deployment/java/maven-jar-server-tag.yml`
- `pipelines/jenkins/continuous-delivery/java/maven-jar-linux-delivery.Jenkinsfile`

## Cach phan loai pipeline

| Delivery Model | Mo ta |
| --- | --- |
| `continuous-integration` | Build, test, lint, scan, package. Khong thay doi moi truong dich. |
| `continuous-delivery` | Tao artifact san sang deploy toi staging/UAT/prod nhung con **manual gate** (can approve thu cong). |
| `continuous-deployment` | Sau khi pipeline qua dieu kien, he thong **tu dong deploy** thang toi moi truong dich ma khong can approve. |

Phan `scenario` nen mo ta du 4 y:

1. **Build tool / artifact**: `maven`, `npm`, `poetry`, `docker`
2. **Kieu package / deploy style**: `jar`, `image`, `helm`, `static`
3. **Dich den**: `server`, `k8s`, `ecs`, `ecr`, `gcr`
4. **Dieu kien kich hoat / bien the**: `tag`, `main`, `mr`, `manual`, `blue-green`

---

## Danh muc hien co

### Pipeline Templates

| Provider | Delivery Model | Language | Scenario | File |
| --- | --- | --- | --- | --- |
| GitLab CI | Continuous Deployment | Java | Maven build + deploy server on tag | `pipelines/gitlab-ci/continuous-deployment/java/maven-jar-server-tag.yml` |
| GitLab CI | Continuous Deployment | React | NPM build + static deploy server on tag | `pipelines/gitlab-ci/continuous-deployment/react/npm-static-server-tag.yml` |
| GitLab CI | Continuous Delivery | React | NPM build + manual static deploy server on tag | `pipelines/gitlab-ci/continuous-delivery/react/npm-static-server-tag-manual.yml` |
| GitLab CI | Continuous Delivery | Docker | Docker build + push registry + manual deploy on tag | `pipelines/gitlab-ci/continuous-delivery/docker/docker-image-server-tag-manual.yml` |
| GitLab CI | Continuous Delivery | Java | Maven build + manual deploy server on tag | `pipelines/gitlab-ci/continuous-delivery/java/maven-jar-server-tag.yml` |
| Jenkins | Continuous Delivery | Java | Maven JAR + Linux server delivery | `pipelines/jenkins/continuous-delivery/java/maven-jar-linux-delivery.Jenkinsfile` |
| Jenkins | Continuous Delivery | Java | Maven JAR + Linux ops delivery | `pipelines/jenkins/continuous-delivery/java/maven-jar-linux-ops-delivery.Jenkinsfile` |
| Jenkins | Continuous Deployment | Java | Maven JAR + Linux server deploy | `pipelines/jenkins/continuous-deployment/java/maven-jar-linux-deploy.Jenkinsfile` |

### Kubernetes Manifest Templates

> Tat ca file nam trong `on-premise/kubernetes/`

| Nhom | Template | Mo ta | File |
| --- | --- | --- | --- |
| Namespace | namespace | Tao namespace moi | `namespace.yml.example` |
| Pod | pod | Pod don gian | `pod.yml.example` |
| Pod | pod-nfs | Pod voi NFS volume mount | `pod-nfs.yml.example` |
| Deployment | deployment-recreate | Strategy Recreate (xoa het roi tao lai) | `deployment/deployment-recreate.yml.example` |
| Deployment | deployment-rolling | Strategy RollingUpdate (cap nhat lan luot) | `deployment/deployment-rolling.yml.example` |
| Deployment | ecommerce-backend | Deployment mau cho ecommerce backend | `deployment/ecommerce-backend-deployment.yml.example` |
| Service | service-nodeport | Service kieu NodePort | `service/service-nodeport.yml.example` |
| Service | mariadb-service | Service cho MariaDB | `service/mariadb-service.yml.example` |
| Ingress | ingress-car-serv | Ingress Nginx cho du an car-serv (domain h1eudayne.tech) | `ingress/ingress-car-serv.yml.example` |
| Ingress | uptime-ingress | Ingress cho Uptime Kuma (domain uptime.devops.hieuduyne.tech) | `uptime-kuma/ingress.yml.example` |
| ConfigMap | configmap-spring | ConfigMap cho Spring Boot properties | `configmap/configmap-spring-properties.yml.example` |
| Secret | database | Secret cho database connection | `secret/database/ecommerce-backend-database-connection.yml` |
| Secret | harbor | Secret cho Harbor registry auth | `secret/harbor/harbor-registry-auth.yml.example` |
| HPA | hpa | HorizontalPodAutoscaler autoscaling/v2 theo CPU va Memory | `hpa/hpa.yml.example` |
| Storage | storageclass | StorageClass NFS voi no-provisioner | `storage/storageclass.yml.example` |
| Storage | pv | PersistentVolume NFS thu cong | `storage/pv.yml.example` |
| Storage | pvc | PersistentVolumeClaim NFS | `storage/pvc.yml.example` |
| Storage | redis-pv-pvc | PV va PVC NFS cho Redis | `storage/redis-pv-pvc.yml.example` |
| Storage | uptime-kuma-pv-pvc | PV va PVC NFS cho Uptime Kuma | `storage/uptime-kuma-pv-pvc.yml.example` |
| StatefulSet | mariadb | MariaDB StatefulSet | `statefulset/mariadb-statefulset.yml.example` |
| Resource Limit | deployment-limit | Deployment voi resource request va limit | `resource-limit/deployment-with-resource-limit.yml.example` |
| Redis | values | Helm values.yaml cho Redis Replication + Sentinel | `redis/values.yml.example` |
| Uptime Kuma | values | Helm values.yaml cho Uptime Kuma su dung existing PVC | `uptime-kuma/values.yml.example` |
| Full-Stack | fullstack | Deployment (RollingUpdate) + Service (ClusterIP) + Ingress trong 1 file | `full-stack/fullstack-rolling-clusterip-ingress.yml.example` |
| Load Balancer | nginx-lb | Nginx config phan phoi traffic den K8s node qua NodePort 30080 | `load-balancer/nginx/k8s-loadbalancer.conf` |

### On-Premise Setup Guides

> Tat ca file nam trong `on-premise/setup/`

| Nhom | Mo ta | File |
| --- | --- | --- |
| Docker | Huong dan cai dat Docker Engine va Docker Compose | `docker/install-docker-guide.md` |
| Kubernetes | Huong dan dung cum K8s (master + worker) | `kubernetes/setup-cluster-guide.md` |
| Kubernetes | Huong dan cai dat va cau hinh HPA (Metrics Server, Rancher fix) | `kubernetes/setup-hpa-guide.md` |
| Kubernetes | Huong dan trien khai NFS tren K8s (kien truc, luu do, buoc thuc hien) | `kubernetes/setup-nfs-guide.md` |
| Kubernetes | Huong dan trien khai database MariaDB tren K8s qua StatefulSet + NFS | `kubernetes/setup-db-nfs-guide.md` |
| Kubernetes | Huong dan trien khai Redis Sentinel HA tren K8s (NFS, PV/PVC, Helm) | `kubernetes/setup-redis-sentinel-guide.md` |
| Kubernetes | Huong dan cai dat Metrics Server tren K8s | `kubernetes/metrics-server-guide.md` |
| Kubernetes | Huong dan cai dat Helm (K8s Package Manager) | `kubernetes/install-helm-guide.md` |
| Kubernetes | Huong dan cai dat Ingress Nginx Controller | `kubernetes/install-ingress-nginx-guide.md` |
| Kubernetes | Huong dan cai dat Velero CLI Client | `kubernetes/install-velero-client-guide.md` |
| Kubernetes | Huong dan cau hinh Velero sao luu k8s ket hop MinIO | `kubernetes/setup-velero-minio-backup.md` |
| Jenkins | Huong dan cai dat Jenkins tren Ubuntu | `jenkins/install-jenkins-guide.md` |
| Jenkins | Huong dan cau hinh Nginx reverse proxy cho Jenkins | `jenkins/reverse-proxy-guide.md` |
| Harbor | Huong dan cai dat Harbor (container registry) | `harbor/install-harbor-guide.md` |
| Rancher | Huong dan cai dat Rancher (K8s management UI) | `rancher/install-rancher-guide.md` |
| MySQL | Huong dan cai dat MySQL Server, tao database va user | `mysql/install-mysql-guide.md` |
| NFS | Huong dan cai dat va cau hinh NFS Server | `nfs/nfs-server-guide.md` |
| NFS | Huong dan cai dat NFS Client va kiem tra ket noi | `nfs/nfs-client-guide.md` |
| Monitoring | Huong dan trien khai Uptime Kuma (PV/PVC, Helm, Ingress, HostAlias) | `monitoring/setup-uptime-kuma-guide.md` |
| Monitoring | Huong dan trien khai Kube Prometheus Stack (Prometheus + Grafana) | `monitoring/setup-kube-prometheus-guide.md` |

### Cloud Infrastructure & Deployment Guides (AWS)

> Cac tai lieu kien thuc va lab thuc hanh nam trong `cloud/aws/`

| Nhom | Loai | Mo ta | File |
| --- | --- | --- | --- |
| EC2 | Ly thuyet | So sanh EC2 voi PC/Laptop vat ly, AMI, EBS, Instance Type | `cloud/aws/services/1. EC2/1. Amazon EC2.md` |
| EC2 | Ly thuyet | Vong doi EC2 (EBS & Instance Store-backed) va cach tinh phi | `cloud/aws/services/1. EC2/2. Amazon EC2 Lifecycle.md` |
| EC2 | Ly thuyet | Tuong lua ao Security Group, co che Stateful | `cloud/aws/services/1. EC2/3. Amazon EC2 Security Group.md` |
| EC2 | Ly thuyet | Cau hinh User Data tu dong hoa va Metadata IMDSv2 | `cloud/aws/services/1. EC2/6. Amazon EC2 User Data and Metadata.md` |
| EC2 | Ly thuyet | Cac truong hop su dung pho bien (Lift & Shift, K8s Workers, DB) | `cloud/aws/services/1. EC2/8. Amazon EC2 Use Cases.md` |
| Storage | Ly thuyet | Chi tiet EBS block storage va 5 phan loai volume | `cloud/aws/services/1. EC2/9. Amazon EBS.md` |
| EC2 | Thuc hanh | Tao instance Linux, SSH, cai Apache, Snapshot va AMI | `cloud/aws/deploy/1. Amazon EC2 Hands-on Lab(Linux).md` |
| EC2 | Thuc hanh | Tao Windows instance, RDP port 3389, giai ma mat khau Admin | `cloud/aws/deploy/2. Amazon EC2 Hands-on Lab(Windows).md` |
| EC2 | Thuc hanh | Tu dong hoa cai Apache qua User Data va lay IP qua IMDSv2 | `cloud/aws/deploy/3. Amazon EC2 User Data and Metadata Lab.md` |
| Storage | Thuc hanh | Tao, gan va online/format EBS volume tren Windows Server | `cloud/aws/deploy/4. Amazon EC2 Hands-on Lab(Windows Volume).md` |
| Storage | Thuc hanh | Tao, gan, XFS format, auto-mount fstab, extend volume online tren Linux | `cloud/aws/deploy/5. Amazon EC2 Hands-on Lab(Linux Volume).md` |
| Security | Thuc hanh | Tao user dev01, cau hinh chmod .ssh (700) va authorized_keys (600) | `cloud/aws/deploy/6. Amazon EC2 Hands-on Lab(Add Member SSH).md` |


### On-Premise Scripts

> Tat ca file nam trong `on-premise/scripts/`

| Nhom | Mo ta | File |
| --- | --- | --- |
| Docker | Cai Docker Engine + standalone Docker Compose | `docker/install-docker-and-compose.sh.example` |
| Docker | Cai Jenkins bang apt repository + Java 21 | `docker/install-jenkins.sh.example` |
| Kubernetes | Chuan bi tat ca node: hosts, swap, kernel module, containerd, kubeadm v1.30 | `kubernetes/01-prepare-all-nodes.sh.example` |
| Kubernetes | Khoi tao cum 1 master + 2 worker voi Calico CNI | `kubernetes/02-init-single-master.sh.example` |
| Kubernetes | Khoi tao cum 3 master HA voi control-plane-endpoint | `kubernetes/03-init-ha-master.sh.example` |
| Kubernetes | Join worker node vao cum K8s | `kubernetes/04-join-worker.sh.example` |
| Kubernetes | Join control-plane bo sung vao cum HA | `kubernetes/05-join-control-plane.sh.example` |
| Kubernetes | Reset cum K8s de cai lai tu dau | `kubernetes/06-reset-cluster.sh.example` |
| Helm | Cai dat Helm v3.16.2 | `helm/01-install-helm.sh.example` |
| Ingress Nginx | Tai chart, chinh values.yaml sang NodePort 30080/30443 | `ingress-nginx/01-prepare-ingress-nginx.sh.example` |
| Ingress Nginx | Tao namespace va deploy Ingress Nginx Controller qua Helm | `ingress-nginx/02-deploy-ingress-nginx.sh.example` |
| Metrics Server | Cai dat Metrics Server bang Helm (ho tro bo qua TLS tu ky) | `metrics-server/install-metrics-server.sh.example` |
| NFS | Cai dat nfs-kernel-server va tao thu muc chia se | `nfs/install-nfs-server.sh.example` |
| NFS | Cai dat nfs-common va kiem tra ket noi cong 2049 | `nfs/install-nfs-client.sh.example` |
| Harbor | Cai Harbor offline, xin TLS bang Certbot, chay prepare/install | `harbor/install-harbor.sh.example` |
| Rancher | Cai dat Rancher (K8s management) | `rancher/install-rancher.sh.example` |
| Jenkins | Cai dat Jenkins server | `jenkins/install-jenkins.sh.example` |
| Jenkins | Systemd service file cho Jenkins Agent | `jenkins/jenkins-agent.service.example` |
| Storage | Mount disk vao he thong | `storage/mount-disk.sh.example` |
| Uptime Kuma | Script tu dong cai dat Uptime Kuma (Namespace, PV, PVC, Helm, Ingress) | `kubernetes/uptime-kuma/setup-uptime-kuma.sh.example` |

### Dockerfile Templates

> Tat ca file nam trong `dockerfiles/`

| Nhom | Ngon ngu | Mo ta | File |
| --- | --- | --- | --- |
| Backend | Java | Dockerfile mau co ban | `backend/java/Dockerfile.example` |
| Backend | Java | Multi-stage Maven build, JAR + OpenJDK 8 Alpine runtime | `backend/java/maven-jar-openjdk8-jre-alpine.Dockerfile.example` |
| Backend | Java | Multi-stage Maven build, JAR + Eclipse Temurin 17 Alpine runtime | `backend/java/maven-jar-temurin17-jre-alpine.Dockerfile.example` |
| Frontend | Angular | Multi-stage npm build, copy dist sang Nginx Alpine | `frontend/angular/npm-dist-nginx-alpine.Dockerfile.example` |
| Frontend | Angular | Dockerfile shared variant (nhieu app dung chung) | `frontend/angular/npm-dist-nginx-alpine-shared.Dockerfile.example` |
| Frontend | Angular | Nginx config tuong ung cho Angular SPA | `frontend/angular/nginx.conf.example` |
| Frontend | VueJS | Multi-stage npm build, copy dist sang Nginx Alpine | `frontend/vuejs/npm-dist-nginx-alpine.Dockerfile.example` |

### Docker Compose Templates

> Tat ca file nam trong `on-premise/docker-compose/`

| Nhom | Mo ta | File |
| --- | --- | --- |
| Backend + MariaDB | Docker Compose stack cho backend image + MariaDB voi bien moi truong | `backend-mariadb/docker-compose.yml.example` |
| Private Registry | Private registry voi TLS self-signed certificate | `private-registry-tls/docker-compose.yml.example` |
| Rancher | Docker Compose stack cho Rancher | `rancher/docker-compose.yml.example` |
| MinIO | Docker Compose stack cho MinIO Object Storage | `minio/docker-compose.yml.example` |



### Nginx Config Templates

> Tat ca file nam trong `on-premise/nginx/`

| Template | Mo ta | File |
| --- | --- | --- |
| React SPA | Nginx config cho React SPA chay tren port 3000 | `react-spa-port-3000.conf` |
| Jenkins Subdomain | Nginx reverse proxy cho Jenkins subdomain | `jenkins-subdomain.conf.example` |

### Workflow

> Tat ca file nam trong `on-premise/workflow/`

| Nhom | Mo ta | File |
| --- | --- | --- |
| Kubernetes | Quy trinh nap du lieu SQL qua NFS va ket noi Backend qua ClusterIP | `kubernetes/k8s-mariadb-nfs-import.md` |

---

## Cach them template moi

1. **Xac dinh vi tri**: chon dung folder goc (`pipelines/`, `dockerfiles/`, `on-premise/`) theo loai tai nguyen.
2. **Dat ten theo quy tac**: tuan theo mau `<build-tool>-<package>-<target>-<trigger>` cho pipeline, hoac ten mo ta ro chuc nang cho manifest/script.
3. **Them vao catalog**: cap nhat mo ta ngan vao `catalog/templates.yml`.
4. **Viet README**: tao file `README.md` trong cung thu muc neu template can giai thich them.
5. **Bao mat**: **KHONG** commit secret, token, host cu the, private key. Dung file `.example` va huong dan nguoi dung tu dien.

## Goi y mo rong

### Pipelines

- Them `pipelines/github-actions/continuous-integration/nodejs/`
- Them `pipelines/github-actions/continuous-delivery/python/`
- Them `pipelines/gitlab-ci/continuous-integration/nodejs/`
- Them `pipelines/gitlab-ci/continuous-deployment/python/`
- Them `pipelines/jenkins/continuous-integration/java/`

### Cloud

- Them `cloud/aws/eks/` - huong dan va script trien khai EKS
- Them `cloud/aws/ecr/` - pipeline push image len ECR
- Them `cloud/gcp/gke/` - huong dan va script trien khai GKE
- Them `cloud/azure/aks/` - huong dan va script trien khai AKS

### On-Premise

- Them `on-premise/setup/monitoring/` - Prometheus, Grafana, Alertmanager
- Them `on-premise/setup/logging/` - EFK/ELK stack
- Them `on-premise/kubernetes/cronjob/` - CronJob templates
- Them `on-premise/kubernetes/network-policy/` - NetworkPolicy templates

### Dockerfiles

- Them `dockerfiles/backend/python/` - Dockerfile cho Python (Flask, Django, FastAPI)
- Them `dockerfiles/backend/nodejs/` - Dockerfile cho Node.js (Express, NestJS)
