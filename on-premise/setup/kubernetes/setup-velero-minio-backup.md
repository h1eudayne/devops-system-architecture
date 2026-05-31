# Quy Trình Thiết Lập Hệ Thống Sao Lưu Velero Kết Hợp MinIO Backend

Tài liệu này cung cấp hướng dẫn toàn diện từng bước để thiết lập giải pháp sao lưu (Backup), khôi phục thảm họa (Disaster Recovery) và di trú tài nguyên cụm Kubernetes sử dụng công cụ **Velero** kết hợp với máy chủ lưu trữ đối tượng **MinIO** đóng vai trò S3 Object Storage backend.

---

## 1. Chuẩn bị tài nguyên phần mềm và hạ tầng

Trước khi tiến hành cấu hình hệ thống Velero Server, bạn cần triển khai thành công 2 thành phần cốt lõi sau:

### Thành phần 1: Velero Client CLI (Trên máy chủ điều khiển)
Velero CLI cần được cài đặt trên máy chủ master (`k8s-master-1`) hoặc thông qua shell quản trị để tương tác với cụm.
*   **Hướng dẫn chi tiết**: [Cài đặt Velero Client](file:///d:/Code/Deploy/on-premise/setup/kubernetes/install-velero-client-guide.md)

### Thành phần 2: Máy chủ lưu trữ MinIO (Trên database-server)
MinIO đóng vai trò lưu trữ các tệp tin nén sao lưu được gửi từ cụm Kubernetes.
*   **Hướng dẫn chi tiết**: [Triển khai MinIO bằng Docker Compose](file:///d:/Code/Deploy/on-premise/docker-compose/minio/README.md)

---

## 2. Các bước cấu hình chi tiết

### Bước 1: Kiểm tra kết nối dịch vụ MinIO
Đảm bảo máy chủ lưu trữ MinIO hoạt động ổn định và có thể truy cập được từ cụm Kubernetes.
1.  Truy cập giao diện quản trị đồ họa trên trình duyệt: `http://<IP_DATABASE_SERVER>:9001`.
2.  Đăng nhập bằng tài khoản mặc định (`h1eudayne` / `1`).

### Bước 2: Tạo Bucket chứa bản sao lưu
1.  Tại menu bên trái của giao diện MinIO Console, chọn mục **Buckets** -> Nhấp **Create Bucket**.
2.  **Bucket Name**: Đặt tên gợi nhớ (ví dụ: `k8s-backup-bucket`).
3.  Nhấp chọn **Create Bucket** để xác nhận tạo phân vùng lưu trữ mới.

### Bước 3: Khởi tạo Access Key và Secret Key cho API kết nối
Để bảo mật và cho phép Velero Server kết nối ghi/đọc dữ liệu qua API, bạn cần tạo khóa truy cập riêng:
1.  Tại menu bên trái, chọn mục **Access Keys** -> Nhấp **Create Access Key**.
2.  Hệ thống sẽ tự động tạo ngẫu nhiên một cặp khóa gồm **Access Key** và **Secret Key**.
3.  Sao chép và lưu trữ an toàn cặp khóa này để sử dụng cấu hình ở bước tiếp theo.

### Bước 4: Khai báo biến môi trường trên Kubernetes Master Node
Đăng nhập vào máy chủ điều khiển `k8s-master-1` (hoặc mở Kubectl Shell của Rancher) và chạy các lệnh khai báo biến môi trường tạm thời:

```bash
export MINIO_URL="http://<IP_DATABASE_SERVER>:9000"
export MINIO_ACCESS_KEY_ID="<Access-Key-Cua-Ban>"
export MINIO_SECRET_KEY_ID="<Secret-Key-Cua-Ban>"
export MINIO_BUCKET="k8s-backup-bucket"
```
*(Thay thế `<IP_DATABASE_SERVER>` bằng IP của máy chủ chạy MinIO và điền chính xác thông tin khóa vừa tạo ở Bước 3).*

### Bước 5: Cài đặt Velero Server vào cụm Kubernetes
Sử dụng Velero CLI để tự động cài đặt các thành phần (CRDs, ServiceAccount, Deployment, DaemonSet) vào cụm Kubernetes trong namespace `velero` kết hợp AWS plugin để kết nối tới MinIO API:

```bash
velero install \
  --provider aws \
  --bucket $MINIO_BUCKET \
  --secret-file <(echo -e "[default]\naws_access_key_id=$MINIO_ACCESS_KEY_ID\naws_secret_access_key=$MINIO_SECRET_KEY_ID") \
  --use-node-agent \
  --backup-location-config region=minio,s3ForcePathStyle="true",s3Url=$MINIO_URL \
  --plugins velero/velero-plugin-for-aws:v1.5.0 \
  --namespace velero
```

*Giải thích tham số chính*:
*   `--provider aws`: Sử dụng plugin AWS (do MinIO hoàn toàn tương thích chuẩn API của AWS S3).
*   `--secret-file <(echo -e ...)`: Sử dụng cơ chế truyền khóa bảo mật trực tiếp dạng luồng tệp tin tạm thời giúp thông tin tài khoản không bị lưu tĩnh xuống ổ đĩa cứng.
*   `--use-node-agent`: Bật tính năng chạy Agent phụ trên các node nhằm hỗ trợ sao lưu dữ liệu trạng thái lưu trữ bền vững (Persistent Volumes) thông qua Restic/Kopia.

Đảm bảo tất cả các Pods trong namespace `velero` hoạt động ở trạng thái `Running`:
```bash
kubectl get pods -n velero
```

---

## 3. Quy trình thực hiện Sao lưu và Khôi phục

### 1. Sao lưu tài nguyên của một Namespace cụ thể
Để tiến hành sao lưu toàn bộ tài nguyên (Deployments, Services, ConfigMaps, Secrets, PVCs...) thuộc namespace `ecommerce`:
```bash
velero backup create ecommerce-backup-v1 --include-namespaces ecommerce
```
*Kiểm tra trạng thái bản sao lưu*:
```bash
velero backup get
velero backup describe ecommerce-backup-v1
```

### 2. Khôi phục tài nguyên từ bản sao lưu
Trong trường hợp gặp sự cố mất dữ liệu hoặc hỏng tài nguyên ở namespace `ecommerce`, thực hiện lệnh khôi phục để khôi phục trạng thái về thời điểm tạo bản backup:
```bash
velero restore create ecommerce-restore-v1 --from-backup ecommerce-backup-v1 --include-namespaces ecommerce
```
*Kiểm tra trạng thái khôi phục*:
```bash
velero restore get
velero restore describe ecommerce-restore-v1
```

### 3. Thiết lập lịch trình tự động sao lưu định kỳ (Schedule)
Để tự động hóa quy trình sao lưu toàn bộ cụm Kubernetes hàng ngày vào lúc 00:00 (nửa đêm):
```bash
velero schedule create daily-cluster-backup --schedule="0 0 * * *" --include-namespaces '*'
```
*Xem danh sách các lịch trình đang hoạt động*:
```bash
velero schedule get
```
