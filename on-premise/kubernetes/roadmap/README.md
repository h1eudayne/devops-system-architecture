# Lộ Trình Học Tập Kubernetes (Kubernetes Roadmap)

Tài liệu này tổng hợp toàn bộ lộ trình học tập Kubernetes từ cơ bản đến nâng cao theo giáo trình học tập của bạn (gồm 43 bài học). Đối với mỗi bài học có tệp tin hoặc thư mục cấu hình mẫu (manifest) trong dự án, bạn có thể bấm trực tiếp vào liên kết để thực hành.

---

## 🗺️ Bản Đồ Lộ Trình Học Tập

| Bài Học | Tiêu Đề Bài Học | Tài Nguyên & Tệp Thực Hành |
| :--- | :--- | :--- |
| **Bài 1** | Kubernetes là gì? Kubernetes để làm gì? | *Lý thuyết cơ bản* |
| **Bài 2** | Khi nào nên sử dụng Kubernetes? | *Lý thuyết quyết định hệ thống* |
| **Bài 3** | Hạ tầng Kubernetes | 📖 [Hướng dẫn cài đặt Cluster](../../setup/kubernetes/setup-cluster-guide.md) |
| **Bài 7** | Mô hình triển khai dự án trên Kubernetes | *Mô hình tổng quan (Database, Backend, Frontend)* |
| **Bài 8** | File yaml cấu hình trong Kubernetes | *Cấu trúc file YAML cơ bản* |
| **Bài 9** | Namespace trong Kubernetes | 📄 [`namespace.yml.example`](../namespace.yml.example) |
| **Bài 10** | Phương pháp triển khai dự án trên Kubernetes hiệu quả | *Phương pháp tối ưu vận hành* |
| **Bài 11** | Các công cụ quản lý Kubernetes | *Giới thiệu kubectl, k9s, dashboard...* |
| **Bài 12** | Cài đặt Rancher và quản lý Kubernetes | 📖 [Hướng dẫn cài đặt Rancher](../../setup/rancher/install-rancher-guide.md) |
| **Bài 13** | Cài đặt Rancher trên Cloud (GCP) | *Triển khai thực tế trên GCP* |
| **Bài 14** | Pod Kubernetes | 📄 [`pod.yml.example`](../pod.yml.example) |
| **Bài 15** | Deployment Kubernetes | 📁 [Thư mục Deployment](../deployment/) |
| **Bài 16** | Các command hay dùng Deployment | *Lệnh kubectl rollout, scale, describe...* |
| **Bài 17** | Các chiến lược triển khai Deployment | 📄 [Rolling Update](../deployment/deployment-rolling.yml.example)<br>📄 [Recreate](../deployment/deployment-recreate.yml.example) |
| **Bài 18** | Các loại services | 📁 [Thư mục Service](../service/) |
| **Bài 19** | NodePort Kubernetes | 📄 [NodePort Service](../service/service-nodeport.yml.example)<br>⚙️ [Nginx Load Balancer Config](../load-balancer/nginx/k8s-loadbalancer.conf) |
| **Bài 20** | NodePort Kuberneres Cloud | *Triển khai NodePort trên đám mây* |
| **Bài 21** | ClusterIP Kubernetes | 📄 [ClusterIP Service](../service/mariadb-service.yml.example) |
| **Bài 22** | Ingress Kubernetes | 📁 [Thư mục Ingress](../ingress/) |
| **Bài 23** | Ingress Kubernetes Cloud | *Thực hành Ingress trên môi trường Cloud* |
| **Bài 24** | Template yaml Kubernetes | *Tổng hợp các mẫu thiết kế YAML* |
| **Bài 25** | Triển khai dự án Fullstack | 📁 [Thư mục Fullstack](../full-stack/) |
| **Bài 26** | Configmap Kubernetes | 📁 [Thư mục ConfigMap](../configmap/) |
| **Bài 27** | Secret Kubernetes | 📁 [Thư mục Secret](../secret/) |
| **Bài 28** | Request và Limit | 📁 [Thư mục Resource Limit](../resource-limit/) |
| **Bài 29** | HPA | 📁 [Thư mục HPA](../hpa/)<br>📖 [Hướng dẫn thiết lập HPA](../../setup/kubernetes/setup-hpa-guide.md) |
| **Bài 30** | Sử dụng Rancher | *Vận hành Rancher UI* |
| **Bài 31** | Sử dụng RBAC Rancher | *Phân quyền chi tiết trên Rancher* |
| **Bài 32** | Triển khai công cụ | *Triển khai các công cụ hỗ trợ vận hành* |
| **Bài 33** | Storage class | 📄 [StorageClass template](../storage/storageclass.yml.example)<br>📖 [Hướng dẫn thiết lập NFS](../../setup/kubernetes/setup-nfs-guide.md) |
| **Bài 34** | PV và PVC | 📄 [PV template](../storage/pv.yml.example)<br>📄 [PVC template](../storage/pvc.yml.example)<br>📄 [NFS Pod template](../pod-nfs.yml.example)<br>📖 [Hướng dẫn thiết lập NFS](../../setup/kubernetes/setup-nfs-guide.md) |
| **Bài 35** | Triển khai database MariaDB | 📁 [Thư mục StatefulSet](../statefulset/)<br>📖 [Hướng dẫn cài đặt DB qua Statefulset](../../setup/kubernetes/setup-db-nfs-guide.md) |
| **Bài 36** | Triển khai Redis với chart | 📁 [Thư mục Redis](../redis/)<br>📖 [Hướng dẫn triển khai Redis Sentinel](../../setup/kubernetes/setup-redis-sentinel-guide.md) |
| **Bài 37** | Giám sát và quản trị | *Lý thuyết cơ bản về monitoring* |
| **Bài 38** | DaemonSet | *Mẫu chạy pod thu thập log/metric trên mọi node* |
| **Bài 39** | Triển khai Kube prometheus stack | 📖 [Hướng dẫn cài đặt Kube Prometheus](../../setup/monitoring/setup-kube-prometheus-guide.md) |
| **Bài 40** | Một số dashboard Grafana | *Cấu hình trực quan hóa số liệu hệ thống* |
| **Bài 41** | Uptime kuma với chart | 📁 [Thư mục Uptime Kuma](../uptime-kuma/)<br>📖 [Hướng dẫn thiết lập Uptime Kuma](../../setup/monitoring/setup-uptime-kuma-guide.md) |
| **Bài 42** | Backup gì trên Kubernetes? | *Chiến lược sao lưu dữ liệu cụm K8s* |
| **Bài 43** | Backup và Restore K8s cluster với Velero | 📖 [Hướng dẫn cài đặt Velero CLI](../../setup/kubernetes/install-velero-client-guide.md)<br>📖 [Hướng dẫn backup qua Velero & MinIO](../../setup/kubernetes/setup-velero-minio-backup.md) |

