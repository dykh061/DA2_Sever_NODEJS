# Tổng Quan Module Pricing

Tài liệu này dành cho thành viên trong team để nắm nhanh module `pricings` đang giải quyết bài toán gì, luồng chạy như thế nào, quyền truy cập ra sao, và vì sao team tách module này riêng khỏi `court`.

## Bức Tranh Chung

Module `pricings` dùng để quản lý **bảng giá sân** theo:

- `court_id`: sân nào
- `day_type`: loại ngày (`weekday`, `weekend`, `holiday`)
- `price`: giá tiền
- `time_slot_id`: khung giờ nào

Mỗi bản ghi trong bảng `pricings` đại diện cho:

- một sân cụ thể
- một loại ngày cụ thể
- một khung giờ cụ thể
- một mức giá cụ thể

Ví dụ:

- Sân 1
- ngày thường (`weekday`)
- khung giờ 06:00 - 07:00
- giá 150000

## Mục Tiêu Của Module

Team tách module `pricings` riêng để:

- Quản lý giá sân rõ ràng hơn.
- Không phải sửa toàn bộ module `court` mỗi khi chỉ muốn đổi giá.
- Dễ mở rộng sau này nếu muốn thêm:
  - giá theo ngày lễ đặc biệt
  - giá theo mùa
  - giá theo chương trình khuyến mãi
- Hạn chế việc update sân làm ghi đè toàn bộ bảng giá không cần thiết.

## Team Đang Giải Quyết Những Vấn Đề Gì

Khi làm module này, có một số vấn đề thực tế cần xử lý:

### Vấn đề 1: Một sân có nhiều giá theo nhiều khung giờ và nhiều loại ngày
Nguyên nhân là giá sân không cố định, mà thay đổi theo thời gian và loại ngày.
Giải pháp là tách bảng `pricings` riêng, mỗi dòng biểu diễn đúng một cấu hình giá.

### Vấn đề 2: Không được tạo trùng giá cho cùng một sân, cùng loại ngày, cùng khung giờ
Ví dụ:
- sân 1
- weekday
- time_slot 1

không thể có 2 dòng giá khác nhau cùng lúc.
Giải pháp là check duplicate trước khi create hoặc update.

### Vấn đề 3: Chỉ admin mới được sửa dữ liệu giá
Vì bảng giá là dữ liệu quản trị, user thường không được phép tạo, sửa, xóa.
Giải pháp là:

- user chỉ được:
  - `GET /pricings`
  - `GET /pricings/:id`
- admin mới được:
  - `POST /pricings`
  - `PUT /pricings/:id`
  - `DELETE /pricings/:id`

### Vấn đề 4: Dữ liệu giá phải phụ thuộc vào sân và khung giờ có thật
Nguyên nhân là nếu `court_id` hoặc `time_slot_id` không tồn tại thì dữ liệu pricing sẽ bị mồ côi.
Giải pháp là check tồn tại của:
- `courts.id`
- `time_slots.id`

trước khi create hoặc update.

## Tác Dụng Của Các Thành Phần Chính

`PricingController`: nhận request từ route, gọi use case tương ứng và trả response cho client.

`GetAllPricingsUseCase`: lấy toàn bộ danh sách bảng giá, thường kèm tên sân và khung giờ để client dễ hiển thị.

`GetPricingByIdUseCase`: lấy chi tiết một pricing theo `id`.

`CreatePricingUseCase`: xử lý tạo mới một dòng giá, validate dữ liệu, kiểm tra sân tồn tại, kiểm tra khung giờ tồn tại, kiểm tra không bị trùng.

`UpdatePricingUseCase`: cập nhật một dòng giá hiện có, hỗ trợ update từng phần dữ liệu nhưng vẫn phải đảm bảo không vi phạm rule trùng dữ liệu.

`DeletePricingUseCase`: xóa một dòng giá theo `id`.

`pricing.repository.impl`: chịu trách nhiệm query DB cho bảng `pricings`, đồng thời join sang `courts` và `time_slots` khi cần trả dữ liệu đầy đủ hơn.

`createPricing.dto` và `updatePricing.dto`: validate dữ liệu đầu vào trước khi đi vào nghiệp vụ chính.

`verify.token` middleware: kiểm tra access token, giải mã và gắn user vào `req.user`.

`checkRole` middleware: kiểm tra quyền của user. Module này dùng middleware này để chỉ cho admin được tạo, sửa, xóa bảng giá.

## Cách Dùng Trong Route

Các route của module `pricings` hiện theo hướng CRUD chuẩn:

- `GET /pricings`
- `GET /pricings/:id`
- `POST /pricings`
- `PUT /pricings/:id`
- `DELETE /pricings/:id`

Phân quyền hiện tại:

- User đã đăng nhập:
  - xem danh sách giá
  - xem chi tiết giá
- Admin:
  - tạo giá mới
  - sửa giá
  - xóa giá

Ví dụ cấu hình route có thể là:

- `router.use(verifyToken)` cho các route cần đăng nhập
- `router.post('/', checkRole, ...)`
- `router.put('/:id', checkRole, ...)`
- `router.delete('/:id', checkRole, ...)`

Điều đó nghĩa là:

- token hợp lệ mới vào được module
- riêng create/update/delete phải có quyền admin

## Response Dữ Liệu Của Module

Một object pricing khi trả về thường có thể gồm:

- `id`
- `court_id`
- `day_type`
- `price`
- `time_slot_id`
- `court_name`
- `start_time`
- `end_time`

Nhờ vậy frontend có thể hiển thị trực tiếp:

- sân nào
- loại ngày nào
- khung giờ nào
- giá bao nhiêu

mà không cần tự join thủ công từ nhiều API.

## Lưu Ý Khi Test

Muốn test create/update/delete pricing thì cần:

- có dữ liệu trong bảng `courts`
- có dữ liệu trong bảng `time_slots`
- có token admin hợp lệ nếu route đang bảo vệ bằng `checkRole`

Khi test bằng Postman:

- Body phải chọn `raw -> JSON`
- Header nên có:
  - `Content-Type: application/json`
  - `Authorization: Bearer <accessToken>`

Nếu gửi `raw -> Text` thì `req.body` có thể bị rỗng hoặc parse sai, dẫn đến lỗi kiểu:

- `Khong co du lieu de cap nhat`

## Mối Quan Hệ Với Module Court

Module `court` cũng có liên quan đến bảng giá vì khi tạo hoặc cập nhật sân, team có thể đang xử lý luôn `pricings`.

Vì vậy cần thống nhất một hướng:

- hoặc chỉnh giá trực tiếp trong module `court`
- hoặc quản lý giá riêng ở module `pricings`

Nếu dùng cả hai cách cùng lúc, có thể xảy ra tình trạng:

- dữ liệu bị replace ngoài ý muốn
- bảng giá vừa sửa xong lại bị module khác ghi đè

## Đọc Tiếp Ở Đâu

Để xem luồng tổng thể của module này từ route, middleware, controller, use case đến database, xem tại file:

`modules/pricings/Pricings_all_Flow.md`

Để xem phần xác thực và phân quyền, xem thêm:

- `modules/authen/AboutAuth.md`

Để xem module sân đang liên kết với pricing như thế nào, xem thêm:

- `modules/court/AboutCourt.md`