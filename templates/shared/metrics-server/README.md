# Hướng dẫn Cài đặt Metrics Server trên Kubernetes bằng Helm

Metrics Server là một dịch vụ thu thập các chỉ số về tài nguyên (CPU, Memory) từ các Kubelet trên mỗi node, sau đó cung cấp lại cho các công cụ khác như Horizontal Pod Autoscaler (HPA), Vertical Pod Autoscaler (VPA) hoặc lệnh `kubectl top`.

## Hướng dẫn nhanh (Sử dụng script có sẵn)

Thư mục này cung cấp sẵn script `install-metrics-server.sh.example` giúp tự động hóa quá trình kéo Helm chart, cấu hình bỏ qua xác thực TLS đối với các cụm On-Premise/Lab dùng certificate tự ký, và deploy vào cụm.

```bash
# 1. Copy file script mẫu
cp install-metrics-server.sh.example install-metrics-server.sh
chmod +x install-metrics-server.sh

# 2. Xem và chỉnh sửa biến cấu hình nếu cần (như NAMESPACE, INSECURE_TLS)
nano install-metrics-server.sh

# 3. Chạy script cài đặt
./install-metrics-server.sh
```

---

## Hướng dẫn cài đặt thủ công từng bước

Nếu không muốn chạy script tự động, bạn có thể thực hiện thủ công các bước sau:

### Bước 1: Thêm Helm Repository và Cập nhật

```bash
helm repo add metrics-server https://kubernetes-sigs.github.io/metrics-server/
helm repo update
```

### Bước 2: Tải và giải nén Helm Chart (Tùy chọn cấu hình nâng cao)

```bash
helm pull metrics-server/metrics-server --untar
```

### Bước 3: Cài đặt trực tiếp bằng Helm

**Trường hợp 1: Cụm Kubernetes On-Premise / Lab (Sử dụng self-signed certificate cho Kubelet - Khuyên dùng)**

Nếu cụm Kubernetes của bạn được dựng bằng `kubeadm` hoặc các công cụ tự cài đặt mà không có CA hợp lệ cho Kubelet, bạn bắt buộc phải bật cờ `--kubelet-insecure-tls` để Metrics Server có thể crawl được dữ liệu:

```bash
helm upgrade --install metrics-server metrics-server/metrics-server \
  --namespace kube-system \
  --set args={--kubelet-insecure-tls}
```

**Trường hợp 2: Cụm Managed Kubernetes (EKS, GKE, AKS, v.v. có CA hợp lệ)**

```bash
helm upgrade --install metrics-server metrics-server/metrics-server \
  --namespace kube-system
```

---

## Kiểm tra sau khi cài đặt

### 1. Kiểm tra trạng thái Pod của Metrics Server
```bash
kubectl get pods -n kube-system -l app.kubernetes.io/name=metrics-server
```
*Kết quả mong đợi: Pod chuyển sang trạng thái `Running` và `Ready (1/1)`.*

### 2. Kiểm tra API Service
Kiểm tra xem API Service đăng ký với Kubernetes API Server đã sẵn sàng chưa:
```bash
kubectl get apiservice v1beta1.metrics.k8s.io
```
*Kết quả mong đợi: Cột `AVAILABLE` phải hiển thị giá trị `True`.*

### 3. Kiểm tra lệnh `kubectl top`
*Lưu ý: Có thể mất khoảng 1 đến 2 phút sau khi cài đặt để Metrics Server hoàn thành chu kỳ scrape dữ liệu đầu tiên.*

```bash
# Xem tài nguyên tiêu thụ của các Nodes
kubectl top nodes

# Xem tài nguyên tiêu thụ của các Pods
kubectl top pods -A
```

---

## Khắc phục lỗi thường gặp (Troubleshooting)

### 1. Lỗi: `x509: certificate signed by unknown authority` hoặc `Get "https://...:10250/stats/summary": TLS handshake error`
- **Nguyên nhân**: Kubelet trên các worker nodes sử dụng chứng chỉ (certificate) tự ký, làm cho Metrics Server không tin tưởng kết nối TLS đó.
- **Cách sửa**: Đảm bảo bạn đã truyền tham số `--kubelet-insecure-tls`.
  - Nếu dùng script, đặt `INSECURE_TLS="true"`.
  - Nếu cài thủ công bằng Helm command, thêm cờ `--set args={--kubelet-insecure-tls}`.

### 2. Lỗi: `kubectl top` trả về `error: Metrics API not available`
- **Nguyên nhân**: API Service `v1beta1.metrics.k8s.io` chưa được đăng ký thành công hoặc Pod Metrics Server đang bị crash/không thể kết nối.
- **Cách sửa**: 
  1. Kiểm tra log của pod: `kubectl logs -n kube-system -l app.kubernetes.io/name=metrics-server`.
  2. Kiểm tra xem APIService có bị lỗi không: `kubectl describe apiservice v1beta1.metrics.k8s.io`.
