import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { pageTransition, fadeIn, slideInFromBottom } from '@/lib/animations';
import { headingClasses, buttonClasses } from '@/lib/fonts';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/hooks/use-auth';

const Register = () => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    passwordConfirm: '',
    name: '',
    email: '',
    phone: '',
    agreeTerms: false,
    agreePrivacy: false,
    agreeMarketing: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });

    // Clear error when field is modified
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (formData.password.length < 8) {
      newErrors.password = '비밀번호는 8자 이상이어야 합니다.';
    }

    if (formData.password !== formData.passwordConfirm) {
      newErrors.passwordConfirm = '비밀번호가 일치하지 않습니다.';
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = '이용약관에 동의해주세요.';
    }

    if (!formData.agreePrivacy) {
      newErrors.agreePrivacy = '개인정보 처리방침에 동의해주세요.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = '유효한 이메일 주소를 입력해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const {
    signInWithGoogle,
    signInWithNaver,
    signInWithKakao,
    isAuthenticated
  } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiRequest('POST', '/api/users/register', {
        username: formData.username,
        password: formData.password,
        name: formData.name,
        email: formData.email,
        phone: formData.phone
      });

      if (response.ok) {
        toast({
          title: "회원가입 성공",
          description: "더 온밀의 회원이 되신 것을 환영합니다.",
        });

        setLocation('/welcome', { replace: true });
      }
    } catch (error) {
      toast({
        title: "회원가입 실패",
        description: "회원가입 중 오류가 발생했습니다. 다시 시도해주세요.",
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
      className="min-h-screen pt-24 pb-20 bg-background"
    >
      <div className="container mx-auto px-4 max-w-md">
        <motion.div variants={fadeIn} className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-montserrat">
            <span className="bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text">회원가입</span>
          </h1>
          <p className="font-pretendard text-muted-foreground text-lg">
            더 온밀의 회원이 되어 <span className="text-foreground font-semibold">특별한 혜택</span>을 누리세요
          </p>
        </motion.div>

        <motion.div
          variants={slideInFromBottom}
          className="bg-secondary rounded-lg shadow-md overflow-hidden border border-border"
        >
          <div className="p-8 pb-0">
            <div className="space-y-4 mb-8">
              {/* Kakao 로그인 */}
              <button
                type="button"
                onClick={signInWithKakao}
                disabled={isLoading}
                className="w-full flex items-center justify-center px-4 py-3 bg-[#FEE500] text-[#000000] rounded-full font-medium hover:bg-[#FDD835] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 0 1-1.727-.11l-4.408 2.883c-.501.265-.678.236-.472-.413l.892-3.678c-2.88-1.46-4.785-3.99-4.785-6.866C1.5 6.665 6.201 3 12 3z" />
                </svg>
                카카오로 시작하기
              </button>

              {/* Naver 로그인 */}
              <button
                type="button"
                onClick={signInWithNaver}
                disabled={isLoading}
                className="w-full flex items-center justify-center px-4 py-3 bg-[#03C75A] text-white rounded-full font-medium hover:bg-[#02B351] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16.273 12.845 7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727v12.845z" />
                </svg>
                네이버로 시작하기
              </button>

              {/* Google 로그인 */}
              <button
                type="button"
                onClick={signInWithGoogle}
                disabled={isLoading}
                className="w-full flex items-center justify-center px-4 py-3 bg-white text-gray-900 rounded-full font-medium shadow-sm hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-border"
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google로 시작하기
              </button>

              <div className="relative flex items-center justify-center my-6">
                <div className="border-t border-border absolute w-full"></div>
                <div className="bg-secondary px-4 relative z-10 text-sm text-muted-foreground font-pretendard">또는 이메일로 가입</div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 pt-0">
            <div className="mb-6">
              <label htmlFor="username" className="block text-sm font-medium text-foreground mb-1 font-pretendard">
                아이디 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1 font-pretendard">
                비밀번호 <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className={`w-full px-3 py-2 bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-foreground ${errors.password ? 'border-red-500' : 'border-border'
                  }`}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
              <p className="mt-1 text-xs text-muted-foreground font-pretendard">
                8자 이상, 영문, 숫자, 특수문자 조합을 권장합니다.
              </p>
            </div>

            <div className="mb-6">
              <label htmlFor="passwordConfirm" className="block text-sm font-medium text-foreground mb-1 font-pretendard">
                비밀번호 확인 <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                id="passwordConfirm"
                name="passwordConfirm"
                value={formData.passwordConfirm}
                onChange={handleChange}
                required
                className={`w-full px-3 py-2 bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-foreground ${errors.passwordConfirm ? 'border-red-500' : 'border-border'
                  }`}
              />
              {errors.passwordConfirm && (
                <p className="mt-1 text-sm text-red-500">{errors.passwordConfirm}</p>
              )}
            </div>

            <div className="mb-6">
              <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1 font-pretendard">
                이름 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1 font-pretendard">
                이메일 <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={`w-full px-3 py-2 bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-foreground ${errors.email ? 'border-red-500' : 'border-border'
                  }`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div className="mb-6">
              <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-1 font-pretendard">
                연락처 <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                placeholder="01012345678"
              />
              <p className="mt-1 text-xs text-muted-foreground font-pretendard">
                '-' 없이 숫자만 입력해주세요.
              </p>
            </div>

            <div className="border-t border-border pt-6 mb-6">
              <h3 className="text-lg font-medium text-foreground mb-4 font-montserrat">이용약관 동의</h3>

              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      type="checkbox"
                      id="agreeAll"
                      checked={formData.agreeTerms && formData.agreePrivacy && formData.agreeMarketing}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setFormData({
                          ...formData,
                          agreeTerms: checked,
                          agreePrivacy: checked,
                          agreeMarketing: checked
                        });
                      }}
                      className="h-4 w-4 text-primary focus:ring-primary border-border rounded bg-background"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="agreeAll" className="font-medium text-foreground font-pretendard">전체 동의</label>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      type="checkbox"
                      id="agreeTerms"
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={handleChange}
                      required
                      className={`h-4 w-4 focus:ring-primary border-border rounded bg-background ${errors.agreeTerms ? 'text-red-500 border-red-500' : 'text-primary'
                        }`}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="agreeTerms" className="font-medium text-foreground font-pretendard">
                      이용약관 동의 <span className="text-red-500">(필수)</span>
                    </label>
                    <p className="text-muted-foreground">
                      <a href="#" className="bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text hover:underline">약관보기</a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      type="checkbox"
                      id="agreePrivacy"
                      name="agreePrivacy"
                      checked={formData.agreePrivacy}
                      onChange={handleChange}
                      required
                      className={`h-4 w-4 focus:ring-primary border-border rounded bg-background ${errors.agreePrivacy ? 'text-red-500 border-red-500' : 'text-primary'
                        }`}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="agreePrivacy" className="font-medium text-foreground font-pretendard">
                      개인정보 수집 및 이용 동의 <span className="text-red-500">(필수)</span>
                    </label>
                    <p className="text-muted-foreground">
                      <a href="#" className="bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text hover:underline">약관보기</a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      type="checkbox"
                      id="agreeMarketing"
                      name="agreeMarketing"
                      checked={formData.agreeMarketing}
                      onChange={handleChange}
                      className="h-4 w-4 text-primary focus:ring-primary border-border rounded bg-background"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="agreeMarketing" className="font-medium text-foreground font-pretendard">
                      마케팅 정보 수신 동의 (선택)
                    </label>
                    <p className="text-muted-foreground font-pretendard">
                      더 온밀의 신제품 및 이벤트 소식을 받아보실 수 있습니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={buttonClasses.primary + " w-full flex items-center justify-center"}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                  처리 중...
                </span>
              ) : '회원가입'}
            </button>
          </form>
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
