# Shared Docker Templates for Angular

## Template hien co

- `npm-dist-nginx-alpine.Dockerfile.example`
  Multi-stage Dockerfile cho du an Angular build bang npm va serve static file bang Nginx.

## Khi nao nen dung

- Du an Angular build ra file static (production build)
- Output build nam trong thu muc `dist/<ten-project>`
- Can mot Dockerfile don gian de dong goi va chay tren server, VPS, hoac container platform
- Runtime chi can web server de phuc vu static asset

## Can doi gi truoc khi dung

- **Bat buoc**: Doi `angular-ecommerce` trong lenh `COPY --from=build` thanh ten project thuc te cua ban (xem trong `angular.json` > `projects`)
- Neu project uu tien reproducible install, co the doi `npm install --force` thanh `npm ci`
- Neu can custom Nginx config (vd: rewrite URL cho Angular routing), them file `nginx.conf` truoc khi build image
- Neu app nghe o cong khac sau proxy, doi `EXPOSE 80` theo cach ban muon tai lieu hoa

## Luu y

- Angular build output khac VueJS: output nam trong `dist/<ten-project>` thay vi chi `dist/`.
- Flag `--force` trong `npm install` de bo qua peer dependency conflict. Neu project khong co conflict, co the bo flag nay.
- Neu dung Angular 17+ voi builder moi (`@angular-devkit/build-angular:application`), output co the nam trong `dist/<ten-project>/browser`. Hay kiem tra thu muc output thuc te truoc khi build image.
- Runtime image dung `nginx:alpine` de nhe va phu hop voi static site.

## Nginx config cho Angular routing (tuy chon)

Neu Angular app dung routing (vd: `/products`, `/cart`), can them file `nginx.conf` de redirect tat ca request ve `index.html`:

```nginx
server {
    listen 80;
    server_name localhost;

    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
}
```

Sau do them dong nay vao Dockerfile (truoc `EXPOSE`):

```dockerfile
COPY nginx.conf /etc/nginx/conf.d/default.conf
```
