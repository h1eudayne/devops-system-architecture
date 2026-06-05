# Cài đặt và cấu hình NFS Client trên Ubuntu Nodes

Hướng dẫn này giúp bạn cài đặt và cấu hình NFS (Network File System) Client trên các máy chủ Linux (ví dụ: `k8s-master-1`, `k8s-master-2`, `k8s-master-3` và các worker nodes).

> [!IMPORTANT]
> **Lưu ý quan trọng:**
> - **Cài đặt và cấu hình NFS Client trên tất cả server muốn kết nối đến NFS Server.**
> - Trong môi trường Kubernetes, để cụm có thể mount thành công các tệp lưu trữ từ NFS Server vào trong Pod, tất cả các node trong cụm (cả Master và Worker) **bắt buộc** phải cài đặt gói dịch vụ `nfs-common`. Nếu thiếu gói này, Kubelet sẽ không thể thực hiện lệnh mount và Pod sẽ bị kẹt ở trạng thái `ContainerCreating` hoặc gặp lỗi `MountVolume.SetUp failed`.

---

## 1. Hướng dẫn cài đặt nhanh (Thủ công)

Chạy các lệnh dưới đây với quyền `sudo` trên **tất cả** các node trong cụm Kubernetes:

### Bước 1: Cập nhật chỉ mục gói dịch vụ
```bash
sudo apt update
```

### Bước 2: Cài đặt gói nfs-common
```bash
sudo apt install -y nfs-common
```

### Bước 3: Xác minh cài đặt thành công
Kiểm tra phiên bản tiện ích mount NFS để chắc chắn gói đã chạy:
```bash
mount.nfs -V
```

---

## 2. Kiểm tra kết nối tới NFS Server

Trước khi cấu hình PersistentVolume (PV) trong Kubernetes, bạn nên kiểm tra xem Client Node có thể kết nối thông suốt tới NFS Server hay không:

### Bước 1: Kiểm tra cổng dịch vụ 2049
NFS sử dụng cổng mặc định `2049`. Chạy lệnh sau từ Client Node (thay `10.0.0.10` bằng IP thực tế của NFS Server):
```bash
nc -zv 10.0.0.10 2049
```
*Kết quả mong muốn: `Connection to 10.0.0.10 2049 port [tcp/nfs] succeeded!`*

### Bước 2: Thử mount thủ công
Tạo thư mục tạm thời và mount thử để kiểm tra phân quyền ghi/đọc:
```bash
# Tạo thư mục test tạm thời
sudo mkdir -p /mnt/nfs_client_test

# Thực hiện mount
sudo mount -t nfs 10.0.0.10:/data /mnt/nfs_client_test

# Kiểm tra danh sách mount
df -h | grep /mnt/nfs_client_test

# Ghi tệp tin kiểm tra phân quyền
echo "Client node test write" | sudo tee /mnt/nfs_client_test/client_test.txt

# Đọc tệp tin vừa ghi
cat /mnt/nfs_client_test/client_test.txt
```

### Bước 3: Gỡ mount (Umount) sau khi kiểm tra xong
```bash
sudo umount /mnt/nfs_client_test
sudo rm -rf /mnt/nfs_client_test
```
