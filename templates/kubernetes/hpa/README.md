# Kubernetes HorizontalPodAutoscaler (HPA) - Hướng dẫn sử dụng

HPA là công cụ giúp tự động co giãn số lượng Pod dựa trên mức độ sử dụng tài nguyên thực tế.

## Các lệnh quản lý HPA thường dùng

### 1. Apply cấu hình HPA
```bash
# Tạo/cập nhật HPA từ file YAML
kubectl apply -f hpa.yml
```

### 2. Xem danh sách HPA
```bash
# Xem danh sách HPA trong namespace cu the
kubectl get hpa -n <namespace>

# Xem danh sách HPA va cap nhat tu dong (giong top/watch)
watch kubectl get hpa -n <namespace>
```

### 3. Xem chi tiết thông tin HPA
```bash
# Xem cac su kien va chi so chi tiet cua HPA
kubectl describe hpa <ten-hpa> -n <namespace>

# Xem file cau hinh hien tai duoi dang YAML
kubectl get hpa <ten-hpa> -n <namespace> -o yaml
```

### 4. Xóa HPA
```bash
kubectl delete hpa <ten-hpa> -n <namespace>
```

---

## Lưu ý cực kỳ quan trọng khi cấu hình HPA

### 1. Phải cấu hình Resource Requests trong Deployment
Metrics Server **không thể tính toán tỷ lệ % CPU/Memory** nếu các Pod trong Deployment không được định nghĩa `requests` tài nguyên.
Ví dụ cấu hình mẫu cho container trong Deployment:
```yaml
resources:
  requests:
    cpu: "200m"
    memory: "256Mi"
  limits:
    cpu: "500m"
    memory: "512Mi"
```
Nếu thiếu phần `requests`, cột `TARGETS` khi chạy `kubectl get hpa` sẽ hiển thị `<unknown>`.

### 2. Tránh hiện tượng Flapping (Dao động Pod liên tục)
Hiện tượng Flapping xảy ra khi tải tăng cao -> HPA scale-up pod -> Tải giảm -> HPA lập tức scale-down pod -> Tải lại tăng -> Lặp lại. Điều này làm lãng phí tài nguyên và ảnh hưởng đến tính ổn định của hệ thống.
- **Cách xử lý**: Sử dụng cấu hình `behavior.scaleDown.stabilizationWindowSeconds: 300` (giá trị mặc định là 5 phút) để giữ ổn định số lượng pod sau khi tải giảm trước khi tiến hành thu hồi pod dần dần.

### 3. Kiểm tra tính tương thích API Version
- Kể từ Kubernetes **v1.23+**, API `autoscaling/v2` được khuyến nghị sử dụng thay thế hoàn toàn cho các phiên bản cũ (`v2beta1`, `v2beta2`).
- File template `hpa.yml.example` trong thư mục này được viết chuẩn theo API `autoscaling/v2`.
