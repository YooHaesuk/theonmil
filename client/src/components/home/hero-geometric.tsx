import { HeroGeometric } from "@/components/ui/shape-landing-hero";
import { buttonClasses } from "@/lib/fonts";
import { Link } from "wouter";
import { motion } from "framer-motion";

export function BakeryHeroGeometric() {
  return (
    <div className="relative">
      <HeroGeometric 
        badge="프리미엄 베이커리" 
        title1="빵다운 빵을 만드는" 
        title2="빵답게"
      />
      
      {/* 추가 컨텐츠 오버레이 */}
      <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 z-30 w-full max-w-md text-center">
        <motion.p 
          className="font-maruburi text-base md:text-xl mb-8 text-[#F5F3EF]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          수도권 200여 개 대형마트에서 이미 검증된 빵을, 소비자에게 직접 전달합니다. 정직한 공정, 현장 기반 신뢰를 만나보세요.
        </motion.p>
        
        <motion.div 
          className="flex flex-col sm:flex-row justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Link href="/products" className={buttonClasses.primary}>
            제품 탐색하기
          </Link>
          <Link href="/brand" className={buttonClasses.light}>
            브랜드 이야기
          </Link>
        </motion.div>
      </div>
      
      {/* 스크롤 표시기 */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30"
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: 1,
          y: [0, 10, 0]
        }}
        transition={{
          opacity: { duration: 0.6, delay: 1.2 },
          y: { 
            duration: 1.5,
            repeat: Infinity,
            repeatType: "loop"
          }
        }}
      >
        <i className="fa-solid fa-chevron-down text-white text-2xl"></i>
      </motion.div>
    </div>
  );
}