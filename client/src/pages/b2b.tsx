import { useState } from 'react';
import { motion } from 'framer-motion';
import { pageTransition, fadeIn, slideInFromLeft, slideInFromRight } from '@/lib/animations';
import { headingClasses } from '@/lib/fonts';
import { useToast } from '@/hooks/use-toast';

const B2B = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    message: '',
    employees: '10-50'
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "문의가 접수되었습니다",
      description: "빠른 시일 내에 담당자가 연락드리겠습니다.",
    });
    
    setFormData({
      companyName: '',
      contactName: '',
      email: '',
      phone: '',
      message: '',
      employees: '10-50'
    });
    
    setIsSubmitting(false);
  };
  
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      className="min-h-screen pt-24 pb-20 bg-[#0A0A0A]"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h1 variants={fadeIn} className="text-4xl font-bold font-montserrat mb-4 text-white">
            <span className="mr-1">기업</span> <span className="bg-gradient-to-r from-[#A78BFA] to-[#EC4899] text-transparent bg-clip-text">제휴 안내</span>
          </motion.h1>
          <motion.p variants={fadeIn} className="font-pretendard text-lg max-w-3xl mx-auto text-gray-300">
            기업 행사, 케이터링, 직원 선물을 위한 대량 주문 및 정기 납품 서비스를 제공합니다.
          </motion.p>
        </div>
        
        <div className="flex flex-col md:flex-row items-center mb-20">
          {/* Image */}
          <motion.div 
            variants={slideInFromLeft}
            className="md:w-1/2 mb-12 md:mb-0 md:pr-12"
          >
            <img 
              src="https://images.unsplash.com/photo-1564844536308-50b114a1d946?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1738&q=80" 
              alt="기업 제휴" 
              className="rounded-lg shadow-lg w-full"
            />
          </motion.div>
          
          {/* Text Content */}
          <motion.div variants={slideInFromRight} className="md:w-1/2">
            <h2 className="text-3xl font-bold font-montserrat mb-6 text-white">
              빵답게와 특별한 <span className="bg-gradient-to-r from-[#A78BFA] to-[#EC4899] text-transparent bg-clip-text">비즈니스 파트너십</span>을 맺어보세요
            </h2>
            <p className="font-pretendard text-lg mb-6 text-gray-300">
              기업 행사, 케이터링, 직원 선물을 위한 대량 주문 및 정기 납품 서비스를 제공합니다. 빵답게와 함께 특별한 비즈니스 파트너십을 맺어보세요.
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <i className="fa-solid fa-building bg-gradient-to-r from-[#A78BFA] to-[#EC4899] text-transparent bg-clip-text mt-1 mr-3 text-lg"></i>
                <span className="font-pretendard text-gray-300">맞춤형 기업 선물 세트 구성</span>
              </li>
              <li className="flex items-start">
                <i className="fa-solid fa-calendar-check bg-gradient-to-r from-[#A78BFA] to-[#EC4899] text-transparent bg-clip-text mt-1 mr-3 text-lg"></i>
                <span className="font-pretendard text-gray-300">정기 배송 및 일괄 배송 서비스</span>
              </li>
              <li className="flex items-start">
                <i className="fa-solid fa-handshake bg-gradient-to-r from-[#A78BFA] to-[#EC4899] text-transparent bg-clip-text mt-1 mr-3 text-lg"></i>
                <span className="font-pretendard text-gray-300">기업 로고 각인 및 맞춤 패키지 옵션</span>
              </li>
              <li className="flex items-start">
                <i className="fa-solid fa-tag bg-gradient-to-r from-[#A78BFA] to-[#EC4899] text-transparent bg-clip-text mt-1 mr-3 text-lg"></i>
                <span className="font-pretendard text-gray-300">대량 주문 할인 및 전용 견적 서비스</span>
              </li>
            </ul>
          </motion.div>
        </div>
        
        {/* Services Section */}
        <motion.div variants={fadeIn} className="mb-20">
          <h2 className="text-3xl font-bold font-montserrat mb-8 text-center text-white">
            기업 <span className="bg-gradient-to-r from-[#A78BFA] to-[#EC4899] text-transparent bg-clip-text">서비스 제안</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#111111] rounded-lg p-6 shadow-md text-center border border-[#222222]">
              <div className="w-16 h-16 bg-[#0F0F1A] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#333333]">
                <i className="fa-solid fa-gift bg-gradient-to-r from-[#A78BFA] to-[#EC4899] text-transparent bg-clip-text text-2xl"></i>
              </div>
              <h3 className="font-montserrat text-xl font-semibold text-white mb-2">기업 선물</h3>
              <p className="font-pretendard text-gray-300">
                명절, 기념일 등 특별한 날에 직원 또는 고객에게 전달할 맞춤형 선물 세트를 제작합니다.
              </p>
            </div>
            
            <div className="bg-[#111111] rounded-lg p-6 shadow-md text-center border border-[#222222]">
              <div className="w-16 h-16 bg-[#0F0F1A] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#333333]">
                <i className="fa-solid fa-utensils bg-gradient-to-r from-[#A78BFA] to-[#EC4899] text-transparent bg-clip-text text-2xl"></i>
              </div>
              <h3 className="font-montserrat text-xl font-semibold text-white mb-2">케이터링</h3>
              <p className="font-pretendard text-gray-300">
                회의, 행사, 세미나 등 기업 행사를 위한 신선한 베이커리 및 디저트 케이터링 서비스를 제공합니다.
              </p>
            </div>
            
            <div className="bg-[#111111] rounded-lg p-6 shadow-md text-center border border-[#222222]">
              <div className="w-16 h-16 bg-[#0F0F1A] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#333333]">
                <i className="fa-solid fa-truck bg-gradient-to-r from-[#A78BFA] to-[#EC4899] text-transparent bg-clip-text text-2xl"></i>
              </div>
              <h3 className="font-montserrat text-xl font-semibold text-white mb-2">정기 납품</h3>
              <p className="font-pretendard text-gray-300">
                카페, 레스토랑, 호텔 등 외식업체에 빵답게의 프리미엄 베이커리 제품을 정기적으로 납품합니다.
              </p>
            </div>
          </div>
        </motion.div>
        
        {/* Inquiry Form */}
        <motion.div variants={fadeIn} className="bg-[#0F0F1A] text-white rounded-lg p-8 md:p-12 border border-[#222222]">
          <h2 className="text-3xl font-bold font-montserrat mb-8 text-center text-white">
            기업 <span className="bg-gradient-to-r from-[#A78BFA] to-[#EC4899] text-transparent bg-clip-text">문의하기</span>
          </h2>
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-300 mb-1">회사명</label>
                <input 
                  type="text" 
                  id="companyName" 
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                  className="w-full rounded-full bg-[#0A0A0A] border border-[#333333] text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#A78BFA]"
                />
              </div>
              <div>
                <label htmlFor="contactName" className="block text-sm font-medium text-gray-300 mb-1">담당자명</label>
                <input 
                  type="text" 
                  id="contactName" 
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleChange}
                  required
                  className="w-full rounded-full bg-[#0A0A0A] border border-[#333333] text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#A78BFA]"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">이메일</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-full bg-[#0A0A0A] border border-[#333333] text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#A78BFA]"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">연락처</label>
                <input 
                  type="tel" 
                  id="phone" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full rounded-full bg-[#0A0A0A] border border-[#333333] text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#A78BFA]"
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label htmlFor="employees" className="block text-sm font-medium text-gray-300 mb-1">임직원 수</label>
              <select 
                id="employees" 
                name="employees"
                value={formData.employees}
                onChange={handleChange}
                className="w-full rounded-full bg-[#0A0A0A] border border-[#333333] text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#A78BFA] appearance-none"
              >
                <option value="1-10">1-10명</option>
                <option value="10-50">10-50명</option>
                <option value="50-100">50-100명</option>
                <option value="100-500">100-500명</option>
                <option value="500+">500명 이상</option>
              </select>
            </div>
            
            <div className="mb-6">
              <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">문의 내용</label>
              <textarea 
                id="message" 
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4} 
                required
                className="w-full rounded-lg bg-[#0A0A0A] border border-[#333333] text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#A78BFA]"
              ></textarea>
            </div>
            
            <div className="text-center">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-gradient-to-r from-[#A78BFA] to-[#EC4899] hover:opacity-90 text-white font-medium py-3 px-8 rounded-full text-center transition-all duration-300 font-montserrat hover:shadow-lg hover:shadow-purple-500/20"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <i className="fa-solid fa-spinner fa-spin mr-2"></i> 처리 중...
                  </span>
                ) : '문의 보내기'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default B2B;
