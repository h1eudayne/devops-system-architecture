# Lộ Trình Học Tập Kubernetes (Kubernetes Roadmap)

Tài liệu này tổng hợp toàn bộ lộ trình học tập Kubernetes từ cơ bản đến nâng cao theo giáo trình học tập của bạn (gồm 43 bài học). Đối với mỗi bài học có tệp tin hoặc thư mục cấu hình mẫu (manifest) trong dự án, bạn có thể bấm trực tiếp vào liên kết để thực hành.

---

## 🗺️ Bản Đồ Lộ Trình Học Tập

| Bài | Tiêu Đề Bài Học | Tài Nguyên & Tệp Thực Hành |
| :---: | :--- | :--- |
| **1** | Kubernetes là gì? Kubernetes để làm gì? | *Lý thuyết cơ bản* |
| **2** | Khi nào nên sử dụng Kubernetes? | *Lý thuyết quyết định hệ thống* |
| **3** | Hạ tầng Kubernetes | 📖 [Hướng dẫn cài đặt Cluster](../../setup/kubernetes/setup-cluster-guide.md) |
| **7** | Mô hình triển khai dự án trên Kubernetes | *Mô hình tổng quan (Database, Backend, Frontend)* |
| **8** | File yaml cấu hình trong Kubernetes | *Cấu trúc file YAML cơ bản* |
| **9** | Namespace trong Kubernetes | 📄 [`namespace.yml.example`](../namespace.yml.example) |
| **10** | Phương pháp triển khai dự án trên Kubernetes hiệu quả | *Phương pháp tối ưu vận hành* |
| **11** | Các công cụ quản lý Kubernetes | *Giới thiệu kubectl, k9s, dashboard...* |
| **12** | Cài đặt Rancher và quản lý Kubernetes | 📖 [Hướng dẫn cài đặt Rancher](../../setup/rancher/install-rancher-guide.md) |
| **13** | Cài đặt Rancher trên Cloud (GCP) | *Triển khai thực tế trên GCP* |
| **14** | Pod Kubernetes | 📄 [`pod.yml.example`](../pod.yml.example) |
| **15** | Deployment Kubernetes | 📁 [Thư mục Deployment](../deployment/) |
| **16** | Các command hay dùng Deployment | *Lệnh kubectl rollout, scale, describe...* |
| **17** | Các chiến lược triển khai Deployment | 📄 [Rolling Update](../deployment/deployment-rolling.yml.example)<br>📄 [Recreate](../deployment/deployment-recreate.yml.example) |
| **18** | Các loại services | 📁 [Thư mục Service](../service/) |
| **19** | NodePort Kubernetes | 📄 [NodePort Service](../service/service-nodeport.yml.example)<br>⚙️ [Nginx Load Balancer Config](../load-balancer/nginx/k8s-loadbalancer.conf) |
| **20** | NodePort Kuberneres Cloud | *Triển khai NodePort trên đám mây* |
| **21** | ClusterIP Kubernetes | 📄 [ClusterIP Service](../service/mariadb-service.yml.example) |
| **22** | Ingress Kubernetes | 📁 [Thư mục Ingress](../ingress/) |
| **23** | Ingress Kubernetes Cloud | *Thực hành Ingress trên môi trường Cloud* |
| **24** | Template yaml Kubernetes | *Tổng hợp các mẫu thiết kế YAML* |
| **25** | Triển khai dự án Fullstack | 📁 [Thư mục Fullstack](../full-stack/) |
| **26** | Configmap Kubernetes | 📁 [Thư mục ConfigMap](../configmap/) |
| **27** | Secret Kubernetes | 📁 [Thư mục Secret](../secret/) |
| **28** | Request và Limit | 📁 [Thư mục Resource Limit](../resource-limit/) |
| **29** | HPA | 📁 [Thư mục HPA](../hpa/)<br>📖 [Hướng dẫn thiết lập HPA](../../setup/kubernetes/setup-hpa-guide.md) |
| **30** | Sử dụng Rancher | *Vận hành Rancher UI* |
| **31** | Sử dụng RBAC Rancher | *Phân quyền chi tiết trên Rancher* |
| **32** | Triển khai công cụ | *Triển khai các công cụ hỗ trợ vận hành* |
| **33** | Storage class | 📄 [StorageClass template](../storage/storageclass.yml.example)<br>📖 [Hướng dẫn thiết lập NFS](../../setup/kubernetes/setup-nfs-guide.md) |
| **34** | PV và PVC | 📄 [PV template](../storage/pv.yml.example)<br>📄 [PVC template](../storage/pvc.yml.example)<br>📄 [NFS Pod template](../pod-nfs.yml.example)<br>📖 [Hướng dẫn thiết lập NFS](../../setup/kubernetes/setup-nfs-guide.md) |
| **35** | Triển khai database MariaDB | 📁 [Thư mục StatefulSet](../statefulset/)<br>📖 [Hướng dẫn cài đặt DB qua Statefulset](../../setup/kubernetes/setup-db-nfs-guide.md) |
| **36** | Triển khai Redis với chart | 📁 [Thư mục Redis](../redis/)<br>📖 [Hướng dẫn triển khai Redis Sentinel](../../setup/kubernetes/setup-redis-sentinel-guide.md) |
| **37** | Giám sát và quản trị | *Lý thuyết cơ bản về monitoring* |
| **38** | DaemonSet | *Mẫu chạy pod thu thập log/metric trên mọi node* |
| **39** | Triển khai Kube prometheus stack | 📖 [Hướng dẫn cài đặt Kube Prometheus](../../setup/monitoring/setup-kube-prometheus-guide.md) |
| **40** | Một số dashboard Grafana | *Cấu hình trực quan hóa số liệu hệ thống* |
| **41** | Uptime kuma với chart | 📁 [Thư mục Uptime Kuma](../uptime-kuma/)<br>📖 [Hướng dẫn thiết lập Uptime Kuma](../../setup/monitoring/setup-uptime-kuma-guide.md) |
| **42** | Backup gì trên Kubernetes? | *Chiến lược sao lưu dữ liệu cụm K8s* |
| **43** | Backup và Restore K8s cluster với Velero | 📖 [Hướng dẫn cài đặt Velero CLI](../../setup/kubernetes/install-velero-client-guide.md)<br>📖 [Hướng dẫn backup qua Velero & MinIO](../../setup/kubernetes/setup-velero-minio-backup.md) |

