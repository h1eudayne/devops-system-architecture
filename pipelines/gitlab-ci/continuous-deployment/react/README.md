# GitLab CI for React Continuous Deployment

## Template hien co

- `npm-static-server-tag.yml`
  Su dung cho du an React build bang `npm` va deploy thu muc static build thang len server Linux khi tao tag.

Template nay duoc xep vao `continuous-deployment` vi pipeline tu dong copy artifact len thu muc dich ma khong co buoc approve trong pipeline.

## Khi nao nen dung

- Ung dung React build ra static files
- Runner da co `node` va `npm`
- Server dich da co san thu muc deploy va web server phuc vu static files
- Quy trinh deploy chap nhan copy de build vao `projectPath`

## Bien can quan tam

- `projectUser`
  User so huu thu muc deploy tren server dich
- `projectPath`
  Thu muc duoc web server doc file static
- `server`
  GitLab Runner tag duoc phep build va deploy
- `buildDir`
  Thu muc output sau build. Mac dinh la `build`, neu du an dung Vite thi thuong doi thanh `dist`

## Assumption va gioi han

- Pipeline dang dung `npm install` va `CI=false npm run build`
- Lenh deploy chi copy de moi vao `projectPath`, khong xoa file cu khong con ton tai trong build moi
- Neu du an dung `pnpm`, `yarn`, hoac can upload len object storage/CDN, nen tach ra template khac

## Server setup tham khao

- Mau Nginx dung chung nam tai `templates/shared/nginx/react-spa-port-3000.conf.example`
- File nay da kem san comment ve symlink, `nginx -t`, va reload de copy dung nhanh
