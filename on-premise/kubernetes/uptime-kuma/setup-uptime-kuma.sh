#!/bin/bash

# ==============================================================================
# Setup Uptime Kuma on Kubernetes (On-Premise)
# ------------------------------------------------------------------------------
# Script này tự động hóa quá trình cài đặt Uptime Kuma:
#   1. Tạo Namespace "monitoring"
#   2. Áp dụng cấu hình PV & PVC (NFS Storage)
#   3. Cài đặt Uptime Kuma thông qua Helm Chart
#   4. Triển khai Ingress cấu hình tên miền
# ==============================================================================

set -euo pipefail

# ------------------------------------------------------------------------------
# Biến cấu hình
# ------------------------------------------------------------------------------
NAMESPACE="monitoring"
RELEASE_NAME="uptime-kuma"
VALUES_FILE="values.yaml"
INGRESS_FILE="ingress.yml"
PV_PVC_FILE="../storage/uptime-kuma-pv-pvc.yml"

echo ">>> Bắt đầu thiết lập Uptime Kuma trên Kubernetes ..."

# 1. Tạo Namespace
echo ">>> [1/5] Khởi tạo Namespace '${NAMESPACE}' ..."
if ! kubectl get ns "${NAMESPACE}" &>/dev/null; then
    kubectl create ns "${NAMESPACE}"
    echo "  Namespace '${NAMESPACE}' đã được tạo."
else
    echo "  Namespace '${NAMESPACE}' đã tồn tại."
fi

# 2. Áp dụng PV & PVC
echo ">>> [2/5] Cấp phát lưu trữ PersistentVolume & PersistentVolumeClaim ..."
if [ -f "${PV_PVC_FILE}" ]; then
    kubectl apply -f "${PV_PVC_FILE}"
elif [ -f "../storage/uptime-kuma-pv-pvc.yml.example" ]; then
    echo "  Cảnh báo: Không tìm thấy file '${PV_PVC_FILE}', sử dụng file template '.example' ..."
    kubectl apply -f "../storage/uptime-kuma-pv-pvc.yml.example"
else
    echo "  Lỗi: Không tìm thấy cấu hình PV & PVC tại thư mục storage."
    exit 1
fi

# Đợi PVC chuyển sang trạng thái Bound
echo "  Đang kiểm tra trạng thái liên kết PVC..."
sleep 2
kubectl get pvc uptime-kuma-pvc -n "${NAMESPACE}"

# 3. Cấu hình Helm và cài đặt Uptime Kuma
echo ">>> [3/5] Thêm Helm Repository và tải Chart ..."
helm repo add uptime-kuma https://dirsigler.github.io/uptime-kuma-helm
helm repo update

echo ">>> [4/5] Triển khai Uptime Kuma bằng Helm ..."
if [ ! -f "${VALUES_FILE}" ] && [ -f "values.yml.example" ]; then
    echo "  Không tìm thấy '${VALUES_FILE}', tự động sao chép từ 'values.yml.example'..."
    cp values.yml.example "${VALUES_FILE}"
fi

helm upgrade --install "${RELEASE_NAME}" uptime-kuma/uptime-kuma \
    --values "${VALUES_FILE}" \
    --namespace "${NAMESPACE}"

# 4. Triển khai Ingress
echo ">>> [5/5] Triển khai Ingress ..."
if [ -f "${INGRESS_FILE}" ]; then
    kubectl apply -f "${INGRESS_FILE}"
elif [ -f "ingress.yml.example" ]; then
    echo "  Không tìm thấy '${INGRESS_FILE}', tự động sử dụng 'ingress.yml.example'..."
    kubectl apply -f ingress.yml.example
else
    echo "  Bỏ qua cấu hình Ingress do không tìm thấy file cấu hình."
fi

echo ""
echo "========================================================================="
echo "  HƯỚNG DẪN HOÀN TẤT & SỬA LỖI DNS (ADD HOST ALIAS)"
echo "-------------------------------------------------------------------------"
echo "  1. Kiểm tra trạng thái Pods:"
echo "     kubectl get pods -n ${NAMESPACE} -w"
echo ""
echo "  2. Địa chỉ truy cập Web UI:"
echo "     http://uptime.devops.hieuduyne.tech"
echo ""
echo "  3. Sửa lỗi domain add host (Không truy cập hoặc phân giải được domain):"
echo "     - Trên Rancher UI: Vào Workloads -> Edit Config (kuma-uptime) ->"
echo "       Pod -> Networking -> Add Alias."
echo "       Điền IP của Ingress Controller (ví dụ 192.168.1.115) và Hostname."
echo ""
echo "     - Hoặc cập nhật trực tiếp Deployment YAML:"
echo "       kubectl edit deployment uptime-kuma -n ${NAMESPACE}"
echo "       Thêm đoạn cấu hình sau vào spec.template.spec:"
echo "       hostAliases:"
echo "         - ip: \"192.168.1.115\""
echo "           hostnames:"
echo "             - \"uptime.devops.hieuduyne.tech\""
echo "========================================================================="
