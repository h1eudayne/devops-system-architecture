# Repo Structure

## Nguyen tac to chuc

Repo nay duoc to chuc theo muc dich su dung, tach biet ro rang giua cac moi truong va loai tai nguyen:

1. `on-premise/`
   Chua toan bo tai nguyen lien quan den ha tang on-premise: huong dan cai dat (setup), quy trinh van hanh (workflow), bash scripts, K8s manifests, Docker Compose stacks va Nginx configs.

2. `cloud/`
   Chua cau hinh va tai nguyen cho cac nha cung cap cloud: AWS, GCP, Azure.

3. `pipelines/`
   Chua file pipeline CI/CD thuc te, copy ra la dung duoc sau khi thay bien. Phan chia theo provider (GitLab CI, GitHub Actions, Jenkins).

4. `dockerfiles/`
   Chua cac Dockerfile mau cho backend va frontend, dung lai cho nhieu project.

5. `docs/`
   Chua quy uoc dat ten, cach viet template, checklist review va quy tac bao mat.

6. `catalog/`
   Chua danh muc tra cuu nhanh: template nao danh cho provider nao, ngon ngu nao, case nao.

## Taxonomy khuyen nghi

```text
.
├── roadmap/                        # Lo trinh hoc tap DevOps (Fresher, Advanced & Kubernetes)
│   ├── README.md                   # Muc luc roadmap
│   ├── roadmap-fresher.md          # Lo trinh DevOps Fresher (35 bai)
│   ├── roadmap-kubernetes.md       # Lo trinh Kubernetes (43 bai)
│   └── roadmap-advanced.md         # Lo trinh DevOps Nang cao (tung buoc cap nhat)
├── on-premise/
│   ├── network/                        # Kien truc mang noi bo (On-premise & Cloud)
│   │   ├── README.md                   # Muc luc va gioi thieu
│   │   ├── 01-intranet-network-model.md
│   │   └── 02-environment-initialization-notes.md
│   ├── server/                         # Quan tri may chu & VM template
│   │   ├── README.md                   # Muc luc va gioi thieu
│   │   ├── 03-setup-server-template.md
│   │   └── 04-server-access-management.md
│   ├── setup/                          # Huong dan cai dat theo hoc trinh & cong cu
│   │   ├── 01-linux-server/            # Bai 1-7: Ubuntu, lenh, vim, phan quyen
│   │   ├── 02-manual-deployment/       # Bai 8-10: Trien khai thu cong FE, Java Spring
│   │   ├── 03-gitlab/                  # Bai 11-17, 26: Gitlab server, Gitlab CI/CD
│   │   ├── 04-docker-registry/         # Bai 18-25: Docker runtime, Harbor registry
│   │   ├── 05-jenkins/                 # Bai 27-32: Jenkins CI/CD
│   │   ├── 06-monitoring/              # Bai 33-35: Zabbix, Kube-Prometheus, Uptime Kuma
│   │   ├── certbot/                    # Cau hinh va xin SSL Let's Encrypt
│   │   │   └── README.md
│   │   ├── kubernetes/                 # Huong dan K8s nang cao (da hoan thien)
│   │   ├── mysql/                      # Cau hinh database
│   │   ├── rancher/                    # Cong cu quan ly K8s
│   │   ├── storage/                    # Ha tang luu tru (NFS)
│   │   └── teleport/                   # Setup cong cu quan ly server Teleport
│   │       ├── README.md
│   │       ├── 05-deploy-server-access-management.md
│   │       └── templates/
│   │           ├── teleport.yaml.template
│   │           ├── teleport.service.template
│   │           └── nginx-teleport-lb.conf.template



│   ├── workflow/                       # Quy trinh van hanh
│   │   └── kubernetes/
│   ├── scripts/                        # Bash scripts
│   │   ├── kubernetes/
│   │   ├── metrics-server/
│   │   ├── nfs/
│   │   ├── docker/
│   │   ├── harbor/
│   │   ├── helm/
│   │   ├── ingress-nginx/
│   │   ├── jenkins/
│   │   ├── rancher/
│   │   └── storage/
│   ├── kubernetes/                     # K8s manifests
│   │   ├── full-stack/
│   │   ├── hpa/
│   │   ├── service/
│   │   ├── statefulset/
│   │   ├── storage/
│   │   ├── redis/
│   │   ├── deployment/
│   │   ├── configmap/
│   │   ├── ingress/
│   │   ├── load-balancer/
│   │   ├── resource-limit/
│   │   └── secret/
│   ├── docker-compose/                 # Docker Compose stacks
│   └── nginx/                          # Nginx configs
│       ├── jenkins-subdomain.conf.example
│       ├── react-spa-port-3000.conf
│       └── teleport-lb.conf.template
├── cloud/
│   ├── aws/
│   ├── gcp/
│   ├── azure/
│   └── cloudflare/                     # Dich vu Cloudflare (DNS, Tunnel, WAF)
│       ├── README.md
│       ├── services/
│       │   ├── README.md
│       │   ├── 1. DNS/
│       │   │   └── 1. Cloudflare DNS Management.md
│       │   └── 2. Zero Trust/
│       │       └── 2. Cloudflare Zero Trust Tunnel.md
│       └── deploy/
├── pipelines/
│   ├── gitlab-ci/
│   │   ├── continuous-integration/
│   │   │   ├── java/
│   │   │   ├── nodejs/
│   │   │   ├── python/
│   │   │   ├── dotnet/
│   │   │   ├── go/
│   │   │   ├── php/
│   │   │   └── docker/
│   │   ├── continuous-delivery/
│   │   │   ├── java/
│   │   │   ├── nodejs/
│   │   │   ├── python/
│   │   │   ├── dotnet/
│   │   │   ├── go/
│   │   │   ├── php/
│   │   │   └── docker/
│   │   └── continuous-deployment/
│   │       ├── java/
│   │       ├── nodejs/
│   │       ├── python/
│   │       ├── dotnet/
│   │       ├── go/
│   │       ├── php/
│   │       └── docker/
│   ├── github-actions/
│   │   ├── continuous-integration/
│   │   ├── continuous-delivery/
│   │   └── continuous-deployment/
│   └── jenkins/
│       ├── continuous-integration/
│       ├── continuous-delivery/
│       ├── continuous-deployment/
│       ├── install/
│       └── reverse-proxy/
├── dockerfiles/
│   ├── backend/
│   └── frontend/
├── docs/
└── catalog/
```

## Quy tac phan loai pipeline

- `continuous-integration`
  Chi build, test, lint, scan, package. Khong thay doi moi truong chay.

- `continuous-delivery`
  Tao artifact san sang release hoac deploy toi moi truong trung gian.
  Neu production van can approve, manual gate, hoac thao tac phat hanh rieng, xep vao nhom nay.

- `continuous-deployment`
  Sau khi qua dieu kien, pipeline tu dong deploy toi moi truong dich ma khong co approve step trong pipeline.
  Nhung template co `restart service`, `kubectl apply`, `helm upgrade`, `scp + run`, `docker service update` thuong thuoc nhom nay.

## Cach chia theo use-case

Trong moi thu muc ngon ngu duoi `pipelines/`, dat ten file theo use-case thay vi ten project. Nhu vay sau nay tim theo nhu cau se nhanh hon.

Vi du:

- `maven-test.yml`
- `maven-test-sonarqube.yml`
- `jar-server-tag.yml`
- `docker-k8s-main.yml`
- `npm-release-main.yml`

## Neu mot template qua lon

Khi mot template can them tai lieu huong dan rieng, hay doi sang cau truc folder:

```text
pipelines/gitlab-ci/continuous-deployment/java/maven-jar-server-tag/
  README.md
  pipeline.yml
  variables.example.env
```

Kieu nay phu hop voi template co:

- nhieu bien moi truong
- yeu cau chuan bi server
- rollback thu cong
- script deploy di kem

## Quy uoc phan loai on-premise

Thu muc `on-premise/` chia thanh cac nhom chuc nang ro rang:

- `network/` — So do va kien truc mang noi bo (on-premise) va ket noi cloud.
- `server/` — Tai lieu quan tri, thiet lap he dieu hanh va khoi tao VM template.
- `setup/` — Tai lieu huong dan cai dat duoc danh so tu 01 den 06 bam sat lo trinh DevOps Fresher, va cac thu muc rieng cho Kubernetes, mysql, rancher, storage, teleport, certbot.
- `workflow/` — Quy trinh van hanh, import du lieu, backup, disaster recovery.
- `scripts/` — Bash scripts tu dong hoa (cai dat K8s, metrics-server, NFS, v.v.).
- `kubernetes/` — K8s manifest templates (Deployment, Service, HPA, PV/PVC, v.v.).
- `docker-compose/` — Cac file docker-compose.yml mau cho cac stack pho bien.
- `nginx/` — Nginx config mau (reverse proxy, load balancer, SSL).

## Quy uoc metadata

Moi template nen co metadata trong `catalog/templates.yml` gom:

- `id`
- `provider`
- `delivery_model`
- `language`
- `scenario`
- `file`
- `trigger`
- `deployment_target`
- `notes`

Tai nguyen dung chung khong thuoc rieng mot provider, nhu Dockerfile mau, Nginx config mau hoac helper script dung lai cho nhieu template, co the dat trong `on-premise/scripts/` hoac `dockerfiles/`.

## Huong phat trien repo

Giai doan 1:

- Gom cac file dang co vao dung thu muc theo cau truc moi
- Tach ro delivery model trong pipelines
- Phan biet on-premise va cloud
- Dat ten file thong nhat
- Them catalog

Giai doan 2:

- Chuan hoa variable naming
- Them README theo tung nhom ngon ngu
- Them template cho GitHub Actions va Jenkins
- Bo sung tai nguyen cloud (AWS, GCP, Azure)

Giai doan 3:

- Them script validate YAML
- Them checklist review truoc khi dua template vao repo
- Them example project mapping variable
- Them IaC templates (Terraform, Pulumi)
