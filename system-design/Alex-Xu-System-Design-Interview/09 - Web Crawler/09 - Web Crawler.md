Chương 9: Thiết kế trình thu thập dữ liệu web
==================================

Giới thiệu
------------

**Trình thu thập thông tin web**, còn được gọi là nhện hoặc robot, được dùng để khám phá và thu thập nội dung web, chẳng hạn như các trang web, hình ảnh và video. Chương này tập trung vào việc thiết kế một trình thu thập dữ liệu web có thể scaling để **lập chỉ mục công cụ tìm kiếm**.

### Ứng dụng của trình thu thập dữ liệu web

1. **Lập chỉ mục công cụ tìm kiếm:** Thu thập các trang web để tạo chỉ mục có thể tìm kiếm được (ví dụ: Googlebot).
2. **Lưu trữ web:** Bảo toàn dữ liệu web để sử dụng trong tương lai (ví dụ: Thư viện Quốc hội Hoa Kỳ).
3. **Khai thác web:** Trích xuất kiến ​​thức từ dữ liệu web (ví dụ: phân tích tài chính trong báo cáo của cổ đông).
4. **Giám sát web:** Phát hiện vi phạm bản quyền hoặc nhãn hiệu.

### Thử thách thiết kế

Trình thu thập dữ liệu web tốt phải giải quyết:

* **Scalability:** Xử lý hàng tỷ trang bằng cách sử dụng tính năng song song.
* **Mạnh mẽ:** Quản lý HTML xấu, sự cố và liên kết độc hại.
* **Lịch sự:** Tránh làm servers choáng ngợp với quá nhiều yêu cầu.
* **scalability:** Hỗ trợ các loại nội dung mới với những thay đổi tối thiểu.

---

Bước 1: Tìm hiểu vấn đề
----------------------------------

### Yêu cầu

1. Thu thập dữ liệu **1 tỷ trang web mỗi tháng** (400 trang/giây, cao nhất là 800 QPS).
2. Thu thập **Nội dung chỉ dành cho HTML**.
3. Theo dõi các trang mới và cập nhật.
4. Bỏ qua nội dung trùng lặp.
5. Lưu trữ dữ liệu được thu thập thông tin trong **5 năm**, yêu cầu ~30 PB dung lượng lưu trữ.

---

Bước 2: Thiết kế cấp cao
-------------------------

### Thành phần

![Web Crawler Architecture](images/web-crawler-architecture.png)

1. **URL gốc:** Điểm bắt đầu cho trình thu thập thông tin.

   * Cần chọn lọc làm điểm khởi đầu tốt mà trình thu thập thông tin có thể sử dụng để duyệt qua càng nhiều liên kết càng tốt.
   * Có thể dựa trên địa phương dựa trên trang web phổ biến khác nhau hoặc dựa trên topics.
   * Chiến lược: Phân loại theo địa phương hoặc topic (ví dụ: thể thao, chăm sóc sức khỏe).
2. **URL Frontier:** Lưu trữ các URL sẽ được tải xuống.

   * Được triển khai dưới dạng **hàng đợi FIFO**.
3. **HTML Downloader:** Tải xuống các trang web từ các URL do URL Frontier cung cấp.
4. **Trình phân giải DNS:** Chuyển đổi URL thành địa chỉ IP.
5. **Trình phân tích nội dung:** Xác thực và phân tích các trang web.

* Loại bỏ các trang không đúng định dạng.
6. **Đã xem nội dung?:** Kiểm tra nội dung trùng lặp bằng cách sử dụng so sánh hàm băm (so sánh giá trị băm của hai trang web).
7. **Lưu trữ nội dung:** Lưu trữ các trang HTML trên đĩa (nội dung phổ biến trong bộ nhớ để giảm latency).
8. **Trình trích xuất URL:** Trích xuất các liên kết mới từ các trang được phân tích cú pháp.
9. **Bộ lọc URL:** Loại trừ các URL bị liệt vào danh sách đen hoặc có lỗi.
10. **Đã xem URL?** Theo dõi các URL đã truy cập để tránh trùng lặp.
11. **Lưu trữ URL:** Lưu trữ các URL đã truy cập.

---

### Quy trình làm việc

1. Thêm **URL gốc** vào Biên giới URL.
2. **Trình tải xuống HTML** tìm nạp URL và phân giải IPs của chúng thông qua Trình phân giải DNS.
3. **Trình phân tích nội dung** xác thực và chuyển nội dung tới "Nội dung đã xem?" thành phần.
4. Nếu nội dung mới, hãy trích xuất các liên kết thông qua **Trình trích xuất URL**.
5. Lọc và thêm các liên kết duy nhất vào URL Frontier.

---

Bước 3: Đi sâu vào các thành phần chính
-------------------------------------

### DFS/BFS

* Trang web có thể được coi là một biểu đồ có hướng trong đó các trang web là nodes và các siêu liên kết (URL) là các cạnh.
* BFS thường được sử dụng để duyệt đồ thị vì độ sâu có thể rất sâu nên DFS không lý tưởng.
* BFS tiêu chuẩn không xem xét mức độ ưu tiên của URL, không phải mọi trang đều có mức độ chất lượng và tầm quan trọng như nhau.

### Biên giới URL

* **Lịch sự:**

  + Đảm bảo mỗi lần chỉ có một yêu cầu cho mỗi host. Thêm latency giữa hai tác vụ tải xuống.
  + Sử dụng ánh xạ từ hostnames tới hàng đợi và luồng công việc (tải xuống).
  + Mỗi luồng tải xuống có một hàng đợi FIFO riêng biệt và chỉ tải các URL từ hàng đợi đó.

    ![Politeness](images/politeness.png)
  + **Bộ routing hàng đợi:** Đảm bảo rằng mỗi hàng đợi (b1, b2, … bn) chỉ chứa các URL từ cùng một host.
  + **Bảng ánh xạ:** Nó ánh xạ từng host vào một hàng đợi.
  + **Bộ chọn hàng đợi:** Mỗi chuỗi công việc được ánh xạ tới hàng đợi FIFO và nó chỉ tải xuống các URL từ hàng đợi đó. Logic lựa chọn hàng đợi được thực hiện bởi bộ chọn Hàng đợi.
  + **Luồng công việc 1 đến N.** Chuỗi công việc tải xuống các trang web một cách tuần tự từ cùng một host. Có thể thêm latency giữa hai tác vụ tải xuống.
* **Sự ưu tiên:**

+ Chỉ định mức độ ưu tiên cao hơn cho các trang quan trọng (ví dụ: theo Xếp hạng trang hoặc tần suất cập nhật).

    ![Prioritizer](images/prioritizer.png)
  + **Bộ ưu tiên:** Nó lấy URL làm đầu vào và tính toán mức độ ưu tiên.
  + **Hàng đợi từ f1 đến fn:** Mỗi hàng đợi có mức độ ưu tiên được chỉ định. Hàng đợi có mức độ ưu tiên cao sẽ được chọn với xác suất cao hơn.
  + **Bộ chọn hàng đợi:** Chọn ngẫu nhiên một hàng đợi có xu hướng thiên về hàng đợi có mức độ ưu tiên cao hơn.
  + **Hàng đợi phía trước:** quản lý mức độ ưu tiên
  + **Xếp hàng sau:** quản lý sự lịch sự
* **Độ mới:** Thu thập lại dữ liệu dựa trên lịch sử cập nhật hoặc tầm quan trọng.

### Trình tải xuống HTML

* **Tuân thủ Robots.txt:** Tôn trọng các quy tắc trong tệp robots.txt.
* **Tối ưu hóa hiệu suất:**
  1. Thu thập thông tin được phân phối bằng multiple servers.
  2. Sử dụng **DNS cache** để tránh tra cứu nhiều lần.
  3. Phân phối thu thập dữ liệu servers theo địa lý để tải xuống nhanh hơn.
  4. Sử dụng thời gian chờ ngắn để tránh servers chậm hoặc không phản hồi.

### Độ bền

1. **Consistent Hashing:** Phân phối tải giữa servers một cách hiệu quả.
2. **Xử lý lỗi:** Ngăn chặn sự cố hệ thống do ngoại lệ.
3. **Xác thực dữ liệu:** Đảm bảo tính toàn vẹn của nội dung.

### scalability

* Thêm mô-đun cho các loại nội dung mới (ví dụ: trình tải xuống PNG, màn hình web).
* Ví dụ: Cắm module theo dõi nội dung web có vi phạm bản quyền hay không.

  ![Extensibility](images/extensibility.png)

---

### Tránh nội dung có vấn đề

1. **Nội dung trùng lặp:** Phát hiện bằng cách sử dụng so sánh hàm băm.
2. **Bẫy nhện:** Tránh vòng lặp vô hạn bằng các kỹ thuật như giới hạn độ dài URL.
3. **Nhiễu dữ liệu:** Lọc nội dung không liên quan như quảng cáo hoặc thư rác.

---

Bước 4: Kết thúc
---------------

### Bài học chính

1. Trình thu thập dữ liệu web phải cân bằng scalability, độ mạnh mẽ, lịch sự và scalability.
2. **Tính lịch sự** ngăn chặn tình trạng quá tải servers, trong khi **ưu tiên** đảm bảo các trang quan trọng được thu thập dữ liệu trước tiên.
3. Lưu trữ hiệu quả và xử lý lỗi là rất quan trọng để xử lý việc thu thập thông tin trên quy mô lớn.

### Những cân nhắc bổ sung

* **Server-Side Rendering:** Xử lý nội dung động được tạo bởi JavaScript hoặc AJAX.
* **Các biện pháp chống thư rác:** Loại trừ các trang chất lượng thấp hoặc không liên quan.
* **Database Sharding:** Chia tỷ lệ lớp dữ liệu bằng replication và sharding.
* **Horizontal Scaling:** Sử dụng stateless servers để scaling công việc thu thập thông tin một cách hiệu quả.
* **Analytics:** Thu thập và phân tích dữ liệu để hiểu rõ hơn.