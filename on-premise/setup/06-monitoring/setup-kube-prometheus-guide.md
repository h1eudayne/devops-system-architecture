# Huong Dan Cai Dat Kube Prometheus Stack (Prometheus + Grafana)

Huong dan nay giup ban trien khai **kube-prometheus-stack** tren Kubernetes su dung Helm chart, bao gom Prometheus (thu thap metrics) va Grafana (hien thi dashboard).

## Dieu kien can

- Cum K8s da hoat dong — [Huong dan dung cum K8s](../kubernetes/setup-cluster-guide.md)
- Helm da cai dat — [Huong dan cai dat Helm](../kubernetes/install-helm-guide.md)
- NFS Server da cau hinh — [Huong dan cai dat NFS Server](../nfs/nfs-server-guide.md)
- Ingress Nginx Controller da cai dat (neu muon truy cap qua domain) — [Huong dan cai dat Ingress Nginx](../kubernetes/install-ingress-nginx-guide.md)
- StorageClass `nfs-storage` da tao — [PV/PVC templates](../../kubernetes/storage/)

---

## Buoc 1: Tao thu muc du lieu tren NFS Server

Thuc hien tren **NFS Server** (vi du: database-server):

```bash
sudo mkdir -p /data/monitoring
sudo chown -R nobody:nogroup /data/
sudo chmod -R 777 /data
```

> **Luu y**: Dam bao thu muc `/data/monitoring` da duoc export trong file `/etc/exports` cua NFS Server.

---

## Buoc 2: Tao Namespace monitoring

```bash
kubectl create ns monitoring
```

---

## Buoc 3: Tao PersistentVolume

Tao file `monitoring-pv.yml` tu template:

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: monitoring-pv
spec:
  capacity:
    storage: 10Gi
  accessModes:
    - ReadWriteOnce
  nfs:
    path: /data/monitoring
    server: 192.168.1.115  # Thay doi IP NFS Server cua ban
  persistentVolumeReclaimPolicy: Retain
  storageClassName: nfs-storage
```

Apply:

```bash
kubectl apply -f monitoring-pv.yml
```

Kiem tra:

```bash
kubectl get pv monitoring-pv
```

> **Template co san**: [monitoring-pv.yml.example](../../kubernetes/storage/monitoring-pv.yml.example)

---

## Buoc 4: Cai dat kube-prometheus-stack bang Helm

### Cach 1: Cai dat truc tiep bang --set (nhanh)

```bash
# Them Helm repo
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

# Cai dat
helm upgrade --install devopseduvn prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --set prometheus.prometheusSpec.storageSpec.volumeClaimTemplate.spec.accessModes[0]=ReadWriteOnce \
  --set prometheus.prometheusSpec.storageSpec.volumeClaimTemplate.spec.resources.requests.storage=10Gi \
  --set prometheus.prometheusSpec.storageSpec.volumeClaimTemplate.spec.storageClassName=nfs-storage
```

### Cach 2: Cai dat bang values.yaml (khuyen nghi cho production)

```bash
# Tai chart ve local
helm pull prometheus-community/kube-prometheus-stack
tar -xvf kube-prometheus-stack-*.tgz

# Chinh sua values.yaml
vi kube-prometheus-stack/values.yaml
```

Trong `values.yaml`, tim va chinh sua cac phan:

**Storage cho Prometheus:**

```yaml
prometheus:
  prometheusSpec:
    storageSpec:
      volumeClaimTemplate:
        spec:
          storageClassName: nfs-storage
          accessModes:
            - ReadWriteOnce
          resources:
            requests:
              storage: 10Gi
```

Sau do cai dat:

```bash
helm upgrade --install devopseduvn prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  -f kube-prometheus-stack/values.yaml
```

> **Template values.yaml co san**: [values.yml.example](../../kubernetes/redis/values.yml.example) (tham khao cau truc tuong tu)

---

## Buoc 5: Kiem tra cai dat

```bash
# Kiem tra tat ca pod trong namespace monitoring
kubectl get pods -n monitoring

# Kiem tra services
kubectl get svc -n monitoring
```

Ket qua mong doi: tat ca pod trang thai `Running`, bao gom:
- `prometheus-devopseduvn-kube-prometheus-prometheus-0`
- `devopseduvn-grafana-*`
- `devopseduvn-kube-prometheus-operator-*`
- `alertmanager-devopseduvn-kube-prometheus-alertmanager-0`

---

## Buoc 6: Cau hinh Ingress (truy cap qua domain)

### Cach 1: Cau hinh trong values.yaml

Trong `values.yaml`, enable ingress cho **Prometheus**:

```yaml
prometheus:
  ingress:
    enabled: true
    ingressClassName: nginx
    hosts:
      - prometheus.your-domain.com    # Thay doi domain cua ban
```

Va cho **Grafana**:

```yaml
grafana:
  ingress:
    enabled: true
    ingressClassName: nginx
    hosts:
      - grafana.your-domain.com       # Thay doi domain cua ban
```

Sau do upgrade lai:

```bash
helm upgrade devopseduvn prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  -f values.yaml
```

### Cach 2: Cau hinh qua Rancher UI

1. Truy cap **Rancher** > chon Cluster
2. Vao **Service Discovery** > **Ingresses**
3. Click **Create**
4. Chon **Namespace**: `monitoring`
5. Chon **Ingress Class**: `nginx`
6. **Add Host**:
   - Host: `prometheus.your-domain.com` → Service: `devopseduvn-kube-prometheus-prometheus` → Port: `9090`
7. **Add Host** (them 1 rule nua cho Grafana):
   - Host: `grafana.your-domain.com` → Service: `devopseduvn-grafana` → Port: `80`
8. Click **Create**

---

## Buoc 7: Truy cap

| Dich vu | URL | Tai khoan mac dinh |
|---|---|---|
| Prometheus | `http://prometheus.your-domain.com` | Khong can dang nhap |
| Grafana | `http://grafana.your-domain.com` | admin / prom-operator |

> **Luu y**: Mat khau Grafana mac dinh la `prom-operator`. Nen doi mat khau ngay sau khi dang nhap lan dau.

---

## Tai lieu lien quan

| Chu de | Duong dan |
|---|---|
| Dung cum K8s | [setup-cluster-guide.md](../kubernetes/setup-cluster-guide.md) |
| Cai dat Helm | [install-helm-guide.md](../kubernetes/install-helm-guide.md) |
| Cai dat NFS Server | [nfs-server-guide.md](../nfs/nfs-server-guide.md) |
| Cai dat NFS Client | [nfs-client-guide.md](../nfs/nfs-client-guide.md) |
| Cai dat Ingress Nginx | [install-ingress-nginx-guide.md](../kubernetes/install-ingress-nginx-guide.md) |
| Setup NFS tren K8s | [setup-nfs-guide.md](../kubernetes/setup-nfs-guide.md) |
| Setup HPA (Metrics Server) | [setup-hpa-guide.md](../kubernetes/setup-hpa-guide.md) |
| PV template cho monitoring | [monitoring-pv.yml.example](../../kubernetes/storage/monitoring-pv.yml.example) |
| PV/PVC/StorageClass templates | [storage/](../../kubernetes/storage/) |
