class Token{
    constructor({userId, refreshToken, publicKey, privateKey}){
        this.userId = userId;
        this.refreshToken = refreshToken;
        this.publicKey = publicKey;
        this.privateKey = privateKey;
    }
}
module.exports = Token;
// sau này phát triển thêm để lưu refreshToken vào database, hoặc cache như redis để
//  quản lý token tốt hơn, có thể revoke token khi cần thiết, hoặc lưu thông tin về thiết bị, IP,... 
// để tăng cường bảo mật.