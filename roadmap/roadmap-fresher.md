# Lộ Trình Học Tập DevOps Fresher (DevOps Basics Roadmap)

Tài liệu này tổng hợp lộ trình học tập DevOps căn bản (gồm 35 bài học và các bài kiểm tra). Đối với mỗi bài học, bạn có thể truy cập trực tiếp vào các hướng dẫn cài đặt và cấu hình mẫu tương ứng trong repository.

---

## Bản Đồ Lộ Trình Học Tập

### Phần 1: Hạ Tầng Linux & Server Căn Bản
Tập trung vào hệ điều hành Linux (Ubuntu), cách sử dụng lệnh, Vim, phân quyền và triển khai thủ công.

| STT | Bài Học | Tài Nguyên và Hướng Dẫn |
| :---: | :--- | :--- |
| **0** | Những điều giúp bạn thành công trong series DevOps | *Định hướng và phương pháp học tập* |
| **1** | Mô hình mạng nội bộ | [Hướng dẫn mô hình mạng](../on-premise/setup/01-linux-server/README.md#bài-1-mô-hình-mạng-nội-bộ) |
| **1.1** | Tại sao sử dụng Linux? | *Lý thuyết hệ điều hành* |
| **2** | Cài đặt VMware Workstation | *Chuẩn bị môi trường ảo hóa* |
| **3** | Cài đặt Ubuntu Server (mạng Bridge) | [Thư mục setup Linux](../on-premise/setup/01-linux-server/) |
| **3.1** | Cài đặt Ubuntu Server (mạng NAT) | [Thư mục setup Linux](../on-premise/setup/01-linux-server/) |
| **4** | Các lệnh Linux thông dụng | [Tài liệu lệnh Linux](../on-premise/setup/01-linux-server/README.md) *(Placeholder)* |
| **5** | Cách sử dụng Vim trong Linux | [Hướng dẫn Vim & Quyền](../on-premise/setup/01-linux-server/README.md) *(Placeholder)* |
| **6** | Các câu lệnh Linux khác | *Nâng cao kỹ năng CLI* |
| **7** | Quyền truy cập trong Linux (Permissions) | [Hướng dẫn Vim & Quyền](../on-premise/setup/01-linux-server/README.md) *(Placeholder)* |

### Phần 2: Tư Duy & Triển Khai Thủ Công
Làm quen với các mô hình và triển khai dự án thực tế bằng tay trước khi tự động hóa.

| STT | Bài Học | Tài Nguyên và Hướng Dẫn |
| :---: | :--- | :--- |
| **8** | Tư duy triển khai mọi dự án | *Mô hình logic triển khai* |
| **9** | Triển khai các dự án Frontend | [Thư mục hướng dẫn Deploy](../on-premise/setup/02-manual-deployment/) |
| **10** | Triển khai dự án Java Spring | [Thư mục hướng dẫn Deploy](../on-premise/setup/02-manual-deployment/) |

### Phần 3: Git & GitLab Server
Quản lý mã nguồn và thiết lập máy chủ Git riêng cho doanh nghiệp.

| STT | Bài Học | Tài Nguyên và Hướng Dẫn |
| :---: | :--- | :--- |
| **11** | Kiến thức nền tảng Git | *Khái niệm Commit, Branch, Merge* |
| **12** | Cài đặt GitLab Server | [Thư mục setup GitLab](../on-premise/setup/03-gitlab/) |
| **13** | Những lệnh Git thông dụng | *CLI Git cheatsheet* |
| **14** | Triển khai Git Workflow | *Gitflow, Trunk-based development* |

### Phần 4: Container hóa với Docker & Registry
Đóng gói ứng dụng thành container độc lập và thiết lập Registry lưu trữ Docker Images.

| STT | Bài Học | Tài Nguyên và Hướng Dẫn |
| :---: | :--- | :--- |
| **18** | Container là gì? Tại sao sử dụng Docker? | *Khái niệm ảo hóa mức OS* |
| **19** | Cách sử dụng Docker | [Hướng dẫn cài đặt Docker](../on-premise/setup/04-docker-registry/install-docker-guide.md) |
| **20** | Cách Dockerize các dự án | *Quy trình viết Dockerfile* |
| **21** | Cách Dockerfile dự án Backend | [Mẫu Dockerfile Java Backend](../dockerfiles/backend/java/README.md) |
| **22** | Cách Dockerfile dự án Frontend | [Mẫu Dockerfile VueJS](../dockerfiles/frontend/vuejs/README.md) / [Angular](../dockerfiles/frontend/angular/README.md) |
| **23** | Cách cài đặt Docker Registry miễn phí | [Docker Compose Registry TLS](../on-premise/docker-compose/private-registry-tls/README.md) |
| **24** | Cách cài đặt Harbor Registry | [Hướng dẫn cài đặt Harbor](../on-premise/setup/04-docker-registry/install-harbor-guide.md) |
| **25** | Sử dụng các thành phần khác của Docker | *Docker Network, Docker Volume, Compose* |

### Phần 5: Tự Động Hóa CI/CD (GitLab CI & Jenkins)
Thiết lập đường ống CI/CD tự động xây dựng, kiểm thử và triển khai ứng dụng.

| STT | Bài Học | Tài Nguyên và Hướng Dẫn |
| :---: | :--- | :--- |
| **15** | CI/CD là gì? CI/CD để làm gì? | *Khái niệm tích hợp và triển khai liên tục* |
| **16** | GitLab CI / Continuous Deployment | [Thư mục GitLab CD](../pipelines/gitlab-ci/continuous-deployment/) |
| **17** | GitLab CI / Continuous Delivery | [Thư mục GitLab CD](../pipelines/gitlab-ci/continuous-delivery/) |
| **26** | Triển khai GitLab CI/CD dự án Docker | [GitLab CI Docker templates](../pipelines/gitlab-ci/continuous-delivery/docker/README.md) |
| **27** | Jenkins là gì? Jenkins để làm gì? | *Giới thiệu công cụ tự động hóa Jenkins* |
| **28** | Cài đặt Jenkins và các chức năng chính | [Hướng dẫn cài đặt Jenkins](../on-premise/setup/05-jenkins/install-jenkins-guide.md) |
| **29** | Triển khai Jenkins CI/CD (Deployment) | [Thư mục Jenkins CD](../pipelines/jenkins/continuous-deployment/) |
| **30** | Triển khai Jenkins CI/CD (Delivery) | [Thư mục Jenkins CD](../pipelines/jenkins/continuous-delivery/) |
| **31** | Jenkins CI/CD Parameter | *Tham số hóa Pipeline (Parameterized Build)* |
| **32** | Ứng dụng khác của Jenkins | *Cấu hình Webhook, Cronjob, Multi-branch* |

### Phần 6: Giám Sát Hệ Thống (Monitoring)
Theo dõi hiệu năng hệ thống và cấu hình cảnh báo.

| STT | Bài Học | Tài Nguyên và Hướng Dẫn |
| :---: | :--- | :--- |
| **33** | Monitoring là gì? Tại sao cần monitoring? | *Khái niệm Metrics, Logs, Traces* |
| **34** | Cài đặt & thiết lập Zabbix chuyên nghiệp | [Thư mục setup Monitoring](../on-premise/setup/06-monitoring/) |
| **35** | Sử dụng Item và Trigger trong Zabbix | [Thư mục setup Monitoring](../on-premise/setup/06-monitoring/) |
