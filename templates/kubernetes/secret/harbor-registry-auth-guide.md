# Kubernetes Secret – Xác thực Harbor Registry

Hướng dẫn cấu hình xác thực **Harbor Registry** (private container registry) cho Kubernetes, thay thế Docker Hub.

---

## Bước 1 – Tạo Secret xác thực Harbor

Thực hiện lệnh sau trên **k8s-master-1** hoặc trong **kubectl shell của Rancher**:

```bash
kubectl create secret docker-registry auth-registry \
  --docker-email=yourmail@gmail.com \
  --docker-username=username-harbor \
  --docker-password=password-harbor \
  --docker-server=domain-harbor.com \
  --namespace ecommerce
```

Giải thích các tham số:

| Tham số | Mô tả |
|---|---|
| `auth-registry` | Tên Secret (dùng lại ở Bước 2) |
| `--docker-email` | Email tài khoản Harbor |
| `--docker-username` | Username đăng nhập Harbor |
| `--docker-password` | Password đăng nhập Harbor |
| `--docker-server` | Domain của Harbor server |
| `--namespace` | Namespace triển khai ứng dụng |

Kiểm tra Secret đã tạo:

```bash
kubectl get secret auth-registry -n ecommerce
```

---

## Bước 2 – Thêm Secret vào Deployment

Thêm trường `imagePullSecrets` vào phần `spec` của Deployment để Kubernetes dùng Secret xác thực khi pull image từ Harbor:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ecommerce-backend
  namespace: ecommerce
spec:
  replicas: 1
  selector:
    matchLabels:
      app: ecommerce-backend
  template:
    metadata:
      labels:
        app: ecommerce-backend
    spec:
      containers:
        - name: ecommerce-backend
          image: domain-harbor.com/devopseduvn/ecommerce-backend:v1
          envFrom:
            - secretRef:
                name: ecommerce-backend-database-connection
                optional: false
      imagePullSecrets:
        - name: auth-registry   # Tên Secret tạo ở Bước 1
```

> **Lưu ý:** `imagePullSecrets` nằm ngang hàng với `containers`, không nằm bên trong.

Apply Deployment:

```bash
kubectl apply -f ecommerce-backend-deployment.yml
```

---

## So sánh Docker Hub và Harbor

| | Docker Hub | Harbor |
|---|---|---|
| Registry server | `docker.io` | Domain riêng (VD: `domain-harbor.com`) |
| Loại Secret | `docker-registry` | `docker-registry` (giống nhau) |
| Tham số `--docker-server` | `https://index.docker.io/v1/` | Domain Harbor của bạn |
| Project path trong image | `username/image:tag` | `harbor-domain/project/image:tag` |

---

## Cấu trúc file liên quan

```
templates/kubernetes/
├── secret/
│   ├── harbor-registry-auth.yml.example             <- Lệnh tạo Secret (file này)
│   └── ecommerce-backend-database-connection.yml    <- Secret database
└── deployment/
    └── ecommerce-backend-deployment.yml.example     <- Deployment tham chiếu cả 2 Secret
```
