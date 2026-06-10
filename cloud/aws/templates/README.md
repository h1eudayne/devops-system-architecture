# AWS Configuration Templates

Thư mục này lưu trữ các mẫu cấu hình chính sách (Policies) dạng JSON/YAML dùng cho các dịch vụ AWS. Các mẫu này được thiết kế để tái sử dụng bằng cách thay thế các giá trị trong dấu `<>` (như `<your-bucket-name>`, `<aws-account-id>`, v.v.).

---

## Cấu trúc thư mục

```text
templates/
├── s3/                              # Các cấu hình cho dịch vụ Amazon S3
│   ├── public-read-policy.json      # Cấp quyền đọc công khai (GetObject)
│   ├── enforce-https-policy.json    # Bắt buộc kết nối HTTPS bảo mật (Deny HTTP)
│   ├── ip-restriction-policy.json   # Chỉ cho phép truy cập từ dải IP định sẵn
│   ├── allow-user-read-policy.json  # Cho phép một IAM User cụ thể đọc dữ liệu
│   ├── deny-user-all-policy.json    # Chặn hoàn toàn truy cập của một IAM User
│   ├── cors-policy.json             # Cấu hình chia sẻ tài nguyên nguồn chéo CORS
│   └── event-notification-payload.json # Cấu trúc JSON payload của S3 Event Notification
│
├── iam/                             # Các cấu hình cho dịch vụ AWS IAM
│   ├── enforce-mfa-policy.json      # Bắt buộc xác thực MFA đối với mọi API
│   ├── role-trust-policy-ec2.json   # Trust Policy cho phép EC2 assume role
│   └── iam-policy-ip-restriction.json # IAM Policy giới hạn quyền truy cập theo địa chỉ IP
│
├── elb/                             # Các cấu hình cho dịch vụ Elastic Load Balancing
│   ├── user-data-instance-a.sh      # Script User Data khởi tạo Instance A (giao diện màu Blue)
│   └── user-data-instance-b.sh      # Script User Data khởi tạo Instance B (giao diện màu Green)
│
├── rds/                             # Các mẫu mã lệnh SQL cho dịch vụ Amazon RDS
│   └── employee_crud_slow_query.sql # File script SQL kiểm thử CRUD và giả lập Slow Query
│
└── README.md                        # (file này)
```

---

## Chi tiết các tệp cấu hình

### 1. Amazon S3 Templates (`templates/s3/`)
*   **[public-read-policy.json](s3/public-read-policy.json)**: Chính sách Bucket Policy cho phép bất kỳ ai ở ngoài Internet đều có thể đọc tài nguyên của bạn (sử dụng khi làm Static Website Hosting).
*   **[enforce-https-policy.json](s3/enforce-https-policy.json)**: Chính sách kiểm soát an toàn dữ liệu, ngăn chặn truy cập không được mã hóa (HTTP) trực tiếp vào bucket.
*   **[ip-restriction-policy.json](s3/ip-restriction-policy.json)**: Chỉ cho phép đọc tệp từ địa chỉ IP nguồn whitelisted (ví dụ: văn phòng công ty).
*   **[allow-user-read-policy.json](s3/allow-user-read-policy.json)**: Cấp quyền đọc dữ liệu cho một tài khoản IAM User cụ thể trên một bucket riêng tư.
*   **[deny-user-all-policy.json](s3/deny-user-all-policy.json)**: Chặn mọi thao tác đọc/ghi/xóa của một user cụ thể để đảm bảo bảo mật.
*   **[cors-policy.json](s3/cors-policy.json)**: Thiết lập CORS định dạng JSON cho phép hoặc chặn các request AJAX truy cập tài nguyên từ các domain bên ngoài.
*   **[event-notification-payload.json](s3/event-notification-payload.json)**: Tài liệu JSON mẫu mô tả cấu trúc payload mà S3 gửi sang Lambda/SNS/SQS khi có sự kiện thay đổi đối tượng (S3 Trigger).

### 2. AWS IAM Templates (`templates/iam/`)
*   **[enforce-mfa-policy.json](iam/enforce-mfa-policy.json)**: Chính sách bảo mật bắt buộc người dùng IAM phải đăng ký và sử dụng MFA. Nếu không xác thực MFA, mọi thao tác truy cập sẽ bị chặn (Deny), ngoại trừ trang quản lý thiết bị MFA cá nhân của họ.
*   **[role-trust-policy-ec2.json](iam/role-trust-policy-ec2.json)**: Chính sách tin cậy (Trust Policy) của IAM Role, cấp quyền cho máy chủ ảo EC2 thực hiện hành động Assume Role.
*   **[iam-policy-ip-restriction.json](iam/iam-policy-ip-restriction.json)**: Chính sách IAM Policy áp dụng trực tiếp cho User/Group, giới hạn các thao tác với S3 chỉ được thực hiện từ IP hợp lệ.

### 3. Amazon ELB Templates (`templates/elb/`)
*   **[user-data-instance-a.sh](elb/user-data-instance-a.sh)**: Script cài đặt máy chủ web Apache và cấu hình giao diện Instance A (tiêu đề xanh dương, hiển thị IP Private/Public động qua IMDSv2).
*   **[user-data-instance-b.sh](elb/user-data-instance-b.sh)**: Script cài đặt máy chủ web Apache và cấu hình giao diện Instance B (tiêu đề xanh lá, hiển thị IP Private/Public động qua IMDSv2).

### 4. Amazon RDS Templates (`templates/rds/`)
*   **[employee_crud_slow_query.sql](rds/employee_crud_slow_query.sql)**: Mẫu mã lệnh SQL phục vụ cho bài thực hành RDS bao gồm các câu lệnh tạo database/table, CRUD dữ liệu mẫu và định nghĩa thủ tục `iterateSleep` để giả lập các Slow Query phục vụ kiểm thử giám sát.
