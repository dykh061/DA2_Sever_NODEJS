const AuthController = require('./controller/auth.controller');
const UserRegisterUseCase = require('./usecase/user.register.usecase');
const KeyTokenUseCase = require('./usecase/user.keyToken.usecase');
const userRepository = require('./infra/user.repository.impl');
const tokenRepository = require('./infra/token.repository.impl');
const TokenServiceImpl = require('./infra/token.service.impl');
const JwtSecurity = require('../../common/security/jwt.security');

const jwtSecurity = new JwtSecurity();
const tokenService = new TokenServiceImpl(tokenRepository, jwtSecurity);
const keyTokenUseCase = new KeyTokenUseCase(tokenService);
const registerUseCase = new UserRegisterUseCase(userRepository, keyTokenUseCase);
const authController = new AuthController({ registerUseCase });

module.exports = {
    authController
};