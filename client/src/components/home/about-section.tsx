import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { headingClasses, buttonClasses } from '@/lib/fonts';
import { fadeIn, slideInFromLeft, slideInFromRight } from '@/lib/animations';

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
                src="https://images.unsplash.com/photo-1591688515877-f6d04f417608?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" 
                alt="베이커리 매장 전경" 
                className="rounded-lg shadow-lg w-full brightness-75"
              />
              <div className="absolute -bottom-6 -right-6 bg-gradient-to-r from-[#A78BFA] to-[#EC4899] text-white p-6 rounded-lg shadow-lg hidden md:block">
                <p className="font-montserrat text-lg font-bold">15+ 년</p>
                <p className="font-pretendard text-sm">베이킹 장인 경력</p>
              </div>
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
            <p className="font-maruburi text-lg text-gray-300 mb-6">
              빵답게는 2008년, 단 하나의 작은 오븐으로 시작했습니다. 처음부터 우리는 '빵다운 빵'이라는 단순한 철학을 고수했습니다.
            </p>
            <p className="font-maruburi text-lg text-gray-300 mb-6">
              국내산 밀가루, 천연 발효종, 그리고 최소한의 첨가물만을 사용해 건강하고 맛있는 빵을 굽는 것. 그 철학은 지금도 변함없이 지켜지고 있습니다.
            </p>
            <p className="font-maruburi text-lg text-gray-300 mb-8">
              대형마트 200여 곳에서 판매되며 많은 분들의 사랑을 받고 있는 빵답게가 이제 온라인에서도 여러분을 찾아갑니다.
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
                <p className="font-montserrat text-xl font-bold bg-gradient-to-r from-[#A78BFA] to-[#EC4899] text-transparent bg-clip-text">200+</p>
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
                <p className="font-montserrat text-xl font-bold bg-gradient-to-r from-[#A78BFA] to-[#EC4899] text-transparent bg-clip-text">5,000+</p>
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
