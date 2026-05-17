# Kubernetes Service - Các câu lệnh thường dùng

## Liệt kê Service

```bash
# Liệt kê tất cả service trong namespace
kubectl get svc -n <namespace>

# Xem chi tiết service
kubectl describe svc <ten-service> -n <namespace>

# Xem cấu hình YAML của service
kubectl get svc <ten-service> -o yaml -n <namespace>
```

## Tạo / Xóa Service

```bash
# Apply service từ file YAML
kubectl apply -f service-nodeport.yml

# Xóa service
kubectl delete svc <ten-service> -n <namespace>
```

## Kiểm tra kết nối

```bash
# Kiểm tra endpoint của service (danh sách Pod IP đang kết nối)
kubectl get endpoints <ten-service> -n <namespace>

# Test truy cập qua NodePort
curl http://<NODE_IP>:<NODE_PORT>

# Test truy cập nội bộ cluster (từ trong Pod khác)
curl http://<ten-service>.<namespace>.svc.cluster.local:<SERVICE_PORT>
```

## Các loại Service

| Type         | Mô tả                                                        |
|--------------|---------------------------------------------------------------|
| ClusterIP    | Chỉ truy cập nội bộ trong cluster (mặc định)                 |
| NodePort     | Expose qua port trên mỗi Node (range 30000-32767)            |
| LoadBalancer | Tạo external load balancer (cloud provider)                   |
| ExternalName | Map service tới DNS name bên ngoài                            |
