const mysql = require('mysql2/promise');
require('dotenv').config();

const REQUIRED_ENV_KEYS = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
const DB_URL = process.env.DB_URL || process.env.DATABASE_URL;

const toBoolean = (value) => {
    if (!value) return false;
    return ['1', 'true', 'yes', 'on'].includes(String(value).toLowerCase());
};

const buildConfigFromUrl = (connectionUrl) => {
    try {
        const parsed = new URL(connectionUrl);
        if (!['mysql:', 'mysql2:'].includes(parsed.protocol)) {
            throw new Error('DB_URL must use mysql:// protocol');
        }

        const database = parsed.pathname.replace(/^\//, '');
        if (!database) {
            throw new Error('DB_URL must include a database name');
        }

        return {
            host: parsed.hostname,
            port: Number(parsed.port) || 3306,
            user: decodeURIComponent(parsed.username),
            password: decodeURIComponent(parsed.password),
            database
        };
    }
    catch (error) {
        return {
            configError: `Invalid DB_URL: ${error.message}`
        };
    }
};

const buildConfigFromEnv = () => {
    const missing = REQUIRED_ENV_KEYS.filter((key) => !process.env[key]);
    if (missing.length > 0) {
        return {
            configError: `Missing database env vars: ${missing.join(', ')}. Set DB_URL or full DB_HOST/DB_USER/DB_PASSWORD/DB_NAME.`
        };
    }

    return {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT) || 3306,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    };
};

const baseConfig = DB_URL ? buildConfigFromUrl(DB_URL) : buildConfigFromEnv();
const DB_CONFIG_ERROR = baseConfig.configError || null;

const pool = DB_CONFIG_ERROR
    ? null
    : mysql.createPool({
        ...baseConfig,
        waitForConnections: true,
        connectionLimit: Number(process.env.DB_CONNECTION_LIMIT) || 10,
        queueLimit: 0,
        ...(toBoolean(process.env.DB_SSL)
            ? { ssl: { rejectUnauthorized: false } }
            : {})
    });

const ensureConfigured = () => {
    if (!pool) {
        throw new Error(DB_CONFIG_ERROR || 'Database is not configured');
    }
};

const query = async (sql, params = []) => {
    ensureConfigured();
    return pool.query(sql, params);
};

const pingDatabase = async () => {
    ensureConfigured();
    const connection = await pool.getConnection();
    try {
        await connection.ping();
        return true;
    }
    finally {
        connection.release();
    }
};

const getDbStatus = () => {
    if (!pool) {
        return {
            configured: false,
            message: DB_CONFIG_ERROR
        };
    }

    return {
        configured: true,
        message: 'Database configuration loaded'
    };
};

module.exports = {
    query,
    pingDatabase,
    getDbStatus
};