import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { pageTransition, fadeIn, slideInFromBottom } from '@/lib/animations';
import { headingClasses, buttonClasses } from '@/lib/fonts';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

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

        setLocation('/login', { replace: true });
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
          <form onSubmit={handleSubmit} className="p-8">
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
