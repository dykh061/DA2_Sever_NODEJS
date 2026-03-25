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

const validateCreateCourt = (body) => {
    const { name, status, imageUrls = [], pricings = [] } = body || {};

    if (typeof name !== 'string' || !name.trim()) {
        throw createAppError('Ten san khong hop le', 400);
    }

    if (typeof status !== 'string' || !status.trim()) {
        throw createAppError('Trang thai san khong hop le', 400);
    }

    if (!Array.isArray(imageUrls)) {
        throw createAppError('imageUrls phai la mang', 400);
    }

    const normalizedImageUrls = imageUrls.map((item, index) => {
        if (typeof item !== 'string' || !item.trim()) {
            throw createAppError(`imageUrl thu ${index + 1} khong hop le`, 400);
        }
        return item.trim();
    });

    if (!Array.isArray(pricings)) {
        throw createAppError('pricings phai la mang', 400);
    }

    const normalizedPricings = pricings.map(normalizePricing);

    return {
        name: name.trim(),
        status: status.trim(),
        imageUrls: normalizedImageUrls,
        pricings: normalizedPricings
    };
};

module.exports = { validateCreateCourt };