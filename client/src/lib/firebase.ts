// Firebase 설정 및 초기화
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, OAuthProvider, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

// Firebase 설정 객체
const firebaseConfig = {
  apiKey: "AIzaSyCDhoEJbHI4CdFFvVHtegHwSubymriIpec",
  authDomain: "theonmil-bakery.firebaseapp.com",
  projectId: "theonmil-bakery",
  storageBucket: "theonmil-bakery.firebasestorage.app",
  messagingSenderId: "927000673488",
  appId: "1:927000673488:web:727ed5d118a3215ccbf2d5"
};

// 개발 환경에서는 호스팅 관련 오류 무시
if (typeof window !== 'undefined') {
  // Firebase 호스팅 관련 오류 방지
  window.addEventListener('error', (e) => {
    if (e.message && e.message.includes('firebase/init.json')) {
      e.preventDefault();
      console.log('🚫 Firebase hosting error ignored (development mode)');
    }
  });
}

// 프로젝트 ID 확인 로그
console.log('🔥 Firebase Project ID:', firebaseConfig.projectId);

// Firebase 앱 초기화
const app = initializeApp(firebaseConfig);

// Firebase Auth 초기화
export const auth = getAuth(app);

// Firebase Firestore 초기화
export const db = getFirestore(app);

// 데이터베이스 정보 확인
console.log('🗄️ Firestore Database Info:', {
  app: app.name,
  projectId: app.options.projectId,
  databaseId: '(default)' // 기본 데이터베이스 사용
});

// Firestore 오프라인 지속성 비활성화 (개발 환경)
if (import.meta.env.DEV) {
  try {
    // 개발 환경에서는 오프라인 지속성을 비활성화하여 연결 문제 방지
    import('firebase/firestore').then(({ disableNetwork, enableNetwork }) => {
      // 네트워크 재연결 시도
      enableNetwork(db).catch(() => {
        console.log('Firestore network enable failed, continuing...');
      });
    });
  } catch (error) {
    console.log('Firestore network configuration failed:', error);
  }
}

// 개발 환경에서 에뮬레이터 연결 (선택사항)
if (import.meta.env.DEV && import.meta.env.VITE_USE_FIREBASE_EMULATOR === 'true') {
  try {
    connectAuthEmulator(auth, 'http://localhost:9099');
    connectFirestoreEmulator(db, 'localhost', 8080);
  } catch (error) {
    console.log('Firebase emulator already connected');
  }
}

// 소셜 로그인 프로바이더 설정
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('email');
googleProvider.addScope('profile');

// Kakao OAuth 프로바이더 (커스텀)
export const kakaoProvider = new OAuthProvider('kakao.com');

// Naver OIDC 프로바이더 (Firebase OIDC 방식)
export const naverProvider = new OAuthProvider('oidc.naver');
// 네이버 OIDC 스코프는 Firebase Console 또는 네이버 개발자센터에서 설정

// Firebase Auth 설정
auth.languageCode = 'ko';

export default app;
