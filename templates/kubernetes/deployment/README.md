# Kubernetes Deployment - Các câu lệnh thường dùng

## Apply / Xóa Deployment

```bash
# Apply deployment từ file YAML
kubectl apply -f deployment.yml

# Xóa deployment
kubectl delete deployment <ten-deployment> -n <namespace>
```

## Scale Replicas

```bash
# Cập nhật trực tiếp số lượng replicas
kubectl scale deployment <ten-deployment> --replicas=<so-replicas> -n <namespace>
```

## Xem thông tin Deployment

```bash
# Xem chi tiết cụ thể về một Deployment
kubectl describe deployment <ten-deployment> -n <namespace>

# Xem cấu hình YAML của một Deployment
kubectl get deployment <ten-deployment> -o yaml -n <namespace>

# Liệt kê các Pod được tạo bởi một Deployment cụ thể
kubectl get pods -l app=<ten-deployment> -n <namespace>
```

## Cập nhật Deployment

```bash
# Cập nhật Deployment bằng cách thay đổi hình ảnh container
kubectl set image deployment/<ten-deployment> <ten-container>=<ten-image>:<tag-moi> -n <namespace>

# Cập nhật biến môi trường cho các container trong Deployment
kubectl set env deployment/<ten-deployment> <key>=<value> -n <namespace>
```

## Rollback & Lịch sử

```bash
# Kiểm tra lịch sử các phiên bản của Deployment
kubectl rollout history deployment <ten-deployment> -n <namespace>

# Rollback Deployment về phiên bản trước
kubectl rollout undo deployment <ten-deployment> -n <namespace>

# Rollback về một revision cụ thể
kubectl rollout undo deployment <ten-deployment> --to-revision=<so-revision> -n <namespace>

# Kiểm tra trạng thái rollout
kubectl rollout status deployment <ten-deployment> -n <namespace>
```
