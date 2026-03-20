# About Authentication

## Nghiệp vụ Auth

Module này xử lý toàn bộ các chức năng xác thực người dùng.

### Hiện tại hỗ trợ:
- ✅ **Register**: Đăng ký tài khoản mới
- ⏳ **Login**: Đăng nhập (TODO)
- ⏳ **Logout**: Đăng xuất/revoke token (TODO)
- ⏳ **Refresh Token**: Cấp access token mới (TODO)

### Security Features:
- 🔐 **Password Hashing**: Bcrypt hashing trước khi lưu DB
- 🔐 **JWT Tokens**: Access + Refresh token dùng RSA keys
- 🔐 **Per-User Key Pair**: Mỗi user có public/private key riêng
- 🔐 **Refresh Token Hashing**: Hash refresh token trước khi lưu DB
- 🔐 **Input Validation**: DTO validation (email format, password length)

### Key Components:

**UserRegisterUseCase** - Xử lý logic đăng ký
```
Email validate → Check duplicate → Hash password → Create user → Issue tokens
```

**TokenServiceImpl** - Tạo JWT tokens
```
Generate RSA keys → Sign access token → Sign refresh token → Save to DB
```

**UserRepositoryImpl** - Tương tác DB users
```
register() → INSERT user + hash password
findEmail() → SELECT email for duplicate check
```

## Chi tiết xem [REGISTER_FLOW.md](./REGISTER_FLOW.md)

## Dependencies

- `common/security/jwt.security.js` - JWT signing/verifying
- `common/utils/hash.js` - Password hashing
- `common/utils/makeDefaultName.js` - Generate default username
- `config/database.js` - Database connection
