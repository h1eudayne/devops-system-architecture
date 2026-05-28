# Kubernetes Secret – Hướng dẫn sử dụng

Hướng dẫn cấu hình và sử dụng **Secret** để lưu trữ thông tin kết nối database MariaDB cho ứng dụng ecommerce backend.

---

## Bước 1 – Hoàn thiện file YAML

Mở file [`ecommerce-backend-database-connection.yml`](./ecommerce-backend-database-connection.yml) và cập nhật các giá trị phù hợp với môi trường của bạn:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: ecommerce-backend-database-connection
  namespace: ecommerce
type: Opaque
stringData:
  MARIADB_HOST: "192.168.209.115"   # Thay bằng IP MariaDB của bạn
  MARIADB_DB: "full-stack-ecommerce"
  MARIADB_PORT: "3306"
  MARIADB_USERNAME: "ecommerceapp"
  MARIADB_PASSWORD: "StrongPa55WorD"
```

> **Lưu ý:** Trường `stringData` cho phép nhập giá trị dạng plain text — Kubernetes sẽ tự động base64 encode khi lưu vào cluster.

Sau khi chỉnh sửa xong, apply lên cluster:

```bash
kubectl apply -f ecommerce-backend-database-connection.yml
```

Kiểm tra Secret đã được tạo:

```bash
kubectl get secret ecommerce-backend-database-connection -n ecommerce
```

---

## Bước 2 – Mount Secret vào Deployment

### Cách A – Qua giao diện Rancher

1. Truy cập **Rancher UI** → chọn cluster và namespace `ecommerce`
2. Vào **Workloads** → **Deployments** → chọn Deployment của backend
3. Nhấn **Edit Config**
4. Chuyển sang tab **Environment Variables**
5. Nhấn **Add Variable** → chọn loại **From Secret**
6. Tìm và chọn Secret: `ecommerce-backend-database-connection`
7. Nhấn **Save** để áp dụng

---

### Cách B – Qua file YAML của Deployment

Thêm cấu hình `envFrom` vào phần `spec.containers` của Deployment:

```yaml
spec:
  containers:
    - name: ecommerce-backend
      image: your-backend-image:tag
      envFrom:
        - secretRef:
            name: ecommerce-backend-database-connection
            optional: false
```

> **Giải thích:**
> - `envFrom.secretRef` → inject **toàn bộ** các key trong Secret thành biến môi trường
> - `optional: false` → Pod sẽ **không khởi động** nếu Secret chưa tồn tại (đảm bảo an toàn)

Apply lại Deployment:

```bash
kubectl apply -f deployment.yml
```

---

## Bước 3 – Cập nhật ConfigMap theo cú pháp `${Variable}`

Sau khi Secret đã được mount, sửa lại các giá trị trong **ConfigMap** để tham chiếu đến biến môi trường từ Secret, sử dụng cú pháp `${TÊN_BIẾN}`:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: ecommerce-backend-config
  namespace: ecommerce
data:
  # Tham chiếu đến các biến từ Secret
  DB_URL: "jdbc:mariadb://${MARIADB_HOST}:${MARIADB_PORT}/${MARIADB_DB}"
  DB_USERNAME: "${MARIADB_USERNAME}"
  DB_PASSWORD: "${MARIADB_PASSWORD}"
```

> **Lưu ý quan trọng:** Cú pháp `${Variable}` chỉ hoạt động nếu ứng dụng của bạn **hỗ trợ đọc biến môi trường** (ví dụ: Spring Boot với `${...}`, Node.js với `process.env.VARIABLE`). Kubernetes không tự giải nội suy cú pháp này trong ConfigMap — việc thay thế xảy ra ở tầng ứng dụng.

---

## Cấu trúc file liên quan

```
templates/kubernetes/
├── secret/
│   ├── database/
│   │   ├── README.md                                    <- Hướng dẫn (file này)
│   │   └── ecommerce-backend-database-connection.yml    <- Secret database
│   └── harbor/
│       ├── README.md                                    <- Hướng dẫn xác thực Harbor
│       └── harbor-registry-auth.yml.example             <- Lệnh tạo Secret Harbor
├── configmap/
│   └── configmap-spring-properties.yml.example          <- ConfigMap tham chiếu biến
└── deployment/
    └── ecommerce-backend-deployment.yml.example          <- Deployment mount Secret
```

---

## Checklist triển khai

- [ ] Cập nhật `MARIADB_HOST` đúng IP môi trường
- [ ] Apply Secret lên cluster (`kubectl apply`)
- [ ] Kiểm tra Secret tồn tại trong namespace `ecommerce`
- [ ] Mount Secret vào Deployment (Rancher hoặc YAML)
- [ ] Cập nhật ConfigMap dùng cú pháp `${Variable}`
- [ ] Restart Deployment để áp dụng thay đổi
