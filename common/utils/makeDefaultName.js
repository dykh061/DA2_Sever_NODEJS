// tạo chuỗi ngẫu nhiên để làm tên mặc định cho người dùng
const randomChars = (length = 8) => {
	const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
	let result = '';

	for (let i = 0; i < length; i += 1) {
		const index = Math.floor(Math.random() * chars.length);
		result += chars[index];
	}

	return result;
};


// tạo tên mặc định với tiền tố nối với chuỗi ngẫu nhiên
const makeDefaultName = (prefix = 'user') => {
	const safePrefix = typeof prefix === 'string' && prefix.trim()
		? prefix.trim().toLowerCase()
		: 'user';

	return `${safePrefix}_${randomChars(8)}`;
};

module.exports = { makeDefaultName };


