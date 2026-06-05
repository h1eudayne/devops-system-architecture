# Bài 4: Phương pháp lựa chọn công nghệ quản lý truy cập server

Tài liệu này trình bày các phương pháp xác thực SSH truyền thống, lưu ý bảo mật quan trọng và các tiêu chí lựa chọn công cụ quản lý truy cập máy chủ (Server Access Management) trong môi trường doanh nghiệp.

---

### I. Các phương thức xác thực SSH truyền thống
SSH thông thường có 2 cách xác thực chính:
1. **Dùng mật khẩu xác thực (Password Authentication):** Đăng nhập bằng tên người dùng và mật khẩu của hệ thống.
2. **Dùng cặp khóa SSH Key (Key Authentication):** Sử dụng cặp khóa mã hóa bất đối xứng bao gồm **Public Key** (đưa lên server) và **Private Key** (giữ ở máy cá nhân).

> [!IMPORTANT]
> **Khuyến nghị bảo mật:** Nên dùng phương pháp xác thực bằng SSH Key và tắt hoàn toàn tính năng đăng nhập bằng mật khẩu (`PasswordAuthentication no` trong cấu hình SSH) để chống các cuộc tấn công Brute-force.

---

### II. Tiêu chí chọn công nghệ quản lý server doanh nghiệp
Để quản lý truy cập server quy mô lớn một cách an toàn và tiện lợi, công cụ quản lý cần đáp ứng các tiêu chí sau:

1. **Web service và open source (Mã nguồn mở & dựa trên web):**
   * Đỡ vất vả khi truy cập, người dùng có thể thao tác trực tiếp trên trình duyệt.
   * Không cần cài đặt/tải thêm công cụ bên thứ ba phức tạp ở máy cá nhân.

2. **Bảo mật mạnh mẽ:**
   * Hỗ trợ mã hóa đầu cuối (End-to-End Encryption) toàn bộ phiên làm việc.
   * Không cho phép nhập mật khẩu trực tiếp, bắt buộc xác thực bằng key ở phía server.
   * Hỗ trợ phân quyền truy cập chi tiết (RBAC - Role-Based Access Control) cho từng nhóm tài nguyên hạ tầng.

3. **Ghi log, audit và quay màn hình (Recording Screen):**
   * Lưu vết lịch sử đăng nhập, thực thi lệnh (Audit logs) phục vụ kiểm toán bảo mật.
   * Ghi hình lại toàn bộ phiên làm việc của người dùng (Session recording) dưới dạng video/text playback để đối chiếu khi có sự cố.

4. **Hỗ trợ nhiều hệ điều hành (OS) và nền tảng:**
   * Hoạt động tốt trên Linux, Windows, Database, Kubernetes, v.v.

5. **Xác thực 2 lớp (2FA/MFA):**
   * Tích hợp cơ chế xác thực đa yếu tố để tăng cường bảo mật cho cổng đăng nhập tập trung.

---

### III. Kết luận
**Teleport** là một trong các công cụ mã nguồn mở mạnh mẽ nhất hiện nay đáp ứng đầy đủ tất cả các tiêu chí khắt khe ở trên, cung cấp giải pháp Access Plain (Gateway) bảo mật tuyệt đối cho server, database và Kubernetes cluster.
