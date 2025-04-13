import { useState } from 'react';
import { motion } from 'framer-motion';
import { headingClasses } from '@/lib/fonts';
import { fadeIn } from '@/lib/animations';
import { useToast } from '@/hooks/use-toast';

const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!email) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "구독 신청 완료",
        description: "빵답게의 소식을 이메일로 받아보실 수 있습니다.",
      });
      
      setEmail('');
      setIsSubmitting(false);
    }, 1000);
  };
  
  return (
    <section id="newsletter" className="py-16 bg-[#D4AF37]">
      <div className="container mx-auto px-4">
        <motion.div 
          className="max-w-3xl mx-auto text-center"
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h2 className={headingClasses.h2 + " text-white mb-4"}>
            빵답게 소식 받기
          </h2>
          <p className="font-maruburi text-lg text-white mb-8 opacity-90">
            신제품 소식, 시즌 한정 메뉴, 특별 할인 정보를 가장 먼저 받아보세요.
          </p>
          <form 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            onSubmit={handleSubmit}
          >
            <input 
              type="email" 
              placeholder="이메일 주소를 입력하세요" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-grow max-w-sm rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-[#1B1B1B] hover:bg-opacity-90 text-white font-medium py-3 px-6 rounded-md text-center transition duration-300 font-montserrat whitespace-nowrap disabled:opacity-70"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                  처리 중...
                </span>
              ) : '구독하기'}
            </button>
          </form>
          <p className="font-pretendard text-white text-sm mt-4 opacity-80">
            구독은 언제든지 취소 가능합니다. 개인정보 처리방침을 준수합니다.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default NewsletterSection;
