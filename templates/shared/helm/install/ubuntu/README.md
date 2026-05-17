# Shared Helm Install Scripts for Ubuntu

## Template hien co

- `01-install-helm.sh.example`
  Bash script cai dat Helm (Kubernetes Package Manager) phien ban v3.16.2.
  Chay tren node co kubectl (thuong la master node).

## Yeu cau truoc khi cai

- Da cai dat cum Kubernetes va co `kubectl` hoat dong
- User co quyen `sudo`
- Co ket noi internet de tai file cai dat

## Cach su dung

```bash
# 1. Copy file example va review
cp 01-install-helm.sh.example 01-install-helm.sh

# 2. Cap quyen thuc thi
chmod +x 01-install-helm.sh

# 3. Chay script
./01-install-helm.sh

# 4. Kiem tra
helm version
```

## Thay doi phien ban Helm

Chinh sua bien `HELM_VERSION` trong file script:

```bash
HELM_VERSION="v3.16.2"   # Thay doi phien ban tai day
```

## Luu y

- Script giu nguyen flow tu huong dan de de copy dung nhanh.
- File duoc dat duoi dang `.example` de nhac nguoi dung review lai truoc khi chay tren server that.
- Helm chi can cai tren node ma ban su dung `kubectl` (thuong la master node hoac may local).
