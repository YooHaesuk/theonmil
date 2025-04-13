"use client";
import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import croissantImage from '../../assets/images/bakery/croissant-transparent.png';
import baguetteImage from '../../assets/images/bakery/baguette-transparent.png';

// 캡슐형 객체 정의 
interface RoundedObject {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  rotate: number;
  color: string;
  blur: number;
  opacity: number;
}

export function HeroGeometric({
  badge,
  title1,
  title2,
}: {
  badge: string;
  title1: string;
  title2: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  
  // 참고 이미지에 나온 캡슐 모양 요소들 (고정 위치)
  const roundedObjects: RoundedObject[] = [
    { id: 1, x: '15%', y: '20%', width: 300, height: 60, rotate: 30, color: 'from-[#312E81] to-[#4B21A6]', blur: 60, opacity: 0.15 },
    { id: 2, x: '75%', y: '30%', width: 200, height: 50, rotate: -15, color: 'from-[#4B21A6] to-[#A367DC]', blur: 70, opacity: 0.2 },
    { id: 3, x: '25%', y: '75%', width: 250, height: 55, rotate: 10, color: 'from-[#A367DC] to-[#EB4D77]', blur: 80, opacity: 0.15 },
    { id: 4, x: '80%', y: '70%', width: 180, height: 60, rotate: -25, color: 'from-[#0F0F1A] to-[#312E81]', blur: 50, opacity: 0.2 },
  ];

  // 화면 크기 변경 감지
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    
    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#0A0A0A]"
    >
      {/* 어두운 배경 */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-[#101020] to-[#0A0A0A] opacity-95"></div>
      
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
        animate={{ opacity: 0.9, scale: 1, rotate: -5 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <img 
          src={croissantImage} 
          alt="크로와상" 
          className="w-[300px] h-[300px] object-contain" 
        />
      </motion.div>
      
      {/* 바게트 이미지 - 오른쪽 상단 */}
      <motion.div
        className="absolute right-[10%] top-[15%] z-10"
        initial={{ opacity: 0, scale: 0.8, rotate: 15 }}
        animate={{ opacity: 0.9, scale: 1, rotate: 10 }}
        transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
      >
        <img 
          src={baguetteImage} 
          alt="바게트" 
          className="w-[350px] h-[350px] object-contain" 
        />
      </motion.div>
      
      {/* 작은 크로와상 - 오른쪽 하단 */}
      <motion.div
        className="absolute right-[20%] bottom-[25%] z-10"
        initial={{ opacity: 0, scale: 0.7, rotate: -10 }}
        animate={{ opacity: 0.8, scale: 0.9, rotate: -5 }}
        transition={{ duration: 1.5, ease: "easeOut", delay: 0.4 }}
      >
        <img 
          src={croissantImage} 
          alt="작은 크로와상" 
          className="w-[200px] h-[200px] object-contain" 
        />
      </motion.div>
      
      {/* 작은 바게트 - 왼쪽 상단 */}
      <motion.div
        className="absolute left-[15%] top-[25%] z-10"
        initial={{ opacity: 0, scale: 0.7, rotate: 20 }}
        animate={{ opacity: 0.8, scale: 0.9, rotate: 15 }}
        transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
      >
        <img 
          src={baguetteImage} 
          alt="작은 바게트" 
          className="w-[250px] h-[250px] object-contain" 
        />
      </motion.div>

      {/* 가운데 밝은 영역 */}
      <div className="absolute top-1/2 left-1/2 w-1/2 h-1/3 -translate-x-1/2 -translate-y-1/2 bg-[#FFFFFF05] blur-[100px] rounded-full"></div>

      {/* 중앙 컨텐츠 */}
      <div className="relative z-20 m-8 max-w-[800px] text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 inline-block rounded-full bg-gradient-to-r from-[#A78BFA] to-[#EC4899] px-8 py-3 text-lg font-semibold text-white shadow-lg shadow-purple-500/20"
        >
          {badge}
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6 mt-4 max-w-3xl text-5xl font-bold md:text-6xl lg:text-7xl mx-auto"
        >
          <span className="font-montserrat text-white">{title1}</span> <br />
          <span className="font-montserrat bg-gradient-to-r from-[#A78BFA] to-[#EC4899] text-transparent bg-clip-text">{title2}</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="font-pretendard text-gray-400 text-lg max-w-xl mx-auto"
        >
          수도권 120여 개 지역중형마트에서 이미 검증된 빵을, 소비자에게 직접 전달합니다.
        </motion.p>
      </div>
    </div>
  );
}