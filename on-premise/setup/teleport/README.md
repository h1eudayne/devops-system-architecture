# Cài Đặt và Cấu Hình Teleport (Teleport Setup)

Thư mục này chứa tài liệu và cấu hình phục vụ việc triển khai cổng quản lý truy cập máy chủ Teleport tập trung trên môi trường On-Premise.

## Danh Sách Hướng Dẫn

1. **[Bài 5: Triển khai công cụ quản lý truy cập máy chủ (Teleport)](./05-deploy-server-access-management.md)**
   * **Phần I: Triển khai Teleport trên môi trường On-Premise**
     * Đánh giá ưu/nhược điểm khi chạy Teleport On-Premise.
     * Tạo bản ghi DNS, thiết lập Nginx Load Balancer ban đầu.
     * Cấu hình Port Forwarding bằng Cloudflare Tunnel (Zero Trust).
     * Tải và cài đặt các tệp tin thực thi binary của Teleport.
     * Khởi tạo tệp tin cấu hình `teleport.yaml` cho Teleport Server.
     * Cấu hình file systemd service quản lý dịch vụ Teleport (`teleport.service`).
     * Kiểm tra truy cập cục bộ và cấu hình Nginx Load Balancer (`lb.conf` + SSL Certbot).
     * Kiểm tra và gỡ lỗi (Troubleshooting) kết nối qua domain và Cloudflare Tunnel.
     * Khởi tạo tài khoản quản trị Teleport (`admin`).
   * **Phần II: Triển khai Teleport trên Cloud (AWS - EC2)**
     * Khởi tạo máy chủ EC2 Instance và mở port 22/80/443 trong Security Group.
     * Cập nhật bản ghi DNS A record trên Cloudflare (lưu ý chế độ DNS Only khi xin SSL ACME).
     * Cài đặt Teleport Binaries qua script tự động.
     * Tạo liên kết mềm (symlink) cho các lệnh trong `/usr/local/bin/`.
     * Tự động sinh file cấu hình ACME Let's Encrypt `/etc/teleport.yaml`.
     * Khởi chạy dịch vụ Teleport bằng Systemd Service tự động tạo.
     * Tạo tài khoản quản trị `admin` cho phép đăng nhập dưới quyền `root` và `ubuntu`.




