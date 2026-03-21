const JwtSecurity = require("../common/security/jwt.security");
const TokenServiceImpl = require("../modules/authen/infra/token.service.impl");
const tokenRepository = require("../modules/authen/infra/token.repository.impl");
const jwtSecur = new JwtSecurity();
const tokenService = new TokenServiceImpl(tokenRepository, jwtSecur);

//
//
// Đây là middleware để xác thực token trong các request đến các route cần bảo vệ, nó sẽ được sử dụng
//  trong cmd/server.js khi định nghĩa route
// cụ thể cách sử dụng sẽ là bọc middleware này vào trước controller của route cần bảo vệ,
// ví dụ như app.get("/profile", verifyToken, profileController)

async function verifyToken(req, res, next) {
  try {
    const authHeader = req.headers["authorization"];

    // nếu authHeader tồn tại thì sẽ chạy vế sau để lấy token,
    // nếu không có authHeader hoặc authHeader không đúng định dạng thì
    // token sẽ là undefined và trả về lỗi 401
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Không có token truy cập" });
    }
    const decoded = await tokenService.verifyAccessToken(token);
    req.user = decoded; // gắn thông tin user đã giải mã vào request để controller có thể sử dụng
    // cụ thể req.user sẽ có userId , email ,role , iat , exp

    return next();
  } catch (error) {
    return next(error);
  }
}

module.exports = verifyToken;
