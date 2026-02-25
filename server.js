require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 정적 파일 서비스 (public 디렉토리)
// 사용자가 /login.html, /posts.html 등에 직접 접근할 수 있도록 환경을 제공합니다.
app.use(express.static(path.join(__dirname, 'public')));

// 기본 경로(/) 접근 시 index.html 제공
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 404 처리 (정적 파일이 없을 경우)
app.use((req, res) => {
    res.status(404).send('<h1>404 - Page Not Found</h1><p>Requested static file does not exist.</p>');
});

app.listen(PORT, () => {
    console.log(`========================================`);
    console.log(`🚀 Frontend Server (MPA Mode) is running!`);
    console.log(`🏠 URL: http://localhost:${PORT}`);
    console.log(`📡 API DEV: ${process.env.REST_API_DEV_URL}`);
    console.log(`📡 API PROD: ${process.env.REST_API_PROD_URL}`);
    console.log(`========================================`);
});
