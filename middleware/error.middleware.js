//
//
// xữ lí lỗi trung tâm, bắt tất cả lỗi từ các controller và trả về response có cấu trúc thống nhất
// hoạt động khi error được truyền vào next() hoặc khi controller trả về lỗi không được bắt
//
//
function errorMiddleware(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const payload = {
    error: err.message || "Internal server error",
  };

  if (err.code) {
    payload.code = err.code;
  }

  if (err.details !== undefined && err.details !== null) {
    payload.details = err.details;
  }

  res.status(statusCode).json(payload);
}

module.exports = errorMiddleware;
