# Pricings Module Flow

Tài liệu này mô tả luồng xử lý đầy đủ của module `pricings`, từ lúc client gửi request đến khi server validate, kiểm tra quyền, thao tác với database và trả response.

---

# 1. Mục tiêu của module Pricings

Module `pricings` dùng để quản lý **bảng giá sân** trong hệ thống.

Phạm vi hiện tại của module gồm:

- Tạo giá sân mới.
- Lấy danh sách toàn bộ giá sân.
- Lấy chi tiết một giá sân.
- Cập nhật giá sân.
- Xóa giá sân.

Dữ liệu của một pricing không đứng độc lập mà liên quan đến:

- `courts`: sân nào
- `time_slots`: khung giờ nào

Vì vậy khi thao tác với `pricings`, hệ thống không chỉ insert/update một dòng giá, mà còn phải kiểm tra tính hợp lệ với các bảng liên quan.

---

# 2. Route tổng của module Pricings

Ở file `routes/index.js`, module pricings được mount vào:

- `/pricings`

Điều đó có nghĩa là các route trong `modules/pricings/route/pricing.route.js` sẽ chạy với prefix `/pricings`.

Ví dụ:

- `GET /pricings`
- `GET /pricings/:id`
- `POST /pricings`
- `PUT /pricings/:id`
- `DELETE /pricings/:id`

---

# 3. Middleware trước khi vào Pricing Controller

Tùy cách team cấu hình route, flow phổ biến sẽ là:

Client gửi request  
→ đi vào route `/pricings`  
→ `verifyToken` kiểm tra access token  
→ nếu token hợp lệ thì giải mã token và gắn vào `req.user`  
→ nếu là route create/update/delete thì `checkRole` kiểm tra quyền admin  
→ nếu pass thì vào `pricingController`  
→ controller gọi usecase  
→ usecase gọi repository  
→ repository thao tác DB  
→ trả response về client

## Quy tắc quyền hiện tại

### User đã đăng nhập:
- được xem danh sách giá
- được xem chi tiết giá

### Admin:
- được tạo giá
- được sửa giá
- được xóa giá

Nếu không có token hoặc token sai:
- request bị chặn tại `verifyToken`

Nếu có token nhưng không đủ quyền admin:
- request bị chặn tại `checkRole`

---

# 4. Flow của từng chức năng

## 4.1. Flow lấy tất cả bảng giá

Route:

- `GET /pricings`

### Bước 1: Client gửi request
Client gọi API để lấy danh sách toàn bộ bảng giá.

### Bước 2: Middleware
Nếu route đang yêu cầu đăng nhập thì request đi qua:

- `verifyToken`

Thông thường route này không cần `checkRole` vì user thường cũng được phép xem.

### Bước 3: Controller gọi use case
`pricingController.getAll` gọi `getAllPricingsUseCase`.

### Bước 4: Use case gọi repository
Repository sẽ query bảng `pricings` và thường join thêm:

- `courts`
- `time_slots`

để lấy dữ liệu đầy đủ như:

- tên sân
- giờ bắt đầu
- giờ kết thúc

### Bước 5: Trả response
Client nhận được danh sách bảng giá, mỗi phần tử có thể gồm:

- `id`
- `court_id`
- `day_type`
- `price`
- `time_slot_id`
- `court_name`
- `start_time`
- `end_time`

### Ý nghĩa
Frontend có thể hiển thị trực tiếp bảng giá mà không cần gọi thêm API khác để ghép tên sân và khung giờ.

---

## 4.2. Flow lấy chi tiết một bảng giá

Route:

- `GET /pricings/:id`

### Bước 1: Client gửi `id`
Client truyền `id` pricing trên URL.

### Bước 2: Middleware
Nếu route private thì request đi qua:

- `verifyToken`

### Bước 3: Controller gọi use case
`pricingController.getById` nhận `req.params.id`.

### Bước 4: Use case xử lý
`getPricingByIdUseCase` sẽ:

1. parse `id`
2. kiểm tra `id` hợp lệ
3. gọi repository tìm pricing theo `id`
4. nếu không có thì throw lỗi `not found`
5. nếu có thì trả về object pricing đầy đủ

### Bước 5: Trả dữ liệu cho client
Client nhận được đúng dòng giá cần xem.

---

## 4.3. Flow tạo bảng giá mới

Route:

- `POST /pricings`

### Bước 1: Client gửi request
Client gửi body dạng:

- `court_id`
- `day_type`
- `price`
- `time_slot_id`

Ví dụ:

- sân 1
- weekday
- giá 150000
- khung giờ 1

### Bước 2: Middleware xác thực và phân quyền
Request đi qua:

- `verifyToken`
- `checkRole`

Chỉ admin mới được tạo.

### Bước 3: Controller nhận request
`pricingController.create` nhận `req.body` và chuyển dữ liệu vào `createPricingUseCase`.

### Bước 4: DTO validate dữ liệu
`createPricing.dto` kiểm tra:

- `court_id` có hợp lệ không
- `day_type` có nằm trong:
  - `weekday`
  - `weekend`
  - `holiday`
- `price` có hợp lệ không
- `time_slot_id` có hợp lệ không

Nếu sai sẽ throw lỗi.

### Bước 5: Use case kiểm tra dữ liệu liên quan
`createPricingUseCase` sẽ:

1. kiểm tra `court_id` có tồn tại trong bảng `courts` không
2. kiểm tra `time_slot_id` có tồn tại trong bảng `time_slots` không
3. kiểm tra có bị trùng pricing không

Rule trùng dữ liệu thường là không cho phép trùng cùng bộ:

- `court_id`
- `day_type`
- `time_slot_id`

### Bước 6: Repository thao tác DB
Nếu mọi thứ hợp lệ, repository sẽ insert vào bảng `pricings`.

### Bước 7: Load lại dữ liệu vừa tạo
Sau khi insert xong, hệ thống có thể load lại pricing vừa tạo để trả về đầy đủ hơn.

### Bước 8: Trả response
Client nhận object pricing mới tạo.

### Ý nghĩa
Sau bước này, hệ thống đã có cấu hình giá cụ thể cho sân theo đúng loại ngày và khung giờ.

---

## 4.4. Flow cập nhật bảng giá

Route:

- `PUT /pricings/:id`

### Bước 1: Client gửi request
Client gửi `id` pricing và body cần cập nhật.

Body có thể chứa một phần hoặc toàn bộ:

- `court_id`
- `day_type`
- `price`
- `time_slot_id`

Ví dụ chỉ sửa:

- `price`
- `day_type`

### Bước 2: Middleware
Request đi qua:

- `verifyToken`
- `checkRole`

Chỉ admin mới được sửa.

### Bước 3: Controller gọi use case
`pricingController.update` gọi `updatePricingUseCase`.

### Bước 4: DTO validate dữ liệu
`updatePricing.dto` kiểm tra các field client gửi lên.

Khác với create:

- update có thể chỉ gửi một phần dữ liệu
- nhưng field nào gửi lên thì phải đúng format

Nếu body không có field hợp lệ nào thì báo lỗi kiểu:

- `Khong co du lieu de cap nhat`

### Bước 5: Use case kiểm tra pricing tồn tại
`updatePricingUseCase` sẽ:

1. parse `id`
2. tìm pricing hiện tại theo `id`
3. nếu không có thì báo lỗi `not found`

### Bước 6: Ghép dữ liệu cũ + mới
Do client có thể chỉ gửi một phần body, use case sẽ tạo ra `finalData` gồm:

- dữ liệu cũ đang có trong DB
- kết hợp với phần mới client vừa gửi

Mục đích là để kiểm tra đầy đủ rule nghiệp vụ sau update.

### Bước 7: Check lại ràng buộc
Use case tiếp tục kiểm tra:

- `court_id` cuối cùng có tồn tại không
- `time_slot_id` cuối cùng có tồn tại không
- bộ dữ liệu cuối cùng có bị trùng với pricing khác không

Nếu trùng thì báo lỗi conflict.

### Bước 8: Repository update DB
Nếu hợp lệ, repository sẽ update đúng các field được gửi lên.

### Bước 9: Load lại dữ liệu mới
Sau khi update xong, hệ thống load lại pricing vừa cập nhật và trả về cho client.

### Ý nghĩa
Admin có thể sửa giá linh hoạt mà không cần sửa toàn bộ sân.

---

## 4.5. Flow xóa bảng giá

Route:

- `DELETE /pricings/:id`

### Bước 1: Client gửi `id`
Client chọn dòng pricing cần xóa.

### Bước 2: Middleware
Request đi qua:

- `verifyToken`
- `checkRole`

Chỉ admin mới được xóa.

### Bước 3: Controller gọi use case
`pricingController.delete` gọi `deletePricingUseCase`.

### Bước 4: Use case kiểm tra pricing tồn tại
Use case tìm pricing theo `id`.

Nếu không tìm thấy:
- trả lỗi `not found`

### Bước 5: Repository xóa dữ liệu
Repository xóa record trong bảng `pricings`.

### Bước 6: Trả message thành công
Client nhận message xác nhận xóa thành công.

---

# 5. Vai Trò Của Repository Trong Module Pricings

Repository của module này thường chịu trách nhiệm:

- lấy toàn bộ pricing
- lấy pricing theo id
- insert pricing mới
- update pricing
- delete pricing
- kiểm tra sân có tồn tại không
- kiểm tra khung giờ có tồn tại không
- kiểm tra duplicate trước khi ghi DB

Ngoài ra, khi cần trả dữ liệu đẹp hơn cho frontend, repository có thể join thêm:

- `courts`
- `time_slots`

để response có ngữ nghĩa hơn.

---

# 6. Vai Trò Của DTO Trong Module Pricings

DTO giúp chặn lỗi ngay từ đầu vào.

## `createPricing.dto`
Dùng cho create, bắt buộc dữ liệu phải đủ và đúng format.

## `updatePricing.dto`
Dùng cho update, cho phép gửi một phần dữ liệu nhưng vẫn phải đúng format.

Lợi ích:

- tránh code validate bị lặp trong controller hoặc use case
- lỗi rõ ràng hơn khi test Postman
- dễ bảo trì khi rule thay đổi

---

# 7. Các Lỗi Team Có Thể Gặp Khi Test

## Lỗi 1: Gửi body sai định dạng
Ví dụ Postman đang để:

- `raw -> Text`

thay vì:

- `raw -> JSON`

Khi đó `req.body` có thể không parse đúng, dẫn đến lỗi:

- `Khong co du lieu de cap nhat`

### Cách xử lý
- chọn `Body -> raw -> JSON`
- kiểm tra header `Content-Type: application/json`

## Lỗi 2: Không có token hoặc token sai
Nếu route có `verifyToken`, request sẽ bị chặn.

### Cách xử lý
- login trước để lấy access token
- gắn `Authorization: Bearer <token>`

## Lỗi 3: Có token nhưng không đủ quyền
Nếu route có `checkRole`, user thường sẽ không tạo/sửa/xóa được.

### Cách xử lý
- dùng token của tài khoản admin
- kiểm tra payload token có chứa `role`

## Lỗi 4: `court_id` không tồn tại
Create/update pricing nhưng sân không có trong DB.

### Cách xử lý
- kiểm tra bảng `courts` trước

## Lỗi 5: `time_slot_id` không tồn tại
Create/update pricing nhưng khung giờ không có trong DB.

### Cách xử lý
- kiểm tra bảng `time_slots` trước

## Lỗi 6: Bị trùng dữ liệu giá
Nếu cùng một:

- `court_id`
- `day_type`
- `time_slot_id`

đã tồn tại rồi, hệ thống nên chặn tạo hoặc sửa thành dữ liệu trùng.

### Cách xử lý
- đổi loại ngày
- đổi khung giờ
- hoặc sửa record cũ thay vì tạo record mới

---

# 8. Ý Nghĩa Của Việc Tách Module Pricings Riêng

Việc tách `pricings` riêng khỏi `court` có lợi vì:

- dễ quản lý bảng giá
- admin sửa giá nhanh hơn
- code dễ đọc hơn
- dễ mở rộng sau này

Tuy nhiên team cũng cần chú ý:

Nếu module `court` đang có flow replace toàn bộ `pricings` khi update sân, còn module `pricings` lại cho CRUD riêng, thì hai nơi này có thể ghi đè lẫn nhau.

Vì vậy team nên thống nhất rõ:

- route nào là nơi chính thức quản lý bảng giá
- lúc nào dùng module `court`
- lúc nào dùng module `pricings`

---

# 9. Tóm Tắt Flow Tổng Quát

```mermaid
flowchart TD
    A[Client] --> B[Route /pricings]
    B --> C[verifyToken]
    C --> D{Route la GET hay thay doi du lieu?}
    D -- GET --> E[PricingController]
    D -- POST PUT DELETE --> F[checkRole]
    F --> E
    E --> G[UseCase]
    G --> H[DTO validate]
    G --> I[PricingRepository]
    I --> J[(pricings table)]
    I --> K[(courts table)]
    I --> L[(time_slots table)]
    E --> M[Response cho client]