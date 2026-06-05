# Bài 5: Triển khai công cụ quản lý truy cập máy chủ (Teleport)

Tài liệu này hướng dẫn cách triển khai công cụ quản lý truy cập máy chủ tập trung (Teleport) trên môi trường On-Premise, bao gồm các bước cấu hình Load Balancer, trỏ DNS và cài đặt Nginx.

---

### I. Đánh giá phương án cài đặt Teleport trên On-Premise

Khi quyết định cài đặt công cụ quản lý truy cập (ví dụ: Teleport) trực tiếp trên hạ tầng On-Premise, cần cân nhắc kỹ các ưu điểm và nhược điểm sau:

*   **Ưu điểm:**
    *   Tận dụng trực tiếp hạ tầng nội bộ của doanh nghiệp, giúp tăng tính bảo mật và kiểm soát dữ liệu.
    *   Tạo tính đồng nhất trong việc quản trị và giám sát các luồng truy cập ra/vào hệ thống.
*   **Nhược điểm:**
    *   Nếu hệ thống On-Premise gặp lỗi hàng loạt (ví dụ: mất điện, mất mạng diện rộng, lỗi phần cứng), server Teleport cũng sẽ bị sập theo.
    *   Khi hạ tầng phân bố ở nhiều nơi (bao gồm cả Cloud hay các cụm Kubernetes cluster bên ngoài), việc mất kết nối tới Teleport On-Premise sẽ làm mất quyền kiểm soát toàn bộ hệ thống phân tán.

---

### II. Các bước triển khai ban đầu

#### 1. Chuẩn bị mô hình
Thiết lập bao gồm máy chủ Load Balancer (chạy Nginx) đóng vai trò làm Gateway tiếp nhận yêu cầu, phân phối lưu lượng và chuyển hướng truy cập tới các node Teleport phía sau.

#### 2. Trỏ tên miền (Domain) về IP Public
Để truy cập dịch vụ từ ngoài Internet qua giao diện Web hoặc Terminal Client, chúng ta cần liên kết một tên miền hoặc phụ miền (sub-domain) với địa chỉ IP Public của máy chủ.

1.  **Kiểm tra IP Public hiện tại của server:**
    Chạy lệnh sau trên terminal của server Teleport:
    ```bash
    curl -4 ifconfig.me
    ```
    *(Kết quả hiển thị địa chỉ IP Public dạng IPv4 của đường truyền mạng)*
    
    ![Kiểm tra IP Public](../../images/setup/teleport_curl_ip.png)

2.  **Cấu hình DNS Record (Ví dụ trên Cloudflare):**
    *   Truy cập bảng quản trị DNS của nhà đăng ký tên miền.
    *   Thêm một bản ghi mới (**Add Record**).
    *   Điền các thông tin:
        *   **Type (Loại bản ghi):** `A`
        *   **Name (Tên miền phụ):** `teleport-onpre` (hoặc tên miền mong muốn, tạo thành FQDN `teleport-onpre.h1eudayne.work`).
        *   **IPv4 address (Địa chỉ IP):** Nhập IP Public vừa lấy được ở bước trên.
        *   **Proxy status:** Bật/Tắt đám mây Cloudflare Proxy (tùy thuộc nhu cầu ẩn IP gốc và sử dụng SSL/TLS của Cloudflare).
    *   Nhấn **Save** để lưu bản ghi.

    ![Cấu hình DNS Cloudflare](../../images/setup/teleport_cloudflare_dns.png)

#### 3. Setup Nginx Load Balancer
Cài đặt Nginx làm Proxy ngược (Reverse Proxy) / Load Balancer để tiếp nhận và phân phối các kết nối HTTP/HTTPS cũng như SSH tunnel của Teleport.

1.  **Cài đặt Nginx trên Ubuntu/Debian:**
    Cập nhật danh sách gói và cài đặt gói `nginx`:
    ```bash
    sudo apt update
    sudo apt install nginx -y
    ```
    
2.  **Kiểm tra trạng thái hoạt động:**
    Truy cập trực tiếp địa chỉ IP Private của máy chủ Load Balancer qua trình duyệt web (`http://<IP_load_balancer>`). Nếu hiển thị trang chào mừng mặc định của Nginx thì việc cài đặt ban đầu đã thành công.

    ![Welcome to Nginx](../../images/setup/teleport_nginx_welcome.png)

#### 4. Setup Port Forwarding (Thông qua Cloudflare Tunnel)
Để người dùng từ ngoài Internet có thể truy cập vào Load Balancer nội bộ mà không cần phải mở port (port forwarding) thủ công trên modem mạng, chúng ta sử dụng giải pháp **Cloudflare Tunnel (Cloudflare Zero Trust)**. Phương pháp này giúp tạo một kết nối outbound an toàn từ server tới Cloudflare, mã hóa toàn bộ lưu lượng và trỏ domain trực tiếp về Nginx Load Balancer.

Các bước thiết lập như sau:

1.  **Truy cập Cloudflare Zero Trust:**
    *   Đăng nhập vào Cloudflare Dashboard.
    *   Di chuyển tới menu **Protect & Connect** -> **Zero Trust**.
    *   Nếu chưa thiết lập gói cước Zero Trust, nhấn **Get started** và làm theo hướng dẫn để chọn gói dịch vụ (chọn gói Free).

    ![Welcome to Cloudflare Zero Trust](../../images/setup/teleport_cloudflare_zt_welcome.png)

2.  **Khởi tạo Tunnel:**
    *   Trong menu bên trái của Zero Trust Dashboard, chọn **Networks** -> **Tunnels** (hoặc chọn **Networks** -> **Overview** -> **Manage Tunnels**).
    *   Nhấn chọn **Create a tunnel** (hoặc **Add a Tunnel**).

    ![Manage Tunnels](../../images/setup/teleport_cloudflare_zt_tunnels.png)

3.  **Đặt tên cho Tunnel:**
    *   Nhập tên gợi nhớ đại diện cho hạ tầng của bạn (ví dụ: `h1eudayne`).
    *   Nhấn **Save tunnel**.

    ![Name your tunnel](../../images/setup/teleport_cloudflare_zt_create_tunnel.png)

4.  **Cài đặt và chạy Cloudflare Connector (cloudflared):**
    *   Tại tab **Install and run connectors**, chọn hệ điều hành tương ứng với máy chủ chạy Nginx Load Balancer (Ví dụ: `Debian` hoặc `Windows`/`Ubuntu` tùy theo môi trường).
    *   Hệ thống sẽ cung cấp lệnh cài đặt và token xác thực duy nhất dưới dạng:
        ```bash
        cloudflared.exe service install eyJhIjo...
        ```
    *   Sao chép lệnh cài đặt và chạy trên máy chủ để cài đặt daemon/dịch vụ `cloudflared`.
    *   Sau khi chạy thành công, trạng thái kết nối ở phần **Connectors** phía dưới sẽ báo xanh (Active).
    *   Nhấn **Next** để hoàn tất cấu hình định tuyến (Route traffic) trỏ tên miền phụ về dịch vụ Nginx Load Balancer nội bộ (`http://localhost` hoặc IP nội bộ).

    ![Install and run connectors](../../images/setup/teleport_cloudflare_zt_connector.png)

