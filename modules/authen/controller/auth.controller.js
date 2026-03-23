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

  // xu ly request dang nhap va tra ket qua cho client
  async login(req, res) {
    const result = await this.loginUseCase.execute(req.body);
    return res.status(200).json(result);
  }

  // xu ly request dang ky va tra thong tin user kem token
  async register(req, res) {
    const result = await this.registerUseCase.execute(req.body);
    return res.status(201).json(result);
  }
  async logout(req, res) {
    const userId = req.user.userId;
    const result = await this.logoutUseCase.execute({ userId });
    return res.status(200).json(result);
  }
  async refreshToken(req, res) {
    const { refreshToken } = req.body;
    const result = await this.refreshTokenUseCase.execute(refreshToken);
    return res.status(200).json(result);
  }
}

module.exports = AuthController;
