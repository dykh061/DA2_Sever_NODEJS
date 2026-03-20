# User Register API Flow

## Request/Response

### Request
```
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "123456",
}
```

### Response (Success)
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "default_username_1"
  },
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

## Execution Flow

```
1. AuthController.register(req, res)
   └─> UserRegisterUseCase.execute(req.body)

2. UserRegisterUseCase.execute()
   ├─> Validate DTO (UserRegisterDTO)
   │   ├─ Check email required + valid format
   │   ├─ Check password required + min 6 chars
   │   └─ Throw: badRequest error
   │
   ├─> UserRepository.findEmail(email)
   │   ├─ Query: SELECT * FROM users WHERE email = ?
   │   └─ Throw: conflict error nếu email tồn tại
   │
   ├─> Hash password
   │   └─ Using bcrypt (hash.js)
   │
   ├─> Generate default username
   │   └─ Using makeDefaultName() utils
   │
   ├─> UserRepository.register(email, hashedPassword, username)
   │   ├─ Query: INSERT INTO users (email, password, username)
   │   └─ Return: User instance với id mới
   │
   ├─> TokenService.issueTokens({userId, email, role})
   │   ├─ JwtSecurity.generateKeyPair()
   │   │   └─ Generate RSA public + private keys
   │   │
   │   ├─ JwtSecurity.signAccessToken(payload, privateKey)
   │   │   └─ Sign JWT với privateKey
   │   │
   │   ├─ JwtSecurity.signRefreshToken(payload, privateKey)
   │   │   └─ Sign JWT với privateKey
   │   │
   │   ├─ Hash refreshToken (using crypto)
   │   │
   │   └─> TokenRepository.saveToken({userId, publicKey, privateKey, refreshTokenHash})
   │       ├─ Query: INSERT INTO tokens (user_id, refresh_token, public_key, private_key)
   │       │          ON DUPLICATE KEY UPDATE ...
   │       └─ Lưu cặp key + hashed refresh token vào DB
   │
   └─> Return {user, tokens}

3. AuthController trả về response 201 + data
```

## Important Security Notes

### 🔐 Token Storage (Public/Private Keys)
- **Mỗi user có 1 cặp RSA key riêng** (public_key, private_key)
- **Lưu trong DB** bảng `tokens` table
- **Private key** dùng để sign tokens (chỉ server biết)
- **Public key** dùng để verify tokens (client/others có thể dùng)

### 🔐 Refresh Token
- **Hashed** trước khi lưu (không lưu pure refresh token)
- **So sánh hash** khi client dùng refresh token

### 🔐 Password
- **Hashed** trước khi lưu (không lưu plain text)
- Dùng bcrypt

### 🔑 Access Token vs Refresh Token
- **Access Token**: Ngắn hạn (expire nhanh)
  - Dùng để authorize requests
  - Verify dùng user's public key từ DB
  
- **Refresh Token**: Dài hạn
  - Dùng để lấy access token mới khi hết hạn
  - So sánh hash với DB

## Database Schema Reference

### users table
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  username VARCHAR(255),
  role ENUM('user', 'admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### tokens table
```sql
CREATE TABLE tokens (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT UNIQUE NOT NULL,
  public_key LONGTEXT NOT NULL,
  private_key LONGTEXT NOT NULL,
  refresh_token VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## Error Handling

### Validation Errors (400 - badRequest)
```
- Email không rỗng: "Email is required"
- Email format: "Invalid email format"
- Password không rỗng: "Password is required"
- Password < 6 chars: "Password must be at least 6 characters"
```

### Business Errors
```
- Email tồn tại (409 - conflict): "Email da ton tai"
- Access Token hợp lệ (401 - unauthorized): "Access token khong hop le"
- Không tìm thấy key (401 - unauthorized): "Khong tim thay key cua user"
```

## Testing

### Manual test
```javascript
const UserRegisterUseCase = require('./modules/authen/usecase/user.register.usecase');

const uc = new UserRegisterUseCase(
  {
    findEmail: async () => null, // mock: email chưa tồn tại
    register: async () => ({
      id: 1,
      email: 'test@example.com',
      username: 'u1',
      role: 'user'
    })
  },
  {
    issueTokens: async () => ({
      accessToken: 'a',
      refreshToken: 'r'
    })
  }
);

uc.execute({
  email: 'test@example.com',
  password: '123456',
  username: 'u1'
}).then(result => console.log(result));
```

## Future Enhancements

- [ ] Login endpoint
- [ ] Logout endpoint (revoke token) 
- [ ] Refresh token endpoint
- [ ] Email verification
- [ ] Password reset
- [ ] Two-factor authentication
- [ ] OAuth integration
