# Hướng dẫn Triển khai Redis Cluster (Replication + Sentinel) bằng Helm trên Kubernetes

Tài liệu này hướng dẫn chi tiết các bước cấu hình và triển khai cụm **Redis** với mô hình **Replication (Master - 3 Replicas)** tích hợp **Sentinel (3 Nodes)** để tự động hóa tính năng High Availability (HA) và Failover. Quá trình triển khai sử dụng Helm Chart của **Bitnami** kết hợp với hệ thống lưu trữ **NFS Storage (PV & PVC)** đã cấu hình trước đó.

---

## 1. Sơ đồ Kiến trúc Hoạt động

Dưới đây là luồng hoạt động của hệ thống từ tầng ứng dụng đến lưu trữ vật lý NFS:

```text
       [ Khách hàng / Backend App ]
                    │
                    ▼ (Kết nối an toàn)
      [ Redis Sentinel Service (Port 26379) ]
        ├── Giám sát trạng thái cụm Redis
        └── Trả về IP của Master hiện tại cho Client
                    │
   ┌────────────────┼────────────────┐
   ▼ (Read/Write)   ▼ (Read-Only)    ▼ (Read-Only)
[ Redis Master ] ──► [ Replica-0 ]  ──► [ Replica-1 ]
   │ (Mount)        │ (Mount)        │ (Mount)
   └────────────────┼────────────────┘
                    ▼
          [ PVC: redis-pvc (10Gi) ]
                    │
           [ PV: redis-pv (NFS) ]
                    │
      [ NFS Server Share: /data/redis/ ]
```

---

## 2. Quy trình Triển khai Chi tiết

Quá trình này có thể được thực hiện trực tiếp trên máy chủ **k8s-master-1** hoặc thông qua **kubectl shell trên giao diện Rancher**.

### BƯỚC 1: Khởi tạo môi trường & Cấp phát ổ đĩa (PV & PVC)

1. **Khởi tạo Namespace `architecture`** (nếu chưa có):
   ```bash
   kubectl create namespace architecture
   ```

2. **Áp dụng cấu hình PV & PVC cho Redis**:
   Đảm bảo tệp `redis-pv-pvc.yml` đã được cập nhật đúng địa chỉ IP của NFS Server, sau đó triển khai:
   ```bash
   kubectl apply -f templates/kubernetes/storage/redis-pv-pvc.yml -n architecture
   ```

3. **Kiểm tra trạng thái liên kết đĩa**:
   Đảm bảo PVC đã chuyển sang trạng thái `Bound` trước khi tiếp tục:
   ```bash
   kubectl get pvc redis-pvc -n architecture
   ```

---

### BƯỚC 2: Thêm Repo Helm và chuẩn bị cấu hình

1. **Thêm kho lưu trữ Bitnami Helm**:
   ```bash
   helm repo add bitnami https://charts.bitnami.com/bitnami
   helm repo update
   ```

2. **Khởi tạo file `values.yaml`**:
   Sao chép tệp mẫu `values.yml.example` sang `values.yaml` và kiểm tra lại thông số:
   ```bash
   cp templates/kubernetes/redis/values.yml.example values.yaml
   ```

---

### BƯỚC 3: Cài đặt cụm Redis bằng Helm

Thực hiện lệnh cài đặt với tệp cấu hình `values.yaml` trong namespace `architecture`:

```bash
helm install redis-sentinel bitnami/redis --values values.yaml --namespace architecture
```

> [!NOTE]
> Nếu bạn muốn nâng cấp cấu hình trong tương lai, chỉ cần chỉnh sửa `values.yaml` và chạy lệnh:
> `helm upgrade redis-sentinel bitnami/redis --values values.yaml --namespace architecture`

---

## 3. Các lệnh kiểm tra vận hành và giám sát

Sau khi chạy lệnh deploy, hãy thực hiện các bước sau để đảm bảo cụm Redis hoạt động ổn định:

### 1. Kiểm tra trạng thái các Pods và Services
```bash
# Kiểm tra danh sách các Pod (Đợi cho tới khi tất cả pod đều ở trạng thái Running 1/1 hoặc 2/2)
kubectl get pods -n architecture -w

# Kiểm tra danh sách Services
kubectl get svc -n architecture
```
*Bạn sẽ thấy các Pod: `redis-sentinel-node-0`, `redis-sentinel-node-1`... chạy đồng thời cả container Redis và Sentinel.*

### 2. Kiểm tra log của Sentinel để xác nhận cụm đã nhận dạng đúng Master
```bash
kubectl logs statefulset/redis-sentinel-node -n architecture -c sentinel --tail=100
```
*Log hợp lệ sẽ hiển thị dòng nhận diện Master mới và giám sát các Replicas.*

### 3. Kiểm tra tính năng Failover (Kiểm thử HA)
Để test tính năng tự động chuyển vùng khi Master gặp sự cố:
```bash
# Giả lập crash bằng cách xóa Pod Master hiện tại (ví dụ redis-sentinel-node-0)
kubectl delete pod redis-sentinel-node-0 -n architecture

# Ngay lập tức theo dõi log Sentinel để xem quá trình bầu chọn Master mới
kubectl logs statefulset/redis-sentinel-node -n architecture -c sentinel -f
```

---

## 4. Hướng dẫn kết nối kiểm tra từ Client nội bộ

Để kiểm tra khả năng kết nối và xác thực mật khẩu của Redis:

1. **Khởi chạy một Pod kiểm thử chạy redis-cli**:
   ```bash
   kubectl run redis-client --rm -i --tty --image bitnami/redis:latest --namespace architecture -- bash
   ```

2. **Kiểm tra kết nối trực tiếp đến Service của cụm**:
   ```bash
   # Kết nối tới Redis Sentinel (Cổng 26379)
   redis-cli -h redis-sentinel -p 26379 -a devopseduvn

   # Hoặc kết nối trực tiếp tới Redis Node (Cổng 6379)
   redis-cli -h redis-sentinel-headless -p 6379 -a devopseduvn
   ```

3. **Kiểm tra trạng thái Replication bằng lệnh Redis**:
   Sau khi đã kết nối thành công, chạy lệnh:
   ```text
   127.0.0.1:6379> info replication
   ```
   *Màn hình sẽ hiển thị thông tin chi tiết về vai trò (`role:master` hoặc `role:slave`) và danh sách các replica đang kết nối.*
