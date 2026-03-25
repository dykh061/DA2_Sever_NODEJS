# Court Module Flow

Tài liệu này mô tả luồng xử lý đầy đủ của module `court`, từ lúc client gửi request đến khi server validate, kiểm tra quyền, thao tác với database và trả response.

---

# 1. Mục tiêu của module Court

Module `court` dùng để quản lý dữ liệu sân trong hệ thống.

Phạm vi hiện tại của module gồm:

- Tạo sân mới.
- Lấy danh sách sân.
- Lấy chi tiết một sân.
- Cập nhật sân.
- Xóa sân.

Dữ liệu của một sân không chỉ nằm ở bảng `courts`, mà còn liên quan đến:

- `court_image`: lưu danh sách ảnh của sân.
- `pricings`: lưu bảng giá theo loại ngày và khung giờ.

Vì vậy khi thao tác với `court`, thực tế hệ thống đang xử lý dữ liệu ở nhiều bảng liên quan chứ không phải chỉ riêng bảng `courts`.

---

# 2. Route tổng của module Court

Ở file `routes/index.js`, module court được mount vào:

- `/courts`

Điều đó có nghĩa là các route trong `modules/court/route/court.route.js` sẽ chạy với prefix `/courts`.

Ví dụ:

- `GET /courts`
- `GET /courts/:id`
- `POST /courts`
- `PUT /courts/:id`
- `DELETE /courts/:id`

---

# 3. Middleware trước khi vào Court Controller

Nếu route được gắn:

- `verifyToken`
- `checkRole`

thì flow sẽ là:

Client gửi request  
→ đi vào route `/courts`  
→ `verifyToken` kiểm tra access token  
→ nếu token hợp lệ thì giải mã token và gắn vào `req.user`  
→ `checkRole` kiểm tra quyền user  
→ nếu user đủ quyền thì mới vào `courtController`  
→ controller gọi usecase  
→ usecase gọi repository  
→ repository thao tác DB  
→ trả response về client

Nếu không có token hoặc token sai:
- request bị chặn tại `verifyToken`

Nếu có token nhưng không đủ quyền:
- request bị chặn tại `checkRole`

---

# 4. Flow của từng chức năng

## 4.1. Flow tạo sân mới

Route:

- `POST /courts`

### Bước 1: Client gửi request
Client gửi body dạng:

- `name`
- `status`
- `imageUrls`
- `pricings`

Ví dụ:

- tên sân
- trạng thái sân
- danh sách URL ảnh
- danh sách bảng giá theo `day_type`, `price`, `time_slot_id`

### Bước 2: Middleware xác thực
Request đi qua:

- `verifyToken`
- `checkRole`

Nếu pass mới được tạo sân.

### Bước 3: Controller nhận request
`courtController.create` nhận `req.body` và chuyển tiếp dữ liệu vào `createCourtUseCase`.

### Bước 4: DTO validate dữ liệu
`createCourt.dto` kiểm tra:

- `name` có hợp lệ không
- `status` có hợp lệ không
- `imageUrls` có phải mảng không
- từng phần tử trong `imageUrls` có phải string hợp lệ không
- `pricings` có phải mảng không
- từng pricing có đủ:
  - `day_type`
  - `price`
  - `time_slot_id`

Nếu sai sẽ throw lỗi.

### Bước 5: Use case xử lý nghiệp vụ
`createCourt.usecase` sẽ:

1. validate dữ liệu
2. tạo record mới trong bảng `courts`
3. lấy `courtId` vừa tạo
4. insert danh sách ảnh vào bảng `court_image`
5. insert danh sách giá vào bảng `pricings`

### Bước 6: Repository thao tác DB
`court.repository.impl` sẽ thực hiện:

- insert vào `courts`
- insert nhiều dòng vào `court_image`
- insert nhiều dòng vào `pricings`

### Bước 7: Trả dữ liệu hoàn chỉnh
Sau khi tạo xong, hệ thống thường load lại dữ liệu chi tiết của sân vừa tạo để trả về:

- `id`
- `name`
- `status`
- `imageUrls`
- `pricings`

### Ý nghĩa
Sau bước này, sân đã có đủ dữ liệu để các module sau như booking có thể dùng tiếp.

---

## 4.2. Flow lấy tất cả sân

Route:

- `GET /courts`

### Bước 1: Client gửi request
Client gọi API lấy toàn bộ sân.

### Bước 2: Middleware
Nếu route đang private thì request đi qua:

- `verifyToken`
- `checkRole`

### Bước 3: Controller gọi use case
`courtController.getAll` gọi `getAllCourts.usecase`.

### Bước 4: Use case gọi repository
Repository sẽ:

1. lấy toàn bộ dữ liệu từ bảng `courts`
2. với từng sân, load thêm ảnh từ `court_image`
3. với từng sân, load thêm bảng giá từ `pricings`

### Bước 5: Trả response
Client nhận danh sách sân, mỗi sân có đủ:

- thông tin cơ bản
- ảnh
- bảng giá

### Ý nghĩa
Giao diện admin hoặc frontend có thể lấy trực tiếp dữ liệu sân mà không cần ghép tay từ nhiều API khác nhau.

---

## 4.3. Flow lấy chi tiết một sân

Route:

- `GET /courts/:id`

### Bước 1: Client gửi `id`
Client truyền `id` sân trên URL.

### Bước 2: Middleware
Nếu route private thì đi qua:

- `verifyToken`
- `checkRole`

### Bước 3: Controller gọi use case
`courtController.getById` nhận `req.params.id`.

### Bước 4: Use case xử lý
`getCourtById.usecase` sẽ:

1. parse `id`
2. kiểm tra id hợp lệ
3. gọi repository tìm sân theo id
4. nếu không có thì throw lỗi `not found`
5. nếu có thì load thêm:
   - imageUrls
   - pricings

### Bước 5: Trả về object sân đầy đủ
Client nhận dữ liệu của đúng sân cần xem.

---

## 4.4. Flow cập nhật sân

Route:

- `PUT /courts/:id`

### Bước 1: Client gửi request
Client gửi `id` sân và body cần cập nhật.

Body có thể chứa:

- `name`
- `status`
- `imageUrls`
- `pricings`

### Bước 2: Middleware
Request đi qua:

- `verifyToken`
- `checkRole`

### Bước 3: Controller gọi use case
`courtController.update` gọi `updateCourt.usecase`.

### Bước 4: DTO validate dữ liệu
`updateCourt.dto` kiểm tra các field client gửi lên.

Khác với create:
- update có thể chỉ gửi một phần dữ liệu
- nhưng field nào gửi lên thì phải đúng format

### Bước 5: Use case kiểm tra sân tồn tại
`updateCourt.usecase` sẽ:

1. parse `id`
2. tìm sân theo `id`
3. nếu không có thì báo lỗi

### Bước 6: Update dữ liệu chính
Nếu body có `name` hoặc `status` thì update bảng `courts`.

### Bước 7: Replace dữ liệu phụ
Nếu body có `imageUrls`:
- xóa toàn bộ ảnh cũ trong `court_image`
- insert lại danh sách ảnh mới

Nếu body có `pricings`:
- xóa toàn bộ bảng giá cũ trong `pricings`
- insert lại danh sách giá mới

### Vì sao dùng replace
Team chọn replace vì:
- đơn giản
- dễ kiểm soát
- tránh dữ liệu cũ còn sót lại
- phù hợp với bài toán admin cập nhật lại toàn bộ cấu hình sân

### Bước 8: Load lại dữ liệu mới
Sau khi update xong, hệ thống load lại chi tiết sân và trả về cho client.

---

## 4.5. Flow xóa sân

Route:

- `DELETE /courts/:id`

### Bước 1: Client gửi `id`
Client chọn sân cần xóa.

### Bước 2: Middleware
Request đi qua:

- `verifyToken`
- `checkRole`

### Bước 3: Controller gọi use case
`courtController.delete` gọi `deleteCourt.usecase`.

### Bước 4: Use case kiểm tra sân tồn tại
Nếu không tìm thấy sân thì trả lỗi.

### Bước 5: Repository xóa dữ liệu
Repository xóa record trong bảng `courts`.

### Bước 6: DB cascade xóa dữ liệu liên quan
Do database có foreign key cascade nên khi xóa sân:
- ảnh trong `court_image` bị xóa theo
- bảng giá trong `pricings` bị xóa theo

### Bước 7: Trả message thành công
Client nhận message xác nhận xóa thành công.

---

# 5. Flow dữ liệu giữa các layer

Flow chuẩn của module hiện tại là:

Route  
→ Middleware  
→ Controller  
→ UseCase  
→ DTO validate  
→ Repository  
→ Database  
→ Repository  
→ UseCase  
→ Controller  
→ Response

## Ý nghĩa từng layer

### Route
Xác định endpoint nào map tới controller nào.

### Middleware
Kiểm tra token và quyền trước khi cho request đi tiếp.

### Controller
Nhận request từ Express và trả response cho client.

### UseCase
Chứa nghiệp vụ chính của từng chức năng.

### DTO
Kiểm tra dữ liệu đầu vào.

### Repository
Làm việc trực tiếp với DB.

### Database
Lưu trữ dữ liệu thật của hệ thống.

---

# 6. Các bảng DB liên quan đến module Court

## `courts`
Lưu thông tin chính của sân:

- `id`
- `name`
- `status`

## `court_image`
Lưu danh sách ảnh của sân:

- `id`
- `court_id`
- `image_url`

## `pricings`
Lưu bảng giá của sân:

- `id`
- `court_id`
- `day_type`
- `price`
- `time_slot_id`

## `time_slots`
Lưu các khung giờ chuẩn của hệ thống.

Bảng `pricings.time_slot_id` đang liên kết foreign key tới `time_slots.id`, nên nếu tạo pricing với `time_slot_id` không tồn tại thì DB sẽ báo lỗi.

---

# 7. Các lỗi thường gặp khi test Court

## Lỗi không có token
Nguyên nhân:
- chưa login
- quên gắn Bearer Token

Kết quả:
- bị chặn ở `verifyToken`

## Lỗi không đủ quyền
Nguyên nhân:
- token hợp lệ nhưng không phải admin
- hoặc token đang có role sai

Kết quả:
- bị chặn ở `checkRole`

## Lỗi foreign key `time_slot_id`
Nguyên nhân:
- gửi `time_slot_id` chưa tồn tại trong `time_slots`

Kết quả:
- create/update court fail ở phần pricing

## Lỗi token role không đúng
Nguyên nhân:
- login thành công nhưng payload token luôn gán `role = user`

Kết quả:
- admin thật vẫn bị `checkRole` chặn

---

# 8. Cách test module Court bằng Postman

## Bước 1: Login
Gọi API login để lấy `accessToken`.

## Bước 2: Copy access token
Lấy `tokens.accessToken` từ response.

## Bước 3: Gắn vào request Court
Trong Postman:

- mở request court
- tab Authorization
- chọn Bearer Token
- dán access token vào

## Bước 4: Test lần lượt
- `POST /courts`
- `GET /courts`
- `GET /courts/:id`
- `PUT /courts/:id`
- `DELETE /courts/:id`

---

# 9. Vai trò của module Court trong toàn hệ thống

Module `court` là dữ liệu lõi của hệ thống booking.

Nếu chưa có dữ liệu sân và bảng giá thì:
- không thể hiển thị sân để user chọn
- không thể tính giá khi đặt lịch
- không thể biết sân nào đang được quản lý

Nói cách khác:
Auth giúp hệ thống biết ai đang dùng hệ thống.
Court giúp hệ thống biết đang quản lý tài nguyên nào.
Pricing giúp hệ thống biết giá của tài nguyên đó theo từng thời điểm.

---

# 10. Tóm tắt ngắn gọn

Flow của module Court là:

Client gọi API Court  
→ Route nhận request  
→ verifyToken kiểm tra đăng nhập  
→ checkRole kiểm tra quyền  
→ Controller gọi UseCase  
→ UseCase validate dữ liệu  
→ Repository thao tác bảng `courts`, `court_image`, `pricings`  
→ DB lưu dữ liệu  
→ hệ thống trả response hoàn chỉnh về client

Module này là nền tảng để các giai đoạn sau như booking, bill, payment có thể hoạt động.