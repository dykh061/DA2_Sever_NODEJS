const mysql = require("mysql2/promise");
require("dotenv").config();

const REQUIRED_ENV_KEYS = ["DB_HOST", "DB_USER", "DB_PASSWORD", "DB_NAME"];
const DB_URL = process.env.DB_URL || process.env.DATABASE_URL;

//
//
// hàm chuyển giá trị chuỗi từ env thành boolean, giúp dễ dàng bật/tắt các tính năng như SSL
// Ví dụ: DB_SSL=true sẽ được chuyển thành true, còn DB_SSL=false hoặc không set sẽ là false
//
//
const toBoolean = (value) => {
  if (!value) return false;
  return ["1", "true", "yes", "on"].includes(String(value).toLowerCase());
};

//
//
/// hàm phân tích DB_URL để lấy thông tin cấu hình database,
// hỗ trợ định dạng mysql://user:pass@host:port/dbname
// Nếu DB_URL không hợp lệ, sẽ trả về lỗi cấu hình để hiển thị rõ ràng hơn thay vì lỗi kết nối chung chung
//
const buildConfigFromUrl = (connectionUrl) => {
  try {
    const parsed = new URL(connectionUrl);
    if (!["mysql:", "mysql2:"].includes(parsed.protocol)) {
      throw new Error("DB_URL must use mysql:// protocol");
    }

    const database = parsed.pathname.replace(/^\//, "");
    if (!database) {
      throw new Error("DB_URL must include a database name");
    }

    return {
      host: parsed.hostname,
      port: Number(parsed.port) || 3306,
      user: decodeURIComponent(parsed.username),
      password: decodeURIComponent(parsed.password),
      database,
    };
  } catch (error) {
    return {
      configError: `Invalid DB_URL: ${error.message}`,
    };
  }
};

//
//
// Hàm kiểm tra cấu hình database, trả về trạng thái và thông điệp lỗi nếu có,
// giúp endpoint /health trả về thông tin rõ ràng hơn về tình trạng database
//
//

const buildConfigFromEnv = () => {
  const missing = REQUIRED_ENV_KEYS.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    return {
      configError: `Missing database env vars: ${missing.join(", ")}. Set DB_URL or full DB_HOST/DB_USER/DB_PASSWORD/DB_NAME.`,
    };
  }

  return {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  };
};

//
// Tạo pool kết nối MySQL, nếu có lỗi cấu hình sẽ không tạo pool
// mà trả về lỗi để xử lý ở các hàm truy cập database
//
const baseConfig = DB_URL ? buildConfigFromUrl(DB_URL) : buildConfigFromEnv();

// Lưu lỗi cấu hình nếu có, để trả về trong endpoint /health hoặc khi cố gắng truy cập database
const DB_CONFIG_ERROR = baseConfig.configError || null;

// Nếu có lỗi cấu hình, pool sẽ là null và các hàm truy cập database sẽ ném lỗi khi gọi ensureConfigured()
const pool = DB_CONFIG_ERROR
  ? null
  : // Nếu không có lỗi cấu hình, tạo pool kết nối MySQL với các tùy chọn tối ưu cho hiệu suất và bảo mật
    mysql.createPool({
      ...baseConfig,
      waitForConnections: true,
      connectionLimit: Number(process.env.DB_CONNECTION_LIMIT) || 10,
      queueLimit: 0,
      ...(toBoolean(process.env.DB_SSL)
        ? { ssl: { rejectUnauthorized: false } }
        : {}),
    });

// Hàm đảm bảo rằng pool đã được cấu hình trước khi thực hiện truy vấn, nếu không sẽ ném lỗi rõ ràng
const ensureConfigured = () => {
  if (!pool) {
    throw new Error(DB_CONFIG_ERROR || "Database is not configured");
  }
};

// Hàm truy vấn database, sẽ tự động đảm bảo pool đã được cấu hình và sẵn sàng trước khi thực hiện truy vấn
const query = async (sql, params = []) => {
  ensureConfigured();
  return pool.query(sql, params);
};

// Hàm ping database để kiểm tra kết nối, sẽ được gọi trong endpoint /health và khi khởi động server để đảm bảo database sẵn sàng
const pingDatabase = async () => {
  ensureConfigured();
  const connection = await pool.getConnection();
  try {
    await connection.ping();
    return true;
  } finally {
    connection.release();
  }
};

// Hàm lấy trạng thái cấu hình database, sẽ được gọi trong endpoint /health để trả về thông tin rõ ràng về tình trạng database
const getDbStatus = () => {
  if (!pool) {
    return {
      configured: false,
      message: DB_CONFIG_ERROR,
    };
  }

  return {
    configured: true,
    message: "Database configuration loaded",
  };
};

module.exports = {
  query,
  pingDatabase,
  getDbStatus,
};
