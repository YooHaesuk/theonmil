import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertReviewSchema, type InsertUser, type InsertReview } from "@shared/schema";
import { createCustomToken, saveUserToFirestore } from "./firebase-admin";
import { checkCloudinaryConfig, uploadImage, deleteImage, getImageUrl } from "./cloudinary";
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import multer from 'multer';
import nodemailer from 'nodemailer';

export function registerRoutes(app: Express): Server {
  // Cloudinary 설정 확인
  checkCloudinaryConfig();

  // Multer 설정 (메모리 저장)
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB 제한
    },
    fileFilter: (req, file, cb) => {
      // 이미지 파일만 허용
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('이미지 파일만 업로드 가능합니다.'));
      }
    }
  });
  // 관리자 권한 체크 미들웨어 (Firebase Auth 기반)
  const requireAdmin = async (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No authorization token provided' });
    }

    try {
      // Firebase Admin SDK를 사용하여 토큰 검증 (추후 구현)
      // 현재는 클라이언트에서 Firebase Auth 상태를 직접 관리
      next();
    } catch (error) {
      return res.status(403).json({ error: 'Invalid token' });
    }
  };

  // Firebase Auth 상태 확인 API
  app.get("/api/auth/status", (req, res) => {
    res.json({
      message: "Firebase Auth를 사용합니다. 클라이언트에서 직접 인증 상태를 확인하세요.",
      authProvider: "firebase"
    });
  });

  // Naver Custom Token 생성 API
  app.post("/api/auth/naver/custom-token", async (req, res) => {
    try {
      const { id, email, name, profileImage } = req.body;

      if (!id || !email || !name) {
        return res.status(400).json({ error: 'Missing required user information' });
      }

      console.log('🎫 네이버 Custom Token 생성 요청:', { id, email, name });

      // Firebase Custom Token 생성 (실제 Firebase Admin SDK 사용)
      const uid = `naver_${id}`;
      const customToken = await createCustomToken(uid, {
        provider: 'naver',
        providerId: id,
        email,
        name,
        profileImage,
        // 안전한 custom claims만 포함 (예약된 키워드 제외)
        naver_provider: true,
        login_method: 'naver_oauth'
      });

      console.log('✅ Firebase Custom Token 생성 성공:', uid);

      // Firestore에 사용자 정보 저장
      await saveUserToFirestore(uid, {
        email,
        name,
        provider: 'naver',
        providerId: id,
        profileImage
      });

      console.log('💾 Firestore 사용자 정보 저장 완료:', uid);

      res.json({ customToken });
    } catch (error) {
      console.error('❌ Custom token creation error:', error);
      res.status(500).json({ error: 'Failed to create custom token' });
    }
  });

  // 관리자 API (Firebase Auth 기반)
  app.get("/api/admin/users", async (req, res) => {
    try {
      // 클라이언트에서 Firebase Auth로 관리자 권한 확인 후 요청
      // Firestore에서 직접 사용자 목록 조회하도록 안내
      res.json({
        message: "Firebase Firestore에서 직접 사용자 데이터를 조회하세요.",
        collection: "users"
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  });

  app.get("/api/admin/stats", async (req, res) => {
    try {
      res.json({
        message: "Firebase Firestore에서 직접 통계 데이터를 조회하세요.",
        collections: ["users", "admin_logs"]
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      res.status(500).json({ error: 'Failed to fetch stats' });
    }
  });

  // 네이버 OAuth 콜백 처리
  app.post("/api/auth/naver/callback", async (req, res) => {
    try {
      const { code, state } = req.body;

      if (!code) {
        return res.status(400).json({ error: 'Authorization code is required' });
      }

      // 네이버 액세스 토큰 요청
      const tokenResponse = await fetch('https://nid.naver.com/oauth2.0/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: process.env.NAVER_CLIENT_ID || '',
          client_secret: process.env.NAVER_CLIENT_SECRET || '',
          code: code,
          state: state || '',
        }),
      });

      const tokenData = await tokenResponse.json();

      if (!tokenData.access_token) {
        return res.status(400).json({ error: 'Failed to get access token from Naver' });
      }

      // 네이버 사용자 정보 요청
      const userResponse = await fetch('https://openapi.naver.com/v1/nid/me', {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
        },
      });

      const userData = await userResponse.json();

      if (userData.resultcode !== '00') {
        return res.status(400).json({ error: 'Failed to get user info from Naver' });
      }

      const naverUser = userData.response;

      // 사용자 정보 반환
      res.json({
        user: {
          id: naverUser.id,
          email: naverUser.email,
          name: naverUser.name,
          profileImage: naverUser.profile_image,
          provider: 'naver'
        }
      });

    } catch (error) {
      console.error('Naver OAuth callback error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });



  // API Routes - prefix all with /api

  // User routes
  app.post("/api/users/register", async (req, res) => {
    try {
      const parsedData = insertUserSchema.parse(req.body);
      const user = await storage.insertUser(parsedData as InsertUser);
      res.json(user);
    } catch (error: any) {
      if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
        res.status(400).json({ error: "User already exists" });
      } else {
        res.status(500).json({ error: "Failed to create user" });
      }
    }
  });

  app.get("/api/users", async (req, res) => {
    try {
      const users = await storage.getUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  // Review routes
  app.post("/api/reviews", async (req, res) => {
    try {
      const parsedData = insertReviewSchema.parse(req.body);
      const review = await storage.insertReview(parsedData as InsertReview);
      res.json(review);
    } catch (error) {
      res.status(500).json({ error: "Failed to create review" });
    }
  });

  app.get("/api/reviews", async (req, res) => {
    try {
      const reviews = await storage.getReviews();
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch reviews" });
    }
  });

  // Product routes
  app.get("/api/products", async (req, res) => {
    try {
      console.log('🔥 Firestore: 상품 목록 조회 시작');
      const db = getFirestore();
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

      console.log('✅ Firestore: 상품 목록 조회 성공:', products.length, '개');
      res.json(products);
    } catch (error) {
      console.error('❌ Firestore: 상품 목록 조회 실패:', error);
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(parseInt(req.params.id));
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  // 🆕 상품 등록 API
  app.post("/api/products", async (req, res) => {
    try {
      const { name, nameKorean, description, price, category, tags, image, images, detailImage, detailContent } = req.body;

      // 필수 필드 검증
      if (!nameKorean || !description || !price || !image) {
        return res.status(400).json({
          error: "필수 필드가 누락되었습니다.",
          required: ["nameKorean", "description", "price", "image"]
        });
      }

      console.log('📦 상품 등록 요청:', {
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
      console.log('🔥 Firestore: 상품 등록 시작');
      const db = getFirestore();
      const productsRef = db.collection('products');
      const newProductRef = productsRef.doc(); // 자동 ID 생성

      const now = Timestamp.now();
      const productData = {
        id: newProductRef.id,
        name: name || nameKorean,
        nameKorean,
        description,
        price: Number(price),
        category: category || 'regular',
        tags: Array.isArray(tags) ? tags : (typeof tags === 'string' ? tags.split(',').map(t => t.trim()) : []),
        image,
        images: Array.isArray(images) ? images : [], // 상품 이미지들
        detailImage: detailImage || '',
        detailContent: detailContent || '', // ✅ 상세 콘텐츠 추가
        isBestseller: false,
        isNew: false,
        isPopular: false,
        createdAt: now,
        updatedAt: now
      };

      await newProductRef.set(productData);

      // 응답용 데이터 (Timestamp를 문자열로 변환)
      const product = {
        ...productData,
        createdAt: now.toDate().toISOString(),
        updatedAt: now.toDate().toISOString()
      };

      console.log('✅ Firestore: 상품 등록 성공:', product);

      res.json({
        success: true,
        message: "상품이 성공적으로 등록되었습니다.",
        product
      });

    } catch (error) {
      console.error('❌ 상품 등록 실패:', error);
      res.status(500).json({
        error: "상품 등록에 실패했습니다.",
        message: error instanceof Error ? error.message : "알 수 없는 오류"
      });
    }
  });

  // 🔄 상품 수정 API
  app.put("/api/products/:id", async (req, res) => {
    try {
      const productId = req.params.id; // 문자열 ID 사용
      const { name, nameKorean, description, price, category, tags, image, images, detailImage, detailContent } = req.body;

      console.log('🔄 Firestore: 상품 수정 요청:', { productId, ...req.body });

      // 필수 필드 검증
      if (!nameKorean || !description || !price || !image) {
        return res.status(400).json({
          error: "필수 필드가 누락되었습니다.",
          required: ["nameKorean", "description", "price", "image"]
        });
      }

      // Firestore에서 상품 수정
      const db = getFirestore();
      const productRef = db.collection('products').doc(productId);

      // 상품 존재 확인
      const productSnap = await productRef.get();
      if (!productSnap.exists) {
        return res.status(404).json({
          error: "상품을 찾을 수 없습니다."
        });
      }

      console.log('🔍 detailImage 값 확인:', { detailImage, type: typeof detailImage });
      console.log('🔍 detailContent 값 확인:', { detailContent, type: typeof detailContent });

      const updateData = {
        name: name || nameKorean,
        nameKorean,
        description,
        price: Number(price),
        category: category || 'regular',
        tags: Array.isArray(tags) ? tags : (typeof tags === 'string' ? tags.split(',').map(t => t.trim()) : []),
        image,
        images: Array.isArray(images) ? images : [], // 상품 이미지들
        detailImage: detailImage || '',
        detailContent: detailContent || '', // ✅ 상세 콘텐츠 수정 추가
        updatedAt: Timestamp.now()
      };

      console.log('💾 Firestore: 상품 수정 데이터:', updateData);

      await productRef.update(updateData);

      // 수정된 상품 조회
      const updatedSnap = await productRef.get();
      const updatedProduct = {
        id: updatedSnap.id,
        ...updatedSnap.data(),
        updatedAt: updateData.updatedAt.toDate().toISOString()
      };

      console.log('✅ Firestore: 상품 수정 성공:', updatedProduct);

      res.json({
        success: true,
        message: "상품이 성공적으로 수정되었습니다.",
        product: updatedProduct
      });

    } catch (error) {
      console.error('❌ Firestore: 상품 수정 실패:', error);
      res.status(500).json({
        error: "상품 수정에 실패했습니다.",
        message: error instanceof Error ? error.message : "알 수 없는 오류"
      });
    }
  });

  // Store routes
  app.get("/api/stores", async (req, res) => {
    try {
      const stores = await storage.getStores();
      res.json(stores);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stores" });
    }
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      authProvider: "firebase"
    });
  });

  // 🖼️ 이미지 업로드 API
  app.post("/api/images/upload", upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: '이미지 파일이 필요합니다.' });
      }

      console.log('📤 이미지 업로드 요청:', {
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size
      });

      // 파일을 base64로 변환
      const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

      // Cloudinary에 업로드
      const result = await uploadImage(base64Image, {
        folder: 'theonmil-bakery/products',
        public_id: `product_${Date.now()}`
      });

      res.json({
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
      console.error('❌ 이미지 업로드 API 오류:', error);
      res.status(500).json({
        error: '이미지 업로드 실패',
        message: error instanceof Error ? error.message : '알 수 없는 오류'
      });
    }
  });

  // 🗑️ 이미지 삭제 API
  app.delete("/api/images/:public_id", async (req, res) => {
    try {
      const { public_id } = req.params;

      if (!public_id) {
        return res.status(400).json({ error: 'public_id가 필요합니다.' });
      }

      console.log('🗑️ 이미지 삭제 요청:', public_id);

      const result = await deleteImage(public_id);

      if (result.success) {
        res.json({
          success: true,
          message: '이미지 삭제 성공',
          public_id
        });
      } else {
        res.status(400).json({
          success: false,
          message: '이미지 삭제 실패',
          result: result.result
        });
      }

    } catch (error) {
      console.error('❌ 이미지 삭제 API 오류:', error);
      res.status(500).json({
        error: '이미지 삭제 실패',
        message: error instanceof Error ? error.message : '알 수 없는 오류'
      });
    }
  });

  // 🔗 이미지 URL 생성 API
  app.post("/api/images/url", async (req, res) => {
    try {
      const { public_id, width, height, quality, format } = req.body;

      if (!public_id) {
        return res.status(400).json({ error: 'public_id가 필요합니다.' });
      }

      const url = getImageUrl(public_id, {
        width,
        height,
        quality: quality || 'auto',
        format: format || 'auto'
      });

      if (url) {
        res.json({
          success: true,
          url,
          public_id
        });
      } else {
        res.status(400).json({
          success: false,
          message: 'URL 생성 실패'
        });
      }

    } catch (error) {
      console.error('❌ 이미지 URL 생성 API 오류:', error);
      res.status(500).json({
        error: 'URL 생성 실패',
        message: error instanceof Error ? error.message : '알 수 없는 오류'
      });
    }
  });

  // 📧 SMTP 메일 전송 API
  app.post("/api/send-email", async (req, res) => {
    try {
      const { to, subject, html } = req.body;

      console.log('📧 메일 전송 요청:', { to, subject });
      console.log('🔧 SMTP 설정 확인:', {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS ? '설정됨' : '미설정'
      });

      // Gmail SMTP 설정 - 강화된 설정
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER || 'yhs85844@gmail.com',
          pass: process.env.SMTP_PASS || 'pvmwqkqjtrgctmwn'
        },
        tls: {
          rejectUnauthorized: false
        },
        debug: true, // 디버그 모드 활성화
        logger: true // 로그 활성화
      });

      console.log('📧 Gmail SMTP 설정 완료');

      console.log('🔍 SMTP 연결 테스트 중...');

      // SMTP 연결 테스트
      await transporter.verify();
      console.log('✅ SMTP 연결 성공!');

      // 메일 옵션
      const mailOptions = {
        from: process.env.SMTP_USER || 'yhs85844@gmail.com',
        to: to,
        subject: subject,
        html: html
      };

      console.log('📤 메일 전송 시도 중...');

      // 메일 전송
      const info = await transporter.sendMail(mailOptions);

      console.log('✅ 메일 전송 성공:', info.messageId);

      res.json({
        success: true,
        message: '메일이 성공적으로 전송되었습니다.',
        messageId: info.messageId
      });

    } catch (error) {
      console.error('❌ 메일 전송 실패:', error);
      console.error('❌ 오류 상세:', {
        message: error.message,
        code: error.code,
        command: error.command,
        response: error.response
      });

      res.status(500).json({
        success: false,
        message: '메일 전송에 실패했습니다.',
        error: error.message,
        code: error.code
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
