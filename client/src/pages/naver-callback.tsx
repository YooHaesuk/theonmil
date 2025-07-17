import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { signInWithCustomToken } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { saveNaverUser } from '@/lib/user-management';
import { useToast } from '@/hooks/use-toast';

const NaverCallback = () => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  console.log('🚀🚀🚀 NaverCallback 컴포넌트 렌더링됨!');
  console.log('🔗 현재 전체 URL:', window.location.href);

  useEffect(() => {
    console.log('🔥🔥🔥 NaverCallback useEffect 실행됨!');
    const handleNaverCallback = async () => {
      try {
        console.log('🔍 네이버 콜백 처리 시작...');
        console.log('🔗 현재 URL:', window.location.href);
        console.log('🪟 팝업 창 여부:', !!window.opener);

        // URL에서 code와 state 파라미터 추출
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        const error = urlParams.get('error');

        console.log('📍 URL 파라미터:', { code, state, error });

        if (error) {
          throw new Error(`네이버 로그인 오류: ${error}`);
        }

        if (!code) {
          throw new Error('인증 코드가 없습니다.');
        }

        setStatus('loading');

        // 실제 네이버 API 호출로 사용자 정보 가져오기
        console.log('🔗 실제 네이버 API 호출 시작...');

        const response = await fetch('/api/auth/naver/callback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code: code,
            state: state
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`네이버 API 호출 실패: ${errorData.error}`);
        }

        const { user: naverUser } = await response.json();
        console.log('✅ 실제 네이버 사용자 정보 수신:', {
          id: naverUser.id,
          email: naverUser.email,
          name: naverUser.name,
          profileImage: naverUser.profileImage
        });

        // accessToken은 보안상 클라이언트에 노출하지 않음
        // 대신 서버에서 이미 검증된 사용자 정보를 사용
        naverUser.accessToken = `VERIFIED_NAVER_TOKEN_${Date.now()}`;

        // 1. Firebase Custom Token 생성 및 Auth 등록
        console.log('🎫 Firebase Custom Token 생성 시작...');
        try {
          const customTokenResponse = await fetch('/api/auth/naver/custom-token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id: naverUser.id,
              email: naverUser.email,
              name: naverUser.name,
              profileImage: naverUser.profileImage
            })
          });

          if (!customTokenResponse.ok) {
            throw new Error('Custom Token 생성 실패');
          }

          const { customToken } = await customTokenResponse.json();
          console.log('✅ Custom Token 생성 성공');

          // Firebase Auth에 로그인 (개발 모드 처리)
          if (customToken.startsWith('dev-token-') || customToken.startsWith('DEV_TOKEN_')) {
            console.log('⚠️ 개발 모드: Firebase Admin SDK 미설정으로 Auth 등록 건너뜀');
            console.log('💡 실제 배포에서는 Firebase 서비스 계정 키 설정 필요');
          } else {
            const { signInWithCustomToken } = await import('firebase/auth');
            const { auth } = await import('../lib/firebase');

            const userCredential = await signInWithCustomToken(auth, customToken);
            console.log('✅ Firebase Auth 로그인 성공:', userCredential.user.uid);
          }

        } catch (authError) {
          console.error('❌ Firebase Auth 등록 실패:', authError);
          console.log('⚠️ Auth 실패했지만 Firestore 저장은 계속 진행합니다.');
        }

        // 2. Firestore에 네이버 사용자 정보 저장
        console.log('🔥🔥🔥 Firestore 저장 시작!');
        console.log('💾 네이버 사용자 정보를 Firestore에 저장 중...');
        console.log('👤 저장할 사용자 데이터:', naverUser);

        try {
          console.log('📞 saveNaverUser 함수 호출 중...');
          const result = await saveNaverUser(naverUser);
          console.log('✅ saveNaverUser 함수 결과:', result);
          console.log('✅ 네이버 사용자 정보 Firestore 저장 완료');
        } catch (firestoreError) {
          console.error('❌ Firestore 저장 실패:', firestoreError);
          console.error('❌ 오류 상세:', firestoreError);
          console.log('⚠️ Firestore 저장 실패했지만 로그인은 계속 진행합니다.');
        }

        // 로컬 스토리지에 사용자 정보 저장 (accessToken 포함)
        const firebaseUid = `naver_${naverUser.id}`;
        const userData = {
          uid: firebaseUid,
          email: naverUser.email,
          name: naverUser.name,
          image: naverUser.profileImage || '',
          provider: 'naver',
          isAdmin: naverUser.email === 'yhs85844@gmail.com',
          accessToken: naverUser.accessToken // Custom Token 생성에 필요
        };

        console.log('💾 사용자 데이터 저장 (accessToken 포함):', {
          ...userData,
          accessToken: userData.accessToken ? userData.accessToken.substring(0, 10) + '...' : 'null'
        });

        // 로컬스토리지에 임시 저장 (호환성 유지)
        localStorage.setItem('naver_user', JSON.stringify(userData));

        setStatus('success');

        // 팝업 방식으로 변경 - 부모 창에 성공 메시지 전송
        if (window.opener) {
          console.log('✅ 부모 창에 네이버 로그인 성공 메시지 전송');
          window.opener.postMessage({
            type: 'NAVER_AUTH_SUCCESS',
            user: userData
          }, window.location.origin);
          window.close();
        } else {
          // 일반 페이지인 경우 홈으로 리다이렉트 (fallback)
          toast({
            title: "로그인 성공",
            description: `${naverUser.name}님, 환영합니다!`,
          });
          setTimeout(() => setLocation('/'), 1500);
        }

      } catch (error) {
        console.error('네이버 콜백 처리 오류:', error);
        setStatus('error');

        // 팝업 방식으로 변경 - 부모 창에 에러 메시지 전송
        if (window.opener) {
          console.log('❌ 부모 창에 네이버 로그인 에러 메시지 전송');
          window.opener.postMessage({
            type: 'NAVER_AUTH_ERROR',
            error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
          }, window.location.origin);
          window.close();
        } else {
          // 일반 페이지인 경우 로그인 페이지로 리다이렉트 (fallback)
          toast({
            title: "로그인 실패",
            description: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
            variant: "destructive"
          });
          setTimeout(() => setLocation('/login'), 2000);
        }
      }
    };

    handleNaverCallback();
  }, [setLocation, toast]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center"
    >
      <div className="text-center">
        {status === 'loading' && (
          <>
            <i className="fa-solid fa-spinner fa-spin text-4xl mb-4 text-[#03C75A]"></i>
            <h1 className="text-2xl font-bold mb-2">네이버 로그인 처리 중...</h1>
            <p className="text-gray-400">잠시만 기다려주세요.</p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <i className="fa-solid fa-check-circle text-4xl mb-4 text-green-500"></i>
            <h1 className="text-2xl font-bold mb-2">로그인 성공!</h1>
            <p className="text-gray-400">환영합니다. 홈페이지로 이동합니다.</p>
          </>
        )}
        
        {status === 'error' && (
          <>
            <i className="fa-solid fa-exclamation-triangle text-4xl mb-4 text-red-500"></i>
            <h1 className="text-2xl font-bold mb-2">로그인 실패</h1>
            <p className="text-gray-400">로그인 페이지로 돌아갑니다.</p>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default NaverCallback;
