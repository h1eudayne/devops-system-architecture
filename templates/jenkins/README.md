# Jenkins Templates

Thu muc nay de luu cac `Jenkinsfile` mau theo ngon ngu va use-case, cung voi mot so tai nguyen phu tro rieng cho Jenkins nhu reverse proxy config va install script.

## Cau truc khuyen nghi

```text
templates/jenkins/
  continuous-integration/
  continuous-delivery/
    java/
  continuous-deployment/
    java/
  install/
    ubuntu/
  reverse-proxy/
```

## Vi du ten file

- `maven-test.Jenkinsfile`
- `continuous-delivery/java/maven-jar-linux-delivery.Jenkinsfile`
- `continuous-delivery/java/maven-jar-linux-ops-delivery.Jenkinsfile`
- `continuous-delivery/java/rollback-version-active-choices.groovy.example`
- `continuous-deployment/java/maven-jar-linux-deploy.Jenkinsfile`
- `docker-k8s-main.Jenkinsfile`
- `install/ubuntu/install-jenkins.sh.example`
- `install/ubuntu/jenkins-agent.service.example`
- `reverse-proxy/nginx-jenkins-subdomain.conf.example`
