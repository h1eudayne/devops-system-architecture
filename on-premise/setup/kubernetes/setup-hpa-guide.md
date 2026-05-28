# Hướng dẫn Cài đặt & Cấu hình HPA (Horizontal Pod Autoscaler) trên Kubernetes

Tài liệu này hướng dẫn chi tiết các bước từ cài đặt Metrics Server trên Control Plane, khắc phục các sự cố thường gặp thông qua giao diện Rancher, đến việc thiết lập Horizontal Pod Autoscaler (HPA) để tự động co giãn số lượng Pod ứng dụng.

---

## 1. Cài đặt Metrics Server

Metrics Server là thành phần bắt buộc để Kubernetes có thể thu thập dữ liệu sử dụng tài nguyên (CPU, Memory) của các Pod và Node.

### Thực hiện trên máy chủ Control Plane (Master Node) gốc:
Chúng tôi đã chuẩn bị sẵn một script tự động hóa đơn giản để cài đặt nhanh chóng bằng Helm:
- Đường dẫn script cài đặt: [install-metrics-server.sh.example](../templates/shared/metrics-server/install-metrics-server.sh.example)

Chạy các câu lệnh sau từ Control Plane:
```bash
# 1. Di chuyển tới thư mục chứa script
cd templates/shared/metrics-server/

# 2. Copy và chạy script cài đặt
cp install-metrics-server.sh.example install-metrics-server.sh
chmod +x install-metrics-server.sh
./install-metrics-server.sh
```

> [!NOTE]
> Để tìm hiểu chi tiết về cài đặt thủ công và cấu hình tùy chỉnh nâng cao của Metrics Server, vui lòng tham khảo tài liệu: [Metrics Server README](../templates/shared/metrics-server/README.md).

---

## 2. Khắc phục sự cố trên giao diện Rancher (Fix lỗi)

Trong một số cụm Kubernetes chạy qua Rancher hoặc tự dựng (On-Premise), Metrics Server có thể không hoạt động hoặc không crawl được chỉ số do lỗi bảo mật chứng chỉ TLS tự ký của Kubelet hoặc trùng lặp cổng kết nối. Bạn có thể sửa nhanh chóng qua giao diện Rancher như sau:

### Các bước sửa lỗi trên giao diện Rancher (Rancher UI):
1. **Chọn Namespace**: Từ thanh menu điều hướng của Rancher, chọn namespace **`kube-system`**.
2. **Tìm Workload**: Truy cập mục **Workloads** > Tìm Deployment có tên **`metrics-server`**.
3. **Chỉnh sửa cấu hình**: Nhấp chuột vào nút tùy chọn của Deployment này và chọn **`Edit YAML`**.
4. **Sửa đổi Cổng kết nối (Ports)**:
   - Trong YAML, tìm tất cả các tham số cấu hình cổng kết nối liên quan (`containerPort`, `targetPort`, hoặc cổng cấu hình bên dưới tham số `--secure-port`).
   - Sửa toàn bộ các giá trị cổng này thành **`4443`**.
5. **Thêm cấu hình bỏ qua TLS của Kubelet**:
   - Tìm đến mục danh sách tham số khởi chạy container (`args`).
   - Thêm tham số cấu hình sau vào danh sách (dưới container chính):
     ```yaml
     args:
       - --kubelet-insecure-tls=true
     ```
6. **Lưu cấu hình**: Nhấp nút **`Save`**. Rancher sẽ tự động cập nhật và khởi chạy lại Pod Metrics Server mới với cấu hình sửa đổi.

---

## 3. Kiểm tra hoạt động của Metrics API

Sau khi hoàn tất cài đặt và chỉnh sửa cấu hình khoảng 1 phút, chạy các câu lệnh dưới đây để kiểm tra dữ liệu tài nguyên:

### Kiểm tra tài nguyên tiêu thụ của các Nodes:
```bash
kubectl top nodes
```
*Kết quả hiển thị chính xác lượng CPU và Memory đang tiêu thụ của từng Node.*

### Kiểm tra tài nguyên tiêu thụ của Pods theo Namespace:
```bash
kubectl top pod -n <namespace-cua-ban>
```
*Hãy thay thế `<namespace-cua-ban>` bằng namespace thực tế của ứng dụng của bạn.*

---

## 4. Hoàn thiện file YAML cấu hình HPA cho ứng dụng

Khi Metrics Server đã hoạt động hoàn toàn ổn định, bạn có thể áp dụng HPA để tự động điều chỉnh số lượng Pod.

### Bước 4.1: Sử dụng mẫu cấu hình HPA có sẵn
Chúng tôi đã chuẩn bị sẵn một tệp mẫu HPA tối giản, dễ hiểu và dễ sử dụng:
- Đường dẫn HPA mẫu: [hpa.yml.example](../templates/kubernetes/hpa/hpa.yml.example)

Sao chép và đổi tên tệp cấu hình:
```bash
cd templates/kubernetes/hpa/
cp hpa.yml.example hpa.yml
```

### Bước 4.2: Tùy chỉnh thông số trong `hpa.yml`
Mở file `hpa.yml` và chỉnh sửa các tham số placeholder cho phù hợp với ứng dụng:
- Thay `<APP_NAME>` bằng tên ứng dụng của bạn.
- Thay `<NAMESPACE>` bằng namespace ứng dụng đang chạy.
- Thay đổi `minReplicas` (số lượng Pod tối thiểu) và `maxReplicas` (số lượng Pod tối đa) nếu cần thiết.

### Bước 4.3: Triển khai HPA
```bash
kubectl apply -f hpa.yml
```

> [!IMPORTANT]
> - Để HPA hoạt động tốt, hãy chắc chắn rằng bạn đã khai báo `resources.requests` cho các container trong file deployment của ứng dụng.
> - Chi tiết các lệnh quản lý HPA nâng cao (`kubectl get`, `describe`, `delete`) và cơ chế chống dao động Pod (flapping) được hướng dẫn cụ thể tại: [HPA README](../templates/kubernetes/hpa/README.md).
