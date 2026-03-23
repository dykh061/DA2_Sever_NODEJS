const { badRequest, unauthorized } = require("../../../common/errors/appError");
const JwtSecurity = require("../../../common/security/jwt.security");

class UserRefreshTokenUseCase {
  constructor(tokenService, tokenRepository, jwtSecurity = new JwtSecurity()) {
    this.tokenService = tokenService;
    this.tokenRepository = tokenRepository;
    this.jwtSecurity = jwtSecurity;
  }

  //
  //
  // xử lí cấp mới access token khi có refresh token hợp lệ
  // và đồng thời lưu lại refresh token đã sử dụng vào lịch sử để phát hiện replay attack
  //
  //
  async execute(refreshToken) {
    if (!refreshToken || typeof refreshToken !== "string") {
      throw badRequest("Refresh token la bat buoc");
    }

    // mã hóa cái refresh token vừa nhận được từ client để chuẩn bị đem đi so sánh
    const hashedRefreshToken = this.jwtSecurity.hashToken(refreshToken);

    // dùng cái hash của refresh token để kiểm tra trong db xem token này đã được sử dụng
    // chưa , nếu rồi thì từ chối cấp token mới và xóa toàn bộ token của user đó để ngăn chặn replay attack
    const usedRefreshToken =
      await this.tokenRepository.findRefreshTokenUsed(hashedRefreshToken);

    if (usedRefreshToken.length > 0) {
      const userId = usedRefreshToken[0].userId; // nếu phát hiện refresh token đã bị sử dụng lại,
      // tức là có dấu hiệu replay attack, thì xóa toàn bộ token của user đó để bắt buộc đăng nhập lại
      //  và ngăn chặn kẻ tấn công tiếp tục sử dụng token cũ
      await this.tokenRepository.deleteByUserId(userId); // xóa token của user khi phát hiện refresh token
      //  đã bị sử dụng lại để ngăn chặn replay attack
      throw unauthorized(
        "Refresh token da duoc su dung, vui long dang nhap lai",
      );
    }

    // verify refresh token và lấy thông tin user từ token để cấp token mới
    const { decoded, keyStore } =
      await this.tokenService.verifyTokenAndGetKeyStore(refreshToken);

    const storedRefreshTokenHash = keyStore.refreshTokenHash;

    if (!storedRefreshTokenHash) {
      throw unauthorized("Khong tim thay refresh token hash");
    }

    if (
      keyStore.refreshExpiresAt &&
      new Date(keyStore.refreshExpiresAt).getTime() <= Date.now()
    ) {
      await this.tokenRepository.deleteByUserId(keyStore.userId);
      throw unauthorized("Refresh token da het han, vui long dang nhap lai");
    }

    if (hashedRefreshToken !== storedRefreshTokenHash) {
      throw unauthorized("Refresh token khong hop le");
    }

    // đẩy token đã sử dụng vào lịch sử để lần sau nếu phát hiện token này bị dùng lại thì sẽ từ chối cấp token mới và xóa token của user đó để ngăn chặn replay attack
    const updatedToken = await this.tokenRepository.appendUsedRefreshTokenHash(
      decoded.userId,
      hashedRefreshToken,
    );
    const [appendResult] = updatedToken;
    if (!appendResult || appendResult.affectedRows === 0) {
      throw unauthorized("Khong the cap nhat lich su refresh token");
    }

    // nếu refresh token hợp lệ thì cấp mới access token và refresh token, đồng thời cập nhật hash
    // của refresh token mới vào db
    const tokens = await this.tokenService.issueTokens(
      {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role || "user",
      },
      {
        publicKey: keyStore.publicKey,
        privateKey: keyStore.privateKey,
      },
    );

    return { tokens };
  }
}

module.exports = UserRefreshTokenUseCase;
