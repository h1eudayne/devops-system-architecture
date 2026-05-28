# GitLab CI for React Continuous Delivery

## Template hien co

- `npm-static-server-tag-manual.yml`
  Su dung cho du an React build bang `npm`, tao artifact tu tag va chi deploy khi nguoi co quyen bam chay buoc manual.

Template nay duoc xep vao `continuous-delivery` vi buoc deploy van co manual gate trong pipeline.

## Khi nao nen dung

- Ung dung React build ra static files
- Runner da co `node` va `npm`
- Can giu buoc deploy o che do manual approval trong GitLab
- Server dich cho phep `sudo` de copy file vao `projectPath`

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

- Deploy job hien tai chi cho phep user `voduchieu1` thuc thi
- Pipeline dang dung `npm install` va `CI=false npm run build`
- Lenh deploy chi copy de moi vao `projectPath`, khong xoa file cu khong con ton tai trong build moi
- Neu can nhieu approver, rollback, hoac deploy qua CDN/object storage, nen tach thanh template khac

## Server setup tham khao

- Mau Nginx dung chung nam tai `templates/shared/nginx/react-spa-port-3000.conf.example`
- File nay phu hop cho React SPA build ra static files va phuc vu tu `projectPath`
