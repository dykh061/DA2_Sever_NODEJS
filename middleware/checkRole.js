// middleware/checkRole.js
const { unauthorized, forbidden } = require('../common/errors/appError');

async function checkRole(req, res, next) {
  try {
    if (!req.user || !req.user.role) {
      return next(
        unauthorized('User chưa đăng nhập hoặc token không hợp lệ')
      );
    }

    // Kiểm tra role từ token
    if (req.user.role !== 'admin') {
      return next(
        forbidden('Bạn không có quyền truy cập')
      );
    }

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = checkRole;