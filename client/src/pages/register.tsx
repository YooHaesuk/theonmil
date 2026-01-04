import React, { useState } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { pageTransition, fadeIn, slideInFromBottom } from '@/lib/animations';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const {
    signInWithGoogle,
    signInWithNaver,
    signInWithKakao
  } = useAuth();

  const handleRegister = async (method: () => Promise<any>) => {
    try {
      setIsLoading(true);
      await method();
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "회원가입 실패",
        description: error.message || "회원가입 시도 중 오류가 발생했습니다. 다시 시도해 주세요.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      className="min-h-screen pt-24 pb-20 bg-background flex items-center justify-center"
    >
      <div className="container mx-auto px-4 max-w-md">
        <motion.div variants={fadeIn} className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-montserrat">
            <span className="bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text">회원가입</span>
          </h1>
          <p className="font-pretendard text-muted-foreground text-lg">
            소셜 계정으로 빠르고 간편하게 <span className="text-foreground font-semibold">회원가입</span> 하세요
          </p>
        </motion.div>

        <motion.div
          variants={slideInFromBottom}
          className="bg-secondary rounded-lg shadow-md overflow-hidden border border-border"
        >
          <div className="p-8">
            <div className="space-y-4">
              {/* Kakao 로그인 */}
              <button
                type="button"
                onClick={() => handleRegister(signInWithKakao)}
                disabled={isLoading}
                className="w-full flex items-center justify-center px-4 py-3 bg-[#FEE500] text-[#000000] rounded-full font-medium hover:bg-[#FDD835] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i className={`${isLoading ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-comment'} mr-3`}></i>
                카카오로 시작하기
              </button>

              {/* Naver 로그인 */}
              <button
                type="button"
                onClick={() => handleRegister(signInWithNaver)}
                disabled={isLoading}
                className="w-full flex items-center justify-center px-4 py-3 bg-[#03C75A] text-white rounded-full font-medium hover:bg-[#02B351] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i className={`${isLoading ? 'fa-solid fa-spinner fa-spin' : 'N'} mr-3 font-bold`}></i>
                네이버로 시작하기
              </button>

              {/* Google 로그인 */}
              <button
                type="button"
                onClick={() => handleRegister(signInWithGoogle)}
                disabled={isLoading}
                className="w-full flex items-center justify-center px-4 py-3 bg-white text-gray-900 rounded-full font-medium shadow-sm hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-border"
              >
                {isLoading ? (
                  <i className="fa-solid fa-spinner fa-spin mr-3"></i>
                ) : (
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                )}
                Google로 시작하기
              </button>
            </div>

            <div className="mt-8 text-center text-sm text-muted-foreground font-pretendard">
              <p>회원가입 시 더 온밀의 이용약관 및 개인정보 처리방침에 동의하게 됩니다.</p>
            </div>
          </div>
        </motion.div>

        <motion.div variants={fadeIn} className="text-center mt-6">
          <p className="text-muted-foreground font-pretendard">
            이미 계정이 있으신가요?{' '}
            <Link href="/login" className="bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text hover:underline">
              로그인
            </Link>
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Register;
