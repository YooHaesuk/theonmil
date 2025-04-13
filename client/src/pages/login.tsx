import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { pageTransition, fadeIn, slideInFromBottom } from '@/lib/animations';
import { headingClasses, buttonClasses } from '@/lib/fonts';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

const Login = () => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await apiRequest('POST', '/api/users/login', {
        username: formData.username,
        password: formData.password
      });
      
      if (response.ok) {
        toast({
          title: "로그인 성공",
          description: "빵답게에 오신 것을 환영합니다.",
        });
        
        setLocation('/', { replace: true });
      }
    } catch (error) {
      toast({
        title: "로그인 실패",
        description: "아이디 또는 비밀번호가 올바르지 않습니다.",
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
            빵답게 계정으로 로그인하세요
          </p>
        </motion.div>
        
        <motion.div
          variants={slideInFromBottom}
          className="bg-[#111111] rounded-lg shadow-md overflow-hidden border border-[#222222]"
        >
          <form onSubmit={handleSubmit} className="p-8">
            <div className="mb-6">
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
                아이디
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                autoComplete="username"
                className="w-full px-4 py-2 bg-[#0A0A0A] border border-[#333333] rounded-full text-white focus:outline-none focus:ring-2 focus:ring-[#A78BFA]"
              />
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                  비밀번호
                </label>
                <Link href="/forgot-password" className="text-sm bg-gradient-to-r from-[#A78BFA] to-[#EC4899] text-transparent bg-clip-text hover:opacity-80">
                  비밀번호 찾기
                </Link>
              </div>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
                className="w-full px-4 py-2 bg-[#0A0A0A] border border-[#333333] rounded-full text-white focus:outline-none focus:ring-2 focus:ring-[#A78BFA]"
              />
            </div>
            
            <div className="flex items-center mb-6">
              <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="h-4 w-4 bg-[#0A0A0A] border-[#333333] focus:ring-[#A78BFA] rounded"
              />
              <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-300">
                로그인 상태 유지
              </label>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#A78BFA] to-[#EC4899] hover:opacity-90 text-white font-medium py-3 px-8 rounded-full text-center transition-all duration-300 font-montserrat hover:shadow-lg hover:shadow-purple-500/20 mb-4"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                  로그인 중...
                </span>
              ) : '로그인'}
            </button>
            
            <div className="relative flex items-center justify-center my-6">
              <div className="border-t border-[#333333] absolute w-full"></div>
              <div className="bg-[#111111] px-4 relative z-10 text-sm text-gray-400">또는</div>
            </div>
            
            <div className="space-y-3">
              <button
                type="button"
                className="w-full flex items-center justify-center px-4 py-2 border border-[#333333] rounded-full text-sm font-medium text-gray-300 bg-[#0A0A0A] hover:bg-[#1A1A2A] transition-colors"
              >
                <i className="fa-solid fa-comment text-yellow-500 mr-2"></i>
                카카오로 로그인
              </button>
              <button
                type="button"
                className="w-full flex items-center justify-center px-4 py-2 border border-[#333333] rounded-full text-sm font-medium text-gray-300 bg-[#0A0A0A] hover:bg-[#1A1A2A] transition-colors"
              >
                <i className="fa-solid fa-n text-green-600 mr-2"></i>
                네이버로 로그인
              </button>
              <button
                type="button"
                className="w-full flex items-center justify-center px-4 py-2 border border-[#333333] rounded-full text-sm font-medium text-gray-300 bg-[#0A0A0A] hover:bg-[#1A1A2A] transition-colors"
              >
                <i className="fa-brands fa-google mr-2"></i>
                구글로 로그인
              </button>
            </div>
          </form>
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
