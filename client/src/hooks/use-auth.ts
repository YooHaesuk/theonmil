import { useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut as firebaseSignOut,
  signInWithCustomToken,
  User as FirebaseUser,
  OAuthProvider
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { signInWithNaver as naverSignIn, getNaverUserInfo } from '@/lib/naver-auth';
import {
  signInWithNaverPopup,
  signInWithNaverRedirect,
  handleNaverRedirectResult,
  handleNaverOIDCError
} from '@/lib/naver-oidc-auth';
import { saveGoogleUser, saveNaverUser } from '@/lib/user-management';

interface User {
  uid: string;
  email: string;
  name: string;
  provider: string;
  image?: string;
  isAdmin?: boolean;
}

interface AuthState {
  user: User | null;
  loading: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true
  });

  // Firebase 사용자를 우리 User 형태로 변환
  const convertFirebaseUser = async (firebaseUser: FirebaseUser): Promise<User | null> => {
    if (!firebaseUser) return null;

    try {
      // 일단 Firebase Auth 정보만 사용 (Firestore 연결 문제 해결 후 활성화)
      const basicUser = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        name: firebaseUser.displayName || '',
        provider: firebaseUser.providerData[0]?.providerId || 'unknown',
        image: firebaseUser.photoURL || '',
        isAdmin: firebaseUser.email === 'yhs85844@gmail.com'
      };

      // 네이버 사용자인지 확인 (UID가 naver_로 시작하는 경우)
      const isNaverUser = firebaseUser.uid.startsWith('naver_');

      if (!isNaverUser) {
        // Google 사용자만 저장 (네이버 사용자는 서버에서 이미 저장됨)
        try {
          console.log('💾 Google 사용자 정보를 Firestore에 저장 중...');
          await saveGoogleUser(firebaseUser);
          console.log('✅ Google 사용자 정보 Firestore 저장 완료');
        } catch (firestoreError) {
          console.log('❌ Firestore 저장 실패, 기본 인증으로 계속 진행:', firestoreError);
        }
      } else {
        console.log('🔍 네이버 사용자 감지 - 서버에서 이미 저장되었으므로 건너뜀');
      }

      return basicUser;
    } catch (error) {
      console.error('Error converting Firebase user:', error);
      return null;
    }
  };

  // Google 로그인 (팝업 방식 - 안정적)
  const signInWithGoogle = async () => {
    try {
      console.log('🚀 Google 로그인 시작 - 팝업 방식');
      const result = await signInWithPopup(auth, googleProvider);
      console.log('✅ Google 로그인 성공:', result.user);

      // Firestore에 사용자 정보 저장
      console.log('💾 Google 사용자 정보를 Firestore에 저장 중...');
      await saveGoogleUser(result.user);
      console.log('✅ Google 사용자 정보 Firestore 저장 완료');

      return result.user;
    } catch (error) {
      console.error('❌ Google sign in error:', error);
      throw error;
    }
  };

  // 네이버 로그인 (Custom Token 방식 - 안정적)
  const handleNaverLogin = async () => {
    return new Promise((resolve, reject) => {
      try {
        console.log('🚀 네이버 로그인 시작 - Custom Token 방식');

        // 네이버 팝업 로그인 시작
        naverSignIn().then(() => {
          console.log('✅ 네이버 SDK 로그인 완료');
        }).catch(reject);

        // 팝업 성공 메시지 리스너 (일회성)
        const handleNaverSuccess = async (event: MessageEvent) => {
          if (event.origin !== window.location.origin) return;

          if (event.data.type === 'NAVER_AUTH_SUCCESS') {
            try {
              window.removeEventListener('message', handleNaverSuccess);

              const naverUser = event.data.user;
              console.log('📋 네이버 사용자 정보 수신:', naverUser.email);

              // localStorage에서 accessToken 가져오기
              const naverUserData = localStorage.getItem('naver_user');
              console.log('🔍 localStorage naver_user:', naverUserData);

              if (!naverUserData) {
                throw new Error('네이버 사용자 데이터를 찾을 수 없습니다');
              }

              const userData = JSON.parse(naverUserData);
              console.log('🔍 파싱된 사용자 데이터:', userData);
              console.log('🔍 accessToken 존재 여부:', !!userData.accessToken);

              if (!userData.accessToken) {
                throw new Error('네이버 accessToken을 찾을 수 없습니다');
              }

              console.log('🎫 네이버 accessToken 확인됨:', userData.accessToken.substring(0, 10) + '...');

              // 서버 Custom Token 생성 및 Firebase Auth 로그인
              console.log('🚀 서버 Custom Token 생성 시작...');

              try {
                const customTokenResponse = await fetch('/api/auth/naver/custom-token', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    id: userData.uid.replace('naver_', ''),
                    email: userData.email,
                    name: userData.name,
                    profileImage: userData.image
                  })
                });

                if (!customTokenResponse.ok) {
                  throw new Error('Custom Token 생성 실패');
                }

                const { customToken } = await customTokenResponse.json();
                console.log('✅ Custom Token 생성 성공');

                // Firebase Auth에 로그인
                const { signInWithCustomToken } = await import('firebase/auth');
                const { auth } = await import('../lib/firebase');

                const userCredential = await signInWithCustomToken(auth, customToken);
                console.log('✅ Firebase Auth 로그인 성공:', userCredential.user.uid);

                // 인증 상태 즉시 업데이트
                setAuthState({
                  user: {
                    uid: userData.uid,
                    email: userData.email,
                    name: userData.name,
                    image: userData.image,
                    provider: 'naver',
                    isAdmin: userData.isAdmin
                  },
                  loading: false
                });

                console.log('✅ 네이버 로그인 완료 (Firebase Auth 방식)');
                resolve(userCredential.user);
                return;

              } catch (customTokenError) {
                console.error('❌ Custom Token 로그인 실패:', customTokenError);
                console.log('⚠️ 대안으로 직접 Firestore 저장 방식 사용');
              }

              // 임시 Firebase User 객체 생성
              const mockFirebaseUser = {
                uid: userData.uid,
                email: userData.email,
                displayName: userData.name,
                photoURL: userData.image,
                emailVerified: true,
                isAnonymous: false,
                providerData: [{
                  providerId: 'naver.com',
                  uid: userData.uid,
                  displayName: userData.name,
                  email: userData.email,
                  photoURL: userData.image
                }],
                metadata: {
                  creationTime: new Date().toISOString(),
                  lastSignInTime: new Date().toISOString()
                }
              };

              console.log('🔥 네이버 사용자 객체 생성:', mockFirebaseUser.email);

              // Firestore에 사용자 정보 저장
              await saveNaverUser(mockFirebaseUser as any, 'naver');
              console.log('💾 네이버 사용자 정보 Firestore 저장 완료');

              // 인증 상태 업데이트
              setAuthState({
                user: {
                  uid: userData.uid,
                  email: userData.email,
                  name: userData.name,
                  image: userData.image,
                  provider: 'naver',
                  isAdmin: userData.isAdmin
                },
                loading: false
              });

              console.log('✅ 네이버 로그인 완료 (Firestore 저장 방식)');
              resolve(mockFirebaseUser as any);

            } catch (error) {
              console.error('❌ 네이버 Custom Token 처리 실패:', error);
              reject(error);
            }
          } else if (event.data.type === 'NAVER_AUTH_ERROR') {
            window.removeEventListener('message', handleNaverSuccess);
            reject(new Error(event.data.error));
          }
        };

        window.addEventListener('message', handleNaverSuccess);

        // 타임아웃 설정 (30초)
        setTimeout(() => {
          window.removeEventListener('message', handleNaverSuccess);
          reject(new Error('네이버 로그인 타임아웃'));
        }, 30000);

      } catch (error) {
        console.error('❌ 네이버 로그인 초기화 실패:', error);
        reject(error);
      }
    });
  };

  // 네이버 로그인 (OIDC 팝업 방식) - 실험적
  const handleNaverLoginOIDC = async () => {
    try {
      console.log('🚀 네이버 OIDC 로그인 시작 - 실험적 방식');

      // Firebase OIDC 팝업 방식으로 네이버 로그인
      const user = await signInWithNaverPopup();

      console.log('✅ 네이버 OIDC 로그인 성공:', user.email);

      return user;
    } catch (error) {
      console.error('❌ 네이버 OIDC 로그인 실패:', error);
      const errorMessage = handleNaverOIDCError(error);
      throw new Error(errorMessage);
    }
  };

  // 네이버 로그인 (리다이렉트 방식) - 대안
  const handleNaverLoginRedirect = async () => {
    try {
      console.log('🚀 네이버 리다이렉트 로그인 시작 - Firebase OIDC 방식');
      await signInWithNaverRedirect();
    } catch (error) {
      console.error('❌ 네이버 OIDC 리다이렉트 로그인 실패:', error);
      const errorMessage = handleNaverOIDCError(error);
      throw new Error(errorMessage);
    }
  };

  // 로그아웃
  const logout = async () => {
    try {
      // Firebase 로그아웃
      await firebaseSignOut(auth);

      // 네이버 로그인 정보 삭제
      localStorage.removeItem('naver_user');

      // 상태 초기화
      setAuthState({ user: null, loading: false });
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  };

  // Firebase Auth 상태 변화 감지
  useEffect(() => {
    // 네이버 로그인 상태 확인
    const checkNaverLogin = () => {
      const naverUser = localStorage.getItem('naver_user');
      if (naverUser) {
        try {
          const userData = JSON.parse(naverUser);
          setAuthState({ user: userData, loading: false });
          return true;
        } catch (error) {
          console.error('네이버 사용자 정보 파싱 오류:', error);
          localStorage.removeItem('naver_user');
        }
      }
      return false;
    };

    // 네이버 OIDC 리다이렉트 결과 처리
    const handleRedirectResult = async () => {
      try {
        const user = await handleNaverRedirectResult();
        if (user) {
          console.log('✅ 네이버 OIDC 리다이렉트 로그인 완료:', user.email);
        }
      } catch (error) {
        console.error('❌ 네이버 OIDC 리다이렉트 결과 처리 실패:', error);
      }
    };

    // 페이지 로드 시 리다이렉트 결과 확인
    handleRedirectResult();

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const user = await convertFirebaseUser(firebaseUser);
        setAuthState({
          user,
          loading: false
        });
      } else {
        // Firebase 사용자가 없는 경우 - 네이버 로그인 확인
        const hasNaverUser = checkNaverLogin();
        if (!hasNaverUser) {
          setAuthState({
            user: null,
            loading: false
          });
        }
      }
    });

    // 초기 로드 시 네이버 로그인 상태 확인
    if (!auth.currentUser) {
      checkNaverLogin();
    }

    // 네이버 팝업 로그인 성공 메시지 리스너
    const handleNaverLoginMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      if (event.data.type === 'NAVER_AUTH_SUCCESS') {
        console.log('✅ 네이버 팝업 로그인 성공 메시지 수신:', event.data.user);
        setAuthState({ user: event.data.user, loading: false });
      } else if (event.data.type === 'NAVER_AUTH_ERROR') {
        console.error('❌ 네이버 팝업 로그인 에러 메시지 수신:', event.data.error);
      }
    };

    window.addEventListener('message', handleNaverLoginMessage);

    return () => {
      unsubscribe();
      window.removeEventListener('message', handleNaverLoginMessage);
    };
  }, []);

  return {
    user: authState.user,
    loading: authState.loading,
    isAuthenticated: !!authState.user,
    isAdmin: authState.user?.isAdmin || false,
    signInWithGoogle,
    signInWithNaver: handleNaverLogin, // Custom Token 방식 (기본)
    signInWithNaverOIDC: handleNaverLoginOIDC, // OIDC 방식 (실험적)
    signInWithNaverRedirect: handleNaverLoginRedirect, // 리다이렉트 방식
    logout
  };
};
