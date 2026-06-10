Chương 3: Khung phỏng vấn thiết kế hệ thống
========================================================

Giới thiệu
------------

Các cuộc phỏng vấn thiết kế hệ thống là một phần quan trọng của quá trình tuyển dụng, mô phỏng các tình huống giải quyết vấn đề thực tế. Những cuộc phỏng vấn này đánh giá không chỉ các kỹ năng kỹ thuật mà còn cả sự hợp tác, giao tiếp và khả năng xử lý các yêu cầu mơ hồ.

Chương này giới thiệu **khuôn khổ 4 bước** để điều hướng các cuộc phỏng vấn thiết kế hệ thống một cách hiệu quả.

---

Bước 1: Hiểu vấn đề và thiết lập phạm vi thiết kế
---------------------------------------------------------

### Mục tiêu chính

* Làm rõ các yêu cầu và giả định.
* Tránh nhảy vào giải pháp quá sớm.
* Thể hiện tư duy phản biện bằng cách đặt những câu hỏi hay.

### Cách tiếp cận

* **Đặt câu hỏi làm rõ:**

  + Đặc điểm quan trọng nhất là gì?
  + Hệ thống cần xử lý ở quy mô nào?
  + Chúng ta đang xây dựng cho web, thiết bị di động hay cả hai?
  + Có công nghệ hiện có hoặc hạn chế nào không?
* **Giả định trong tài liệu:** Viết các giả định lên bảng trắng hoặc giấy để tham khảo.

### Ví dụ

**Vấn đề:** Thiết kế hệ thống cung cấp tin tức.  
**Câu hỏi:**

* Đây là ứng dụng dành cho thiết bị di động, ứng dụng web hay cả hai?
* Một người dùng có thể có bao nhiêu bạn bè?
* Nguồn cấp dữ liệu có nên bao gồm hình ảnh và video không?
* Nguồn cấp dữ liệu có được sắp xếp theo trình tự thời gian đảo ngược không?

---

Bước 2: Đề xuất thiết kế cấp cao và nhận được sự đồng ý
------------------------------------------------

### Mục tiêu chính

* Phát triển kiến trúc cấp cao.
* Cộng tác với người phỏng vấn để hoàn thiện thiết kế.

### Cách tiếp cận

* **Dự thảo bản thiết kế:**

  + Sử dụng sơ đồ hộp cho các thành phần chính (ví dụ: clients, APIs, databases, caches, CDNs).
  + Coi người phỏng vấn như một người đồng đội để hoàn thiện thiết kế.
* **Thực hiện các phép tính sau phong bì:**

  + Đảm bảo thiết kế có thể giải quyết được các hạn chế về quy mô.
* **Xem qua các trường hợp sử dụng:** Xác định các trường hợp khó khăn và xác thực các giả định thiết kế.

### Ví dụ

Đối với hệ thống nguồn cấp tin tức, hãy chia thiết kế thành:

1. **Quy trình xuất bản nguồn cấp dữ liệu:** Viết bài đăng vào databases và điền nguồn cấp dữ liệu của bạn bè.
2. **Luồng truy xuất nguồn cấp dữ liệu:** Tổng hợp và hiển thị các bài đăng của bạn bè theo trình tự thời gian đảo ngược.

---

Bước 3: Thiết kế Deep Dive
---------------

### Mục tiêu chính

* Đi sâu vào các thành phần quan trọng.
* Thể hiện sự hiểu biết sâu sắc và khả năng thích ứng.

### Cách tiếp cận

* **Ưu tiên các thành phần chính:** Tập trung vào các lĩnh vực phù hợp nhất với vấn đề.
* **Thảo luận về Bottlenecks:** Xác định các vấn đề tiềm ẩn về hiệu suất và đề xuất giải pháp.
* **Chi tiết số dư:** Tránh sử dụng kỹ thuật quá mức hoặc tìm hiểu sâu không cần thiết.

### Ví dụ Topics

* **Trình rút ngắn URL:** Tập trung vào thiết kế hàm băm.
* **Hệ thống trò chuyện:** Khám phá tính năng giảm latency và xử lý trạng thái trực tuyến/ngoại tuyến.
* **Hệ thống nguồn cấp tin tức:** Kiểm tra quá trình xuất bản và truy xuất nguồn cấp dữ liệu.

---

Bước 4: Tóm tắt
---------------

### Mục tiêu chính

* Nêu bật những lĩnh vực cần cải thiện.
* Tóm tắt lại thiết kế và thảo luận các bước tiếp theo.

### Cách tiếp cận

* **Xác định Bottlenecks:** Thảo luận về các hạn chế tiềm ẩn và chiến lược scaling.
* **Tóm tắt thiết kế:** Tóm tắt các quyết định thiết kế chính và sự đánh đổi.
* **Đề xuất cải tiến:**
  + Cách scaling từ 1 triệu đến 10 triệu người dùng.
  + Xử lý lỗi đối với lỗi server hoặc sự cố mạng.

---

Thực tiễn tốt nhất
--------------

### Việc nên làm

* **Đặt câu hỏi:** Làm rõ những điểm mơ hồ trước khi đi sâu vào giải pháp.
* **Giao tiếp:** Chia sẻ quá trình suy nghĩ của bạn với người phỏng vấn.
* ** Lặp lại với Người phỏng vấn:** Hãy đối xử với họ như một cộng tác viên.
* **Thể hiện tính linh hoạt:** Đề xuất các phương pháp thay thế và tinh chỉnh thiết kế của bạn.
* **Tập trung vào các thành phần quan trọng:** Ưu tiên các bộ phận chính của hệ thống.

### Những điều không nên

* **Tránh các giải pháp sớm:** Đừng thiết kế trước khi hiểu rõ yêu cầu.
* **Đừng im lặng:** Giao tiếp thường xuyên trong suốt quá trình.
* **Tránh sử dụng kỹ thuật quá mức:** Tập trung vào các giải pháp thiết thực, có thể scaling.

---

Quản lý thời gian
---------------

### Phân bổ thời gian đề xuất (cho các cuộc phỏng vấn 45 phút):

1. **Hiểu vấn đề và phạm vi:** 3–10 phút
2. **Thiết kế cấp cao và mua vào:** 10–15 phút
3. **Lặn sâu:** 10–25 phút
4. **Tóm tắt:** 3–5 phút