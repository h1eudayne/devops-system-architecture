# Jenkins for Java Continuous Deployment

## Template hien co

- `maven-jar-linux-deploy.Jenkinsfile`
  Su dung cho du an Java build bang Maven, tao file JAR va deploy truc tiep len server Linux.

Template nay duoc xep vao `continuous-deployment` vi pipeline co buoc copy artifact, dung process cu va chay lai ung dung sau khi build pass.

## Khi nao nen dung

- Ung dung dang dong goi thanh file JAR
- Jenkins agent da co Maven va Java
- Server dich cho phep copy file va restart ung dung truc tiep
- Quy trinh deploy chap nhan `nohup` va kill process theo ten artifact

## Khi nao nen tach ra template khac

Nen tao template moi neu du an:

- deploy qua Docker
- deploy qua Kubernetes
- chay bang `systemd` thay vi `nohup`
- can test, scan hoac package khac voi quy trinh hien tai
