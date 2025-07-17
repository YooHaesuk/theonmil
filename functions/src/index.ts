import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as cors from 'cors';

// Firebase Admin 초기화
admin.initializeApp();

// CORS 설정
const corsHandler = cors({ origin: true });

// 네이버 사용자 정보 인터페이스
interface NaverUserInfo {
  id: string;
  email: string;
  name: string;
  nickname?: string;
  profile_image?: string;
  mobile?: string;
  gender?: string;
  age?: string;
  birthday?: string;
}

// 네이버 로그인용 Custom Token 생성
export const createNaverCustomToken = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    try {
      // POST 요청만 허용
      if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
      }

      const { accessToken } = req.body;

      if (!accessToken) {
        res.status(400).json({ error: 'Access token is required' });
        return;
      }

      // 네이버 사용자 정보 API 호출
      const naverResponse = await fetch('https://openapi.naver.com/v1/nid/me', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (!naverResponse.ok) {
        throw new Error('Failed to fetch Naver user info');
      }

      const naverData = await naverResponse.json();
      const userInfo: NaverUserInfo = naverData.response;

      console.log('🔍 네이버 사용자 정보:', userInfo);

      // Firebase Custom Token 생성
      const uid = `naver_${userInfo.id}`;
      const customToken = await admin.auth().createCustomToken(uid, {
        provider: 'naver',
        email: userInfo.email,
        name: userInfo.name,
        nickname: userInfo.nickname,
        profile_image: userInfo.profile_image,
        mobile: userInfo.mobile,
        gender: userInfo.gender,
        age: userInfo.age,
        birthday: userInfo.birthday
      });

      console.log('✅ Custom Token 생성 성공:', uid);

      // Firestore에 사용자 정보 저장
      await admin.firestore().collection('users').doc(uid).set({
        uid,
        provider: 'naver',
        email: userInfo.email,
        displayName: userInfo.name,
        nickname: userInfo.nickname,
        photoURL: userInfo.profile_image,
        phoneNumber: userInfo.mobile,
        gender: userInfo.gender,
        age: userInfo.age,
        birthday: userInfo.birthday,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        lastLoginAt: admin.firestore.FieldValue.serverTimestamp()
      }, { merge: true });

      console.log('✅ Firestore 사용자 정보 저장 완료:', uid);

      res.json({
        success: true,
        customToken,
        userInfo: {
          uid,
          email: userInfo.email,
          displayName: userInfo.name,
          photoURL: userInfo.profile_image
        }
      });

    } catch (error) {
      console.error('❌ Custom Token 생성 실패:', error);
      res.status(500).json({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
});

// Google/카카오 사용자 Firestore 저장
export const saveUserToFirestore = functions.auth.user().onCreate(async (user) => {
  try {
    const { uid, email, displayName, photoURL, providerData } = user;
    
    // 네이버 사용자는 이미 Custom Token에서 처리됨
    if (uid.startsWith('naver_')) {
      return;
    }

    const provider = providerData[0]?.providerId || 'unknown';
    
    await admin.firestore().collection('users').doc(uid).set({
      uid,
      provider,
      email,
      displayName,
      photoURL,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      lastLoginAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    console.log('✅ Firebase Auth 사용자 Firestore 저장 완료:', uid, provider);
    
  } catch (error) {
    console.error('❌ Firestore 저장 실패:', error);
  }
});
