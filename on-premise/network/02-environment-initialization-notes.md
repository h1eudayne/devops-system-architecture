# Bài 2: Lưu ý khi khởi tạo môi trường thực tế

### I. Lưu ý khi khởi tạo môi trường thực tế
* **Trong doanh nghiệp:** Các thiết bị sẽ có các switch chia mạng và các thiết bị sẽ kết nối vào các switch đó. Tương ứng các thiết bị sẽ cùng nằm trong dải mạng đó.
* **Khi tạo máy ảo (Virtual Machine):** Thường sẽ có 2 tùy chọn cấu hình mạng chính là NAT và Bridge.
  * **Bridge:** Máy ảo sẽ nằm cùng dải mạng với máy tính Host (Giống như máy tính biến thành một server độc lập trên mạng nội bộ và mọi người đều có thể truy cập được đến server đó).
* **Lưu ý quan trọng:** Trường hợp mạng kết nối thay vì mô hình `Modem (gốc) -> Switch` mà nối theo kiểu `Modem (gốc) -> Modem` thì bắt buộc phải tắt DHCP động (để tránh xung đột cấp phát IP).

### II. Lấy địa chỉ IPv4 và vấn đề IP Public
* **Lệnh kiểm tra IP:**
  ```bash
  curl.exe -4 https://ifconfig.me
  ```
* **Bản chất của IP hiển thị:**
  Địa chỉ IP lấy được này không phải là địa chỉ IP có thể được truy cập trực tiếp từ internet ngay lập tức. Các nhà cung cấp mạng (ISP) hiện nay thường sử dụng cơ chế **CGNAT (Carrier-Grade NAT)**.
  * **CGNAT** là một kỹ thuật mà các nhà cung cấp dịch vụ internet sử dụng để tiết kiệm dải địa chỉ IPv4 public.
  * Bên nhà cung cấp mạng thực chất chỉ cấp cho router nhà bạn một địa chỉ IP private (riêng) và sẽ tiến hành ánh xạ nó ra địa chỉ IPv4 public thông qua hệ thống NAT ở cấp độ nhà mạng.

### III. Cách để public dịch vụ
* **Để thiết bị có thể "đứng" trên internet:** Phải liên hệ nhà mạng yêu cầu tắt chế độ NAT (bỏ CGNAT/mở port) để host được dịch vụ ra internet. *(Lưu ý: Việc này không đồng nghĩa với việc bạn sẽ được cấp IP tĩnh)*.
* **Sử dụng Cloudflare (Tùy chọn Tunneling/Proxy):** Nếu đi qua Cloudflare, phải cài đặt hệ thống monitoring trên server (cụ thể là phải cài agent qua server).
