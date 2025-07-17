import express from "express";
import dotenv from 'dotenv';

// 환경변수 로드
dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 테스트 라우트
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

// 포트 설정
const port = process.env.PORT ? parseInt(process.env.PORT) : 5000;

app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Test server running on port ${port}`);
});
