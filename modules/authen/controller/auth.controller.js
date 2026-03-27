const REFRESH_TOKEN_COOKIE_NAME = "refreshToken";
const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

const parseBooleanEnv = (value) => {
  if (typeof value !== "string") {
    return undefined;
  }

  if (value.toLowerCase() === "true") {
    return true;
  }

  if (value.toLowerCase() === "false") {
    return false;
  }

  return undefined;
};

const buildRefreshTokenCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === "production";
  const secureFromEnv = parseBooleanEnv(process.env.REFRESH_COOKIE_SECURE);
  const secure = secureFromEnv ?? isProduction;
  const sameSite =
    process.env.REFRESH_COOKIE_SAMESITE || (secure ? "none" : "lax");

  const options = {
    httpOnly: true,
    secure,
    sameSite,
    path: "/auth",
    maxAge: REFRESH_TOKEN_TTL_MS,
  };

  if (process.env.REFRESH_COOKIE_DOMAIN) {
    options.domain = process.env.REFRESH_COOKIE_DOMAIN;
  }

  return options;
};

class AuthController {
  // khoi tao controller voi cac use case cua auth module
  constructor({
    registerUseCase,
    loginUseCase,
    logoutUseCase,
    refreshTokenUseCase,
  }) {
    this.registerUseCase = registerUseCase;
    this.loginUseCase = loginUseCase;
    this.logoutUseCase = logoutUseCase;
    this.refreshTokenUseCase = refreshTokenUseCase;
  }

  setRefreshTokenCookie(res, refreshToken) {
    res.cookie(
      REFRESH_TOKEN_COOKIE_NAME,
      refreshToken,
      buildRefreshTokenCookieOptions(),
    );
  }

  clearRefreshTokenCookie(res) {
    const options = buildRefreshTokenCookieOptions();
    delete options.maxAge;
    res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, options);
  }

  // xu ly request dang nhap va tra ket qua cho client
  async login(req, res) {
    const result = await this.loginUseCase.execute(req.body);
    this.setRefreshTokenCookie(res, result.tokens.refreshToken);

    return res.status(200).json({
      user: result.user,
      accessToken: result.tokens.accessToken,
    });
  }

  // xu ly request dang ky va tra thong tin user kem token
  async register(req, res) {
    const result = await this.registerUseCase.execute(req.body);
    this.setRefreshTokenCookie(res, result.tokens.refreshToken);

    return res.status(201).json({
      user: result.user,
      accessToken: result.tokens.accessToken,
    });
  }

  async logout(req, res) {
    const userId = req.user.userId;
    const result = await this.logoutUseCase.execute({ userId });
    this.clearRefreshTokenCookie(res);
    return res.status(200).json(result);
  }

  async refreshToken(req, res) {
    const refreshToken = req.cookies?.[REFRESH_TOKEN_COOKIE_NAME];

    // execute use case - nó sẽ throw error nếu token không hợp lệ
    const result = await this.refreshTokenUseCase.execute(refreshToken);

    // set cookie refresh token mới (rotation)
    this.setRefreshTokenCookie(res, result.tokens.refreshToken);

    return res.status(200).json({
      accessToken: result.tokens.accessToken,
    });
  }
}

module.exports = AuthController;
