/*
Huong dan ma loi:
- BAD_REQUEST (400): Du lieu dau vao sai dinh dang, thieu hoac khong hop le.
- UNAUTHORIZED (401): Thieu/sai token xac thuc, sai thong tin dang nhap.
- FORBIDDEN (403): Da xac thuc nhung khong du quyen thuc hien hanh dong.
- NOT_FOUND (404): Khong tim thay tai nguyen (user/order/file theo id...).
- CONFLICT (409): Xung dot trang thai du lieu (trung email/username, unique key).
- UNPROCESSABLE_ENTITY (422): Du lieu dung format nhung vi pham rule nghiep vu.
- INTERNAL_SERVER_ERROR (500): Loi khong mong muon o phia server.
*/

class AppError extends Error {
    constructor(message, statusCode = 500, code = 'APP_ERROR', details = null) {
        super(message || 'Internal server error');
        this.name = 'AppError';
        this.statusCode = statusCode;
        this.code = code;
        this.details = details;
    }
}

const createAppError = (message, statusCode = 500, code = 'APP_ERROR', details = null) => {
    return new AppError(message, statusCode, code, details);
};

// Dung khi du lieu request khong hop le (validation, query params, body schema).
const badRequest = (message = 'Bad request', details = null) => {
    return createAppError(message, 400, 'BAD_REQUEST', details);
};

// Dung khi xac thuc that bai (khong co token, token sai, sai mat khau).
const unauthorized = (message = 'Unauthorized', details = null) => {
    return createAppError(message, 401, 'UNAUTHORIZED', details);
};

// Dung khi da dang nhap nhung khong du quyen thuc hien hanh dong.
const forbidden = (message = 'Forbidden', details = null) => {
    return createAppError(message, 403, 'FORBIDDEN', details);
};

// Dung khi khong tim thay tai nguyen duoc yeu cau.
const notFound = (message = 'Not found', details = null) => {
    return createAppError(message, 404, 'NOT_FOUND', details);
};

// Dung khi du lieu bi trung hoac xung dot voi trang thai hien tai.
const conflict = (message = 'Conflict', details = null) => {
    return createAppError(message, 409, 'CONFLICT', details);
};

// Dung khi input dung format co ban nhung vi pham rule nghiep vu.
const unprocessableEntity = (message = 'Unprocessable entity', details = null) => {
    return createAppError(message, 422, 'UNPROCESSABLE_ENTITY', details);
};

// Dung lam fallback cho cac loi khong mong muon.
const internalServerError = (message = 'Internal server error', details = null) => {
    return createAppError(message, 500, 'INTERNAL_SERVER_ERROR', details);
};

const isAppError = (error) => error instanceof AppError;

const assertOrThrow = (condition, message, statusCode = 400, code = 'BAD_REQUEST', details = null) => {
    if (!condition) {
        throw createAppError(message, statusCode, code, details);
    }
};

module.exports = {
    AppError,
    createAppError,
    badRequest,
    unauthorized,
    forbidden,
    notFound,
    conflict,
    unprocessableEntity,
    internalServerError,
    isAppError,
    assertOrThrow
};
