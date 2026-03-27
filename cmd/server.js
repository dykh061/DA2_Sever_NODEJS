const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { pingDatabase, getDbStatus } = require("../config/database");
const router = require("../routes/index");
const errorMiddleware = require("../middleware/error.middleware");

const app = express();

app.use(cors());
app.use(express.json());

//
//
// Các endpoint cơ bản như "/" và "/health" được đặt trước các route khác để đảm bảo rằng chúng luôn sẵn sàng phục vụ request
//  mà không bị ảnh hưởng bởi các route khác, giúp kiểm tra nhanh tình trạng server và database một cách hiệu quả
//
//
app.get("/", (req, res) => {
  res.status(200).json({
    service: "DemoNodejs API",
    status: "running",
  });
});

app.get("/build", (req, res) => {
  res.status(200).json({
    service: process.env.RENDER_SERVICE_NAME || "DemoNodejs API",
    branch: process.env.RENDER_GIT_BRANCH || "unknown",
    commit: process.env.RENDER_GIT_COMMIT || "local",
  });
});

app.get("/health", async (req, res) => {
  const dbStatus = getDbStatus();

  if (!dbStatus.configured) {
    return res.status(200).json({
      status: "ok",
      database: "not_configured",
      detail: dbStatus.message,
      uptimeSeconds: Math.floor(process.uptime()),
    });
  }

  try {
    await pingDatabase();
    return res.status(200).json({
      status: "ok",
      database: "connected",
      uptimeSeconds: Math.floor(process.uptime()),
    });
  } catch (error) {
    return res.status(200).json({
      status: "ok",
      database: "unreachable",
      detail: error.message,
      uptimeSeconds: Math.floor(process.uptime()),
    });
  }
});

app.use("/", router);

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

//
//
// Điểm endpoint 404 này sẽ được đặt sau tất cả các route khác để đảm bảo rằng
// nếu không có route nào khớp với request, server sẽ trả về lỗi 404 thay vì để
// request rơi vào middleware xử lý lỗi chung, giúp phân biệt rõ ràng giữa lỗi
// do route không tồn tại và lỗi do sự cố trong quá trình xử lý request
// asyncHandler sẽ tự động bắt lỗi từ các controller trả về promise
// và chuyển đến middleware xử lý lỗi của Express mà không cần phải gọi next(err)
//
//
app.use(errorMiddleware);

//
//
// Điểm khởi động server sẽ kiểm tra kết nối database ngay khi startup để
// phát hiện sớm các vấn đề về cấu hình hoặc kết nối database, giúp đảm bảo
//  rằng server đã sẵn sàng phục vụ request trước khi bắt đầu lắng nghe cổng
//
//
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server đang chạy ở cổng ${PORT}`);

  const dbStatus = getDbStatus();
  if (!dbStatus.configured) {
    console.warn(`Canh bao cau hinh DB: ${dbStatus.message}`);
    return;
  }

  pingDatabase()
    .then(() => {
      console.log("Ket noi DB thanh cong");
    })
    .catch((error) => {
      console.warn(`Khong the ket noi DB luc startup: ${error.message}`);
    });
});
