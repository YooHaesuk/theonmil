import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { headingClasses } from '@/lib/fonts';
import { slideInFromLeft, slideInFromRight } from '@/lib/animations';
import { useToast } from '@/hooks/use-toast';

const B2BSection = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission delay
    setTimeout(() => {
      toast({
        title: "문의가 접수되었습니다",
        description: "빠른 시일 내에 담당자가 연락드리겠습니다.",
      });
      setIsSubmitting(false);
      
      // Reset form
      const form = e.target as HTMLFormElement;
      form.reset();
    }, 1000);
  };
  
  return (
    <section id="b2b" className="py-20 bg-[#0F0F1A] text-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          {/* Image */}
          <motion.div 
            className="md:w-1/2 mb-12 md:mb-0 md:pr-12"
            variants={slideInFromLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="rounded-lg shadow-lg overflow-hidden border border-[#222222]">
              <img 
                src="https://images.unsplash.com/photo-1564844536308-50b114a1d946?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1738&q=80" 
                alt="기업 제휴" 
                className="w-full"
              />
            </div>
          </motion.div>
          
          {/* Text content */}
          <motion.div 
            className="md:w-1/2"
            variants={slideInFromRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold font-montserrat mb-6 text-white">
              기업 제휴 <span className="bg-gradient-to-r from-[#A78BFA] to-[#EC4899] text-transparent bg-clip-text">안내</span>
            </h2>
            <p className="font-maruburi text-lg text-gray-300 mb-6">
              기업 행사, 케이터링, 직원 선물을 위한 대량 주문 및 정기 납품 서비스를 제공합니다. 빵답게와 함께 특별한 비즈니스 파트너십을 맺어보세요.
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#A78BFA] to-[#EC4899] flex items-center justify-center text-white mt-0.5 mr-3 flex-shrink-0">
                  <i className="fa-solid fa-building text-xs"></i>
                </div>
                <span className="font-pretendard text-gray-300">맞춤형 기업 선물 세트 구성</span>
              </li>
              <li className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#A78BFA] to-[#EC4899] flex items-center justify-center text-white mt-0.5 mr-3 flex-shrink-0">
                  <i className="fa-solid fa-calendar-check text-xs"></i>
                </div>
                <span className="font-pretendard text-gray-300">정기 배송 및 일괄 배송 서비스</span>
              </li>
              <li className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#A78BFA] to-[#EC4899] flex items-center justify-center text-white mt-0.5 mr-3 flex-shrink-0">
                  <i className="fa-solid fa-handshake text-xs"></i>
                </div>
                <span className="font-pretendard text-gray-300">기업 로고 각인 및 맞춤 패키지 옵션</span>
              </li>
              <li className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#A78BFA] to-[#EC4899] flex items-center justify-center text-white mt-0.5 mr-3 flex-shrink-0">
                  <i className="fa-solid fa-tag text-xs"></i>
                </div>
                <span className="font-pretendard text-gray-300">대량 주문 할인 및 전용 견적 서비스</span>
              </li>
            </ul>
            
            {/* B2B 간단 문의 폼 */}
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-gray-300 mb-1">회사명</label>
                  <input 
                    type="text" 
                    id="companyName" 
                    required
                    className="w-full rounded-full bg-[#1A1A2A] border border-[#333333] text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#A78BFA]"
                  />
                </div>
                <div>
                  <label htmlFor="contactName" className="block text-sm font-medium text-gray-300 mb-1">담당자명</label>
                  <input 
                    type="text" 
                    id="contactName" 
                    required
                    className="w-full rounded-full bg-[#1A1A2A] border border-[#333333] text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#A78BFA]"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">이메일</label>
                <input 
                  type="email" 
                  id="email" 
                  required
                  className="w-full rounded-full bg-[#1A1A2A] border border-[#333333] text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#A78BFA]"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">문의 내용</label>
                <textarea 
                  id="message" 
                  rows={4} 
                  required
                  className="w-full rounded-xl bg-[#1A1A2A] border border-[#333333] text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#A78BFA]"
                ></textarea>
              </div>
              <div className="flex justify-between items-center">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-[#A78BFA] to-[#EC4899] hover:shadow-lg hover:shadow-purple-500/20 text-white font-medium py-3 px-8 rounded-full text-center transition-all duration-300 font-montserrat disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                      처리 중...
                    </span>
                  ) : '문의 보내기'}
                </button>
                <Link href="/b2b" className="bg-gradient-to-r from-[#A78BFA] to-[#EC4899] text-transparent bg-clip-text hover:opacity-80 transition-opacity duration-300">
                  자세히 알아보기 <i className="fa-solid fa-arrow-right ml-1"></i>
                </Link>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default B2BSection;
