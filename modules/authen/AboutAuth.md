# Tổng Quan Module Xác Thực

Tài liệu này dành cho thành viên trong team để nắm nhanh module `authen` đang giải quyết vấn đề gì, đang chạy theo luồng nào, và vì sao team chọn cách triển khai hiện tại.

## Bức Tranh Chung

Module xác thực hiện có 3 nghiệp vụ chính:

- Đăng ký tài khoản mới.
- Đăng nhập và cấp token.
- Đăng xuất để thu hồi phiên hiện tại.

Mục tiêu của thiết kế là:

- Code đủ rõ để người mới đọc và sửa được.
- Luồng bảo mật cơ bản phải an toàn trong môi trường thực tế.
- Dễ mở rộng sang refresh token và phân quyền về sau.

## Team Đã Giải Quyết Những Vấn Đề Gì

Khi mới làm, có 3 vấn đề thực tế xuất hiện:

Vấn đề 1: Lỗi async trong middleware xác thực token.
Nguyên nhân là thiếu `await` khi gọi verify access token, khiến dữ liệu trung gian là Promise và gây lỗi dây chuyền.
Giải pháp là chuyển middleware sang async và await đầy đủ.

Vấn đề 2: Inject nhầm thứ tự dependency cho `TokenServiceImpl`.
Constructor của service này nhận theo thứ tự `(tokenRepository, jwtSecurity)`. Nếu truyền ngược sẽ gây lỗi runtime lúc verify.
Giải pháp là chuẩn hóa thứ tự inject ở mọi nơi sử dụng.

Vấn đề 3: Câu lệnh `ON DUPLICATE KEY UPDATE` không update mà lại insert thêm.
Nguyên nhân là cột `tokens.user_id` trong DB thực tế thiếu ràng buộc UNIQUE.
Giải pháp là bổ sung UNIQUE cho `user_id` để hành vi update đúng kỳ vọng.

## Tác Dụng Của Các Thành Phần Chính

`UserRegisterUseCase`: xử lý toàn bộ nghiệp vụ đăng ký (validate, kiểm tra trùng, hash mật khẩu, tạo user, cấp token).

`UserLoginUseCase`: xử lý đăng nhập (validate, tìm user, so khớp mật khẩu, cấp token).

`UserLogoutUseCase`: xử lý đăng xuất bằng cách xóa bản ghi token theo `userId`.

`TokenServiceImpl`: tạo key pair, ký JWT và verify token theo public key lấy từ DB.

`verify.token` middleware: chặn route private, tách Bearer token, verify hợp lệ rồi gắn thông tin người dùng vào `req.user`.

`asyncHandler` middleware: gom lỗi async về `next(error)` để global error middleware xử lý tập trung.

## Cách Dùng Trong Route

`POST /auth/register` và `POST /auth/login` là route public.

`POST /auth/logout` là route private, bắt buộc đi qua middleware verify token trước controller.

Khi verify thành công, controller có thể dùng `req.user.userId` để xử lý nghiệp vụ cần xác thực.

## Đọc Tiếp Ở Đâu

Để xem đầy đủ tất cả luồng của module (register, login, logout, verify token, error flow) theo kiểu tự sự kèm sơ đồ, xem tại [modules/authen/Auth_all_Flow.md](modules/authen/Auth_all_Flow.md).
