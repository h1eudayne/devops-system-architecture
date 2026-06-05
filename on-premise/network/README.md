# Kiến Trúc Mạng & Hạ Tầng (Network Architecture)

Thư mục này chứa tài liệu mô tả kiến trúc mạng nội bộ (On-premise) và mô hình kết nối với đám mây (Cloud) trong hạ tầng doanh nghiệp.

## Danh Sách Bài Học

1. **[Bài 1: Mô hình mạng nội bộ](./01-intranet-network-model.md)**
   * Sơ đồ kết nối thiết bị đầu cuối, Switch, Server trung tâm, Router định tuyến ra ngoài internet.
   * So sánh mô hình On-premise và mô hình Cloud (Public / Private).

2. **[Bài 2: Lưu ý khi khởi tạo môi trường thực tế](./02-environment-initialization-notes.md)**
   * Cấu hình card mạng máy ảo (Bridge vs NAT) và giải quyết xung đột DHCP.
   * Kiểm tra IP Public, cơ chế CGNAT của nhà mạng và các giải pháp public dịch vụ (Port-forwarding, Cloudflare Tunnels).
