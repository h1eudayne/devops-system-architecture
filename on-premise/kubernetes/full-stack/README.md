# Kubernetes Full-Stack Templates

Template gộp đầy đủ **Deployment + Service + Ingress** trong một file duy nhất,
giúp deploy nhanh một ứng dụng web lên Kubernetes và expose ra ngoài qua domain.

## Khi nào dùng Full-Stack template?

- Khi muốn deploy nhanh một ứng dụng web hoàn chỉnh mà không cần tách file.
- Phù hợp cho **dev/staging** hoặc ứng dụng đơn giản chỉ cần 1 Deployment + 1 Service + 1 Ingress.
- Đối với production phức tạp (nhiều service, cần Helm chart), nên tách riêng từng resource.

## Templates hiện có

| File | Strategy | Service | Ingress | Mô tả |
| --- | --- | --- | --- | --- |
| [`fullstack-rolling-clusterip-ingress.yml.example`](./fullstack-rolling-clusterip-ingress.yml.example) | RollingUpdate | ClusterIP | Nginx | Deploy zero-downtime, expose nội bộ qua ClusterIP, route traffic qua Ingress Nginx |

## Placeholders cần thay thế

| Placeholder | Mô tả | Ví dụ |
| --- | --- | --- |
| `<APP_NAME>` | Tên ứng dụng | `car-serv`, `api-gateway` |
| `<NAMESPACE>` | Namespace đã tạo | `car-serv`, `production` |
| `<DOCKER_IMAGE>` | Docker image đầy đủ | `elroydevops/car-serv:latest` |
| `<CONTAINER_PORT>` | Port container lắng nghe | `80`, `8080`, `3000` |
| `<REPLICAS>` | Số lượng pod chạy song song | `2`, `3` |
| `<DOMAIN>` | Domain trỏ vào ứng dụng | `app.devopsedu.vn` |

## Yêu cầu trước khi dùng

1. **Kubernetes cluster** đang hoạt động
2. **Ingress Nginx Controller** đã cài đặt
   → [`shared/ingress-nginx/install/ubuntu/`](../../shared/ingress-nginx/install/ubuntu/README.md)
3. **Namespace** đã được tạo
   → [`namespace.yml.example`](../namespace.yml.example)
4. (Tùy chọn) **Nginx Load Balancer** nếu chạy on-premise
   → [`load-balancer/nginx/k8s-loadbalancer.conf`](../load-balancer/nginx/k8s-loadbalancer.conf)

## Cách sử dụng

```bash
# 1. Copy template và bỏ .example
cp fullstack-rolling-clusterip-ingress.yml.example fullstack.yml

# 2. Thay thế các placeholder (ví dụ với sed)
sed -i 's/<APP_NAME>/car-serv/g' fullstack.yml
sed -i 's/<NAMESPACE>/car-serv/g' fullstack.yml
sed -i 's|<DOCKER_IMAGE>|elroydevops/car-serv:latest|g' fullstack.yml
sed -i 's/<CONTAINER_PORT>/80/g' fullstack.yml
sed -i 's/<REPLICAS>/2/g' fullstack.yml
sed -i 's/<DOMAIN>/car-serv-onpre.devopsedu.vn/g' fullstack.yml

# 3. Tạo namespace (nếu chưa có)
kubectl create ns car-serv

# 4. Apply toàn bộ
kubectl apply -f fullstack.yml

# 5. Kiểm tra
kubectl get all -n car-serv
kubectl get ingress -n car-serv
```

## Kiểm tra sau khi deploy

```bash
# Xem trạng thái tất cả resource
kubectl get all -n <NAMESPACE>

# Xem chi tiết Ingress (kiểm tra routing rule)
kubectl describe ingress <APP_NAME>-ingress -n <NAMESPACE>

# Kiểm tra rollout status
kubectl rollout status deployment/<APP_NAME>-deployment -n <NAMESPACE>

# Test truy cập (cần add host nếu chưa có DNS)
curl -v http://<DOMAIN>/
```

## Cấu trúc resource

```text
  Deployment (<APP_NAME>-deployment)
       |
       | selector: app=<APP_NAME>
       v
  Pod (replicas: <REPLICAS>)
       |
       | label: app=<APP_NAME>
       |
  Service (<APP_NAME>-service)         <-- ClusterIP, chỉ truy cập nội bộ
       |
       | name: <APP_NAME>-service
       |
  Ingress (<APP_NAME>-ingress)         <-- Route từ domain vào Service
       |
       | host: <DOMAIN>
       v
  Client truy cập qua http://<DOMAIN>
```

## Tùy chỉnh nâng cao

Template đã chuẩn bị sẵn các phần tùy chọn (đang comment), bỏ comment để bật:

- **Resource Limits**: giới hạn CPU/Memory cho container
- **Health Check**: liveness/readiness probe để K8s tự restart pod lỗi
- **Annotations**: proxy body size, timeout cho Ingress
- **TLS**: cấu hình HTTPS với certificate

## Câu lệnh thường dùng

```bash
# Scale replicas
kubectl scale deployment <APP_NAME>-deployment --replicas=3 -n <NAMESPACE>

# Cập nhật image
kubectl set image deployment/<APP_NAME>-deployment <APP_NAME>=<NEW_IMAGE> -n <NAMESPACE>

# Rollback về bản trước
kubectl rollout undo deployment <APP_NAME>-deployment -n <NAMESPACE>

# Xem lịch sử deploy
kubectl rollout history deployment <APP_NAME>-deployment -n <NAMESPACE>

# Xóa toàn bộ
kubectl delete -f fullstack.yml
```
