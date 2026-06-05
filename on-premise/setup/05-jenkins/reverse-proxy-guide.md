# Jenkins Reverse Proxy

## Template hien co

- `nginx-jenkins-subdomain.conf.example`
  Nginx reverse proxy config mau cho Jenkins khi publish bang mot subdomain rieng va Jenkins lang nghe o port `8080`.

## Khi nao nen dung

- Jenkins dang chay sau Nginx reverse proxy
- Muon expose Jenkins qua subdomain rieng, vi du `jenkins.example.com`
- Jenkins dang chay o root path cua domain, khong phai `/jenkins`
- Can support websocket va cac request proxy thong dung cua Jenkins

## Can doi gi truoc khi dung

- Doi `server_name` thanh domain that cua ban
- Doi upstream `server ...:8080` thanh host Jenkins that
- Neu Nginx va Jenkins cung mot may, uu tien `127.0.0.1:8080` thay vi domain public
- Neu public Internet, nen them TLS va redirect HTTP sang HTTPS
- Trong Jenkins, dat `Jenkins URL` thanh URL public that, vi du `https://jenkins.example.com/`

## Luu y

- Khong them dau `/` o cuoi `proxy_pass`, vi de gay loi path va redirect voi Jenkins
- Jenkins khuyen nghi dung `map $http_upgrade $connection_upgrade` de xu ly websocket dung cach
- `proxy_request_buffering off` huu ich cho CLI qua HTTP va mot so request dai
- Neu Jenkins duoc serve o root cua subdomain thi khong can `JENKINS_PREFIX`
- Neu ban muon publish Jenkins duoi context path nhu `/jenkins`, thi reverse proxy va Jenkins phai cung mot prefix

## Nguon tham khao

- Jenkins reverse proxy configuration:
  https://www.jenkins.io/doc/book/system-administration/reverse-proxy-configuration-with-jenkins/
- Jenkins Nginx example:
  https://www.jenkins.io/doc/book/system-administration/reverse-proxy-configuration-with-jenkins/reverse-proxy-configuration-nginx/
