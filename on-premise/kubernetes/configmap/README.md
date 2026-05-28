# Kubernetes ConfigMap Templates

## Template hien co

| File | Mo ta |
|------|-------|
| `configmap-spring-properties.yml.example` | ConfigMap chua `application.properties` cho Spring Boot |

## Khi nao nen dung

- Backend Spring Boot can doc `application.properties` tu ben ngoai thay vi hardcode trong Docker image
- Muon thay doi cau hinh (database, allowed origins, ...) ma khong can rebuild image
- Dung ket hop voi Dockerfile co `--spring.config.location` tro den duong dan mount

## Cach hoat dong

```
ConfigMap (application.properties)
      |
      | mount volume vao /config/
      v
Pod (Spring Boot container)
      |
      | doc file tu /config/application.properties
      | thong qua --spring.config.location
      v
Ung dung chay voi cau hinh moi
```

## Placeholders can thay the

| Placeholder | Mo ta | Vi du |
|-------------|-------|-------|
| `<CONFIGMAP_NAME>` | Ten ConfigMap | `ecommerce-backend-application-properties-configmap` |
| `<NAMESPACE>` | Namespace | `ecommerce` |
| `<DB_IP>` | IP database server | `192.168.1.115` |
| `<DB_NAME>` | Ten database | `full-stack-ecommerce` |
| `<DB_USER>` | User database | `ecommerceapp` |
| `<DB_PASSWORD>` | Mat khau database | `StrongPa55WorD` |
| `<ALLOWED_ORIGINS>` | Domain frontend | `http://ecommerce.devopsedu.vn` |

## Cach dung nhanh

```bash
# 1. Copy template
cp configmap-spring-properties.yml.example configmap.yml

# 2. Thay cac placeholder
sed -i 's/<CONFIGMAP_NAME>/ecommerce-backend-application-properties-configmap/g' configmap.yml
sed -i 's/<NAMESPACE>/ecommerce/g' configmap.yml
sed -i 's/<DB_IP>/192.168.1.115/g' configmap.yml
# ... thay cac placeholder khac

# 3. Apply
kubectl apply -f configmap.yml

# 4. Kiem tra
kubectl get configmap -n ecommerce
kubectl describe configmap ecommerce-backend-application-properties-configmap -n ecommerce
```

## Ket hop voi Deployment

Trong file YAML Deployment, them `volumeMounts` va `volumes` de mount ConfigMap vao container:

```yaml
spec:
  template:
    spec:
      containers:
        - name: ecommerce-backend
          volumeMounts:
            - mountPath: /run/src/main/resources/application.properties
              name: ecommerce-backend-application-properties-config-volume
              subPath: application.properties
      volumes:
        - configMap:
            defaultMode: 420
            name: ecommerce-backend-application-properties-configmap
          name: ecommerce-backend-application-properties-config-volume
```

Dockerfile backend phai co:

```dockerfile
ENTRYPOINT ["java", "-jar", "app.jar", "--spring.config.location=/run/src/main/resources/application.properties"]
```

## Tai lieu lien quan

- K8s fullstack template: [`kubernetes/full-stack/README.md`](../full-stack/README.md)
- Secret database: [`kubernetes/secret/database/README.md`](../secret/database/README.md)
- Deployment example: [`kubernetes/deployment/ecommerce-backend-deployment.yml.example`](../deployment/ecommerce-backend-deployment.yml.example)

## Luu y

- Khong nen luu mat khau truc tiep trong ConfigMap cho production. Dung K8s Secret hoac external secret manager.
- Khi cap nhat ConfigMap, can restart pod de ung dung doc lai cau hinh moi:
  ```bash
  kubectl rollout restart deployment/<ten-deployment> -n <namespace>
  ```
- Ten key trong `data` (vd: `application.properties`) phai khop voi ten file ma `spring.config.location` tro den.
