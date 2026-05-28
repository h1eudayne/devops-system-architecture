# Shared Ingress Nginx Install Scripts for Ubuntu

## Template hien co

- `01-prepare-ingress-nginx.sh.example`
  Bash script tai chart Ingress Nginx, chinh sua `values.yaml` (NodePort, port config) va copy vao thu muc devops.
  **Chay bang quyen root** tren master node.

- `02-deploy-ingress-nginx.sh.example`
  Bash script tao namespace va cai dat Ingress Nginx Controller bang Helm.
  **Chay bang user devops** (user co quyen kubectl).

## Yeu cau truoc khi cai

- Da cai dat cum Kubernetes va `kubectl` hoat dong
- Da cai dat Helm (xem `shared/helm/install/ubuntu/`)
- User root de chay script 01
- User devops (co quyen kubectl) de chay script 02

## Cau hinh mac dinh

| Thong so       | Gia tri       |
| -------------- | ------------- |
| Service type   | NodePort      |
| HTTP nodePort  | 30080         |
| HTTPS nodePort | 30443         |

## Thu tu thuc hien

```bash
# === CHAY BANG ROOT ===

# 1. Copy va review script 01
cp 01-prepare-ingress-nginx.sh.example 01-prepare-ingress-nginx.sh
chmod +x 01-prepare-ingress-nginx.sh

# 2. Chay script 01 (tai chart, sua values.yaml, copy cho devops)
./01-prepare-ingress-nginx.sh

# === CHUYEN SANG USER DEVOPS ===
su - devops

# 3. Copy va review script 02
cp 02-deploy-ingress-nginx.sh.example 02-deploy-ingress-nginx.sh
chmod +x 02-deploy-ingress-nginx.sh

# 4. Chay script 02 (tao namespace va cai dat)
./02-deploy-ingress-nginx.sh

# 5. Kiem tra
kubectl get pods -n ingress-nginx
kubectl get svc -n ingress-nginx
```

## Truy cap sau khi cai dat

```text
HTTP:  http://<NODE_IP>:30080
HTTPS: https://<NODE_IP>:30443
```

## Tuy chinh

Chinh sua cac bien trong script 01 de thay doi port:

```bash
NODEPORT_HTTP="30080"     # Port HTTP
NODEPORT_HTTPS="30443"    # Port HTTPS
```

## Luu y

- Script 01 chay bang root vi can quyen ghi vao `/home/devops/`.
- Script 02 chay bang user devops vi can quyen kubectl voi cum K8s.
- File duoc dat duoi dang `.example` de nhac nguoi dung review lai truoc khi chay.
- Review lai `values.yaml` sau khi script 01 chinh sua de dam bao dung yeu cau.
