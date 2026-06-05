# Cài đặt và cấu hình NFS Server trên Ubuntu (database-server)

Hướng dẫn này giúp bạn tự cài đặt và cấu hình NFS (Network File System) Server trên một máy chủ Linux (ví dụ: `database-server`) để chia sẻ thư mục lưu trữ cho các máy khách khác trong hệ thống (như các Node Kubernetes hoặc các Web Server).

> [!IMPORTANT]
> **Lưu ý quan trọng về gói cài đặt:**
> Trên hệ điều hành Ubuntu/Debian, gói quản lý NFS Server thực tế chạy trực tiếp trong nhân hệ thống là **`nfs-kernel-server`**. Việc cài đặt gói này sẽ đảm bảo tính tương thích tốt nhất và cho hiệu năng truyền tải dữ liệu cao nhất.

---

## 1. Khi nào nên dùng?

- Cần một hệ thống lưu trữ tập trung (Shared Storage) chi phí thấp cho môi trường On-Premise.
- Cấu hình StorageClass trong Kubernetes sử dụng cơ chế thủ công (`no-provisioner`) hoặc NFS Subdir External Provisioner.
- Chia sẻ thư mục dữ liệu giữa nhiều máy chủ để thực hiện đồng bộ (ví dụ: thư mục upload ảnh, tệp tin tĩnh của web server).

---

## 2. Hướng dẫn cài đặt nhanh (Thủ công)

Chạy các lệnh dưới đây với quyền `sudo` trên máy chủ đóng vai trò NFS Server (`database-server`):

### Bước 1: Cập nhật chỉ mục gói dịch vụ
```bash
sudo apt update
```

### Bước 2: Cài đặt dịch vụ NFS Kernel Server
```bash
sudo apt install -y nfs-kernel-server
```

### Bước 3: Tạo thư mục lưu trữ chia sẻ
Ở đây ta tạo thư mục `/data` để chứa toàn bộ dữ liệu dùng chung:
```bash
sudo mkdir -p /data
```

### Bước 4: Cấu hình phân quyền thư mục
Gán quyền sở hữu cho người dùng vô danh (`nobody:nogroup`) để các client kết nối tới không bị chặn ghi file:
```bash
sudo chown -R nobody:nogroup /data
sudo chmod -R 777 /data
```

### Bước 5: Cấu hình xuất bản thư mục chia sẻ
Mở file cấu hình `/etc/exports`:
```bash
sudo vi /etc/exports
```
Thêm dòng cấu hình sau vào cuối file để chia sẻ thư mục cho mọi client (`*`):
```text
/data *(rw,sync,no_subtree_check,no_root_squash)
```

> [!TIP]
> **Khuyến nghị bảo mật nâng cao:**
> Tránh sử dụng dấu `*` (cho phép tất cả IP). Hãy thay thế bằng dải subnet IP cụ thể của cụm máy chủ hoặc cụm Kubernetes của bạn:
> - Giới hạn theo dải mạng: `/data 10.0.0.0/24(rw,sync,no_subtree_check,no_root_squash)`
> - Giới hạn cho 1 IP cụ thể: `/data 10.0.0.15(rw,sync,no_subtree_check,no_root_squash)`

**Giải thích các tùy chọn cấu hình:**
- `rw` (Read/Write): Cho phép client có cả quyền đọc và ghi dữ liệu trên thư mục chia sẻ.
- `sync`: Yêu cầu ghi các thay đổi vào đĩa cứng vật lý trước khi phản hồi thành công về client (an toàn dữ liệu, chống mất mát khi mất điện đột ngột).
- `no_subtree_check`: Vô hiệu hóa việc kiểm tra cây thư mục con giúp tăng tốc độ truyền tải tệp và độ ổn định khi client đổi tên file đang mở.
- `no_root_squash`: Cho phép người dùng `root` ở phía client có quyền tương đương `root` ở phía server đối với thư mục chia sẻ này (cực kỳ quan trọng khi chạy các container Kubernetes chạy bằng quyền root).

### Bước 6: Áp dụng cấu hình và cập nhật danh sách chia sẻ
```bash
sudo exportfs -rav
```

### Bước 7: Khởi động lại và kích hoạt tự động chạy dịch vụ cùng hệ thống
```bash
sudo systemctl restart nfs-kernel-server
sudo systemctl enable nfs-kernel-server
```

---

## 3. Cấu hình Tường lửa (Firewall - UFW)

NFS Server sử dụng cổng mặc định **2049** (cả TCP và UDP). Nếu bạn bật UFW, hãy mở cổng này:

```bash
# Cho phép tất cả truy cập tới cổng NFS (Không khuyến nghị)
sudo ufw allow 2049

# Khuyến nghị: Chỉ cho phép dải IP tin cậy truy cập cổng NFS
sudo ufw allow from 10.0.0.0/24 to any port 2049 proto tcp
sudo ufw allow from 10.0.0.0/24 to any port 2049 proto udp

# Tải lại cấu hình tường lửa
sudo ufw reload
```

---

## 4. Kiểm tra hoạt động của NFS Server

### Xem các thư mục đang được chia sẻ (export) trên Server:
```bash
sudo exportfs -v
```
Kết quả mong muốn sẽ hiển thị đường dẫn thư mục cùng với danh sách IP và quyền tương ứng đã cấu hình.

### Xem trạng thái dịch vụ:
```bash
sudo systemctl status nfs-kernel-server
```

---

## 5. Hướng dẫn kiểm tra kết nối từ phía Client Node

Để chắc chắn NFS Server hoạt động đúng, bạn có thể thực hiện mount thử từ một Client bất kỳ trong cùng mạng:

### Bước 1: Cài đặt gói hỗ trợ NFS Client trên Client Node
```bash
sudo apt update
sudo apt install -y nfs-common
```

### Bước 2: Tạo thư mục đích để mount thử
```bash
sudo mkdir -p /mnt/nfs_test
```

### Bước 3: Thực hiện Mount thư mục chia sẻ
Thay `10.0.0.10` bằng IP thực tế của `database-server` (NFS Server):
```bash
sudo mount -t nfs 10.0.0.10:/data /mnt/nfs_test
```

### Bước 4: Kiểm tra trạng thái mount và phân quyền ghi
```bash
# Kiểm tra phân vùng mount thành công
df -h | grep /mnt/nfs_test

# Thử tạo file kiểm tra ghi dữ liệu
echo "NFS connection test success" | sudo tee /mnt/nfs_test/test.txt

# Kiểm tra nội dung file vừa tạo
cat /mnt/nfs_test/test.txt
```

### Bước 5: Umuont thư mục sau khi kiểm tra xong
```bash
sudo umount /mnt/nfs_test
```
