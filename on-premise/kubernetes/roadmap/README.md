# Lo Trinh Hoc Tap Kubernetes (Kubernetes Roadmap)

Tai lieu nay tong hop toan bo lo trinh hoc tap Kubernetes tu co ban den nang cao theo giao trinh hoc tap cua ban (gom 43 bai hoc). Doi voi moi bai hoc co tep tin hoac thu muc cau hinh mau (manifest) trong du an, ban co the bam truc tiep vao lien ket de thuc hanh.

---

## Ban Do Lo Trinh Hoc Tap

| STT | Tieu De Bai Hoc | Tai Nguyen va Tep Thuc Hanh |
| :---: | :--- | :--- |
| **1** | Kubernetes la gi? Kubernetes de lam gi? | *Ly thuyet co ban* |
| **2** | Khi nao nen su dung Kubernetes? | *Ly thuyet quyet dinh he thong* |
| **3** | Ha tang Kubernetes | [Huong dan cai dat Cluster](../../setup/kubernetes/setup-cluster-guide.md) |
| **7** | Mo hinh trien khai du an tren Kubernetes | *Mo hinh tong quan (Database, Backend, Frontend)* |
| **8** | File yaml cau hinh trong Kubernetes | *Cau truc file YAML co ban* |
| **9** | Namespace trong Kubernetes | [`namespace.yml.example`](../namespace.yml.example) |
| **10** | Phuong phap trien khai du an tren Kubernetes hieu qua | *Phuong phap toi uu van hanh* |
| **11** | Cac cong cu quan ly Kubernetes | *Gioi thieu kubectl, k9s, dashboard...* |
| **12** | Cai dat Rancher va quan ly Kubernetes | [Huong dan cai dat Rancher](../../setup/rancher/install-rancher-guide.md) |
| **13** | Cai dat Rancher tren Cloud (GCP) | *Trien khai thuc te tren GCP* |
| **14** | Pod Kubernetes | [`pod.yml.example`](../pod.yml.example) |
| **15** | Deployment Kubernetes | [Thu muc Deployment](../deployment/) |
| **16** | Cac command hay dung Deployment | *Lenh kubectl rollout, scale, describe...* |
| **17** | Cac chien luoc trien khai Deployment | [Rolling Update](../deployment/deployment-rolling.yml.example)<br>[Recreate](../deployment/deployment-recreate.yml.example) |
| **18** | Cac loai services | [Thu muc Service](../service/) |
| **19** | NodePort Kubernetes | [NodePort Service](../service/service-nodeport.yml.example)<br>[Nginx Load Balancer Config](../load-balancer/nginx/k8s-loadbalancer.conf) |
| **20** | NodePort Kuberneres Cloud | *Trien khai NodePort tren dam may* |
| **21** | ClusterIP Kubernetes | [ClusterIP Service](../service/mariadb-service.yml.example) |
| **22** | Ingress Kubernetes | [Thu muc Ingress](../ingress/) |
| **23** | Ingress Kubernetes Cloud | *Thuc hanh Ingress tren moi truong Cloud* |
| **24** | Template yaml Kubernetes | *Tong hop cac mau thiet ke YAML* |
| **25** | Trien khai du an Fullstack | [Thu muc Fullstack](../full-stack/) |
| **26** | Configmap Kubernetes | [Thu muc ConfigMap](../configmap/) |
| **27** | Secret Kubernetes | [Thu muc Secret](../secret/) |
| **28** | Request va Limit | [Thu muc Resource Limit](../resource-limit/) |
| **29** | HPA | [Thu muc HPA](../hpa/)<br>[Huong dan thiet lap HPA](../../setup/kubernetes/setup-hpa-guide.md) |
| **30** | Su dung Rancher | *Van hanh Rancher UI* |
| **31** | Su dung RBAC Rancher | *Phan quyen chi tiet tren Rancher* |
| **32** | Trien khai cong cu | *Trien khai cac cong cu ho tro van hanh* |
| **33** | Storage class | [StorageClass template](../storage/storageclass.yml.example)<br>[Huong dan thiet lap NFS](../../setup/kubernetes/setup-nfs-guide.md) |
| **34** | PV va PVC | [PV template](../storage/pv.yml.example)<br>[PVC template](../storage/pvc.yml.example)<br>[NFS Pod template](../pod-nfs.yml.example)<br>[Huong dan thiet lap NFS](../../setup/kubernetes/setup-nfs-guide.md) |
| **35** | Trien khai database MariaDB | [Thu muc StatefulSet](../statefulset/)<br>[Huong dan cai dat DB qua Statefulset](../../setup/kubernetes/setup-db-nfs-guide.md) |
| **36** | Trien khai Redis voi chart | [Thu muc Redis](../redis/)<br>[Huong dan trien khai Redis Sentinel](../../setup/kubernetes/setup-redis-sentinel-guide.md) |
| **37** | Giam sat va quan tri | *Ly thuyet co ban ve monitoring* |
| **38** | DaemonSet | *Mau chay pod thu thap log/metric tren moi node* |
| **39** | Trien khai Kube prometheus stack | [Huong dan cai dat Kube Prometheus](../../setup/monitoring/setup-kube-prometheus-guide.md) |
| **40** | Mot so dashboard Grafana | *Cau hinh truc quan hoa so lieu he thong* |
| **41** | Uptime kuma voi chart | [Thu muc Uptime Kuma](../uptime-kuma/)<br>[Huong dan thiet lap Uptime Kuma](../../setup/monitoring/setup-uptime-kuma-guide.md) |
| **42** | Backup gi tren Kubernetes? | *Chien luoc sao luu du lieu cum K8s* |
| **43** | Backup va Restore K8s cluster voi Velero | [Huong dan cai dat Velero CLI](../../setup/kubernetes/install-velero-client-guide.md)<br>[Huong dan backup qua Velero va MinIO](../../setup/kubernetes/setup-velero-minio-backup.md) |
