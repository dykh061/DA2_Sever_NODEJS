const { createAppError } = require('../../../common/errors/appError');

const normalizePricing = (item, index) => {
    if (!item || typeof item !== 'object') {
        throw createAppError(`Pricing thu ${index + 1} khong hop le`, 400);
    }

    const day_type = typeof item.day_type === 'string' ? item.day_type.trim() : '';
    const price = Number(item.price);
    const time_slot_id = Number(item.time_slot_id);

    if (!day_type) {
        throw createAppError(`day_type cua pricing thu ${index + 1} khong hop le`, 400);
    }

    if (Number.isNaN(price) || price < 0) {
        throw createAppError(`price cua pricing thu ${index + 1} khong hop le`, 400);
    }

    if (!Number.isInteger(time_slot_id) || time_slot_id <= 0) {
        throw createAppError(`time_slot_id cua pricing thu ${index + 1} khong hop le`, 400);
    }

    return {
        day_type,
        price,
        time_slot_id
    };
};

const validateUpdateCourt = (body) => {
    const result = {};
    const hasName = Object.prototype.hasOwnProperty.call(body || {}, 'name');
    const hasStatus = Object.prototype.hasOwnProperty.call(body || {}, 'status');
    const hasImageUrls = Object.prototype.hasOwnProperty.call(body || {}, 'imageUrls');
    const hasPricings = Object.prototype.hasOwnProperty.call(body || {}, 'pricings');

    if (!hasName && !hasStatus && !hasImageUrls && !hasPricings) {
        throw createAppError('Khong co du lieu de cap nhat', 400);
    }

    if (hasName) {
        if (typeof body.name !== 'string' || !body.name.trim()) {
            throw createAppError('Ten san khong hop le', 400);
        }
        result.name = body.name.trim();
    }

    if (hasStatus) {
        if (typeof body.status !== 'string' || !body.status.trim()) {
            throw createAppError('Trang thai san khong hop le', 400);
        }
        result.status = body.status.trim();
    }

    if (hasImageUrls) {
        if (!Array.isArray(body.imageUrls)) {
            throw createAppError('imageUrls phai la mang', 400);
        }

        result.imageUrls = body.imageUrls.map((item, index) => {
            if (typeof item !== 'string' || !item.trim()) {
                throw createAppError(`imageUrl thu ${index + 1} khong hop le`, 400);
            }
            return item.trim();
        });
    }

    if (hasPricings) {
        if (!Array.isArray(body.pricings)) {
            throw createAppError('pricings phai la mang', 400);
        }

        result.pricings = body.pricings.map(normalizePricing);
    }

    return result;
};

module.exports = { validateUpdateCourt };