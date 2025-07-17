// Naver 로그인 유틸리티
import { signInWithCustomToken } from 'firebase/auth';
import { auth } from './firebase';

// Naver Login SDK 타입 정의
declare global {
  interface Window {
    naver_id_login: any;
  }
}

interface NaverUser {
  id: string;
  email: string;
  name: string;
  profile_image?: string;
}

// Naver 로그인 초기화
export const initNaverLogin = () => {
  if (typeof window === 'undefined' || !window.naver_id_login) {
    console.error('Naver Login SDK not loaded');
    return null;
  }

  const naverLogin = new window.naver_id_login(
    import.meta.env.VITE_NAVER_CLIENT_ID || 'lGJhDS4RHiIa2Kxpp9rE',
    'http://localhost:5000/auth/naver/callback'
  );

  // 초기화
  naverLogin.init();

  return naverLogin;
};

// Naver 로그인 실행 (팝업 방식)
export const signInWithNaver = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      // 상태값 생성 및 저장 (CSRF 방지)
      const state = Math.random().toString(36).substring(2, 15);
      localStorage.setItem('naver_oauth_state', state);

      // 네이버 OAuth URL 생성 (로컬 개발용)
      const clientId = import.meta.env.VITE_NAVER_CLIENT_ID || 'lGJhDS4RHiIa2Kxpp9rE';
      const naverAuthUrl = `https://nid.naver.com/oauth2.0/authorize?` +
        `response_type=code&` +
        `client_id=${clientId}&` +
        `redirect_uri=${encodeURIComponent('http://localhost:5000/auth/naver/callback')}&` +
        `state=${state}`;

      console.log('🚀 네이버 팝업 로그인 시작');

      // 팝업 창으로 네이버 로그인 열기
      const popup = window.open(
        naverAuthUrl,
        'naverLogin',
        'width=500,height=600,scrollbars=yes,resizable=yes'
      );

      if (!popup) {
        reject(new Error('팝업이 차단되었습니다. 팝업 차단을 해제해주세요.'));
        return;
      }

      // 팝업 창 모니터링
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          console.log('✅ 네이버 팝업 창이 닫혔습니다');
          resolve();
        }
      }, 1000);

      // 타임아웃 설정 (30초)
      setTimeout(() => {
        clearInterval(checkClosed);
        if (popup && !popup.closed) {
          popup.close();
        }
        reject(new Error('네이버 로그인 시간 초과'));
      }, 30000);

    } catch (error) {
      console.error('❌ 네이버 팝업 로그인 오류:', error);
      reject(error);
    }
  });
};

// Firebase Custom Token 생성 (서버 API 호출)
const createFirebaseCustomToken = async (naverUser: NaverUser): Promise<string> => {
  try {
    const response = await fetch('/api/auth/naver/custom-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(naverUser),
    });

    if (!response.ok) {
      throw new Error('Failed to create custom token');
    }

    const data = await response.json();
    return data.customToken;
  } catch (error) {
    console.error('Error creating custom token:', error);
    throw error;
  }
};

// 네이버 사용자 정보 가져오기 (Custom Token용)
export const getNaverUserInfo = async (): Promise<any> => {
  return new Promise((resolve, reject) => {
    try {
      // localStorage에서 네이버 사용자 정보 확인
      const naverUserData = localStorage.getItem('naver_user');
      if (naverUserData) {
        const userData = JSON.parse(naverUserData);
        console.log('✅ 네이버 사용자 정보 획득:', userData.email);
        resolve(userData);
      } else {
        console.log('❌ 네이버 사용자 정보가 없습니다');
        reject(new Error('네이버 사용자 정보가 없습니다'));
      }
    } catch (error) {
      console.error('❌ 네이버 사용자 정보 가져오기 실패:', error);
      reject(error);
    }
  });
};

// Naver 로그아웃
export const signOutFromNaver = () => {
  const naverLogin = initNaverLogin();
  if (naverLogin) {
    naverLogin.logout();
  }
};
