const jwt = require('jsonwebtoken');
const crypto = require('crypto');

class JwtSecurity {
    generateKeyPair() {
        const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
            modulusLength: 4096,
            publicKeyEncoding: { type: 'spki', format: 'pem' },
            privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
        });

        return { publicKey, privateKey };
    }

    hashToken(token) {
        return crypto.createHash('sha256').update(token).digest('hex');
    }

    signAccessToken(payload, privateKey) {
        return jwt.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: process.env.ACCESS_TOKEN_EXPIRES || '15m'
        });
    }

    signRefreshToken(payload, privateKey) {
        return jwt.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: process.env.REFRESH_TOKEN_EXPIRES || '7d'
        });
    }

    decode(token) {
        return jwt.decode(token);
    }

    verify(token, publicKey) {
        return jwt.verify(token, publicKey, {
            algorithms: ['RS256']
        });
    }
}

module.exports = JwtSecurity;
