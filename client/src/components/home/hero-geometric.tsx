import { HeroGeometric } from "@/components/ui/shape-landing-hero";
import { buttonClasses } from "@/lib/fonts";
import { Link } from "wouter";
import { motion } from "framer-motion";

export function BakeryHeroGeometric() {
  return (
    <div className="relative h-screen">
      <HeroGeometric 
        badge="프리미엄 베이커리" 
        title1="Elevate Your" 
        title2="Digital Vision"
      />
      
      {/* 버튼 오버레이 */}
      <div className="absolute bottom-28 left-1/2 transform -translate-x-1/2 z-30 w-full max-w-md text-center">
        <motion.div 
          className="flex flex-col sm:flex-row justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Link 
            href="/products" 
            className="px-6 py-3 rounded-full bg-gradient-to-r from-[#A78BFA] to-[#EC4899] text-white text-sm font-medium hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
          >
            제품 탐색하기
          </Link>
          <Link 
            href="/brand" 
            className="px-6 py-3 rounded-full bg-[#11111A] border border-[#ffffff20] text-white text-sm font-medium hover:bg-[#1A1A2A] transition-all duration-300"
          >
            브랜드 이야기
          </Link>
        </motion.div>
      </div>
      
      {/* 스크롤 표시기 */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30"
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: 0.6,
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
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 4V20M12 20L18 14M12 20L6 14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.div>
    </div>
  );
}