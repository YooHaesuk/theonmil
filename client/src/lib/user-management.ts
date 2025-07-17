// 통합 사용자 관리 시스템
import { doc, setDoc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from './firebase';

// 사용자 데이터 인터페이스
export interface UserData {
  uid: string;
  name: string;
  email: string;
  provider: 'google' | 'naver' | 'kakao';
  profileImage?: string;
  createdAt: Date;
  lastLoginAt: Date;
  isActive: boolean;
  isAdmin?: boolean;
}

// 사용자 생성 또는 업데이트
export const createOrUpdateUser = async (userData: Omit<UserData, 'createdAt' | 'isActive'>) => {
  try {
    console.log('🔥🔥🔥 createOrUpdateUser 함수 시작!');
    console.log('👤 사용자 생성/업데이트 시작:', userData);
    console.log('🗄️ Firestore DB 객체:', db);

    const userRef = doc(db, 'users', userData.uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      // 기존 사용자 업데이트 (마지막 로그인 시간만)
      await updateDoc(userRef, {
        lastLoginAt: Timestamp.now(),
        name: userData.name, // 이름이 변경될 수 있으므로 업데이트
        profileImage: userData.profileImage || null
      });
      console.log('✅ 기존 사용자 업데이트 완료:', userData.uid);
    } else {
      // 새 사용자 생성 (merge: true 옵션으로 충돌 방지)
      const newUserData = {
        ...userData,
        createdAt: Timestamp.now(),
        lastLoginAt: Timestamp.now(),
        isActive: true,
        isAdmin: false
      };
      await setDoc(userRef, newUserData, { merge: true });
      console.log('✅ 새 사용자 생성 완료:', userData.uid);
    }

    return userRef;
  } catch (error) {
    console.error('❌ 사용자 생성/업데이트 실패:', error);
    console.error('❌ 오류 상세:', error);

    // 특정 오류에 대한 추가 정보
    if (error instanceof Error) {
      console.error('❌ 오류 메시지:', error.message);
      if (error.message.includes('Target ID already exists')) {
        console.log('🔄 중복 ID 오류 - 업데이트로 재시도...');
        // 중복 오류 시 업데이트로 재시도
        try {
          const userRef = doc(db, 'users', userData.uid);
          await updateDoc(userRef, {
            lastLoginAt: Timestamp.now(),
            name: userData.name,
            profileImage: userData.profileImage || null
          });
          console.log('✅ 재시도 업데이트 성공:', userData.uid);
          return userRef;
        } catch (retryError) {
          console.error('❌ 재시도도 실패:', retryError);
        }
      }
    }

    throw error;
  }
};

// 사용자 조회
export const getUser = async (uid: string) => {
  try {
    const userRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      return userDoc.data() as UserData;
    }
    return null;
  } catch (error) {
    console.error('❌ 사용자 조회 실패:', error);
    return null;
  }
};

// Google 사용자를 Firestore에 저장
export const saveGoogleUser = async (firebaseUser: any) => {
  try {
    const userData = {
      uid: firebaseUser.uid,
      name: firebaseUser.displayName || '이름 없음',
      email: firebaseUser.email || '',
      provider: 'google' as const,
      profileImage: firebaseUser.photoURL || '',
      lastLoginAt: new Date()
    };
    
    await createOrUpdateUser(userData);
    return userData;
  } catch (error) {
    console.error('❌ Google 사용자 저장 실패:', error);
    throw error;
  }
};

// 네이버 사용자를 Firestore에 저장
export const saveNaverUser = async (naverUserInfo: any) => {
  try {
    console.log('🔥🔥🔥 saveNaverUser 함수 시작!');
    console.log('📥 입력된 네이버 사용자 정보:', naverUserInfo);

    // 네이버 사용자 UID 사용 (이미 naver_ 접두사 포함)
    const uid = naverUserInfo.uid || `naver_${naverUserInfo.id}`;
    console.log('🆔 사용할 UID:', uid);

    // 기존 사용자 확인
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      // 기존 사용자 - Google과 동일한 업데이트 로직
      const existingData = userSnap.data();
      const updatedData = {
        name: naverUserInfo.displayName || naverUserInfo.name || '이름 없음',
        profileImage: naverUserInfo.photoURL || naverUserInfo.profile_image || '',
        lastLogin: Timestamp.now(),
        lastLoginAt: Timestamp.now(), // 네이버 호환성
        loginCount: (existingData.loginCount || 0) + 1,
        updatedAt: Timestamp.now(),
        isActive: true
      };

      await updateDoc(userRef, updatedData);
      console.log('✅ 기존 네이버 사용자 업데이트 완료');

      return {
        ...existingData,
        ...updatedData,
        uid
      };
    } else {
      // 신규 사용자 - Google과 동일한 생성 로직
      const userData = {
        uid: uid,
        name: naverUserInfo.displayName || naverUserInfo.name || '이름 없음',
        email: naverUserInfo.email || '',
        provider: 'naver' as const,
        profileImage: naverUserInfo.photoURL || naverUserInfo.profile_image || '',
        isAdmin: false,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        lastLogin: Timestamp.now(),
        lastLoginAt: Timestamp.now(), // 네이버 호환성
        loginCount: 1,
        isActive: true
      };

      await setDoc(userRef, userData);
      console.log('✅ 신규 네이버 사용자 생성 완료');

      return userData;
    }

    console.log('📦 Firestore에 저장할 데이터:', userData);
    console.log('📞 createOrUpdateUser 함수 호출 중...');

    const result = await createOrUpdateUser(userData);
    console.log('✅ createOrUpdateUser 결과:', result);
    console.log('✅ saveNaverUser 완료!');

    return userData;
  } catch (error) {
    console.error('❌ saveNaverUser 함수에서 오류 발생:', error);
    console.error('❌ 오류 상세:', error);
    throw error;
  }
};

// 사용자 삭제 (비활성화)
export const deactivateUser = async (uid: string) => {
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      isActive: false,
      deactivatedAt: Timestamp.now()
    });
    console.log('✅ 사용자 비활성화 완료:', uid);
  } catch (error) {
    console.error('❌ 사용자 비활성화 실패:', error);
    throw error;
  }
};
