# Jenkins Install on Ubuntu

## Template hien co

- `install-jenkins.sh.example`
  Bash script de cai Jenkins tren Ubuntu bang package chinh thuc cua Jenkins va Java 21.
- `jenkins-agent.service.example`
  File `systemd` mau de chay Jenkins agent tren server Ubuntu va tu khoi dong lai cung he thong.

## Khi nao nen dung

- Can bootstrap nhanh Jenkins controller tren server Ubuntu
- Can cau hinh Jenkins agent tren may Ubuntu de ket noi ve controller
- Muon luu script cai dat ngay trong nhom `templates/jenkins/` de de tim
- Dang dung Jenkins package repository chinh thuc

## Can doi gi truoc khi dung

- Chay script bang user co quyen `sudo` hoac root
- Kiem tra lai version Java va Jenkins repository key truoc khi chay tren moi truong production
- Neu server khong dung `ufw`, hay sua hoac bo dong mo cong trong script
- Voi file agent service, can thay lai `jnlpUrl`, `User`, duong dan `agent.jar`, va `secret-file` theo node thuc te

## Cai agent service

Copy file mau vao:

```bash
sudo cp jenkins-agent.service.example /etc/systemd/system/jenkins-agent.service
```

Sau do chay 4 lenh:

```bash
sudo systemctl daemon-reload
sudo systemctl enable jenkins-agent
sudo systemctl start jenkins-agent
sudo systemctl status jenkins-agent
```

## Luu y

- File nay co noi dung giong script trong `templates/shared/docker/install/ubuntu/install-jenkins.sh.example`
- Ban trong `templates/jenkins/` duoc dat de nguoi tim tai nguyen Jenkins co the thay ngay trong cung mot nhom
- Ten file systemd nen dong bo voi lenh `systemctl`, vi vay template duoc dat theo dang `jenkins-agent.service`
- Khong nen them dau `&` trong `ExecStart` khi dung `systemd`; service mau da giu tien trinh Java o foreground de `systemd` quan ly dung cach
