# Shared Kubernetes Install Scripts for Ubuntu (On-Premise)

## Template hien co

- `01-prepare-all-nodes.sh.example`
  Bash script chuan bi tat ca cac node: cau hinh hosts, tat swap, cai kernel module, cau hinh sysctl, cai containerd va cac goi Kubernetes (kubelet, kubeadm, kubectl v1.30).

- `02-init-single-master.sh.example`
  Bash script khoi tao cum K8s mo hinh 1 master + 2 worker. Chay tren node master-1.

- `03-init-ha-master.sh.example`
  Bash script khoi tao cum K8s mo hinh 3 master (HA control plane). Chay tren node master-1.

- `04-join-worker.sh.example`
  Bash script de worker node join vao cum (mo hinh 1 master + 2 worker). Chay tren worker nodes.

- `05-join-control-plane.sh.example`
  Bash script de master node bo sung join vao cum (mo hinh HA 3 master). Chay tren master-2 va master-3.

- `06-reset-cluster.sh.example`
  Bash script reset cum K8s khi muon cai lai tu dau.

## Kien truc cum ho tro

### Mo hinh 1: 1 Master + 2 Worker

```text
k8s-master-1 (control-plane)  ─── kubeadm init
k8s-master-2 (worker)         ─── kubeadm join (worker)
k8s-master-3 (worker)         ─── kubeadm join (worker)
```

### Mo hinh 2: 3 Master HA (control-plane + worker)

```text
k8s-master-1 (control-plane)  ─── kubeadm init --control-plane-endpoint --upload-certs
k8s-master-2 (control-plane)  ─── kubeadm join --control-plane --certificate-key
k8s-master-3 (control-plane)  ─── kubeadm join --control-plane --certificate-key
```

## Cau hinh tai nguyen toi thieu

| Hostname     | OS           | IP             | RAM (toi thieu) | CPU (toi thieu) |
| ------------ | ------------ | -------------- | --------------- | --------------- |
| k8s-master-1 | Ubuntu 22.04 | 192.168.1.111  | 3G              | 2               |
| k8s-master-2 | Ubuntu 22.04 | 192.168.1.112  | 3G              | 2               |
| k8s-master-3 | Ubuntu 22.04 | 192.168.1.113  | 3G              | 2               |

## Thu tu thuc hien

### Mo hinh 1 (1 master + 2 worker)

1. Chay `01-prepare-all-nodes.sh.example` tren **tat ca 3 server**
2. Chay `02-init-single-master.sh.example` tren **k8s-master-1**
3. Chay `04-join-worker.sh.example` tren **k8s-master-2 va k8s-master-3** (thay token va hash tu output buoc 2)

### Mo hinh 2 (3 master HA)

1. Chay `01-prepare-all-nodes.sh.example` tren **tat ca 3 server**
2. Chay `03-init-ha-master.sh.example` tren **k8s-master-1**
3. Chay `05-join-control-plane.sh.example` tren **k8s-master-2 va k8s-master-3** (thay token, hash va cert-key tu output buoc 2)

### Reset cum

- Chay `06-reset-cluster.sh.example` tren **tat ca cac node** khi muon cai lai tu dau.

## Can doi gi truoc khi dung

- Chay script bang user co quyen `sudo` (khoi tao user `devops` bang `adduser devops`)
- Thay doi IP address trong file `01-prepare-all-nodes.sh.example` neu IP khac voi default
- Token va cert hash se duoc in ra sau khi chay `kubeadm init`, can copy sang cac script join
- Kiem tra phien ban Kubernetes (`v1.30`) va Calico (`v3.25.0`) truoc khi chay tren moi truong production
- Dam bao cac server co the giao tiep voi nhau qua mang noi bo

## Luu y

- Script giu nguyen flow tu bai giang de de copy dung nhanh.
- File duoc dat duoi dang `.example` de nhac nguoi dung review lai truoc khi chay tren server that.
- Khong commit thong tin nhay cam nhu token, cert hash hay SSH key vao repo.
- Calico duoc su dung lam CNI plugin. Co the thay bang Flannel, Weave hoac Cilium tuy nhu cau.
