import { VercelRequest, VercelResponse } from '@vercel/node';
import admin from 'firebase-admin';

// Firebase Admin 초기화 (Vercel 환경용)
if (!admin.apps.length) {
  try {
    // Vercel 환경변수에서 Firebase 설정 읽기
    const serviceAccount = {
      type: "service_account",
      project_id: process.env.FIREBASE_PROJECT_ID || "theonmil-bakery",
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.FIREBASE_CLIENT_EMAIL}`
    };

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: process.env.FIREBASE_PROJECT_ID || "theonmil-bakery",
    });

    console.log('✅ Firebase Admin initialized in Vercel');
  } catch (error) {
    console.error('❌ Firebase Admin initialization failed:', error);
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // OPTIONS 요청 처리 (CORS preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const db = admin.firestore();

    if (req.method === 'GET') {
      // 상품 목록 조회
      console.log('🔥 Vercel API: 상품 목록 조회 시작');
      const productsRef = db.collection('products');
      const snapshot = await productsRef.orderBy('createdAt', 'desc').get();

      const products: any[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        products.push({
          id: doc.id,
          ...data,
          // Timestamp를 문자열로 변환
          createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
          updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt
        });
      });

      console.log('✅ Vercel API: 상품 목록 조회 성공:', products.length, '개');
      return res.status(200).json(products);

    } else if (req.method === 'POST') {
      // 상품 등록
      const { name, nameKorean, description, price, category, tags, image, images, detailImage, detailContent } = req.body;

      // 필수 필드 검증
      if (!nameKorean || !description || !price || !image) {
        return res.status(400).json({
          error: "필수 필드가 누락되었습니다.",
          required: ["nameKorean", "description", "price", "image"]
        });
      }

      console.log('📦 Vercel API: 상품 등록 요청:', {
        name,
        nameKorean,
        description,
        price,
        category,
        tags: Array.isArray(tags) ? tags : [],
        image,
        detailContent: detailContent ? `${detailContent.substring(0, 100)}...` : '없음'
      });

      // Firestore에 상품 저장
      const productData = {
        name: name || nameKorean, // name이 없으면 nameKorean 사용
        nameKorean,
        description,
        price: parseFloat(price),
        category: category || 'bread',
        tags: Array.isArray(tags) ? tags : [],
        image,
        images: Array.isArray(images) ? images : [],
        detailImage: detailImage || '',
        detailContent: detailContent || '',
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true
      };

      const docRef = await db.collection('products').add(productData);
      console.log('✅ Vercel API: 상품 등록 성공:', docRef.id);

      return res.status(201).json({
        success: true,
        message: '상품이 성공적으로 등록되었습니다.',
        productId: docRef.id,
        data: {
          id: docRef.id,
          ...productData,
          createdAt: productData.createdAt.toISOString(),
          updatedAt: productData.updatedAt.toISOString()
        }
      });

    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }

  } catch (error) {
    console.error('❌ Vercel API: 상품 처리 실패:', error);
    return res.status(500).json({ 
      error: "상품 처리에 실패했습니다.",
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
