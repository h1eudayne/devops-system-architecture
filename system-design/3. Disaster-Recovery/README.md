# Khoi Phuc Tham Hoa (Disaster Recovery Design)

Phong chong va khoi phuc tham hoa (Disaster Recovery - DR) la chien luoc lap ke hoach ung pho de khoi phuc lai he thong hoat dong binh thuong sau su co lon (chay trung tam du lieu, dut cap quang, loi xoa nham du lieu dien rong,...).

---

## Cac Chi So DR Cot Loi

1. **RPO (Recovery Point Objective - Diem khoi phuc muc tieu)**:
   * Do luong luong du lieu toi da chap nhan mat mat (tinh theo thoi gian).
   * *Vi du*: Neu RPO = 4 gio, tuc la he thong phai duoc backup toi thieu 4 tieng mot lan, de khi co su co, du lieu bi mat nhieu nhat chi trong vong 4 tieng.
   
2. **RTO (Recovery Time Objective - Thoi gian khoi phuc muc tieu)**:
   * Do luong khoan thoi gian toi da de he thong hoat dong tro lai sau khi xay ra su co.
   * *Vi du*: Neu RTO = 1 gio, tuc la quan tri vien hoac he thong tu dong phai hoi sinh dich vu tro lai trong vong 1 tieng.

---

## Cac Chien Luoc Trien Khai DR Pho Bien

| Chien luoc | RPO / RTO | Chi phi | Cach thuc hien |
| :--- | :---: | :---: | :--- |
| **Backup and Restore** | Cao (Vai gio den vai ngay) | Thap | Sao luu du lieu dinh ky va luu tru o mot noi an toan khac (Object Storage S3/MinIO). Khi co su co thi dung lai server moi roi khoi phuc du lieu len. |
| **Pilot Light** | Trung binh (Vai chuc phut) | Trung binh | Co so du lieu luon chay song song va dong bo lien tuc (Replicated). Ung dung Backend duoc tat san va chi khoi dong len khi co su co tai Site chinh. |
| **Warm Standby** | Thap (Vai phut) | Cao | Phien ban thu nho cua he thong luon chay song song o Site phu voi cong suat thap hon, san sang nang scale khi co su co. |
| **Multi-Site (Active-Active)** | Gan nhu bang 0 | Rat cao | He thong chay song song toan cong suat tai hai hoac nhieu trung tam du lieu khac nhau. User duoc dieu phoi thong qua DNS phan vung dia ly. |

---

## Lien Ket Thuc Hanh DevOps
Tham khao cach thuc hien quy trinh sao luu va khoi phuc ha tang trong cum Kubernetes bang cong cu Velero:

*   **Setup Velero Client**: [Huong dan cai dat Velero CLI](../../on-premise/setup/kubernetes/install-velero-client-guide.md)
*   **Backup & Restore Lab**: [Cau hinh Velero backup K8s cluster sang Object Storage MinIO](../../on-premise/setup/kubernetes/setup-velero-minio-backup.md)
