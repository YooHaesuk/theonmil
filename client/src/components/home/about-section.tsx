import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { headingClasses, buttonClasses } from '@/lib/fonts';
import { fadeIn, slideInFromLeft, slideInFromRight } from '@/lib/animations';

// 공장 이미지 임포트
import factoryImg from '@/assets/images/about/factory.png';

const AboutSection = () => {
  return (
    <section id="about" className="py-20 bg-[#0A0A0A]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Image column */}
          <motion.div 
            className="md:w-1/2"
            variants={slideInFromLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="relative">
              <img 
                src={factoryImg}
                alt="빵 공장 생산 현장" 
                className="rounded-lg shadow-lg w-full brightness-90"
              />
              {/* 15+년 베이킹 장인 경력 버튼이 삭제되었습니다 */}
            </div>
          </motion.div>
          
          {/* Text column */}
          <motion.div 
            className="md:w-1/2"
            variants={slideInFromRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold font-montserrat mb-6 text-white">
              우리의 <span className="bg-gradient-to-r from-[#A78BFA] to-[#EC4899] text-transparent bg-clip-text">이야기</span>
            </h2>
            <p className="font-pretendard text-lg text-gray-300 mb-6">
              빵답게는 2023년, 단 하나의 작은 오븐으로 시작했습니다. 처음부터 우리는 '빵다운 빵'이라는 단순한 철학을 고수했습니다.
            </p>
            <p className="font-pretendard text-lg text-gray-300 mb-6">
              국내산 밀가루, 천연 발효종, 그리고 최소한의 첨가물만을 사용해 건강하고 맛있는 빵을 굽는 것. 그 철학은 지금도 변함없이 지켜지고 있습니다.
            </p>
            <p className="font-pretendard text-lg text-gray-300 mb-8">
              지역 중형마트 120여 곳에서 판매되며 많은 분들의 사랑을 받고 있는 빵답게가 이제 온라인에서도 여러분을 찾아갑니다.
            </p>
            
            <div className="grid grid-cols-3 gap-4 mb-8">
              <motion.div 
                className="text-center p-4 bg-[#111111] border border-[#222222] rounded-lg"
                variants={fadeIn}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.8 }}
                transition={{ delay: 0.2 }}
              >
                <p className="font-montserrat text-xl font-bold bg-gradient-to-r from-[#A78BFA] to-[#EC4899] text-transparent bg-clip-text">120+</p>
                <p className="font-pretendard text-sm text-gray-400">입점 매장</p>
              </motion.div>
              <motion.div 
                className="text-center p-4 bg-[#111111] border border-[#222222] rounded-lg"
                variants={fadeIn}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.8 }}
                transition={{ delay: 0.4 }}
              >
                <p className="font-montserrat text-xl font-bold bg-gradient-to-r from-[#A78BFA] to-[#EC4899] text-transparent bg-clip-text">30+</p>
                <p className="font-pretendard text-sm text-gray-400">제품 라인업</p>
              </motion.div>
              <motion.div 
                className="text-center p-4 bg-[#111111] border border-[#222222] rounded-lg"
                variants={fadeIn}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.8 }}
                transition={{ delay: 0.6 }}
              >
                <p className="font-montserrat text-xl font-bold bg-gradient-to-r from-[#A78BFA] to-[#EC4899] text-transparent bg-clip-text">3,000+</p>
                <p className="font-pretendard text-sm text-gray-400">일 생산량</p>
              </motion.div>
            </div>
            
            <Link 
              href="/brand" 
              className="px-6 py-3 rounded-full bg-[#11111A] border border-[#ffffff20] text-white text-sm font-medium hover:bg-[#1A1A2A] transition-all duration-300"
            >
              브랜드 철학 더 알아보기
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
