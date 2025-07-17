import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { pageTransition, fadeIn, slideInFromLeft, slideInFromRight } from '@/lib/animations';
import { headingClasses, buttonClasses } from '@/lib/fonts';

const Brand = () => {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      className="min-h-screen pt-24 pb-20 bg-[#0A0A0A]"
    >
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center mb-16">
          <motion.h1 variants={fadeIn} className="text-4xl font-bold font-montserrat mb-4 text-white">
            <span className="bg-gradient-to-r from-[#A78BFA] to-[#EC4899] text-transparent bg-clip-text">브랜드 이야기</span>
          </motion.h1>
          <motion.p variants={fadeIn} className="font-pretendard text-lg max-w-3xl mx-auto mb-8 text-gray-300">
            더 온밀은 2023년, 단 하나의 작은 오븐으로 시작했습니다. 처음부터 우리는 '온전한 밀의 맛'이라는 단순한 철학을 고수했습니다.
          </motion.p>
        </div>
        
        {/* Brand Story */}
        <div className="flex flex-col md:flex-row items-center gap-12 mb-20">
          <motion.div 
            variants={slideInFromLeft}
            className="md:w-1/2"
          >
            <div className="bg-gradient-to-r from-purple-800 to-indigo-900 w-full h-64 md:h-96 rounded-lg shadow-lg flex items-center justify-center">
              <p className="text-2xl md:text-3xl text-white font-bold font-montserrat">빵 제조 과정</p>
            </div>
          </motion.div>
          <motion.div 
            variants={slideInFromRight}
            className="md:w-1/2"
          >
            <h2 className="text-3xl font-bold font-montserrat mb-6 text-white">
              <span className="bg-gradient-to-r from-[#A78BFA] to-[#EC4899] text-transparent bg-clip-text">시작의 순간</span>
            </h2>
            <p className="font-pretendard text-lg mb-6 text-gray-300">
              더 온밀은 2023년, 단 하나의 작은 오븐으로 시작했습니다. 처음부터 우리는 '온전한 밀의 맛'이라는 단순한 철학을 고수했습니다.
            </p>
            <p className="font-pretendard text-lg mb-6 text-gray-300">
              국내산 밀가루, 천연 발효종, 그리고 최소한의 첨가물만을 사용해 건강하고 맛있는 빵을 굽는 것. 그 철학은 지금도 변함없이 지켜지고 있습니다.
            </p>
            <p className="font-pretendard text-lg mb-6 text-gray-300">
              지역 중형마트 120여 곳에서 판매되며 많은 분들의 사랑을 받고 있는 더 온밀이 이제 온라인에서도 여러분을 찾아갑니다.
            </p>
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="text-center p-4 bg-[#0F0F1A] rounded-lg border border-[#222222]">
                <p className="font-montserrat text-xl font-bold bg-gradient-to-r from-[#A78BFA] to-[#EC4899] text-transparent bg-clip-text">120+</p>
                <p className="font-pretendard text-sm text-gray-300">입점 매장</p>
              </div>
              <div className="text-center p-4 bg-[#0F0F1A] rounded-lg border border-[#222222]">
                <p className="font-montserrat text-xl font-bold bg-gradient-to-r from-[#A78BFA] to-[#EC4899] text-transparent bg-clip-text">30+</p>
                <p className="font-pretendard text-sm text-gray-300">제품 라인업</p>
              </div>
              <div className="text-center p-4 bg-[#0F0F1A] rounded-lg border border-[#222222]">
                <p className="font-montserrat text-xl font-bold bg-gradient-to-r from-[#A78BFA] to-[#EC4899] text-transparent bg-clip-text">3,000+</p>
                <p className="font-pretendard text-sm text-gray-300">일 생산량</p>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Brand Philosophy */}
        <div className="flex flex-col md:flex-row-reverse items-center gap-12 mb-20">
          <motion.div 
            variants={slideInFromRight}
            className="md:w-1/2"
          >
            <div className="bg-gradient-to-r from-pink-600 to-purple-800 w-full h-64 md:h-96 rounded-lg shadow-lg flex items-center justify-center">
              <p className="text-2xl md:text-3xl text-white font-bold font-montserrat">천연 발효 공정</p>
            </div>
          </motion.div>
          <motion.div 
            variants={slideInFromLeft}
            className="md:w-1/2"
          >
            <h2 className="text-3xl font-bold font-montserrat mb-6 text-white">
              <span className="bg-gradient-to-r from-[#A78BFA] to-[#EC4899] text-transparent bg-clip-text">브랜드 철학</span>
            </h2>
            <p className="font-pretendard text-lg mb-6 text-gray-300">
              더 온밀의 모든 제품은 정직한 재료와 시간으로 만들어집니다. 우리는 화학 첨가물 대신 천연 발효의 맛과 향을 담아내기 위해 긴 시간 정성을 다합니다.
            </p>
            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <i className="fa-solid fa-check text-purple-400 mt-1 mr-3"></i>
                <span className="font-pretendard text-gray-300">최소한의 첨가물로 건강한 맛을 추구합니다</span>
              </div>
              <div className="flex items-start">
                <i className="fa-solid fa-check text-purple-400 mt-1 mr-3"></i>
                <span className="font-pretendard text-gray-300">국내산 농산물과 엄선된 재료만을 사용합니다</span>
              </div>
              <div className="flex items-start">
                <i className="fa-solid fa-check text-purple-400 mt-1 mr-3"></i>
                <span className="font-pretendard text-gray-300">장인의 정성으로 매일 신선한 빵을 굽습니다</span>
              </div>
              <div className="flex items-start">
                <i className="fa-solid fa-check text-purple-400 mt-1 mr-3"></i>
                <span className="font-pretendard text-gray-300">공정무역 원료를 적극적으로 도입합니다</span>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Team */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <motion.h2 variants={fadeIn} className="text-3xl font-bold font-montserrat mb-4 text-white">
              <span className="bg-gradient-to-r from-[#A78BFA] to-[#EC4899] text-transparent bg-clip-text">장인 베이커들</span>
            </motion.h2>
            <motion.p variants={fadeIn} className="font-pretendard text-lg max-w-3xl mx-auto text-gray-300">
              더 온밀을 만드는 사람들은 각자의 분야에서 오랜 경험과 전문성을 갖춘 장인들입니다.
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              variants={fadeIn}
              className="bg-[#111111] rounded-lg overflow-hidden shadow-md text-center border border-[#222222]"
            >
              <div className="h-64 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-indigo-600 to-purple-800 flex items-center justify-center">
                  <div className="text-white text-center">
                    <i className="fa-solid fa-bread-slice text-5xl mb-2"></i>
                    <p className="font-montserrat text-lg">수석 베이커</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-montserrat text-xl font-semibold text-white mb-1">김민수</h3>
                <p className="font-montserrat text-sm bg-gradient-to-r from-[#A78BFA] to-[#EC4899] text-transparent bg-clip-text mb-4">수석 베이커</p>
                <p className="font-pretendard text-sm text-gray-300">프랑스 파리에서 15년간 현지 베이커리에서 경력을 쌓은 뒤 더 온밀의 첫 번째 오븐을 열었습니다.</p>
              </div>
            </motion.div>
            
            <motion.div 
              variants={fadeIn}
              className="bg-[#111111] rounded-lg overflow-hidden shadow-md text-center border border-[#222222]"
            >
              <div className="h-64 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-pink-600 to-purple-700 flex items-center justify-center">
                  <div className="text-white text-center">
                    <i className="fa-solid fa-cake-candles text-5xl mb-2"></i>
                    <p className="font-montserrat text-lg">파티시에</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-montserrat text-xl font-semibold text-white mb-1">이지은</h3>
                <p className="font-montserrat text-sm bg-gradient-to-r from-[#A78BFA] to-[#EC4899] text-transparent bg-clip-text mb-4">파티시에</p>
                <p className="font-pretendard text-sm text-gray-300">전통 제과와 현대적 기법을 접목시킨 디저트로 더 온밀의 특별한 케이크와 타르트를 책임지고 있습니다.</p>
              </div>
            </motion.div>
            
            <motion.div 
              variants={fadeIn}
              className="bg-[#111111] rounded-lg overflow-hidden shadow-md text-center border border-[#222222]"
            >
              <div className="h-64 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-800 flex items-center justify-center">
                  <div className="text-white text-center">
                    <i className="fa-solid fa-flask text-5xl mb-2"></i>
                    <p className="font-montserrat text-lg">제품 개발자</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-montserrat text-xl font-semibold text-white mb-1">박준호</h3>
                <p className="font-montserrat text-sm bg-gradient-to-r from-[#A78BFA] to-[#EC4899] text-transparent bg-clip-text mb-4">제품 개발자</p>
                <p className="font-pretendard text-sm text-gray-300">식품 영양학 전문가로서 건강하고 맛있는 더 온밀의 신제품 개발과 품질 관리를 담당합니다.</p>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* CTA Section */}
        <motion.div 
          variants={fadeIn}
          className="bg-[#0F0F1A] text-white rounded-lg p-12 text-center border border-[#222222]"
        >
          <h2 className="font-montserrat text-3xl md:text-4xl font-bold mb-6">
            더 온밀의 <span className="bg-gradient-to-r from-[#A78BFA] to-[#EC4899] text-transparent bg-clip-text">철학</span>, 직접 맛보세요
          </h2>
          <p className="font-pretendard text-lg mb-8 max-w-2xl mx-auto text-gray-300">
            정직한 재료와 장인의 손길로 만든 더 온밀의 제품을 지금 경험해보세요.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/products" className="px-6 py-3 rounded-full bg-gradient-to-r from-[#A78BFA] to-[#EC4899] text-white font-medium transition-all hover:opacity-90 hover:shadow-lg hover:shadow-purple-500/20">
              제품 보러가기
            </Link>
            <Link href="/stores" className="px-6 py-3 rounded-full bg-[#0A0A0A] border border-[#333333] text-white hover:bg-[#1A1A2A] transition-colors">
              매장 찾기
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Brand;
