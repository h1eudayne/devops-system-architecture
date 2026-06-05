# Hướng Dẫn Cài Đặt Hạ Tầng DevOps Nâng Cao (Advanced DevOps Setup)

Thư mục này được thiết kế để chứa toàn bộ tài liệu hướng dẫn cài đặt, cấu hình và tối ưu hóa các công cụ thuộc lộ trình **DevOps Nâng Cao** (Advanced DevOps).

## Các Nhóm Công Nghệ Sẽ Triển Khai Tại Đây

1. **Infrastructure as Code (IaC):**
   * Hướng dẫn cài đặt và thiết lập cấu hình Terraform (backend state locking với S3/MySQL/Consul).
   * Hướng dẫn cài đặt Ansible, tổ chức cấu trúc folder Ansible Roles, cấu hình Ansible Vault để mã hóa secret.

2. **Centralized Logging (Quản lý Log tập trung):**
   * Hướng dẫn cài đặt cụm Elasticsearch, Fluentd / Fluent-Bit để thu thập log trong Kubernetes.
   * Hướng dẫn cài đặt Grafana Loki + Promtail cho giải pháp thu thập log siêu nhẹ.

3. **Secrets Management (Quản lý khóa bảo mật):**
   * Hướng dẫn cài đặt HashiCorp Vault Server (chạy chế độ Production).
   * Tích hợp Vault vào Kubernetes sử dụng Vault Agent Injector hoặc External Secrets Operator.

4. **GitOps CD:**
   * Hướng dẫn cài đặt ArgoCD trên cụm Kubernetes, cấu hình SSO, quản lý ứng dụng qua Git.

5. **Service Mesh:**
   * Hướng dẫn cài đặt Istio Service Mesh, cấu hình VirtualService và DestinationRule cho traffic routing.

---

## Cách Tổ Chức File Hướng Dẫn
* Tạo các file Markdown riêng biệt theo mẫu: `setup-<tool>-guide.md` (ví dụ: `setup-vault-guide.md`, `setup-argocd-guide.md`).
* Đảm bảo không commit các khóa API, mật khẩu hoặc khóa chứng chỉ thực tế. Sử dụng các file ví dụ cấu hình đi kèm nếu cần.
