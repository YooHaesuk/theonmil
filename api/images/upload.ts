import { VercelRequest, VercelResponse } from '@vercel/node';
import { v2 as cloudinary } from 'cloudinary';
import formidable from 'formidable';
import fs from 'fs';

// Cloudinary 설정
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Vercel에서 body parser 비활성화
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // OPTIONS 요청 처리 (CORS preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('🖼️ 이미지 업로드 요청 시작');

    // formidable로 파일 파싱
    const form = formidable({
      maxFileSize: 10 * 1024 * 1024, // 10MB
      keepExtensions: true,
    });

    const [fields, files] = await form.parse(req);
    const file = Array.isArray(files.image) ? files.image[0] : files.image;

    if (!file) {
      return res.status(400).json({ error: '이미지 파일이 필요합니다.' });
    }

    console.log('📤 파일 정보:', {
      originalFilename: file.originalFilename,
      mimetype: file.mimetype,
      size: file.size
    });

    // 파일을 base64로 변환
    const fileBuffer = fs.readFileSync(file.filepath);
    const base64Image = `data:${file.mimetype};base64,${fileBuffer.toString('base64')}`;

    // Cloudinary에 업로드
    const result = await cloudinary.uploader.upload(base64Image, {
      folder: 'theonmil-bakery/products',
      public_id: `product_${Date.now()}`,
      transformation: [
        { quality: 'auto:best' },
        { fetch_format: 'auto' }
      ]
    });

    console.log('✅ Cloudinary 업로드 성공:', result.public_id);

    // 임시 파일 삭제
    fs.unlinkSync(file.filepath);

    return res.status(200).json({
      success: true,
      message: '이미지 업로드 성공',
      data: {
        public_id: result.public_id,
        secure_url: result.secure_url,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes
      }
    });

  } catch (error) {
    console.error('❌ 이미지 업로드 실패:', error);
    return res.status(500).json({
      error: '이미지 업로드에 실패했습니다.',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
