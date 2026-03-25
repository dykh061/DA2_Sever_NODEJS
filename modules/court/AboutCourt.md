# Tổng Quan Module Quản Lý Sân

Tài liệu này dành cho thành viên trong team để nắm nhanh module `court` đang giải quyết vấn đề gì, đang chạy theo luồng nào, và vì sao team chọn cách triển khai hiện tại.



## Bức Tranh Chung

Module `court` hiện có 4 nghiệp vụ chính:

- Tạo sân mới.
- Xem danh sách sân và chi tiết từng sân.
- Cập nhật thông tin sân.
- Xóa sân.

Mỗi sân không chỉ có thông tin cơ bản trong bảng `courts`, mà còn đi kèm:

- Danh sách hình ảnh trong bảng `court_image`.
- Danh sách bảng giá theo khung giờ trong bảng `pricings`.

Mục tiêu của thiết kế là:

- Tách riêng module quản lý sân để độc lập với booking và payment.
- Dữ liệu sân phải đủ cho các bước sau như đặt lịch, tính giá, hiển thị giao diện.
- Admin có thể CRUD sân dễ dàng, còn người không đủ quyền sẽ bị chặn từ middleware.

## Team Đã Giải Quyết Những Vấn Đề Gì

Khi làm module này, có một số vấn đề thực tế đã xuất hiện:

Vấn đề 1: Bảng `courts` chỉ lưu `id`, `name`, `status`, còn hình ảnh và giá nằm ở bảng riêng.
Nguyên nhân là thiết kế DB tách `court_image` và `pricings` ra khỏi `courts`.
Giải pháp là khi lấy dữ liệu sân, module sẽ gom thêm `imageUrls` và `pricings` để trả ra một object đầy đủ cho client.

Vấn đề 2: Khi tạo hoặc cập nhật giá sân, `time_slot_id` phải tồn tại trong bảng `time_slots`.
Nguyên nhân là bảng `pricings` có foreign key tới `time_slots`.
Giải pháp là phải seed dữ liệu `time_slots` trước khi test create/update court có pricing.

Vấn đề 3: Cần phân quyền để chỉ admin mới được thao tác module sân.
Nguyên nhân là đây là dữ liệu lõi của hệ thống, không thể để user thường sửa trực tiếp.
Giải pháp là route `court` đi qua `verifyToken` và `checkRole` trước khi vào controller.

Vấn đề 4: Khi cập nhật hình ảnh và bảng giá của sân, dữ liệu cũ phải được thay thế rõ ràng.
Nguyên nhân là nếu chỉ append thêm sẽ gây dữ liệu rác hoặc không đúng giá hiện tại.
Giải pháp là module chọn cách xóa danh sách cũ rồi insert lại danh sách mới cho `court_image` và `pricings`.

## Tác Dụng Của Các Thành Phần Chính

`CourtController`: nhận request từ route, gọi use case tương ứng và trả response cho client.

`CreateCourtUseCase`: xử lý tạo sân mới, validate input, tạo record trong `courts`, sau đó thêm ảnh và bảng giá đi kèm.

`GetAllCourtsUseCase`: lấy toàn bộ danh sách sân kèm ảnh và bảng giá.

`GetCourtByIdUseCase`: lấy chi tiết một sân theo `id`, trả ra dữ liệu đầy đủ để client hoặc admin có thể sử dụng.

`UpdateCourtUseCase`: cập nhật thông tin sân, đồng thời thay thế lại danh sách ảnh và bảng giá nếu client gửi lên.

`DeleteCourtUseCase`: xóa sân theo `id`. Do DB có foreign key cascade, dữ liệu liên quan như `court_image` và `pricings` sẽ bị xóa theo.

`court.repository.impl`: chịu trách nhiệm query DB cho module sân, bao gồm `courts`, `court_image`, `pricings`.

`createCourt.dto` và `updateCourt.dto`: validate dữ liệu đầu vào trước khi đi vào nghiệp vụ chính.

`verify.token` middleware: kiểm tra access token, giải mã và gắn user vào `req.user`.

`checkRole` middleware: kiểm tra quyền của user sau khi đã verify token. Nếu team đang dùng `req.user.role` thì token login phải chứa đúng role của user.

## Cách Dùng Trong Route

Các route của module `court` hiện theo hướng CRUD chuẩn:

- `GET /courts`
- `GET /courts/:id`
- `POST /courts`
- `PUT /courts/:id`
- `DELETE /courts/:id`

Nếu route được gắn:

`router.use(verifyToken, checkRole)`

thì toàn bộ các API trên sẽ là private, bắt buộc người gọi phải đăng nhập và có quyền phù hợp.

Khi verify thành công, thông tin user sẽ có trong `req.user`.
Khi check role thành công, request mới được đi tiếp vào controller.

Body tạo hoặc cập nhật sân hiện tại có thể gồm:

- `name`
- `status`
- `imageUrls`
- `pricings`

Trong đó `pricings` là mảng các object có:

- `day_type`
- `price`
- `time_slot_id`

## Response Dữ Liệu Của Module

Một object sân khi trả về thường có dạng:

- `id`
- `name`
- `status`
- `imageUrls`
- `pricings`

Nhờ vậy client không cần gọi riêng nhiều API để tự ghép dữ liệu ảnh và giá của sân.

## Lưu Ý Khi Test

Muốn test create/update court có pricing thì bảng `time_slots` phải có dữ liệu trước.

Muốn test route có phân quyền thì phải login trước để lấy `accessToken`, sau đó gắn Bearer Token vào Postman.

Nếu `checkRole` đang kiểm tra `req.user.role`, cần đảm bảo token login thực sự chứa đúng role như `admin`, nếu không thì dù user trong DB là admin vẫn có thể bị chặn.

## Đọc Tiếp Ở Đâu

Để xem phần xác thực, token, verify middleware và cách quyền được gắn vào request, xem tại file `modules/authen/AboutAuth.md`.

Để xem route tổng đang mount module này như thế nào, xem tại `routes/index.js`.