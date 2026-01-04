// Firebase OIDC를 사용한 네이버 인증
import {
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  linkWithPopup,
  reauthenticateWithPopup,
  OAuthProvider,
  User as FirebaseUser
} from 'firebase/auth';
import { auth } from './firebase';
import { saveNaverUser } from './user-management';

// 네이버 OIDC 프로바이더 설정
export const createNaverOIDCProvider = () => {
  // Firebase Console에서 설정한 OIDC 프로바이더 ID 사용
  const provider = new OAuthProvider('oidc.naver');

  // 네이버 OIDC는 스코프를 Firebase Console에서 설정하거나
  // 네이버 개발자센터에서 '필수 동의' 항목으로 설정해야 함
  // 클라이언트 코드에서는 스코프를 추가하지 않음

  // 커스텀 파라미터 설정 (필요시)
  provider.setCustomParameters({
    // 네이버 특정 파라미터가 있다면 여기에 추가
  });

  return provider;
};

// 팝업 방식으로 네이버 로그인
export const signInWithNaverPopup = async (): Promise<FirebaseUser> => {
  try {
    console.log('🚀 네이버 OIDC 팝업 로그인 시작');

    const provider = createNaverOIDCProvider();
    const result = await signInWithPopup(auth, provider);

    console.log('✅ 네이버 OIDC 로그인 성공:', result.user.email);

    // 사용자 정보를 Firestore에 저장
    await saveNaverUser(result.user);

    // OIDC 크리덴셜에서 추가 정보 가져오기
    const credential = OAuthProvider.credentialFromResult(result);
    if (credential) {
      console.log('📋 네이버 OIDC 크리덴셜 정보:', {
        accessToken: credential.accessToken,
        idToken: credential.idToken
      });
    }

    return result.user;
  } catch (error) {
    console.error('❌ 네이버 OIDC 팝업 로그인 실패:', error);
    throw error;
  }
};

// 리다이렉트 방식으로 네이버 로그인
export const signInWithNaverRedirect = async (): Promise<void> => {
  try {
    console.log('🚀 네이버 OIDC 리다이렉트 로그인 시작');

    const provider = createNaverOIDCProvider();
    await signInWithRedirect(auth, provider);
  } catch (error) {
    console.error('❌ 네이버 OIDC 리다이렉트 로그인 실패:', error);
    throw error;
  }
};

// 리다이렉트 결과 처리
export const handleNaverRedirectResult = async (): Promise<FirebaseUser | null> => {
  try {
    console.log('🔍 네이버 OIDC 리다이렉트 결과 확인');

    const result = await getRedirectResult(auth);

    if (result) {
      console.log('✅ 네이버 OIDC 리다이렉트 로그인 성공:', result.user.email);

      // 사용자 정보를 Firestore에 저장
      await saveNaverUser(result.user);

      // OIDC 크리덴셜에서 추가 정보 가져오기
      const credential = OAuthProvider.credentialFromResult(result);
      if (credential) {
        console.log('📋 네이버 OIDC 크리덴셜 정보:', {
          accessToken: credential.accessToken,
          idToken: credential.idToken
        });
      }

      return result.user;
    }

    return null;
  } catch (error) {
    console.error('❌ 네이버 OIDC 리다이렉트 결과 처리 실패:', error);
    throw error;
  }
};

// 기존 사용자에 네이버 계정 연결
export const linkWithNaverAccount = async (user: FirebaseUser): Promise<FirebaseUser> => {
  try {
    console.log('🔗 네이버 계정 연결 시작');

    const provider = createNaverOIDCProvider();
    const result = await linkWithPopup(user, provider);

    console.log('✅ 네이버 계정 연결 성공');

    return result.user;
  } catch (error) {
    console.error('❌ 네이버 계정 연결 실패:', error);
    throw error;
  }
};

// 네이버 계정으로 재인증
export const reauthenticateWithNaver = async (user: FirebaseUser): Promise<FirebaseUser> => {
  try {
    console.log('🔄 네이버 계정 재인증 시작');

    const provider = createNaverOIDCProvider();
    const result = await reauthenticateWithPopup(user, provider);

    console.log('✅ 네이버 계정 재인증 성공');

    return result.user;
  } catch (error) {
    console.error('❌ 네이버 계정 재인증 실패:', error);
    throw error;
  }
};

// 네이버 OIDC 에러 처리 헬퍼
export const handleNaverOIDCError = (error: any): string => {
  console.error('네이버 OIDC 에러:', error);

  if (error.code) {
    switch (error.code) {
      case 'auth/popup-closed-by-user':
        return '로그인 팝업이 사용자에 의해 닫혔습니다.';
      case 'auth/popup-blocked':
        return '팝업이 차단되었습니다. 팝업 차단을 해제해주세요.';
      case 'auth/cancelled-popup-request':
        return '로그인 요청이 취소되었습니다.';
      case 'auth/account-exists-with-different-credential':
        return '이미 다른 로그인 방법으로 가입된 이메일입니다.';
      case 'auth/credential-already-in-use':
        return '이미 사용 중인 계정입니다.';
      case 'auth/operation-not-allowed':
        return '네이버 로그인이 활성화되지 않았습니다.';
      case 'auth/invalid-credential':
        return '잘못된 인증 정보입니다.';
      default:
        return error.message || '네이버 로그인 중 오류가 발생했습니다.';
    }
  }

  return error.message || '알 수 없는 오류가 발생했습니다.';
};
