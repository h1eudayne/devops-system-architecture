# Jenkins for Java Continuous Delivery

## Template hien co

- `maven-jar-linux-delivery.Jenkinsfile`
  Su dung cho du an Java build bang Maven, tao file JAR va chi deploy khi co nguoi xac nhan trong Jenkins.
- `maven-jar-linux-ops-delivery.Jenkinsfile`
  Scripted pipeline ho tro `start`, `stop`, `upcode`, va `rollback`, kem backup va checkout source code tu Git.
- `rollback-version-active-choices.groovy.example`
  Script Groovy mau cho `Active Choices Reactive Parameter` de nap danh sach file backup cho tham so `rollback_version`.

Hai template nay duoc xep vao `continuous-delivery` vi van co buoc phe duyet hoac thao tac van hanh thu cong truoc khi thay doi trang thai he thong dich.

## Khi nao nen dung

- Ung dung dang dong goi thanh file JAR
- Jenkins agent da co Maven va Java
- Server dich cho phep copy file va restart ung dung truc tiep

## Chon template nao

- Dung `maven-jar-linux-delivery.Jenkinsfile` khi ban chi can build, doi nguoi dung bam xac nhan, roi moi deploy.
- Dung `maven-jar-linux-ops-delivery.Jenkinsfile` khi muon gom nhieu thao tac van hanh vao mot job, nhu `start`, `stop`, `upcode`, `backup`, va `rollback`.

## Luu y them

- Template `ops` can cac tham so job `action`, `server`, `hash`, va `rollback_version`.
- Neu dung Active Choices cho `rollback_version`, nen truyen `server` la Jenkins node name, khong chi la label chung.
- `upcode` can `credentialsId` va `gitLink` phu hop voi he thong Git thuc te.
- `rollback` se xoa noi dung hien tai trong `folderDeploy` truoc khi giai nen file backup, nen can kiem tra lai duong dan rat ky.

## Active Choices cho rollback

Co the cau hinh `rollback_version` bang plugin Active Choices nhu sau:

- Parameter type: `Active Choices Reactive Parameter`
- Name: `rollback_version`
- Referenced parameters: `action,server`
- Choice type: `Single Select`
- Groovy script: dung file `rollback-version-active-choices.groovy.example`

Fallback script goi y:

```groovy
return ['Could not load backups']
```

Ghi chu:

- Script nay chi tra danh sach backup khi `action == 'rollback'`.
- No doc truc tiep thu muc backup tren Jenkins node duoc chon trong `server`.
- Jenkins co the yeu cau approve script trong `In-Process Script Approval`.

## Khi nao nen tach ra template khac

Nen tao template moi neu du an:

- deploy qua Docker
- deploy qua Kubernetes
- chay bang `systemd` thay vi `nohup`
- can quy trinh promotion hoac rollback phuc tap hon so voi 2 template hien co
