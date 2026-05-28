# Shared Docker Templates for VueJS

## Template hien co

- `npm-dist-nginx-alpine.Dockerfile.example`
  Multi-stage Dockerfile cho du an VueJS build bang npm va serve static file bang Nginx.

## Khi nao nen dung

- Du an VueJS build ra file static
- Output build nam trong thu muc `dist`
- Can mot Dockerfile don gian de dong goi va chay tren server, VPS, hoac container platform
- Runtime chi can web server de phuc vu static asset

## Can doi gi truoc khi dung

- Neu project khong build ra `dist`, doi duong dan trong lenh `COPY --from=build`
- Neu project uu tien reproducible install, co the doi `npm install` thanh `npm ci`
- Neu can custom Nginx config, them `nginx.conf` hoac file site config truoc khi build image
- Neu app nghe o cong khac sau proxy, doi `EXPOSE 80` theo cach ban muon tai lieu hoa

## Luu y

- Template nay giu quy trinh giong mau goc bang `npm install` va `npm run build` de de copy dung nhanh.
- Runtime image dung `nginx:alpine` de nhe va phu hop voi static site.
