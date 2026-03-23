const User = require('../modules/user/models/User'); // Đảm bảo đúng đường dẫn tới model User

// Middleware kiểm tra quyền của người dùng
const checkRole = async (req, res, next) => {
  try {
    // Lấy userId từ req.user (đã được gán khi kiểm tra token)
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });  // Dùng 401 cho lỗi xác thực
    }

    // Tìm user trong database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Kiểm tra role_id, nếu là admin thì tiếp tục
    if (user.role_id !== 1) {  // 1 là admin
      return res.status(403).json({ message: 'You do not have admin privileges' });
    }

    // Tiếp tục với middleware khác nếu là admin
    next();
  } catch (error) {
    console.error(error);  // Log lỗi chi tiết để kiểm tra
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = checkRole;