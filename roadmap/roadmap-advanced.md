# Lộ Trình Học Tập DevOps Nâng Cao (Advanced DevOps Roadmap)

Tài liệu này tổng hợp lộ trình học tập DevOps nâng cao dành cho những người đã làm chủ kiến thức cơ bản (Linux, Docker, CI/CD, Monitoring) và Kubernetes. Lộ trình tập trung vào các công nghệ hạ tầng nâng cao: Infrastructure as Code (IaC), Centralized Logging, Secrets Management, GitOps, Service Mesh và Cloud Managed Kubernetes.

---

## Bản Đồ Lộ Trình Học Tập Nâng Cao

### Phần 1: Infrastructure as Code (IaC) - Tự Động Hóa Hạ Tầng
Sử dụng mã nguồn để khai báo, khởi tạo và quản lý hạ tầng phần cứng cũng như cấu hình phần mềm.

| STT | Chủ Đề / Bài Học | Công Cụ & Nội Dung | Tài Nguyên / Hướng Dẫn |
| :---: | :--- | :--- | :--- |
| **1** | Hạ tầng dạng mã nguồn (IaC) là gì? | Khái niệm Declarative vs Imperative, GitOps State | *Lý thuyết cơ bản* |
| **2** | Terraform căn bản | Providers, Resources, Variables, Outputs | [Thư mục setup Nâng cao](../on-premise/setup/07-advanced/) *(Placeholder)* |
| **3** | Quản lý State trong Terraform | Terraform State, Backend S3/GCS, State Locking | [Thư mục setup Nâng cao](../on-premise/setup/07-advanced/) *(Placeholder)* |
| **4** | Cấu trúc Terraform nâng cao | Terraform Modules, Workspace, Dynamic Blocks | *Mẫu Terraform Modules* |
| **5** | Ansible căn bản | Agentless configuration, Inventory, Ad-hoc Commands | [Thư mục setup Nâng cao](../on-premise/setup/07-advanced/) *(Placeholder)* |
| **6** | Triển khai Ansible nâng cao | Playbooks, Roles, Ansible Vault, Handlers | *Mẫu Ansible Roles* |

### Phần 2: Centralized Logging (Quản Lý Log Tập Trung)
Thu thập, phân tích và quản trị toàn bộ dữ liệu log từ server và Kubernetes cluster về một nơi duy nhất.

| STT | Chủ Đề / Bài Học | Công Cụ & Nội Dung | Tài Nguyên / Hướng Dẫn |
| :---: | :--- | :--- | :--- |
| **7** | Kiến trúc Logging trong Microservices | Tại sao cần Centralized Logging? Shipper, Parser, Storage | *Lý thuyết kiến trúc* |
| **8** | EFK Stack (Elasticsearch - Fluentd - Kibana) | Cài đặt Elasticsearch, cấu hình Fluent-bit thu thập log | [Thư mục setup Nâng cao](../on-premise/setup/07-advanced/) *(Placeholder)* |
| **9** | PLG Stack (Promtail - Loki - Grafana) | Giải pháp logging nhẹ nhàng (Lightweight), tích hợp Grafana | [Thư mục setup Nâng cao](../on-premise/setup/07-advanced/) *(Placeholder)* |

### Phần 3: Secrets Management (Bảo Mật Thông Tin Nhạy Cảm)
Quản lý tập trung các khóa bảo mật, mật khẩu, API token và tích hợp tự động vào ứng dụng/Kubernetes.

| STT | Chủ Đề / Bài Học | Công Cụ & Nội Dung | Tài Nguyên / Hướng Dẫn |
| :---: | :--- | :--- | :--- |
| **10** | Quản lý Secret trong doanh nghiệp | Rủi ro rò rỉ secret trên Git, co chế mã hóa | *Lý thuyết bảo mật* |
| **11** | Cài đặt HashiCorp Vault | Thiết lập Vault Server, cơ chế Unseal, Secrets Engine | [Thư mục setup Nâng cao](../on-premise/setup/07-advanced/) *(Placeholder)* |
| **12** | Tích hợp Vault vào Kubernetes | Vault Agent Injector, External Secrets Operator (ESO) | [Thư mục setup Nâng cao](../on-premise/setup/07-advanced/) *(Placeholder)* |

### Phần 4: GitOps & Declarative CD
Quy trình triển khai ứng dụng tự động dựa trên Git làm "Single Source of Truth".

| STT | Chủ Đề / Bài Học | Công Cụ & Nội Dung | Tài Nguyên / Hướng Dẫn |
| :---: | :--- | :--- | :--- |
| **13** | Tư duy GitOps và Khác biệt với CI/CD truyền thống | Pull-based vs Push-based Deployment, Auto-sync | *Lý thuyết GitOps* |
| **14** | Triển khai ArgoCD trên Kubernetes | Cài đặt ArgoCD, Application CRD, Sync Policy | [Thư mục setup Nâng cao](../on-premise/setup/07-advanced/) *(Placeholder)* |
| **15** | Quản lý Multi-cluster với ArgoCD | Kết nối cụm k8s từ xa, ApplicationSet | [Thư mục setup Nâng cao](../on-premise/setup/07-advanced/) *(Placeholder)* |

### Phần 5: Service Mesh (Mạng Lưới Dịch Vụ)
Quản lý giao tiếp giữa các service trong microservices: traffic control, security, observability.

| STT | Chủ Đề / Bài Học | Công Cụ & Nội Dung | Tài Nguyên / Hướng Dẫn |
| :---: | :--- | :--- | :--- |
| **16** | Service Mesh là gì? Khi nào cần sử dụng? | Data Plane (Envoy) vs Control Plane (Istiod) | *Lý thuyết Service Mesh* |
| **17** | Cài đặt Istio trên Kubernetes | Cấu hình Istio Operator, Sidecar Injection | [Thư mục setup Nâng cao](../on-premise/setup/07-advanced/) *(Placeholder)* |
| **18** | Quản lý Traffic với Istio | VirtualService, DestinationRule, Canary Deployment | [Thư mục setup Nâng cao](../on-premise/setup/07-advanced/) *(Placeholder)* |
| **19** | Bảo mật giao tiếp (Mutual TLS) | Thiết lập mTLS (Strict/Permissive), AuthorizationPolicy | [Thư mục setup Nâng cao](../on-premise/setup/07-advanced/) *(Placeholder)* |

### Phần 6: Cloud Managed Kubernetes & Hybrid Cloud
Triển khai Kubernetes trên các nền tảng đám mây lớn tích hợp dịch vụ Managed Service.

| STT | Chủ Đề / Bài Học | Công Cụ & Nội Dung | Tài Nguyên / Hướng Dẫn |
| :---: | :--- | :--- | :--- |
| **20** | Managed Kubernetes vs Self-hosted K8s | So sánh chi phí, vận hành, khả năng tự động Scale | *Lý thuyết Cloud* |
| **21** | Triển khai AWS EKS | Khởi tạo EKS Cluster bằng Terraform/eksctl, IAM Roles for Service Accounts (IRSA) | [Thư mục cloud/aws/](../../cloud/aws/README.md) |
| **22** | Triển khai GCP GKE | Khởi tạo GKE Cluster bằng Terraform, Workload Identity | [Thư mục cloud/gcp/](../../cloud/gcp/README.md) |
