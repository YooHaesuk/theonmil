import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { headingClasses, buttonClasses } from '@/lib/fonts';
import { slideInFromLeft, slideInFromRight } from '@/lib/animations';

const GiftSection = () => {
  return (
    <section id="gifts" className="py-20 bg-[#0A0A0A] overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          {/* Text content */}
          <motion.div 
            className="md:w-1/2 mb-12 md:mb-0 md:pr-12"
            variants={slideInFromLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold font-montserrat mb-6 text-white">
              특별한 날, <span className="bg-gradient-to-r from-[#A78BFA] to-[#EC4899] text-transparent bg-clip-text">특별한 선물</span>
            </h2>
            <p className="font-maruburi text-lg text-gray-300 mb-6">
              소중한 사람의 기념일에 빵답게의 선물 세트는 어떠신가요? 케이크, 디저트와 함께 신선한 꽃다발과 마음을 담은 메시지 카드를 함께 보내드립니다.
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#A78BFA] to-[#EC4899] flex items-center justify-center text-white mt-0.5 mr-3">
                  <i className="fa-solid fa-check text-xs"></i>
                </div>
                <span className="font-pretendard text-gray-300">원하는 날짜에 정확한 배송</span>
              </li>
              <li className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#A78BFA] to-[#EC4899] flex items-center justify-center text-white mt-0.5 mr-3">
                  <i className="fa-solid fa-check text-xs"></i>
                </div>
                <span className="font-pretendard text-gray-300">전문 플로리스트가 준비한 신선한 꽃다발</span>
              </li>
              <li className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#A78BFA] to-[#EC4899] flex items-center justify-center text-white mt-0.5 mr-3">
                  <i className="fa-solid fa-check text-xs"></i>
                </div>
                <span className="font-pretendard text-gray-300">고급스러운 패키지와 리본 포장</span>
              </li>
              <li className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#A78BFA] to-[#EC4899] flex items-center justify-center text-white mt-0.5 mr-3">
                  <i className="fa-solid fa-check text-xs"></i>
                </div>
                <span className="font-pretendard text-gray-300">직접 작성한 손글씨 메시지 카드 동봉</span>
              </li>
            </ul>
            <Link 
              href="/products?category=gift" 
              className="px-6 py-3 rounded-full bg-gradient-to-r from-[#A78BFA] to-[#EC4899] text-white text-sm font-medium hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
            >
              선물 세트 보기
            </Link>
          </motion.div>
          
          {/* Image */}
          <motion.div 
            className="md:w-1/2 relative"
            variants={slideInFromRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="rounded-lg shadow-lg overflow-hidden border border-[#222222]">
              <img 
                src="https://images.unsplash.com/photo-1627834377411-8da5f4f09de8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1901&q=80" 
                alt="선물 세트" 
                className="w-full"
              />
            </div>
            <motion.div 
              className="absolute -top-6 -left-6 bg-[#111111] p-3 rounded-lg shadow-lg hidden md:block border border-[#222222]"
              initial={{ opacity: 0, x: -20, y: -20 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
            >
              <img 
                src="https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80" 
                alt="꽃다발" 
                className="w-24 h-24 object-cover rounded"
              />
            </motion.div>
            <motion.div 
              className="absolute -bottom-6 -right-6 bg-[#111111] p-3 rounded-lg shadow-lg hidden md:block border border-[#222222]"
              initial={{ opacity: 0, x: 20, y: 20 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
            >
              <img 
                src="https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=765&q=80" 
                alt="케이크" 
                className="w-24 h-24 object-cover rounded brightness-75"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default GiftSection;
