const express = require('express');
const cors = require('cors');
require('dotenv').config();
const userRouters = require('./routes/userRoute');
const { pingDatabase, getDbStatus } = require('./config/db');

const app = express();

app.use(cors()); //Dùng cors để cho phép FE gọi API thoải mái

app.use(express.json()); //Đọc json từ body request

app.get('/', (req, res) => {
    res.status(200).json({
        service: 'DemoNodejs API',
        status: 'running'
    });
});

app.get('/health', async (req, res) => {
    const dbStatus = getDbStatus();

    if (!dbStatus.configured) {
        return res.status(200).json({
            status: 'ok',
            database: 'not_configured',
            detail: dbStatus.message,
            uptimeSeconds: Math.floor(process.uptime())
        });
    }

    try {
        await pingDatabase();
        return res.status(200).json({
            status: 'ok',
            database: 'connected',
            uptimeSeconds: Math.floor(process.uptime())
        });
    }
    catch (error) {
        return res.status(200).json({
            status: 'ok',
            database: 'unreachable',
            detail: error.message,
            uptimeSeconds: Math.floor(process.uptime())
        });
    }
});

app.use('/users', userRouters);

app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

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
            console.log('Ket noi DB thanh cong');
        })
        .catch((error) => {
            console.warn(`Khong the ket noi DB luc startup: ${error.message}`);
        });
});