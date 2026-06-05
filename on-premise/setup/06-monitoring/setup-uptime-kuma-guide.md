# Hướng dẫn Cài đặt Uptime Kuma trên Kubernetes (On-Premise)

Tài liệu này hướng dẫn chi tiết các bước thiết lập và triển khai **Uptime Kuma** (công cụ giám sát trạng thái dịch vụ self-hosted) sử dụng Helm Chart kết hợp với hệ thống lưu trữ **NFS Storage (PV & PVC)** và **Ingress** để cấu hình tên miền truy cập, kèm theo bước sửa lỗi phân giải tên miền (DNS Host Aliases).

## Điều kiện cần

- Cụm K8s đã hoạt động — [Hướng dẫn dựng cụm K8s](../kubernetes/setup-cluster-guide.md)
- Helm đã cài đặt — [Hướng dẫn cài đặt Helm](../kubernetes/install-helm-guide.md)
- NFS Server đã cấu hình — [Hướng dẫn cài đặt NFS Server](../nfs/nfs-server-guide.md)
- Ingress Nginx Controller đã cài đặt — [Hướng dẫn cài đặt Ingress Nginx](../kubernetes/install-ingress-nginx-guide.md)

---

## Bước 1: Tạo thư mục dữ liệu trên NFS Server

Thực hiện trên **NFS Server** (ví dụ: databaseserver):

```bash
sudo mkdir -p /data/monitoring
sudo chown -R nobody:nogroup /data/
sudo chmod -R 777 /data
```

> **Lưu ý**: Đảm bảo thư mục `/data/monitoring` đã được khai báo chia sẻ trong tệp `/etc/exports` của NFS Server.

---

## Bước 2: Tạo PersistentVolume (PV) và PersistentVolumeClaim (PVC)

Áp dụng tệp cấu hình PV và PVC để lưu trữ dữ liệu bền vững cho Uptime Kuma trong namespace `monitoring`.

1. **Tạo namespace `monitoring`** (nếu chưa có):
   ```bash
   kubectl create ns monitoring
   ```

2. **Tạo file `uptime-kuma-pv-pvc.yml`**:
   ```yaml
   apiVersion: v1
   kind: PersistentVolume
   metadata:
     name: uptime-kuma-pv
   spec:
     capacity:
       storage: 5Gi
     accessModes:
       - ReadWriteOnce
     nfs:
       path: /data/monitoring
       server: 192.168.1.115  # Thay đổi thành IP của NFS Server của bạn
     persistentVolumeReclaimPolicy: Retain
     storageClassName: nfs-storage
   ---
   apiVersion: v1
   kind: PersistentVolumeClaim
   metadata:
     name: uptime-kuma-pvc
     namespace: monitoring
   spec:
     accessModes:
       - ReadWriteOnce
     resources:
       requests:
         storage: 5Gi
     storageClassName: nfs-storage
   ```

3. **Áp dụng cấu hình**:
   ```bash
   kubectl apply -f uptime-kuma-pv-pvc.yml
   ```

> **Template có sẵn**: [uptime-kuma-pv-pvc.yml.example](../../kubernetes/storage/uptime-kuma-pv-pvc.yml.example)

---

## Bước 3: Thêm Helm Repo và Cài đặt Uptime Kuma với values.yaml

Sử dụng Helm Chart để cài đặt Uptime Kuma và liên kết với PVC đã tạo.

1. **Thêm Helm Repository**:
   ```bash
   helm repo add uptime-kuma https://dirsigler.github.io/uptime-kuma-helm
   helm repo update
   ```

2. **Tạo file `values.yaml`**:
   ```yaml
   volume:
     enabled: true
     accessMode: ReadWriteOnce
     existingClaim: "uptime-kuma-pvc"
   ```

3. **Tiến hành cài đặt**:
   ```bash
   helm install uptime-kuma uptime-kuma/uptime-kuma --values values.yaml --namespace monitoring
   ```

> **Template values có sẵn**: [values.yml.example](../../kubernetes/uptime-kuma/values.yml.example)

---

## Bước 4: Tạo Ingress cấu hình Domain

Cấu hình Ingress để truy cập Web UI của Uptime Kuma từ bên ngoài qua tên miền `uptime.devops.hieuduyne.tech`.

1. **Tạo file `uptime-ingress.yml`**:
   ```yaml
   apiVersion: networking.k8s.io/v1
   kind: Ingress
   metadata:
     name: uptime-ingress
     namespace: monitoring
   spec:
     ingressClassName: nginx
     rules:
       - host: uptime.devops.hieuduyne.tech
         http:
           paths:
             - backend:
                 service:
                   name: uptime-kuma
                   port:
                     number: 3001
               path: /
               pathType: Prefix
   ```

2. **Áp dụng cấu hình**:
   ```bash
   kubectl apply -f uptime-ingress.yml
   ```

> **Template Ingress có sẵn**: [ingress.yml.example](../../kubernetes/uptime-kuma/ingress.yml.example)

---

## Bước 5: Sửa lỗi phân giải tên miền (Fix bug add host domain)

Khi chạy môi trường nội bộ On-premise, Pod Uptime Kuma có thể gặp lỗi không phân giải được chính xác tên miền `uptime.devops.hieuduyne.tech`. Cần thêm cấu hình `HostAliases` để định cấu hình file `/etc/hosts` bên trong Pod.

### Cách 1: Cấu hình qua giao diện Rancher UI
1. Truy cập **Rancher UI** > Chọn Cluster của bạn.
2. Vào mục **Workloads** > Tìm ứng dụng `kuma-uptime` hoặc `uptime-kuma`.
3. Click vào biểu tượng 3 chấm ở góc phải > Chọn **Edit Config**.
4. Di chuyển xuống phần cấu hình **Pod** > Mở tab **Networking**.
5. Tìm đến phần **Add Alias**.
6. Nhập thông tin:
   - **IP**: IP của máy chủ chạy Ingress Controller hoặc Nginx Load Balancer (Ví dụ: `192.168.1.115`).
   - **Hostnames**: `uptime.devops.hieuduyne.tech`
7. Click **Save** để cập nhật và khởi động lại Pod.

### Cách 2: Cập nhật trực tiếp bằng YAML Manifest
Thêm đoạn cấu hình `hostAliases` vào dưới trường `spec.template.spec` trong file Deployment của Uptime Kuma:

```yaml
spec:
  template:
    spec:
      hostAliases:
        - ip: "192.168.1.115"  # Thay đổi thành IP Ingress Nginx / Load Balancer tương ứng
          hostnames:
            - "uptime.devops.hieuduyne.tech"
```

Áp dụng thay đổi:
```bash
kubectl edit deployment uptime-kuma -n monitoring
```

---

## Tài liệu liên quan

| Chủ đề | Đường dẫn |
|---|---|
| Dựng cụm K8s | [setup-cluster-guide.md](../kubernetes/setup-cluster-guide.md) |
| Cài đặt Helm | [install-helm-guide.md](../kubernetes/install-helm-guide.md) |
| Cài đặt NFS Server | [nfs-server-guide.md](../nfs/nfs-server-guide.md) |
| Cài đặt Ingress Nginx | [install-ingress-nginx-guide.md](../kubernetes/install-ingress-nginx-guide.md) |
| PV/PVC Uptime Kuma | [uptime-kuma-pv-pvc.yml.example](../../kubernetes/storage/uptime-kuma-pv-pvc.yml.example) |
| Values Uptime Kuma | [values.yml.example](../../kubernetes/uptime-kuma/values.yml.example) |
| Ingress Uptime Kuma | [ingress.yml.example](../../kubernetes/uptime-kuma/ingress.yml.example) |
