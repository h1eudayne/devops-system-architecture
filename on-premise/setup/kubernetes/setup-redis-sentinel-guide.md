# Hướng dẫn Triển khai và Cấu hình cụm Redis Sentinel High Availability trên Kubernetes sử dụng NFS Storage

Tài liệu này cung cấp hướng dẫn từng bước chi tiết để thiết lập cụm cơ sở dữ liệu lưu trữ đệm **Redis** có tính sẵn sàng cao (**High Availability - HA**) thông qua giải pháp **Sentinel (3 Nodes)** kết hợp **Master-Replica (3 Replicas)**, chạy trên hạ tầng lưu trữ chia sẻ **NFS Storage (PV & PVC)** trong cụm Kubernetes.

---

## 1. Thành phần liên quan trong Repository

Để phục vụ quá trình triển khai này, các tệp cấu hình mẫu và tài liệu đi kèm đã được chuẩn bị đầy đủ:
* **Mẫu cấu hình PV & PVC**: [redis-pv-pvc.yml.example](../templates/kubernetes/storage/redis-pv-pvc.yml.example) - Định nghĩa thực thể lưu trữ dùng chung qua NFS.
* **Mẫu cấu hình values.yaml cho Helm**: [values.yml.example](../templates/kubernetes/redis/values.yml.example) - Tham số cấu hình chi tiết cho cụm Redis replication và Sentinel.
* **Hướng dẫn vận hành Redis**: [README.md](../templates/kubernetes/redis/README.md) - Tổng hợp các lệnh kiểm tra, giám sát, và kiểm thử tính năng Failover.

---

## 2. Quy trình 6 Bước Triển khai Chuẩn HA

### Bước 1: Khởi tạo Namespace
Tài nguyên PVC và Pods của Redis Sentinel sẽ chạy tập trung trong namespace dành riêng cho các thành phần kiến trúc hệ thống (`architecture`):
```bash
kubectl create namespace architecture
```

---

### Bước 2: Cấu hình vùng lưu trữ vật lý trên NFS Server
Để đảm bảo các Node Redis có thể ghi chép dữ liệu bền vững xuống NFS Server (`databaseserver`), bạn cần thực thi các lệnh sau để khởi tạo và phân quyền cho thư mục chia sẻ:

1. **Đăng nhập vào NFS Server** và chạy các lệnh:
   ```bash
   # Tạo thư mục vật lý lưu trữ dữ liệu Redis
   sudo mkdir -p /data/redis

   # Phân quyền sở hữu cho nobody:nogroup để tránh lỗi Permission Denied từ Pod Client
   sudo chown -R nobody:nogroup /data/

   # Cấp quyền đọc ghi tối đa cho thư mục chia sẻ
   sudo chmod -R 777 /data
   ```

2. **Đảm bảo tệp `/etc/exports`** trên NFS Server đã được cấu hình xuất bản với tùy chọn `no_root_squash` (bắt buộc):
   ```text
   /data *(rw,sync,no_subtree_check,no_root_squash)
   ```

3. **Áp dụng cấu hình NFS**:
   ```bash
   sudo exportfs -rav
   sudo systemctl restart nfs-kernel-server
   ```

---

### Bước 3: Triển khai PersistentVolume & PersistentVolumeClaim (PV & PVC)
Tận dụng tệp cấu hình mẫu [redis-pv-pvc.yml.example](../templates/kubernetes/storage/redis-pv-pvc.yml.example):

1. **Tạo tệp cấu hình thực tế**:
   ```bash
   cp ../templates/kubernetes/storage/redis-pv-pvc.yml.example redis-pv-pvc.yml
   ```
2. **Chỉnh sửa địa chỉ IP** của NFS Server tại trường `spec.nfs.server` trong file `redis-pv-pvc.yml` trỏ đúng về máy chủ NFS của bạn (mặc định mẫu là `192.168.1.115`).
3. **Áp dụng tài nguyên lên K8s**:
   ```bash
   kubectl apply -f redis-pv-pvc.yml -n architecture
   ```
4. **Kiểm tra trạng thái liên kết PVC**:
   * **Qua Rancher UI**: Đăng nhập vào giao diện Rancher, truy cập vào Namespace `architecture` -> *Storage* -> *PersistentVolumeClaims* và xác nhận trạng thái của `redis-pvc` là **`Bound`**.
   * **Qua CLI**:
     ```bash
     kubectl get pvc redis-pvc -n architecture
     ```

---

### Bước 4: Tạo thư mục làm việc và chuẩn bị cấu hình Helm values
1. **Khởi tạo thư mục làm việc trên K8S Master**:
   ```bash
   mkdir -p redis
   cd redis
   ```
2. **Sao chép tệp cấu hình values.yaml**:
   Tận dụng tệp cấu hình mẫu chuẩn Bitnami đã cấu hình sẵn tích hợp Sentinel và PVC:
   ```bash
   cp ../templates/kubernetes/redis/values.yml.example values.yaml
   ```
3. **Giải thích các tham số cốt lõi trong `values.yaml`**:
   * `architecture: replication`: Bật chế độ nhân bản Master-Replica.
   * `auth.enabled: true` & `auth.password: "devopseduvn"`: Bật bảo mật xác thực bằng mật khẩu.
   * `master.persistence.existingClaim: "redis-pvc"`: Gắn đĩa lưu trữ của Master vào PVC NFS đã tạo.
   * `replica.replicaCount: 3` & `replica.persistence.existingClaim: "redis-pvc"`: Khởi chạy 3 Pod Replica dùng chung vùng lưu trữ NFS an toàn.
   * `sentinel.enabled: true` & `sentinel.replicas: 3`: Khởi chạy 3 Node Sentinel giám sát và tự động xử lý sự cố (Failover).

---

### Bước 5: Cài đặt cụm Redis Sentinel bằng Helm Chart
1. **Thêm kho lưu trữ ứng dụng Bitnami**:
   ```bash
   helm repo add bitnami https://charts.bitnami.com/bitnami
   helm repo update
   ```
2. **Triển khai bằng Helm** với tên bản phát hành `redis-sentinel` trong namespace `architecture`:
   ```bash
   helm install redis-sentinel bitnami/redis --values values.yaml --namespace architecture
   ```
3. **Theo dõi trạng thái các Pods** cho đến khi tất cả các Pod chuyển sang trạng thái `Running (2/2)` (cả container Redis và container Sentinel đều hoạt động):
   ```bash
   kubectl get pods -n architecture -w
   ```

---

### Bước 6: Kiểm thử kết nối nội bộ qua Network Policy (ClusterIP)
Trong môi trường Kubernetes, các Pod giao tiếp thông qua mạng riêng ảo nội bộ được quản lý bởi Network Policy. Để ứng dụng Backend kết nối tới cụm Redis HA, luồng dữ liệu bắt buộc đi qua Service có loại `ClusterIP`.

Cú pháp kết nối DNS nội bộ:
```text
<tên_service>.<namespace>.svc.cluster.local
```

#### 1. Khởi chạy Client kiểm thử (Alpine Linux)
Chạy một Pod Alpine tạm thời thông qua Rancher kubectl shell hoặc K8S Master CLI:
```bash
kubectl run redis-client --rm -i --tty --image alpine --namespace architecture -- sh
```

#### 2. Cài đặt redis-cli bên trong container Alpine
```bash
apk update
apk add redis
```

#### 3. Kiểm tra kết nối tới Sentinel (Cổng 26379)
Sử dụng DNS nội bộ của Sentinel Service để kết nối:
```bash
redis-cli -h redis-sentinel.architecture.svc.cluster.local -p 26379 -a devopseduvn
```

#### 4. Truy vấn Sentinel để xác định IP của Master hiện tại
Tại giao diện dòng lệnh Redis Sentinel, gõ câu lệnh sau:
```text
redis-sentinel.architecture.svc.cluster.local:26379> SENTINEL get-master-addr-by-name mymaster
```
*Hệ thống sẽ trả về địa chỉ IP nội bộ cùng cổng 6379 của Pod Master đang hoạt động (ví dụ: `redis-sentinel-node-0`). Gõ `exit` để thoát.*

#### 5. Kết nối trực tiếp tới Redis Node (Cổng 6379) để đọc ghi dữ liệu
```bash
redis-cli -h redis-sentinel-headless.architecture.svc.cluster.local -p 6379 -a devopseduvn
```
Kiểm tra trạng thái Replication:
```text
redis-sentinel-headless.architecture.svc.cluster.local:6379> info replication
```

---

## 3. Lợi ích của Kiến trúc Redis Sentinel HA này

* **Không mất dữ liệu (Data Persistence)**: Toàn bộ dữ liệu của Master và các Replicas đều được ghi nhận trực tiếp xuống NFS Server thông qua cơ chế mount đĩa an toàn.
* **Tự động phục hồi sự cố (Automatic Failover)**: Nếu Node Master bị crash, các Sentinel Nodes sẽ tự động bầu chọn một Replica lành mạnh lên làm Master mới mà không cần can thiệp thủ công từ DevOps.
* **Bảo mật tối đa (Zero Public Exposure)**: Sử dụng Service loại `ClusterIP` và mạng K8s nội bộ đảm bảo cơ sở dữ liệu Redis hoàn toàn được ẩn giấu trước các cuộc tấn công quét cổng từ Internet bên ngoài.
