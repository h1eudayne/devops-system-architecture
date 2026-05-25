# CI/CD Template Library

Repository nay dung de luu va tai su dung cac file CI/CD da duoc chuan hoa cho nhieu nen tang, nhieu ngon ngu va nhieu delivery model.

## Muc tieu

- Gom template theo `provider -> delivery model -> language -> scenario`.
- De tim, de copy, de mo rong.
- Tach ro `continuous integration`, `continuous delivery` va `continuous deployment`.
- Tach phan mo ta, quy uoc va template thuc te de repo khong bi roi.

## Cau truc de xuat

```text
.
|-- catalog/
|   `-- templates.yml
|-- docs/
|   |-- REPO-STRUCTURE.md
|   `-- TEMPLATE-GUIDELINES.md
|-- setup/
|   |-- setup-db-nfs-guide.md
|   |-- setup-hpa-guide.md
|   `-- setup-nfs-guide.md
|-- workflow/
|   `-- kubernetes/
|       `-- k8s-mariadb-nfs-import.md
|-- templates/
|   |-- github-actions/
|   |   |-- README.md
|   |   |-- continuous-integration/
|   |   |   `-- README.md
|   |   |-- continuous-delivery/
|   |   |   `-- README.md
|   |   `-- continuous-deployment/
|   |       `-- README.md
|   |-- gitlab-ci/
|   |   |-- README.md
|   |   |-- continuous-integration/
|   |   |   `-- README.md
|   |   |-- continuous-delivery/
|   |   |   `-- README.md
|   |   `-- continuous-deployment/
|   |       |-- README.md
|   |       `-- java/
|   |           |-- README.md
|   |           `-- maven-jar-server-tag.yml
|   |-- shared/
|   |   |-- docker/
|   |   |   |-- install/
|   |   |   |   `-- ubuntu/
|   |   |   |       |-- README.md
|   |   |   |       |-- install-docker-and-compose.sh.example
|   |   |   |       `-- install-jenkins.sh.example
|   |   |   |-- compose/
|   |   |   |   `-- backend-mariadb/
|   |   |   |       |-- README.md
|   |   |   |       `-- docker-compose.yml.example
|   |   |   |-- java/
|   |   |   |   |-- README.md
|   |   |   |   `-- maven-jar-openjdk8-jre-alpine.Dockerfile.example
|   |   |   |-- registry/
|   |   |   |   |-- harbor/
|   |   |   |   |   |-- README.md
|   |   |   |   |   `-- install-harbor.sh.example
|   |   |   |   `-- private-registry-tls/
|   |   |   |       |-- README.md
|   |   |   |       `-- docker-compose.yml.example
|   |   |   `-- vuejs/
|   |   |       |-- README.md
|   |   |       `-- npm-dist-nginx-alpine.Dockerfile.example
|   |   |-- mysql/
|   |   |   `-- install/
|   |   |       `-- ubuntu/
|   |   |           `-- README.md
|   |   |-- kubernetes/
|   |   |   `-- install/
|   |   |       `-- ubuntu/
|   |   |           |-- README.md
|   |   |           |-- 01-prepare-all-nodes.sh.example
|   |   |           |-- 02-init-single-master.sh.example
|   |   |           |-- 03-init-ha-master.sh.example
|   |   |           |-- 04-join-worker.sh.example
|   |   |           |-- 05-join-control-plane.sh.example
|   |   |           `-- 06-reset-cluster.sh.example
|   |   `-- nginx/
|   |       `-- react-spa-port-3000.conf.example
|   `-- jenkins/
|       |-- README.md
|       |-- continuous-integration/
|       |   `-- README.md
|       |-- continuous-delivery/
|       |   `-- README.md
|       |-- install/
|       |   `-- ubuntu/
|       |       |-- README.md
|       |       `-- install-jenkins.sh.example
|       |-- reverse-proxy/
|       |   |-- README.md
|       |   `-- nginx-jenkins-subdomain.conf.example
|       `-- continuous-deployment/
|           `-- README.md
|-- templates/
|   `-- kubernetes/
|       |-- namespace.yml.example
|       |-- pod.yml.example
|       |-- deployment/
|       |-- service/
|       |   |-- README.md
|       |   `-- service-nodeport.yml.example
|       |-- ingress/
|       |   |-- README.md
|       |   `-- ingress-car-serv.yml.example
|       |-- hpa/
|       |   |-- README.md
|       |   `-- hpa.yml.example
|       |-- storage/
|       |   |-- README.md
|       |   `-- storageclass.yml.example
|       |-- full-stack/
|       |   |-- README.md
|       |   `-- fullstack-rolling-clusterip-ingress.yml.example
|       `-- load-balancer/
|           `-- nginx/
|               `-- k8s-loadbalancer.conf
`-- .gitignore
```

## Quy tac dat ten

Mau duong dan:

```text
templates/<provider>/<delivery-model>/<language>/<scenario>.yml
```

Vi du:

- `templates/gitlab-ci/continuous-integration/java/maven-test.yml`
- `templates/github-actions/continuous-delivery/nodejs/npm-build-release-main.yml`
- `templates/gitlab-ci/continuous-deployment/java/maven-jar-server-tag.yml`

## Cach phan loai pipeline

- `continuous-integration`: build, test, lint, scan, package; khong thay doi moi truong dich.
- `continuous-delivery`: tao artifact san sang phat hanh hoac deploy toi staging, UAT, hoac prod nhung con manual gate.
- `continuous-deployment`: sau khi pipeline qua dieu kien, he thong tu dong deploy thang toi moi truong dich ma khong can approve trong pipeline.

Phan `scenario` nen mo ta du 4 y:

1. Build tool hoac artifact: `maven`, `npm`, `poetry`, `docker`
2. Kieu package hoac deploy style: `jar`, `image`, `helm`, `static`
3. Dich den: `server`, `k8s`, `ecs`, `ecr`, `gcr`
4. Dieu kien kich hoat hoac bien the: `tag`, `main`, `mr`, `manual`, `blue-green`

## Danh muc hien co

| Provider | Delivery Model | Language | Scenario | File |
| --- | --- | --- | --- | --- |
| GitLab CI | Continuous Deployment | Java | Maven build + direct server deploy on tag | `templates/gitlab-ci/continuous-deployment/java/maven-jar-server-tag.yml` |
| GitLab CI | Continuous Deployment | React | NPM build + static deploy to server on tag | `templates/gitlab-ci/continuous-deployment/react/npm-static-server-tag.yml` |
| GitLab CI | Continuous Delivery | React | NPM build + manual static deploy to server on tag | `templates/gitlab-ci/continuous-delivery/react/npm-static-server-tag-manual.yml` |
| GitLab CI | Continuous Delivery | Docker | Docker build + push registry + manual container deploy on tag | `templates/gitlab-ci/continuous-delivery/docker/docker-image-server-tag-manual.yml` |

## Cach them template moi

1. Chon dung provider, delivery model va language.
2. Dat ten file theo scenario mo ta ro build, target va trigger.
3. Them mo ta ngan vao `catalog/templates.yml`.
4. Neu co bien bat buoc hoac buoc manual, ghi ro trong README cung cap template.
5. Khong commit secret, token, host cu the, private key.

Tai nguyen dung chung nhu config Nginx, Dockerfile mau, shell snippet, hoac file phu tro co the dat trong `templates/shared/`.

## Tai nguyen dung chung hien co

| Nhom | Ngon ngu | Mo ta | File |
| --- | --- | --- | --- |
| Docker | Compose | Docker Compose stack mau cho backend image + MariaDB voi bien moi truong de doi theo tung project | `templates/shared/docker/compose/backend-mariadb/docker-compose.yml.example` |
| Docker | Ubuntu | Bash script cai Docker Engine va standalone Docker Compose tren Ubuntu | `templates/shared/docker/install/ubuntu/install-docker-and-compose.sh.example` |
| Docker | Ubuntu | Bash script cai Jenkins tren Ubuntu bang Jenkins apt repository va Java 21 | `templates/shared/docker/install/ubuntu/install-jenkins.sh.example` |
| Docker | Java | Multi-stage Maven build, copy JAR sang Alpine runtime va chay bang Java 8 | `templates/shared/docker/java/maven-jar-openjdk8-jre-alpine.Dockerfile.example` |
| Docker | Registry | Script mau cai Harbor offline, xin TLS bang Certbot va chay prepare/install sau khi review harbor.yml | `templates/shared/docker/registry/harbor/install-harbor.sh.example` |
| Docker | Registry | Huong dan tao private registry voi TLS self-signed certificate va Docker Compose | `templates/shared/docker/registry/private-registry-tls/docker-compose.yml.example` |
| Docker | VueJS | Multi-stage npm build, copy `dist` sang Nginx runtime va phuc vu static file | `templates/shared/docker/vuejs/npm-dist-nginx-alpine.Dockerfile.example` |
| MySQL | Ubuntu | Huong dan cai `mysql-server`, chay `mysql_secure_installation`, tao database va user ung dung | `templates/shared/mysql/install/ubuntu/README.md` |
| NFS Server | Ubuntu | Huong dan chi tiet cai dat, cau hinh va mo port cho NFS Server tren Ubuntu | `templates/shared/nfs-server/install/ubuntu/README.md` |
| NFS Server | Ubuntu | Bash script tu dong hoa cai dat nfs-kernel-server va tao thu muc chia se tren Ubuntu | `templates/shared/nfs-server/install/ubuntu/install-nfs-server.sh.example` |
| NFS Client | Ubuntu | Huong dan chi tiet cai dat nfs-common va kiem tra ket noi den NFS Server | `templates/shared/nfs-client/install/ubuntu/README.md` |
| NFS Client | Ubuntu | Bash script tu dong hoa cai dat nfs-common va kiem tra ket noi cong 2049 tren client nodes | `templates/shared/nfs-client/install/ubuntu/install-nfs-client.sh.example` |
| Nginx | React SPA | Nginx config mau cho React SPA chay tren port 3000 | `templates/shared/nginx/react-spa-port-3000.conf.example` |
| Kubernetes | Ubuntu | Bash script chuan bi tat ca node K8s: hosts, swap, kernel module, containerd, kubeadm v1.30 | `templates/shared/kubernetes/install/ubuntu/01-prepare-all-nodes.sh.example` |
| Kubernetes | Ubuntu | Khoi tao cum K8s mo hinh 1 master + 2 worker voi Calico CNI | `templates/shared/kubernetes/install/ubuntu/02-init-single-master.sh.example` |
| Kubernetes | Ubuntu | Khoi tao cum K8s mo hinh 3 master HA voi control-plane-endpoint | `templates/shared/kubernetes/install/ubuntu/03-init-ha-master.sh.example` |
| Kubernetes | Ubuntu | Join worker node vao cum K8s (mo hinh 1 master + 2 worker) | `templates/shared/kubernetes/install/ubuntu/04-join-worker.sh.example` |
| Kubernetes | Ubuntu | Join control-plane node bo sung vao cum K8s HA (mo hinh 3 master) | `templates/shared/kubernetes/install/ubuntu/05-join-control-plane.sh.example` |
| Kubernetes | Ubuntu | Reset cum K8s de cai lai tu dau | `templates/shared/kubernetes/install/ubuntu/06-reset-cluster.sh.example` |
| Helm | Ubuntu | Bash script cai dat Helm v3.16.2 (Kubernetes Package Manager) tren Ubuntu | `templates/shared/helm/install/ubuntu/01-install-helm.sh.example` |
| Ingress Nginx | Ubuntu | Bash script (root) tai chart Ingress Nginx, chinh sua values.yaml sang NodePort 30080/30443 | `templates/shared/ingress-nginx/install/ubuntu/01-prepare-ingress-nginx.sh.example` |
| Ingress Nginx | Ubuntu | Bash script (devops) tao namespace va cai dat Ingress Nginx Controller qua Helm | `templates/shared/ingress-nginx/install/ubuntu/02-deploy-ingress-nginx.sh.example` |
| Metrics Server | Kubernetes | Huong dan va bash script (Helm) cai dat Metrics Server, ho tro cau hinh bo qua TLS tu ky | `templates/shared/metrics-server/README.md` |
| Kubernetes | HPA Setup | Huong dan chi tiet cai dat Metrics Server, cach sua loi tren Rancher va cau hinh HPA | `setup/setup-hpa-guide.md` |
| Kubernetes | NFS Setup | Huong dan toan dien ve kien truc, luu do hoat dong va cac buoc trien khai NFS tren K8s | `setup/setup-nfs-guide.md` |
| Kubernetes | DB NFS Setup | Huong dan tung buoc trien khai database MariaDB tren K8s qua StatefulSet va NFS | `setup/setup-db-nfs-guide.md` |
| Kubernetes | DB NFS Workflow | Quy trinh nap du lieu SQL qua NFS va ket noi Backend qua ClusterIP (Phuong phap toi uu) | `workflow/kubernetes/k8s-mariadb-nfs-import.md` |
| Nginx | Load Balancer | Nginx config phan phoi traffic den cac K8s node qua NodePort 30080 (dung cho on-premise) | `templates/kubernetes/load-balancer/nginx/k8s-loadbalancer.conf` |
| Kubernetes | Ingress | Cau hinh Ingress Nginx cho du an car-serv (on-premise, domain h1eudayne.tech) | `templates/kubernetes/ingress/ingress-car-serv.yml.example` |
| Kubernetes | Full-Stack | Template gom Deployment (RollingUpdate) + Service (ClusterIP) + Ingress (Nginx) trong 1 file, deploy nhanh ung dung web hoan chinh | `templates/kubernetes/full-stack/fullstack-rolling-clusterip-ingress.yml.example` |
| Kubernetes | HPA | Template HorizontalPodAutoscaler (HPA) autoscaling/v2 tu dong co gian pod theo CPU va Memory | `templates/kubernetes/hpa/hpa.yml.example` |
| Kubernetes | Storage | Template StorageClass (nfs-storage) su dung no-provisioner va volumeBindingMode WaitForFirstConsumer | `templates/kubernetes/storage/storageclass.yml.example` |


## Goi y mo rong tiep theo

- Them `templates/github-actions/continuous-integration/nodejs/`
- Them `templates/github-actions/continuous-delivery/python/`
- Them `templates/gitlab-ci/continuous-integration/nodejs/`
- Them `templates/gitlab-ci/continuous-deployment/python/`
- Them `templates/jenkins/continuous-delivery/java/`
- Them `examples/` neu muon minh hoa cach inject variable cho tung project

