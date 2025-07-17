import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { pageTransition, fadeIn, slideInFromBottom } from '@/lib/animations';
import { headingClasses, buttonClasses } from '@/lib/fonts';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { testFirestoreWrite, testUserCollection } from '@/lib/firestore-test';

const Login = () => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const {
    signInWithGoogle,
    signInWithNaver,
    signInWithNaverOIDC,
    signInWithNaverRedirect,
    isAuthenticated
  } = useAuth();

  // 이미 로그인된 경우 홈으로 리다이렉트
  useEffect(() => {
    if (isAuthenticated) {
      setLocation('/', { replace: true });
    }
  }, [isAuthenticated, setLocation]);

  const handleGoogleLogin = async () => {
    console.log('🎯 Google 로그인 버튼 클릭됨');
    setIsLoading(true);
    try {
      console.log('📞 signInWithGoogle 함수 호출');
      await signInWithGoogle();
      console.log('✅ Google 로그인 성공!');
      toast({
        title: "로그인 성공",
        description: "Google 계정으로 로그인되었습니다.",
      });
      setLocation('/', { replace: true });
    } catch (error) {
      console.error('❌ Google login error:', error);
      toast({
        title: "로그인 실패",
        description: "Google 로그인 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKakaoLogin = () => {
    setIsLoading(true);
    toast({
      title: "준비 중",
      description: "Kakao 로그인은 곧 지원될 예정입니다.",
      variant: "destructive"
    });
    setIsLoading(false);
  };

  // Firestore 테스트 함수들
  const handleFirestoreTest = async () => {
    setIsLoading(true);
    try {
      const result = await testFirestoreWrite();
      toast({
        title: result ? "테스트 성공" : "테스트 실패",
        description: result ? "Firestore 쓰기 테스트가 성공했습니다." : "Firestore 쓰기 테스트가 실패했습니다.",
        variant: result ? "default" : "destructive"
      });
    } catch (error) {
      toast({
        title: "테스트 오류",
        description: "테스트 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserCollectionTest = async () => {
    setIsLoading(true);
    try {
      const result = await testUserCollection();
      toast({
        title: result ? "사용자 테스트 성공" : "사용자 테스트 실패",
        description: result ? "사용자 컬렉션 테스트가 성공했습니다." : "사용자 컬렉션 테스트가 실패했습니다.",
        variant: result ? "default" : "destructive"
      });
    } catch (error) {
      toast({
        title: "테스트 오류",
        description: "사용자 테스트 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNaverLogin = async () => {
    console.log('🎯 네이버 Custom Token 로그인 버튼 클릭됨');
    setIsLoading(true);
    try {
      console.log('📞 signInWithNaver 함수 호출 (Custom Token 방식)');
      await signInWithNaver();
      console.log('✅ 네이버 Custom Token 로그인 완료');
      toast({
        title: "로그인 성공",
        description: "네이버 계정으로 로그인되었습니다.",
      });
      setLocation('/', { replace: true });
    } catch (error) {
      console.error('❌ 네이버 Custom Token 로그인 오류:', error);
      toast({
        title: "로그인 실패",
        description: `네이버 로그인 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };


  
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      className="min-h-screen pt-24 pb-20 flex items-center justify-center bg-[#0A0A0A]"
    >
      <div className="container mx-auto px-4 max-w-md">
        <motion.div variants={fadeIn} className="text-center mb-8">
          <h1 className="text-4xl font-bold font-montserrat mb-2 text-white">
            <span className="bg-gradient-to-r from-[#A78BFA] to-[#EC4899] text-transparent bg-clip-text">로그인</span>
          </h1>
          <p className="font-pretendard text-gray-300">
            더 온밀 계정으로 로그인하세요
          </p>
        </motion.div>
        
        <motion.div
          variants={slideInFromBottom}
          className="bg-[#111111] rounded-lg shadow-md overflow-hidden border border-[#222222]"
        >
          <div className="p-8">
            <div className="space-y-4">
              {/* Google 로그인 */}
              <button
                onClick={() => {
                  console.log('🔥 Google 버튼 클릭 감지됨!');
                  handleGoogleLogin();
                }}
                disabled={isLoading}
                className="w-full flex items-center justify-center px-4 py-3 bg-white text-gray-900 rounded-full font-medium hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google로 로그인
              </button>

              {/* Kakao 로그인 */}
              <button
                onClick={handleKakaoLogin}
                disabled={isLoading}
                className="w-full flex items-center justify-center px-4 py-3 bg-[#FEE500] text-[#000000] rounded-full font-medium hover:bg-[#FDD835] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 0 1-1.727-.11l-4.408 2.883c-.501.265-.678.236-.472-.413l.892-3.678c-2.88-1.46-4.785-3.99-4.785-6.866C1.5 6.665 6.201 3 12 3z"/>
                </svg>
                카카오로 로그인 (준비중)
              </button>

              {/* Naver 로그인 */}
              <button
                onClick={() => {
                  console.log('🔥 네이버 로그인 버튼 클릭 감지됨!');
                  handleNaverLogin();
                }}
                disabled={isLoading}
                className="w-full flex items-center justify-center px-4 py-3 bg-[#03C75A] text-white rounded-full font-medium hover:bg-[#02B351] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16.273 12.845 7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727v12.845z"/>
                </svg>
                네이버로 로그인
              </button>
            </div>

            {/* 개발자 모드에서만 테스트 버튼 표시 */}
            {process.env.NODE_ENV === 'development' && (
              <>
                <div className="relative flex items-center justify-center my-6">
                  <div className="border-t border-[#333333] absolute w-full"></div>
                  <div className="bg-[#111111] px-4 relative z-10 text-sm text-gray-400">개발자 테스트</div>
                </div>

                {/* Firestore 테스트 버튼들 */}
                <div className="space-y-3">
                  <button
                    onClick={handleFirestoreTest}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    🧪 Firestore 쓰기 테스트
                  </button>

                  <button
                    onClick={handleUserCollectionTest}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    👤 사용자 컬렉션 테스트
                  </button>

                  {/* 네이버 대안 로그인 방식들 */}
                  <details className="mt-4">
                    <summary className="text-gray-400 text-sm cursor-pointer hover:text-gray-300">
                      네이버 로그인 대안 방식 (개발자용)
                    </summary>
                    <div className="mt-3 space-y-2">
                      <button
                        onClick={async () => {
                          console.log('🔥 네이버 OIDC 버튼 클릭 감지됨!');
                          setIsLoading(true);
                          try {
                            await signInWithNaverOIDC();
                            toast({
                              title: "로그인 성공",
                              description: "네이버 OIDC 로그인 성공!",
                            });
                            setLocation('/', { replace: true });
                          } catch (error) {
                            toast({
                              title: "로그인 실패",
                              description: `네이버 OIDC 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
                              variant: "destructive"
                            });
                          } finally {
                            setIsLoading(false);
                          }
                        }}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center px-4 py-2 bg-transparent text-[#03C75A] rounded-lg font-medium hover:bg-[#03C75A] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-[#03C75A] text-sm"
                      >
                        네이버 (OIDC 팝업) - 실험적
                      </button>
                      <button
                        onClick={async () => {
                          console.log('🔥 네이버 리다이렉트 버튼 클릭 감지됨!');
                          setIsLoading(true);
                          try {
                            await signInWithNaverRedirect();
                          } catch (error) {
                            toast({
                              title: "로그인 실패",
                              description: `네이버 리다이렉트 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
                              variant: "destructive"
                            });
                            setIsLoading(false);
                          }
                        }}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center px-4 py-2 bg-transparent text-[#03C75A] rounded-lg font-medium hover:bg-[#03C75A] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-[#03C75A] text-sm"
                      >
                        네이버 (OIDC 리다이렉트)
                      </button>
                    </div>
                  </details>
                </div>
              </>
            )}

            <div className="relative flex items-center justify-center my-6">
              <div className="border-t border-[#333333] absolute w-full"></div>
              <div className="bg-[#111111] px-4 relative z-10 text-sm text-gray-400">간편 로그인</div>
            </div>

            <p className="text-center text-sm text-gray-400">
              소셜 계정으로 빠르고 안전하게 로그인하세요
            </p>
          </div>
        </motion.div>
        
        <motion.div variants={fadeIn} className="text-center mt-6">
          <p className="text-gray-400">
            아직 계정이 없으신가요?{' '}
            <Link href="/register" className="bg-gradient-to-r from-[#A78BFA] to-[#EC4899] text-transparent bg-clip-text hover:opacity-80">
              회원가입
            </Link>
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Login;
