// middleware/asyncHandler.middleware.js dùng để bọc các controller trả về promise để tự động bắt lỗi mà
//  không cần phải dùng try/catch ở mỗi controller, giúp code gọn hơn và dễ bảo trì hơn
// Ví dụ khi dùng asyncHandler, nếu controller có lỗi sẽ tự động được chuyển đến middleware
// xử lý lỗi của Express mà không cần phải gọi next(err) thủ công
function asyncHandler(handler) {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

module.exports = asyncHandler;
