# Lộ Trình Học Tập Kubernetes (Kubernetes Roadmap)

Tài liệu này tổng hợp toàn bộ lộ trình học tập Kubernetes từ cơ bản đến nâng cao theo giáo trình học tập của bạn (gồm 43 bài học). Đối với mỗi bài học có tệp tin hoặc thư mục cấu hình mẫu (manifest) trong dự án, bạn có thể bấm trực tiếp vào liên kết để thực hành.

---

## 🗺️ Bản Đồ Lộ Trình Học Tập

| Bài Học | Tiêu Đề Bài Học | Thời Lượng | Bài Kiểm Tra / Đánh Giá | Tài Nguyên & Tệp Thực Hành |
| :--- | :--- | :---: | :--- | :--- |
| **Bài 1** | Kubernetes là gì? Kubernetes để làm gì? | 05:25 | Bài kiểm tra số 1 | *Lý thuyết cơ bản* |
| **Bài 2** | Khi nào nên sử dụng Kubernetes? | 04:26 | Bài kiểm tra số 2 | *Lý thuyết quyết định hệ thống* |
| **Bài 3** | Hạ tầng Kubernetes | 07:26 | Bài kiểm tra số 3 | 📖 [Hướng dẫn cài đặt Cluster](../../setup/kubernetes/setup-cluster-guide.md) |
| **Bài 7** | Mô hình triển khai dự án trên Kubernetes | 06:17 | Bài kiểm tra số 7 | *Mô hình tổng quan (Database, Backend, Frontend)* |
| **Bài 8** | File yaml cấu hình trong Kubernetes | 03:12 | Bài kiểm tra số 8 | *Cấu trúc file YAML cơ bản* |
| **Bài 9** | Namespace trong Kubernetes | 06:58 | Bài kiểm tra số 9 | 📄 [`namespace.yml.example`](../namespace.yml.example) |
| **Bài 10** | Phương pháp triển khai dự án trên Kubernetes hiệu quả | 04:09 | Bài kiểm tra số 10 | *Phương pháp tối ưu vận hành* |
| **Bài 11** | Các công cụ quản lý Kubernetes | 03:21 | Bài kiểm tra số 11 | *Giới thiệu kubectl, k9s, dashboard...* |
| **Bài 12** | Cài đặt Rancher và quản lý Kubernetes | 13:57 | Bài kiểm tra số 12 | 📖 [Hướng dẫn cài đặt Rancher](../../setup/rancher/install-rancher-guide.md) |
| **Bài 13** | Cài đặt Rancher trên Cloud (GCP) | 06:40 | Bài kiểm tra số 13 | *Triển khai thực tế trên GCP* |
| **Bài 14** | Pod Kubernetes | 08:25 | Bài kiểm tra số 14 | 📄 [`pod.yml.example`](../pod.yml.example) |
| **Bài 15** | Deployment Kubernetes | 14:18 | Bài kiểm tra số 15 | 📁 [Thư mục Deployment](../deployment/) |
| **Bài 16** | Các command hay dùng Deployment | 04:33 | Bài kiểm tra số 16 | *Lệnh kubectl rollout, scale, describe...* |
| **Bài 17** | Các chiến lược triển khai Deployment | 06:54 | Bài kiểm tra số 17 | 📄 [Rolling Update](../deployment/deployment-rolling.yml.example)<br>📄 [Recreate](../deployment/deployment-recreate.yml.example) |
| **Bài 18** | Các loại services | 04:08 | Bài kiểm tra số 18 | 📁 [Thư mục Service](../service/) |
| **Bài 19** | NodePort Kubernetes | 02:50 | Bài kiểm tra số 19 | 📄 [NodePort Service](../service/service-nodeport.yml.example)<br>⚙️ [Nginx Load Balancer Config](../load-balancer/nginx/k8s-loadbalancer.conf) |
| **Bài 20** | NodePort Kuberneres Cloud | 03:35 | Bài kiểm tra số 20 | *Triển khai NodePort trên đám mây* |
| **Bài 21** | ClusterIP Kubernetes | 02:10 | Bài kiểm tra số 21 | 📄 [ClusterIP Service](../service/mariadb-service.yml.example) |
| **Bài 22** | Ingress Kubernetes | 23:46 | Bài kiểm tra số 22 | 📁 [Thư mục Ingress](../ingress/) |
| **Bài 23** | Ingress Kubernetes Cloud | 05:33 | Bài kiểm tra số 23 | *Thực hành Ingress trên môi trường Cloud* |
| **Bài 24** | Template yaml Kubernetes | 07:13 | Bài kiểm tra số 24 | *Tổng hợp các mẫu thiết kế YAML* |
| **Bài 25** | Triển khai dự án Fullstack | 21:21 | Bài kiểm tra số 25 | 📁 [Thư mục Fullstack](../full-stack/) |
| **Bài 26** | Configmap Kubernetes | 11:35 | Bài kiểm tra số 26 | 📁 [Thư mục ConfigMap](../configmap/) |
| **Bài 27** | Secret Kubernetes | 10:52 | Bài kiểm tra số 27 | 📁 [Thư mục Secret](../secret/) |
| **Bài 28** | Request và Limit | 05:33 | Bài kiểm tra số 28 | 📁 [Thư mục Resource Limit](../resource-limit/) |
| **Bài 29** | HPA | 15:50 | Bài kiểm tra số 29 | 📁 [Thư mục HPA](../hpa/)<br>📖 [Hướng dẫn thiết lập HPA](../../setup/kubernetes/setup-hpa-guide.md) |
| **Bài 30** | Sử dụng Rancher | 15:19 | Bài kiểm tra số 30 | *Vận hành Rancher UI* |
| **Bài 31** | Sử dụng RBAC Rancher | 10:11 | Bài kiểm tra số 31 | *Phân quyền chi tiết trên Rancher* |
| **Bài 32** | Triển khai công cụ | 02:12 | - | *Triển khai các công cụ hỗ trợ vận hành* |
| **Bài 33** | Storage class | 09:13 | Bài kiểm tra số 33 | 📄 [StorageClass template](../storage/storageclass.yml.example)<br>📖 [Hướng dẫn thiết lập NFS](../../setup/kubernetes/setup-nfs-guide.md) |
| **Bài 34** | PV và PVC | 15:44 | Bài kiểm tra số 34 | 📄 [PV template](../storage/pv.yml.example)<br>📄 [PVC template](../storage/pvc.yml.example)<br>📄 [NFS Pod template](../pod-nfs.yml.example)<br>📖 [Hướng dẫn thiết lập NFS](../../setup/kubernetes/setup-nfs-guide.md) |
| **Bài 35** | Triển khai database MariaDB | 07:17 | Bài kiểm tra số 35 | 📁 [Thư mục StatefulSet](../statefulset/)<br>📖 [Hướng dẫn cài đặt DB qua Statefulset](../../setup/kubernetes/setup-db-nfs-guide.md) |
| **Bài 36** | Triển khai Redis với chart | 15:55 | Bài kiểm tra số 36 | 📁 [Thư mục Redis](../redis/)<br>📖 [Hướng dẫn triển khai Redis Sentinel](../../setup/kubernetes/setup-redis-sentinel-guide.md) |
| **Bài 37** | Giám sát và quản trị | 02:42 | - | *Lý thuyết cơ bản về monitoring* |
| **Bài 38** | DaemonSet | 03:12 | Bài kiểm tra số 38 | *Mẫu chạy pod thu thập log/metric trên mọi node* |
| **Bài 39** | Triển khai Kube prometheus stack | 12:41 | Bài kiểm tra số 39 | 📖 [Hướng dẫn cài đặt Kube Prometheus](../../setup/monitoring/setup-kube-prometheus-guide.md) |
| **Bài 40** | Một số dashboard Grafana | 06:59 | Bài kiểm tra số 40 | *Cấu hình trực quan hóa số liệu hệ thống* |
| **Bài 41** | Uptime kuma với chart | 08:51 | Bài kiểm tra số 41 | 📁 [Thư mục Uptime Kuma](../uptime-kuma/)<br>📖 [Hướng dẫn thiết lập Uptime Kuma](../../setup/monitoring/setup-uptime-kuma-guide.md) |
| **Bài 42** | Backup gì trên Kubernetes? | 06:05 | Bài kiểm tra số 42 | *Chiến lược sao lưu dữ liệu cụm K8s* |
| **Bài 43** | Backup và Restore K8s cluster với Velero | 13:20 | Bài kiểm tra số 43 | 📖 [Hướng dẫn cài đặt Velero CLI](../../setup/kubernetes/install-velero-client-guide.md)<br>📖 [Hướng dẫn backup qua Velero & MinIO](../../setup/kubernetes/setup-velero-minio-backup.md) |

