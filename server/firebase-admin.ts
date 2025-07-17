// 환경변수 먼저 로드 (Firebase Admin 초기화 전에!)
import dotenv from 'dotenv';
dotenv.config();

// 환경변수 먼저 로드 (Firebase Admin 초기화 전에!)
import dotenv from 'dotenv';
dotenv.config();

// Firebase Admin SDK 설정
import admin from 'firebase-admin';

let isAdminInitialized = false;

// Firebase Admin 초기화 (환경변수 기반)
const initializeFirebaseAdmin = () => {
  try {
    if ((admin.apps && admin.apps.length > 0) || isAdminInitialized) {
      return;
    }
  } catch (e) {
    // admin.apps가 undefined일 수 있음
  }

  try {
    // 환경변수 디버깅
    console.log('🔍 Firebase Admin 환경변수 확인:');
    console.log('- FIREBASE_PROJECT_ID:', process.env.FIREBASE_PROJECT_ID ? '✅ 설정됨' : '❌ 없음');
    console.log('- FIREBASE_PRIVATE_KEY:', process.env.FIREBASE_PRIVATE_KEY ? '✅ 설정됨' : '❌ 없음');
    console.log('- FIREBASE_CLIENT_EMAIL:', process.env.FIREBASE_CLIENT_EMAIL ? '✅ 설정됨' : '❌ 없음');

    // 서비스 계정 키가 있는지 확인
    if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
      const serviceAccount = {
        type: "service_account",
        project_id: process.env.FIREBASE_PROJECT_ID,
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
        projectId: process.env.FIREBASE_PROJECT_ID,
      });

      console.log('Firebase Admin initialized successfully');
      isAdminInitialized = true;
    } else {
      console.log('Firebase Admin service account not configured - running in development mode');
    }
  } catch (error) {
    console.error('Firebase Admin initialization error:', error);
    console.log('Running without Firebase Admin features');
  }
};

// Firebase Admin 초기화 시도
initializeFirebaseAdmin();

export const firebaseAdmin = admin;

// Custom Token 생성 함수
export const createCustomToken = async (uid: string, additionalClaims?: object): Promise<string> => {
  try {
    // Firebase Admin이 초기화되지 않은 경우 개발 모드용 더미 토큰 반환
    if (!isAdminInitialized || !admin.apps || admin.apps.length === 0) {
      console.log('Firebase Admin not available - returning development token');
      // 개발 환경에서는 더미 토큰 반환 (실제로는 작동하지 않음)
      return `dev-token-${uid}-${Date.now()}`;
    }

    // 사용자 레코드 생성 또는 업데이트 (provider 정보 포함)
    if (additionalClaims && typeof additionalClaims === 'object') {
      const claims = additionalClaims as any;

      try {
        // 방법 1: importUsers API로 강제 provider 설정
        const userImportRecord = {
          uid: uid,
          email: claims.email,
          displayName: claims.name,
          photoURL: claims.profileImage,
          emailVerified: true,
          providerData: [{
            uid: claims.providerId || claims.email,
            email: claims.email,
            displayName: claims.name,
            photoURL: claims.profileImage,
            providerId: 'naver.com'
          }]
        };

        await admin.auth().importUsers([userImportRecord], {
          hash: {
            algorithm: 'STANDARD_SCRYPT' as any,
            key: Buffer.from(''),
            saltSeparator: Buffer.from(''),
            rounds: 8,
            memoryCost: 14
          }
        });
        console.log('✅ importUsers로 네이버 사용자 생성/업데이트:', uid);

      } catch (importError) {
        console.log('⚠️ importUsers 실패, 일반 방식으로 시도:', importError.message);

        try {
          const userRecord = await admin.auth().getUser(uid);
          console.log('✅ 기존 사용자 레코드 확인:', uid);

          // 기존 사용자 업데이트
          await admin.auth().updateUser(uid, {
            email: claims.email,
            displayName: claims.name,
            photoURL: claims.profileImage,
            emailVerified: true
          });
          console.log('✅ 기존 사용자 레코드 업데이트:', uid);

        } catch (error) {
          // 사용자가 없으면 생성
          await admin.auth().createUser({
            uid: uid,
            email: claims.email,
            displayName: claims.name,
            photoURL: claims.profileImage,
            emailVerified: true
          });
          console.log('✅ 새 사용자 레코드 생성:', uid);
        }
      }
    }

    const customToken = await admin.auth().createCustomToken(uid, additionalClaims);
    return customToken;
  } catch (error) {
    console.error('Error creating custom token:', error);
    throw error;
  }
};

// 사용자 정보 Firestore에 저장
export const saveUserToFirestore = async (uid: string, userData: any) => {
  try {
    if (!isAdminInitialized || !admin.apps || admin.apps.length === 0) {
      console.log('Firebase Admin not available - skipping Firestore save');
      return true; // 개발 환경에서는 성공으로 처리
    }

    const db = admin.firestore();
    const userRef = db.collection('users').doc(uid);

    // 기존 사용자 확인
    const userDoc = await userRef.get();

    if (userDoc.exists) {
      // 기존 사용자 - 로그인 정보 업데이트
      await userRef.update({
        lastLogin: admin.firestore.FieldValue.serverTimestamp(),
        loginCount: admin.firestore.FieldValue.increment(1),
        name: userData.name,
        profileImage: userData.profileImage || ''
      });
    } else {
      // 신규 사용자 - 새로 생성
      await userRef.set({
        email: userData.email,
        name: userData.name,
        provider: userData.provider,
        providerId: userData.providerId,
        profileImage: userData.profileImage || '',
        isAdmin: userData.email === process.env.ADMIN_EMAIL,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        lastLogin: admin.firestore.FieldValue.serverTimestamp(),
        loginCount: 1
      });
    }

    return true;
  } catch (error) {
    console.error('Error saving user to Firestore:', error);
    return false;
  }
};
