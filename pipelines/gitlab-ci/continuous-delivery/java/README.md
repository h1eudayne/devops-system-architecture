# GitLab CI for Java Continuous Deployment

## Template hien co

- `maven-jar-server-tag.yml`
  Su dung cho du an Java build bang Maven, tao JAR va deploy thang len server Linux khi tao tag.

Template nay duoc xep vao `continuous-deployment` vi pipeline co buoc deploy thuc te va khong co manual approval step truoc khi restart ung dung.

## Khi nao nen dung

- Ung dung dang dong goi thanh file JAR
- Runner da co Maven
- Server dich da cai Java
- Quy trinh deploy chap nhan copy file + restart process thu cong

## Khi nao nen tach ra template khac

Nen tao template moi neu du an:

- deploy qua Docker
- deploy qua Kubernetes
- chay bang systemd thay vi `nohup`
- can test, scan hoac package khac voi quy trinh hien tai
