# Cac Case Studies Thuc Te (System Design Case Studies)

Day la noi tong hop cac bai toan thiet ke kien truc he thong thuc te tu cac bai phong van kien truc su he thong hoac cac kich ban thuc te khi van hanh du an lon.

---

## Danh Sach Cac Case Studies De Nghien Cuu

1. **Thiet Ke He Thong E-Commerce (Thuong Mai Dien Tu)**:
   * **Yeu cau**: Xu ly luong truy cap lon trong gio vang san sale, quan ly ton kho nhat quan (concurrency control), thanh toan bao mat.
   * **Tai nguyen DevOps lien quan**: [Trien khai du an Full-stack mau](../../on-premise/kubernetes/full-stack/).

2. **Thiet Ke He Thong Giam Sat Suc Khoe May Chu (Monitoring and Alerting)**:
   * **Yeu cau**: Thu thap Log, Metric tu hang nghin may chu theo thoi gian thuc, tu dong canh bao qua Slack/Telegram khi CPU > 90%.
   * **Tai nguyen DevOps lien quan**: [Trien khai Prometheus va Grafana](../../on-premise/setup/monitoring/setup-kube-prometheus-guide.md) va [Uptime Kuma](../../on-premise/setup/monitoring/setup-uptime-kuma-guide.md).

3. **Thiet Ke He Thong Chat Thoi Gian Thuc (Real-time Messaging)**:
   * **Yeu cau**: Ket noi WebSocket duy tri lien tuc giua hang trieu Client, truyen tai tin nhan do tre thap, luu tru lich su hoi thoai hieu qua.
   * **Tai nguyen DevOps lien quan**: [Cau hinh Load Balancer ho tro WebSocket/Reverse Proxy](../../on-premise/nginx/).

---

## Cach Viet Mot Case Study Chuan System Architect

Khi ban phan tich thiet ke cho bat ky he thong nao, hay tuan theo quy trinh 4 buoc sau:

1. **Buoc 1: Lam ro yeu cau (Scope and Requirements)**:
   * Yeu cau chuc nang (User lam duoc gi?)
   * Yeu cau phi chuc nang (Quy mo he thong? So luong DAU/MAU? QPS doc/ghi? RTO/RPO?).
2. **Buoc 2: Thiet ke so do tong quan (High-Level Design)**:
   * Ve so do luong du lieu (Data Flow Diagram).
   * Xac dinh cac thanh phan chinh (Client, DNS, CDN, LB, Web Service, Cache, DB, Message Queue).
3. **Buoc 3: Di sau thiet ke chi tiet (Deep Dive Design)**:
   * Cach thiet ke Schema Database, khoa chinh, danh Index.
   * Cach toi uu hoa tang dem (Caching Strategy: Cache-Aside, Write-Through).
   * Co che phong ve (Rate Limiter, Circuit Breaker).
4. **Buoc 4: Xac dinh gioi han va danh doi (Bottlenecks and Trade-offs)**:
   * He thong se bi nghen o dau neu tai tang gap 10 lan?
   * Tinh nhat quan du lieu co bi suy giam khi phan tan khong? (Dinh ly CAP).
