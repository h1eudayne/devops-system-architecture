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

2. **Cấu hình lưu trữ vật lý trên NFS Server** (Thực hiện trên máy chủ `databaseserver`):
   Tạo thư mục chia sẻ cho Redis và phân quyền ghi đọc đầy đủ để tránh lỗi Permission Denied từ Pod:
   ```bash
   sudo mkdir -p /data/redis
   sudo chown -R nobody:nogroup /data/
   sudo chmod -R 777 /data
   ```

3. **Áp dụng cấu hình PV & PVC cho Redis**:
   Đảm bảo tệp `redis-pv-pvc.yml` đã được cập nhật đúng địa chỉ IP của NFS Server, sau đó triển khai:
   ```bash
   kubectl apply -f templates/kubernetes/storage/redis-pv-pvc.yml -n architecture
   ```

4. **Kiểm tra trạng thái liên kết đĩa (PVC)**:
   Bạn có thể đăng nhập giao diện **Rancher** để xem PVC `redis-pvc` đã chuyển sang trạng thái **`Bound`** hay chưa, hoặc kiểm tra bằng CLI:
   ```bash
   kubectl get pvc redis-pvc -n architecture
   ```

---

### BƯỚC 2: Tạo thư mục làm việc & Chuẩn bị cấu hình

1. **Tạo thư mục làm việc trên K8S Master**:
   ```bash
   mkdir -p redis
   cd redis
   ```

2. **Khởi tạo file cấu hình `values.yaml`**:
   Sao chép tệp mẫu `values.yml.example` sang `values.yaml` trong thư mục làm việc của bạn:
   ```bash
   cp templates/kubernetes/redis/values.yml.example values.yaml
   ```

3. **Thêm kho lưu trữ Bitnami Helm & Cập nhật**:
   ```bash
   helm repo add bitnami https://charts.bitnami.com/bitnami
   helm repo update
   ```

---

### BƯỚC 3: Cài đặt cụm Redis bằng Helm

Thực hiện lệnh cài đặt với tệp cấu hình `values.yaml` trong namespace `architecture` sử dụng cú pháp chuẩn Bitnami:

```bash
helm install redis-sentinel bitnami/redis --values values.yaml --namespace architecture
```

> [!NOTE]
> Nếu bạn muốn nâng cấp hoặc cập nhật cấu hình trong tương lai, chỉ cần chỉnh sửa `values.yaml` và chạy lệnh:
> `helm upgrade redis-sentinel bitnami/redis --values values.yaml --namespace architecture`

---

## 3. Các lệnh kiểm tra vận hành và giám sát

Sau khi triển khai thành công, hãy thực hiện các bước sau để đảm bảo cụm Redis hoạt động ổn định:

### 1. Kiểm tra trạng thái các Pods và Services
```bash
# Kiểm tra danh sách các Pod (Đợi cho tới khi tất cả pod đều ở trạng thái Running 2/2)
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

## 4. Hướng dẫn kết nối kiểm tra và tích hợp Backend

> [!IMPORTANT]
> **Lưu ý về Mạng nội bộ trong Kubernetes:**
> - Các Pod trong Kubernetes giao tiếp với nhau qua một mạng riêng ảo được quản lý bởi Network Policy.
> - Để các ứng dụng/dịch vụ (như Backend gọi đến Redis) có thể kết nối được với nhau, chúng sẽ đi qua **Service** và loại Service sử dụng là **ClusterIP** (mặc định của chart).
> - Định dạng định danh DNS mạng nội bộ K8s chuẩn:
>   `<service_name>.<namespace>.svc.cluster.local` (cú pháp kết nối đến host).
> - Service Name cho Redis Sentinel: `redis-sentinel`
> - Cổng Sentinel mặc định: `26379`
> - Cú pháp kết nối: `redis-cli -h <host> -p <port> -a <password>`

### BƯỚC 1: Khởi chạy Pod và cài đặt Redis CLI
Ta sử dụng một Pod chạy hệ điều hành Alpine tạm thời để cài đặt `redis-cli` thông qua trình quản lý gói `apk` (kubectl shell):

```bash
# 1. Khởi chạy một Pod Alpine kiểm thử tạm thời
kubectl run redis-client --rm -i --tty --image alpine --namespace architecture -- sh

# 2. Bên trong shell của container Alpine, chạy lệnh cài đặt redis-cli:
apk update
apk add redis
```

### BƯỚC 2: Kiểm tra kết nối tới Sentinel & Xác định Master hiện tại

1. **Kết nối tới Redis Sentinel thông qua DNS nội bộ**:
   ```bash
   redis-cli -h redis-sentinel.architecture.svc.cluster.local -p 26379 -a devopseduvn
   ```

2. **Truy vấn địa chỉ IP của Master hiện tại từ Sentinel**:
   Sau khi đã đăng nhập thành công vào Sentinel, gõ lệnh sau để lấy thông tin Master:
   ```text
   redis-sentinel.architecture.svc.cluster.local:26379> SENTINEL get-master-addr-by-name mymaster
   ```
   *Kết quả trả về sẽ là địa chỉ IP nội bộ cùng cổng (6379) của Pod Master hiện tại (ví dụ: `redis-sentinel-node-0`).*

3. **Thoát khỏi client**:
   ```text
   redis-sentinel.architecture.svc.cluster.local:26379> exit
   ```

---

### BƯỚC 3: Kết nối trực tiếp đến Redis Node (Đọc/Ghi dữ liệu)

1. **Kết nối trực tiếp tới Headless Service của Redis Master/Replica**:
   ```bash
   redis-cli -h redis-sentinel-headless.architecture.svc.cluster.local -p 6379 -a devopseduvn
   ```

2. **Kiểm tra trạng thái Replication**:
   ```text
   redis-sentinel-headless.architecture.svc.cluster.local:6379> info replication
   ```
   *Màn hình sẽ hiển thị chi tiết vai trò (`role:master` hoặc `role:slave`) và danh sách 3 Replicas đang kết nối đồng bộ.*
