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
    
    ![Kiểm tra IP Public](../../../images/setup/teleport_curl_ip.png)

2.  **Cấu hình DNS Record (Ví dụ trên Cloudflare):**
    *   Truy cập bảng quản trị DNS của nhà đăng ký tên miền.
    *   Thêm một bản ghi mới (**Add Record**).
    *   Điền các thông tin:
        *   **Type (Loại bản ghi):** `A`
        *   **Name (Tên miền phụ):** `teleport-onpre` (hoặc tên miền mong muốn, tạo thành FQDN `teleport-onpre.h1eudayne.work`).
        *   **IPv4 address (Địa chỉ IP):** Nhập IP Public vừa lấy được ở bước trên.
        *   **Proxy status:** Bật/Tắt đám mây Cloudflare Proxy (tùy thuộc nhu cầu ẩn IP gốc và sử dụng SSL/TLS của Cloudflare).
    *   Nhấn **Save** để lưu bản ghi.

    ![Cấu hình DNS Cloudflare](../../../images/setup/teleport_cloudflare_dns.png)

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

    ![Welcome to Nginx](../../../images/setup/teleport_nginx_welcome.png)

3.  **Cấu hình SSL/TLS với Certbot (Let's Encrypt):**
    Để cổng bảo mật HTTPS hoạt động bình thường, chúng ta cần cấp phát chứng chỉ SSL/TLS miễn phí từ Let's Encrypt cho tên miền phụ đã trỏ:
    
    *   **Cài đặt Certbot và các gói hỗ trợ:**
        ```bash
        sudo apt install apache2-utils certbot python3-certbot-nginx -y
        ```
    
    *   **Tạo chứng chỉ SSL ở chế độ Standalone:**
        > [!WARNING]
        > Trước khi chạy lệnh dưới đây, hãy tạm thời dừng Nginx để giải phóng cổng `80` phục vụ việc xác thực domain:
        > `sudo systemctl stop nginx`
        
        ```bash
        sudo certbot certonly --standalone -d teleport-onpre.h1eudayne.work --preferred-challenges http --agree-tos -m voduchieu42@gmail.com --keep-until-expiring
        ```
        *(Sau khi tạo thành công, khởi động lại dịch vụ Nginx: `sudo systemctl start nginx`)*
        
        *(Để tìm hiểu chi tiết hơn về cách thức hoạt động và tự động gia hạn, vui lòng tham khảo [Hướng dẫn cấu hình Certbot](../../setup/certbot/README.md))*

4.  **Cấu hình Nginx Load Balancer (lb.conf):**
    > [!TIP]
    > Bạn có thể sử dụng trực tiếp tệp tin mẫu có sẵn: [nginx-teleport-lb.conf.template](./templates/nginx-teleport-lb.conf.template) hoặc [teleport-lb.conf.template](../../nginx/teleport-lb.conf.template) và thay thế các biến cấu hình tương ứng.
    
    Tạo mới tệp tin cấu hình máy chủ ảo cho Nginx tại `/etc/nginx/conf.d/lb.conf`:
    ```bash
    sudo vi /etc/nginx/conf.d/lb.conf
    ```
    
    Sao chép nội dung cấu hình dưới đây (Nginx Load Balancer này sẽ chuyển tiếp lưu lượng ngược về địa chỉ IP nội bộ của Teleport Server thực tế - ví dụ: `192.168.209.102:443`):
    ```nginx
    server {
        listen 443 ssl;
        server_name teleport-onpre.h1eudayne.work;

        # Đường dẫn tới chứng chỉ SSL vừa tạo qua Certbot
        ssl_certificate /etc/letsencrypt/live/teleport-onpre.h1eudayne.work/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/teleport-onpre.h1eudayne.work/privkey.pem;

        include /etc/letsencrypt/options-ssl-nginx.conf;
        ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

        location / {
            # Proxy ngược về IP nội bộ của Teleport Server
            proxy_pass https://192.168.209.102:443;
            proxy_ssl_server_name on;
            proxy_ssl_verify off;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }

    server {
        listen 80;
        server_name teleport-onpre.h1eudayne.work;

        # Tự động chuyển hướng truy cập HTTP sang HTTPS
        if ($host = teleport-onpre.h1eudayne.work) {
            return 301 https://$host$request_uri;
        }

        return 404;
    }
    ```
    
    Kiểm tra cú pháp Nginx và khởi động lại dịch vụ để áp dụng cấu hình:
    ```bash
    sudo nginx -t
    sudo systemctl restart nginx
    ```




#### 4. Setup Port Forwarding (Kết nối từ ngoài Internet)

Để có thể kết nối từ Internet vào máy chủ Load Balancer trong mạng nội bộ, thông thường có 2 phương pháp chính:

*   **Cách 1: Mở port trên Modem/Router (Traditional Port Forwarding)**
    *   *Nguyên lý:* Cấu hình NAT/Port Forwarding trên Modem nhà mạng để ánh xạ IP Public và port của modem tới IP Private của Nginx Load Balancer.
    *   *Nhược điểm:* Yêu cầu quyền quản trị Modem wifi, cần thuê IP Public tĩnh hoặc dùng DDNS, và việc mở cổng trực tiếp ra Internet tiềm ẩn nhiều nguy cơ bảo mật nếu không cấu hình firewall chặt chẽ.
*   **Cách 2: Sử dụng Cloudflare Tunnel (Khuyên dùng)**
    *   *Nguyên lý:* Chạy một phần mềm Agent/Connector (`cloudflared`) trên server nội bộ để chủ động thiết lập kết nối outbound (gọi ra) tới Cloudflare Zero Trust.
    *   *Ưu điểm:* Không cần mở bất kỳ port inbound nào trên modem wifi, không cần cấu hình NAT, toàn bộ lưu lượng được mã hóa an toàn qua proxy của Cloudflare.

Dưới đây là hướng dẫn chi tiết thực hiện theo **Cách 2 (Cloudflare Tunnel)**:

1.  **Truy cập Cloudflare Zero Trust:**
    *   Đăng nhập vào Cloudflare Dashboard.
    *   Di chuyển tới menu **Protect & Connect** -> **Zero Trust**.
    *   Nếu chưa thiết lập gói cước Zero Trust, nhấn **Get started** và làm theo hướng dẫn để chọn gói dịch vụ (chọn gói Free).

    ![Welcome to Cloudflare Zero Trust](../../../images/setup/teleport_cloudflare_zt_welcome.png)

2.  **Khởi tạo Tunnel:**
    *   Trong menu bên trái của Zero Trust Dashboard, chọn **Networks** -> **Tunnels** (hoặc chọn **Networks** -> **Overview** -> **Manage Tunnels**).
    *   Nhấn chọn **Create a tunnel** (hoặc **Add a Tunnel**).

    ![Manage Tunnels](../../../images/setup/teleport_cloudflare_zt_tunnels.png)

3.  **Đặt tên cho Tunnel:**
    *   Nhập tên gợi nhớ đại diện cho hạ tầng của bạn (ví dụ: `h1eudayne`).
    *   Nhấn **Save tunnel**.

    ![Name your tunnel](../../../images/setup/teleport_cloudflare_zt_create_tunnel.png)

4.  **Cài đặt và chạy Cloudflare Connector (cloudflared):**
    *   Tại tab **Install and run connectors**, chọn hệ điều hành tương ứng với máy chủ chạy Nginx Load Balancer (Ví dụ: `Windows`, `Debian`, hoặc `Ubuntu` tùy môi trường).
    *   Hệ thống sẽ cung cấp lệnh tải và cài đặt kèm token xác thực duy nhất.
    *   Sao chép lệnh cài đặt và chạy trên máy chủ dưới quyền Administrator/Root.
    *   > [!TIP]
    *   > **Lưu ý xử lý lỗi:** Nếu hệ thống báo lỗi không nhận dạng lệnh `cloudflared`, hãy chỉ định rõ đường dẫn tuyệt đối đến tệp thực thi `cloudflared.exe` (ví dụ: `C:\path\to\cloudflared.exe service install ...` trên Windows).
    *   Sau khi chạy thành công, trạng thái kết nối ở phần **Connectors** phía dưới sẽ báo xanh (Active/Connected).

    ![Install and run connectors](../../../images/setup/teleport_cloudflare_zt_connector.png)
    
    *   Chúng ta cũng có thể kiểm tra trạng thái hoạt động trực tiếp trong danh sách Connector của Tunnel:
    
    ![Trạng thái Connector hoạt động](../../../images/setup/teleport_cloudflare_zt_connected.png)

5.  **Cấu hình định tuyến lưu lượng (Route Traffic):**
    *   > [!IMPORTANT]
    *   > **Lưu ý quan trọng:** Trước khi định tuyến, **phải xóa bản ghi DNS A** của tên miền phụ `teleport-onpre` đã tạo thủ công ở **Bước 2** trước đó. Vì ở bước này Cloudflare sẽ tự động tạo bản ghi DNS CNAME để trỏ domain phụ về tunnel.
    *   Tại tab **Route tunnel** (Setup Traffic), cấu hình như sau:
        *   **Subdomain:** `teleport-onpre` (tên miền phụ muốn cấu hình).
        *   **Domain:** Chọn domain của bạn (ví dụ: `h1eudayne.work`).
        *   **Path:** Để trống (leave empty) để áp dụng cho mọi đường dẫn truy cập.
        *   **Service:**
            *   **Type:** `HTTP`
            *   **URL:** `192.168.209.101:80` (địa chỉ IP nội bộ kèm cổng của Nginx Load Balancer).
    *   Nhấn **Complete setup** để hoàn tất quá trình định tuyến.

    ![Cấu hình Route Traffic](../../../images/setup/teleport_cloudflare_zt_route_traffic.png)

#### 5. Cài đặt các tệp tin thực thi Teleport
Sau khi cấu hình định tuyến và cổng kết nối thành công, chúng ta tiến hành tải và cài đặt các tệp tin thực thi (binary) của Teleport trên máy chủ đích:

1.  **Tải về gói cài đặt Teleport:**
    Sử dụng công cụ `wget` để tải phiên bản Teleport (phiên bản `v13.2.0`):
    ```bash
    wget https://get.gravitational.com/teleport-v13.2.0-linux-amd64-bin.tar.gz
    ```

2.  **Giải nén gói cài đặt:**
    Giải nén tệp tin lưu trữ dạng `.tar.gz` vừa tải về:
    ```bash
    tar -xzf teleport-v13.2.0-linux-amd64-bin.tar.gz
    ```
    Sau khi giải nén, một thư mục có tên `teleport/` sẽ được tạo ra chứa các tệp tin thực thi (binary).

3.  **Cài đặt các tệp tin thực thi vào hệ thống:**
    Di chuyển các tệp thực thi chính của Teleport vào thư mục `/usr/local/bin/` để hệ điều hành có thể nhận diện lệnh ở bất cứ đâu:
    ```bash
    sudo mv teleport/tctl /usr/local/bin/
    sudo mv teleport/tsh /usr/local/bin/
    sudo mv teleport/teleport /usr/local/bin/
    ```
    *   **`teleport`**: Tiến trình daemon chính chạy Teleport Server.
    *   **`tctl`**: Công cụ CLI quản trị dành cho Admin (dùng để quản lý người dùng, tạo token, quản lý node...).
    *   **`tsh`**: Công cụ CLI Client dành cho người dùng kết nối SSH và quản trị.

4.  **Xác minh cài đặt thành công:**
    Kiểm tra phiên bản của cả 3 công cụ vừa cài đặt để đảm bảo chúng hoạt động bình thường:
    ```bash
    teleport version && tctl version && tsh version
    ```

5.  **Khởi tạo thư mục cấu hình:**
    Tạo thư mục `/etc/teleport` để chuẩn bị chứa tệp tin cấu hình (`teleport.yaml`) của Teleport:
    ```bash
    sudo mkdir -p /etc/teleport
    ```

#### 6. Tạo file cấu hình Teleport (teleport.yaml)
> [!TIP]
> Bạn có thể sử dụng trực tiếp tệp cấu hình mẫu có sẵn: [teleport.yaml.template](./templates/teleport.yaml.template) và điền tên miền của bạn.

Tạo mới và chỉnh sửa tệp cấu hình cho Teleport Server tại đường dẫn `/etc/teleport/teleport.yaml`:
```bash
sudo vi /etc/teleport/teleport.yaml
```

Sao chép nội dung cấu hình mẫu dưới đây vào tệp tin:
```yaml
version: v3
teleport:
  nodename: teleport
  data_dir: /var/lib/teleport
  log:
    output: stderr
    severity: INFO
    format:
      output: text
  ca_pin: ""
  diag_addr: ""

auth_service:
  enabled: "yes"
  listen_addr: 0.0.0.0:3025
  cluster_name: teleport-onpre.h1eudayne.work
  proxy_listener_mode: multiplex

ssh_service:
  enabled: "yes"

proxy_service:
  enabled: "yes"
  web_listen_addr: 0.0.0.0:443
  public_addr: teleport-onpre.h1eudayne.work:443
  https_keypairs: []
  https_keypairs_reload_interval: 0s
```

**Giải thích các thông số cấu hình chính:**
*   **`teleport.nodename`**: Tên định danh của node Teleport này trong cụm (cluster).
*   **`teleport.data_dir`**: Thư mục lưu trữ dữ liệu trạng thái, chứng chỉ CA nội bộ và thông tin phiên làm việc.
*   **`auth_service`**: Dịch vụ xác thực (Auth Service) đóng vai trò là cơ quan cấp chứng chỉ (CA) của cụm, kiểm soát quyền truy cập và phân phối chứng chỉ cho Client/Node.
    *   `cluster_name`: Tên cụm Teleport (trùng khớp với FQDN tên miền đã trỏ qua Cloudflare Tunnel).
    *   `proxy_listener_mode: multiplex`: Chế độ gộp cổng (multiplexing) cho phép Proxy lắng nghe và phân luồng tất cả các loại kết nối (SSH, Web, Reverse Tunnel) đi qua một cổng duy nhất.
*   **`ssh_service`**: Bật/Tắt dịch vụ SSH node trên chính máy chủ chạy Teleport để cho phép truy cập SSH bảo mật thông qua Teleport.
*   **`proxy_service`**: Dịch vụ Proxy (Gateway) tiếp nhận các kết nối từ client bên ngoài (Web Browser, tsh client) và chuyển tiếp tới Auth Service hoặc các Node.
    *   `web_listen_addr: 0.0.0.0:443`: Địa chỉ và cổng lắng nghe giao diện Web/API.
    *   `public_addr`: Địa chỉ Public FQDN mà người dùng bên ngoài sử dụng để kết nối tới cổng Teleport.

#### 7. Tạo file Service quản lý Teleport (systemd)
> [!TIP]
> Bạn có thể sử dụng trực tiếp tệp dịch vụ mẫu có sẵn: [teleport.service.template](./templates/teleport.service.template).

Để quản lý việc khởi chạy, tự động khởi động cùng hệ thống và giám sát tiến trình của Teleport Server, chúng ta khởi tạo một dịch vụ hệ thống (systemd service).

1.  **Tạo tệp dịch vụ systemd cho Teleport:**
    Khởi tạo tệp tin dịch vụ tại `/etc/systemd/system/teleport.service`:
    ```bash
    sudo vi /etc/systemd/system/teleport.service
    ```

2.  **Sao chép nội dung cấu hình Service:**
    ```ini
    [Unit]
    Description=Teleport Service
    Documentation=https://gravitational.com/teleport/docs
    After=network.target

    [Service]
    User=root
    ExecStart=/usr/local/bin/teleport start --config=/etc/teleport/teleport.yaml
    Restart=on-failure
    LimitNOFILE=65536

    [Install]
    WantedBy=multi-user.target
    ```

3.  **Xem lại nội dung tệp tin đã tạo để xác nhận:**
    ```bash
    cat /etc/systemd/system/teleport.service
    ```





