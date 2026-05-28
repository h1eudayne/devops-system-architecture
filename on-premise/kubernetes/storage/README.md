# Kubernetes Storage - Hướng dẫn cấu hình StorageClass, PV và PVC

Thư mục này chứa các template và hướng dẫn cấu hình lưu trữ trong Kubernetes, đặc biệt là sử dụng StorageClass với cơ chế cấp phát thủ công (manual provisioning) cho NFS hoặc Local Storage.

> [!IMPORTANT]
> **Lưu ý quan trọng về thiết kế và sử dụng:**
> 1. **Tài nguyên Toàn cục (Cluster-scoped):** StorageClass và PersistentVolume (PV) là tài nguyên toàn cục của cluster, **không thuộc về bất kỳ namespace nào** (không khai báo `namespace` trong metadata). Trong khi đó, PersistentVolumeClaim (PVC) là tài nguyên cục bộ và bắt buộc phải nằm chung namespace với Pod sử dụng nó.
> 2. **Tùy biến cấu trúc thư mục & Tên file:** Bạn hoàn toàn có thể tự do tạo thêm các thư mục con riêng biệt hoặc đổi tên file `.yml` để phù hợp với quy chuẩn đặt tên của dự án/tổ chức của bạn.
> 3. **Giải pháp cho On-Premise (`no-provisioner`):** Trong môi trường tự vận hành (On-Premise), do không có các API tự động cấp phát ổ đĩa của nhà cung cấp Cloud, chúng ta bắt buộc sử dụng tùy chọn `provisioner: kubernetes.io/no-provisioner`. Điều này đồng nghĩa với việc bạn phải tạo sẵn ổ cứng vật lý và định nghĩa thực thể `PersistentVolume` (PV) thủ công trước khi PVC có thể liên kết (bind).
> 4. **Sự khác biệt khi chạy trên Cloud:** Trên các môi trường đám mây (như AWS, GCP, Azure), bạn không cần dùng `no-provisioner` và không cần tạo PV thủ công. Bạn chỉ cần điền đúng tên provisioner của nhà cung cấp đám mây (ví dụ: `ebs.csi.aws.com` cho AWS EBS, `pd.csi.storage.gke.io` cho Google Persistent Disk). Khi bạn apply một PVC, hệ thống Cloud sẽ tự động lắng nghe, khởi tạo ổ cứng vật lý tương ứng và tự động tạo PV tương thích để gán trực tiếp vào PVC mà không cần bất kỳ sự can thiệp thủ công nào.


---

## 1. Các câu lệnh thường dùng

### Quản lý StorageClass (SC)
```bash
# Liệt kê tất cả StorageClass
kubectl get sc

# Xem chi tiết cấu hình StorageClass
kubectl describe sc nfs-storage
```

### Quản lý PersistentVolume (PV)
```bash
# Liệt kê tất cả PV trong cluster (PV là tài nguyên toàn cluster, không thuộc namespace)
kubectl get pv

# Xem chi tiết PV cụ thể
kubectl describe pv <ten-pv>
```

### Quản lý PersistentVolumeClaim (PVC)
```bash
# Liệt kê tất cả PVC trong namespace
kubectl get pvc -n <namespace>

# Xem chi tiết PVC cụ thể
kubectl describe pvc <ten-pvc> -n <namespace>
```

---

## 2. Quy trình cấu hình và sử dụng StorageClass thủ công (no-provisioner)

Khi sử dụng `provisioner: kubernetes.io/no-provisioner`, Kubernetes sẽ không tự động tạo ổ đĩa vật lý cho bạn. Bạn cần thực hiện theo quy trình 3 bước sau:

### Bước 1: Tạo StorageClass
Sử dụng file template [storageclass.yml.example](storageclass.yml.example) (bỏ đuôi `.example`):
```bash
kubectl apply -f storageclass.yml
```

### Bước 2: Tạo PersistentVolume (PV) thủ công
Do dùng `no-provisioner`, bạn cần khai báo PV thủ công trỏ tới thư mục NFS đã export trên NFS Server.

Sử dụng file template [pv.yml.example](pv.yml.example) (bỏ đuôi `.example`):
```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: nfs-pv
spec:
  capacity:
    storage: 10Gi
  volumeMode: Filesystem
  accessModes:
    - ReadWriteMany
  persistentVolumeReclaimPolicy: Retain
  storageClassName: nfs-storage
  nfs:
    path: /data
    server: 192.168.1.115
```
*Lưu ý: Thay thế `path` và `server` trỏ đúng cấu hình NFS thực tế của bạn (ví dụ: `192.168.1.115` và `/data`).*

Apply PV:
```bash
kubectl apply -f pv.yml
```

### Bước 3: Tạo PersistentVolumeClaim (PVC) trong ứng dụng
Ứng dụng sẽ yêu cầu dung lượng lưu trữ thông qua PVC.

Sử dụng file template [pvc.yml.example](pvc.yml.example) (bỏ đuôi `.example`):
```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: nfs-pvc
  namespace: ecommerce
spec:
  accessModes:
    - ReadWriteMany
  resources:
    requests:
      storage: 5Gi
  storageClassName: nfs-storage
```
*Lưu ý: Thay thế `namespace` và `storage` cho phù hợp với yêu cầu thực tế của ứng dụng.*

Apply PVC:
```bash
kubectl apply -f pvc.yml
```

---

## 3. Gắn PVC vào Pod / Deployment

Trong spec của Pod hoặc Deployment, gắn PVC đã tạo vào container:

```yaml
spec:
  containers:
    - name: web-app
      image: nginx:alpine
      volumeMounts:
        - name: storage-volume
          mountPath: /usr/share/nginx/html
  volumes:
    - name: storage-volume
      persistentVolumeClaim:
        claimName: app-nfs-pvc
```
