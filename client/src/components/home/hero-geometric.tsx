import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { useRealViewport } from "@/hooks/use-real-viewport";
// @ts-ignore
import croissantImage from '../../assets/images/bakery/croissant-transparent.png';
// @ts-ignore
import baguetteImage from '../../assets/images/bakery/baguette-transparent.png';

/**
 * 캡슐형 객체 정의 
 */
interface RoundedObject {
  id: number;
  x: string | number;
  y: string | number;
  width: number;
  height: number;
  rotate: number;
  color: string;
  blur: number;
  opacity: number;
}

export function BakeryHeroGeometric() {
  // 실제 뷰포트 높이 계산 훅 사용
  useRealViewport();
  
  // useEffect 훅 사용하여 HTML body에 스타일 적용
  useEffect(() => {
    // HTML body에 스타일 적용
    document.documentElement.style.overflowX = 'hidden';
    document.body.style.overflowX = 'hidden';
    document.body.style.width = '100%';
    document.body.style.position = 'relative';
    
    return () => {
      // useEffect 훅이 해제될 때 스타일 초기화
      document.documentElement.style.overflowX = '';
      document.body.style.overflowX = '';
      document.body.style.width = '';
      document.body.style.position = '';
    };
  }, []);
  
  // 참고 이미지에 나온 캡슐 모양 요소들 (고정 위치)
  const roundedObjects: RoundedObject[] = [
    { id: 1, x: '15%', y: '20%', width: 300, height: 60, rotate: 30, color: 'from-[#312E81] to-[#4B21A6]', blur: 60, opacity: 0.15 },
    { id: 2, x: '75%', y: '30%', width: 200, height: 50, rotate: -15, color: 'from-[#4B21A6] to-[#A367DC]', blur: 70, opacity: 0.2 },
    { id: 3, x: '25%', y: '75%', width: 250, height: 55, rotate: 10, color: 'from-[#A367DC] to-[#EB4D77]', blur: 80, opacity: 0.15 },
    { id: 4, x: '80%', y: '70%', width: 180, height: 60, rotate: -25, color: 'from-[#0F0F1A] to-[#312E81]', blur: 50, opacity: 0.2 },
  ];
  
  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between pb-16 overflow-hidden bg-[#0A0A0A]" style={{ maxWidth: '100vw' }}>
      {/* 배경 요소들 */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* 배경 */}
        <div className="absolute inset-0 bg-[#0A0A0A] z-0"></div>
        
        {/* 참고 이미지에 나온 캡슐형 요소들 */}
        {roundedObjects.map((obj) => (
          <div 
            key={obj.id}
            className={`absolute rounded-full bg-gradient-to-r ${obj.color}`}
            style={{
              left: obj.x,
              top: obj.y,
              width: obj.width + 'px',
              height: obj.height + 'px',
              transform: `rotate(${obj.rotate}deg)`,
              filter: `blur(${obj.blur}px)`,
              opacity: obj.opacity,
            }}
          />
        ))}
        
        {/* 큰 크로와상 이미지 - 왼쪽 하단 */}
        <motion.div
          className="absolute left-[5%] bottom-[15%] z-10"
          initial={{ opacity: 0, scale: 0.8, rotate: -15 }}
          animate={{ 
            opacity: [0, 0.5, 0.5, 0], // 서서히 나타났다 서서히 사라짐
            scale: [1, 1.03, 0.98, 1],
            rotate: [-5, -8, -3, -5],
            y: [0, -15, 10, 0],
            x: [0, 10, -5, 0]
          }}
          transition={{ 
            duration: 15, 
            ease: "easeInOut", 
            repeat: Infinity,
            repeatType: "loop",
            times: [0, 0.2, 0.8, 1] // 타이밍 조절
          }}
        >
          <img 
            src={croissantImage} 
            alt="크로와상" 
            className="w-[300px] h-[300px] object-contain brightness-75" 
          />
        </motion.div>
        
        {/* 바게트 이미지 - 오른쪽 상단 */}
        <motion.div
          className="absolute right-[10%] top-[15%] z-10"
          initial={{ opacity: 0, scale: 0.8, rotate: 15 }}
          animate={{ 
            opacity: [0, 0.5, 0.5, 0], // 서서히 나타났다 서서히 사라짐
            scale: [1, 1.02, 0.97, 1],
            rotate: [10, 8, 12, 10],
            y: [0, 10, -8, 0],
            x: [0, -15, 8, 0]
          }}
          transition={{ 
            duration: 18, 
            ease: "easeInOut", 
            repeat: Infinity,
            repeatType: "loop",
            delay: 0.2,
            times: [0, 0.2, 0.8, 1] // 타이밍 조절
          }}
        >
          <img 
            src={baguetteImage} 
            alt="바게트" 
            className="w-[350px] h-[350px] object-contain brightness-75" 
          />
        </motion.div>
        
        {/* 작은 크로와상 - 오른쪽 하단 */}
        <motion.div
          className="absolute right-[20%] bottom-[25%] z-10"
          initial={{ opacity: 0, scale: 0.7, rotate: -10 }}
          animate={{ 
            opacity: [0, 0.4, 0.4, 0], // 서서히 나타났다 서서히 사라짐
            scale: [0.9, 0.93, 0.88, 0.9],
            rotate: [-5, -3, -8, -5],
            y: [0, -10, 5, 0],
            x: [0, -8, 12, 0]
          }}
          transition={{ 
            duration: 12, 
            ease: "easeInOut", 
            repeat: Infinity,
            repeatType: "loop",
            delay: 0.4,
            times: [0, 0.2, 0.8, 1] // 타이밍 조절
          }}
        >
          <img 
            src={croissantImage} 
            alt="작은 크로와상" 
            className="w-[200px] h-[200px] object-contain brightness-75" 
          />
        </motion.div>
        
        {/* 작은 바게트 - 왼쪽 상단 */}
        <motion.div
          className="absolute left-[15%] top-[25%] z-10"
          initial={{ opacity: 0, scale: 0.7, rotate: 20 }}
          animate={{ 
            opacity: [0, 0.4, 0.4, 0], // 서서히 나타났다 서서히 사라짐
            scale: [0.9, 0.92, 0.87, 0.9],
            rotate: [15, 18, 12, 15],
            y: [0, 8, -12, 0],
            x: [0, 12, -5, 0]
          }}
          transition={{ 
            duration: 14, 
            ease: "easeInOut", 
            repeat: Infinity,
            repeatType: "loop",
            delay: 0.3,
            times: [0, 0.2, 0.8, 1] // 타이밍 조절
          }}
        >
          <img 
            src={baguetteImage} 
            alt="작은 바게트" 
            className="w-[250px] h-[250px] object-contain brightness-75" 
          />
        </motion.div>
        
        {/* 추가 작은 크로와상 - 중앙 위쪽 */}
        <motion.div
          className="absolute left-[45%] top-[20%] z-10 rotate-12"
          initial={{ opacity: 0, scale: 0.5, rotate: 25 }}
          animate={{ 
            opacity: [0, 0.35, 0.35, 0], // 서서히 나타났다 서서히 사라짐
            scale: [0.65, 0.68, 0.62, 0.65],
            rotate: [25, 30, 20, 25],
            y: [0, -12, 8, 0],
            x: [0, 15, -10, 0]
          }}
          transition={{ 
            duration: 16, 
            ease: "easeInOut", 
            repeat: Infinity,
            repeatType: "loop",
            delay: 1.2,
            times: [0, 0.2, 0.8, 1] // 타이밍 조절
          }}
        >
          <img 
            src={croissantImage} 
            alt="아주 작은 크로와상" 
            className="w-[150px] h-[150px] object-contain brightness-70" 
          />
        </motion.div>
        
        {/* 추가 작은 바게트 - 중앙 아래쪽 */}
        <motion.div
          className="absolute left-[48%] bottom-[15%] z-10 rotate-[-5deg]"
          initial={{ opacity: 0, scale: 0.6, rotate: -20 }}
          animate={{ 
            opacity: [0, 0.3, 0.3, 0], // 서서히 나타났다 서서히 사라짐
            scale: [0.6, 0.63, 0.58, 0.6],
            rotate: [-20, -25, -15, -20],
            y: [0, 15, -10, 0],
            x: [0, -10, 5, 0]
          }}
          transition={{ 
            duration: 14, 
            ease: "easeInOut", 
            repeat: Infinity,
            repeatType: "loop",
            delay: 0.8,
            times: [0, 0.2, 0.8, 1] // 타이밍 조절
          }}
        >
          <img 
            src={baguetteImage} 
            alt="아주 작은 바게트" 
            className="w-[170px] h-[170px] object-contain brightness-70" 
          />
        </motion.div>

        {/* 가운데 밝은 영역 */}
        <div className="absolute top-1/6 left-1/2 w-1/2 h-1/3 -translate-x-1/2 -translate-y-1/4 bg-[#FFFFFF08] blur-[80px] rounded-full"></div>
      </div>
      
      {/* 콘텐츠 영역 - 하나로 통합 */}
      <div className="relative z-20 w-full flex flex-col flex-grow justify-between overflow-hidden">
        {/* 상단 콘텐츠 영역 */}
        <div className="pt-40 md:pt-36 w-full overflow-hidden">
          <div className="flex flex-col items-center justify-center mx-auto px-4 sm:px-8 py-8 md:py-12 w-full max-w-[800px]" style={{ wordBreak: 'keep-all' }}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6 inline-block rounded-full bg-gradient-to-r from-[#A78BFA] to-[#EC4899] px-6 sm:px-8 py-3 text-lg font-semibold text-white shadow-lg shadow-purple-500/20"
              style={{ wordBreak: 'keep-all' }}
            >
              프리미엄 베이커리
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-6 text-center max-w-full text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mx-auto mt-6"
              style={{ wordBreak: 'keep-all' }}
            >
              <span className="font-montserrat text-white">온전한 밀의 맛을 만드는</span> <br />
              <span className="font-montserrat bg-gradient-to-r from-[#A78BFA] to-[#EC4899] text-transparent bg-clip-text">더 온밀</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="font-pretendard text-gray-400 text-lg max-w-full sm:max-w-xl mx-auto mb-8 mt-8 text-center"
              style={{ wordBreak: 'keep-all', overflowWrap: 'break-word' }}
            >
              수도권 120여 개 지역중형마트에서 이미 검증된 빵을,<br />
              소비자에게 직접 전달합니다.
            </motion.p>
          </div>
        </div>
        
        {/* 버튼 영역 */}
        <div className="relative z-30 w-full max-w-md mx-auto mb-8 text-center px-4 overflow-hidden">
          <motion.div 
            className="flex flex-col sm:flex-row justify-center gap-4 mt-8 sm:mt-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <Link 
              href="/products" 
              className="px-6 py-3 rounded-full bg-gradient-to-r from-[#A78BFA] to-[#EC4899] text-white text-sm font-medium hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 max-w-[200px] mx-auto w-full sm:w-auto"
            >
              제품 탐색하기
            </Link>
            <Link 
              href="/brand" 
              className="px-6 py-3 rounded-full bg-[#11111A] border border-[#ffffff20] text-white text-sm font-medium hover:bg-[#1A1A2A] transition-all duration-300 max-w-[200px] mx-auto w-full sm:w-auto"
            >
              브랜드 이야기
            </Link>
          </motion.div>
          
          {/* 스크롤 표시기 */}
          <motion.div 
            className="flex justify-center items-center w-full mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop", ease: "easeInOut" }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4V20M12 20L18 14M12 20L6 14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}