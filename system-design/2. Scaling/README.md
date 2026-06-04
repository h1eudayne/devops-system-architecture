# Thiet Ke Kha Nang Co Gian (Scaling System Design)

Co gian (Scaling) la kha nang mo rong dung luong cua he thong de xu ly luong tai lon hon (vi du: luong request tang dot bien trong cac chien dich khuyen mai hoac luong nguoi dung tang truong).

---

## Phan Loai Chien Luoc Co Gian

1. **Mo rong theo chieu doc (Vertical Scaling - Scale Up)**:
   * **Nguyen ly**: Tang them tai nguyen phan cung (CPU, RAM, Disk) cho may chu hien tai.
   * **Uu diem**: De thuc hien, khong can thay doi kien truc code cua ung dung.
   * **Nhuoc diem**: Co gioi han vat ly phan cung va gay Downtime khi nang cap.

2. **Mo rong theo chieu ngang (Horizontal Scaling - Scale Out)**:
   * **Nguyen ly**: Them nhieu may chu moi vao cum chay song song de chia se tai.
   * **Uu diem**: Khong gioi han nang luc mo rong, tinh san sang cao.
   * **Nhuoc diem**: Doi hoi ung dung phai thiet ke khong trang thai (Stateless), can he thong Load Balancer va phuc tap hon khi dong bo du lieu.

---

## Cac Diem Mau Chot Khi Thiet Ke He Thong Tai Cao

*   **Caching**: Dua du lieu thuong xuyen truy xuat len RAM (su dung Redis) de giam tai truc tiep cho Database.
*   **Database Read/Write Splitting**: Dinh huong luong ghi den Database Master, va phan phoi luong doc den cac Database Slave de chia se ganh nang.
*   **Auto-scaling**: Tu dong tang giam so luong ung dung dua tren muc su dung CPU/RAM thuc te.

---

## Lien Ket Thuc Hanh DevOps
Hay tham khao cach cau hinh co gian tu dong va caching truc tiep trong repo chi tiet:

*   **Auto-scaling**: [Kubernetes Horizontal Pod Autoscaler (HPA)](../../on-premise/kubernetes/hpa/) (Cau hinh tu dong scale so luong Pod dua theo thong so tai CPU/RAM).
*   **Caching Layer**: [Cai dat Redis Sentinel HA Cluster](../../on-premise/kubernetes/redis/) (Su dung Helm Chart de deploy cum Redis chiu tai cao).
