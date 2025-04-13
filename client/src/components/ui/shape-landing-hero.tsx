"use client";
import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

interface Shape {
  id: number;
  x: number;
  y: number;
  rotate: number;
  opacity: number;
  scale: number;
  type: string;
  delay: number;
}

// 베이커리 SVG 아이콘 컴포넌트
const BreadIcon = () => (
  <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.5 2 2 5.5 2 9.5C2 13.5 6.5 17 12 17C17.5 17 22 13.5 22 9.5C22 5.5 17.5 2 12 2Z" stroke="url(#bread-gradient)" strokeWidth="1.5" />
    <defs>
      <linearGradient id="bread-gradient" x1="2" y1="2" x2="22" y2="17" gradientUnits="userSpaceOnUse">
        <stop stopColor="#A78BFA" />
        <stop offset="1" stopColor="#EC4899" />
      </linearGradient>
    </defs>
  </svg>
);

const CroissantIcon = () => (
  <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 4C2.9 5.1 2 6.5 2 8C2 9.5 3 12 5 13C7 14 10 14 12 12C14 10 14 7 13 5C12 3 9.5 2 8 2C6.5 2 5.1 2.9 4 4Z" stroke="url(#croissant-gradient)" strokeWidth="1.5" />
    <defs>
      <linearGradient id="croissant-gradient" x1="2" y1="2" x2="14" y2="14" gradientUnits="userSpaceOnUse">
        <stop stopColor="#60A5FA" />
        <stop offset="1" stopColor="#3B82F6" />
      </linearGradient>
    </defs>
  </svg>
);

const DonutIcon = () => (
  <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="8" stroke="url(#donut-gradient)" strokeWidth="1.5" />
    <circle cx="12" cy="12" r="3" stroke="url(#donut-gradient)" strokeWidth="1.5" />
    <defs>
      <linearGradient id="donut-gradient" x1="4" y1="4" x2="20" y2="20" gradientUnits="userSpaceOnUse">
        <stop stopColor="#F87171" />
        <stop offset="1" stopColor="#EF4444" />
      </linearGradient>
    </defs>
  </svg>
);

const MuffinIcon = () => (
  <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 9C18 5.68629 15.3137 3 12 3C8.68629 3 6 5.68629 6 9H4V11C4 11 6 13 12 13C18 13 20 11 20 11V9H18Z" stroke="url(#muffin-gradient)" strokeWidth="1.5" />
    <defs>
      <linearGradient id="muffin-gradient" x1="4" y1="3" x2="20" y2="13" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FBBF24" />
        <stop offset="1" stopColor="#F59E0B" />
      </linearGradient>
    </defs>
  </svg>
);

// 컴포넌트 맵핑
const BakeryIcons = {
  "bread": BreadIcon,
  "croissant": CroissantIcon,
  "donut": DonutIcon,
  "muffin": MuffinIcon,
};

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
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // 창 크기에 따라 도형 개수 조정
  const getShapeCount = () => {
    if (dimensions.width < 640) return 8;
    if (dimensions.width < 1024) return 12;
    return 16;
  };

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

  // 도형 초기화
  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return;

    const types = ["bread", "croissant", "donut", "muffin"];

    const newShapes: Shape[] = Array.from(
      { length: getShapeCount() },
      (_, i) => ({
        id: i,
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height,
        rotate: Math.random() * 360,
        opacity: Math.random() * 0.3 + 0.2,
        scale: Math.random() * 0.4 + 0.6,
        type: types[Math.floor(Math.random() * types.length)],
        delay: Math.random() * 2,
      })
    );

    setShapes(newShapes);
  }, [dimensions]);

  return (
    <div 
      ref={containerRef}
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#0A0A0A]"
    >
      {/* 배경 그라데이션 */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-[#0F0F1A] to-[#0A0A0A] opacity-80"></div>
      
      {/* 움직이는 빵 모양 아이콘들 */}
      {shapes.map((shape) => {
        let Icon;
        if (shape.type === "bread") Icon = BreadIcon;
        else if (shape.type === "croissant") Icon = CroissantIcon;
        else if (shape.type === "donut") Icon = DonutIcon;
        else if (shape.type === "muffin") Icon = MuffinIcon;
        else Icon = BreadIcon;  // 기본 아이콘
        
        return (
          <motion.div
            key={shape.id}
            className="absolute"
            style={{
              opacity: shape.opacity,
            }}
            initial={{
              x: shape.x,
              y: shape.y,
              rotate: shape.rotate,
              scale: shape.scale,
              opacity: 0,
            }}
            animate={{
              x: [shape.x, shape.x + Math.random() * 100 - 50, shape.x],
              y: [shape.y, shape.y + Math.random() * 100 - 50, shape.y],
              rotate: shape.rotate + 180,
              opacity: [0, shape.opacity, 0],
            }}
            transition={{
              duration: Math.random() * 15 + 20,
              repeat: Infinity,
              ease: "linear",
              delay: shape.delay,
            }}
          >
            <Icon />
          </motion.div>
        );
      })}

      {/* 가운데 밝은 영역 만들기 */}
      <div className="absolute top-1/2 left-1/2 w-1/2 h-1/3 -translate-x-1/2 -translate-y-1/2 bg-[#FFFFFF05] blur-[100px] rounded-full"></div>

      {/* 중앙 컨텐츠 */}
      <div className="relative z-10 m-8 max-w-[800px] text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 inline-block rounded-full bg-[#11111A] border border-[#ffffff20] px-4 py-1.5 text-xs font-medium text-white"
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

      {/* 하단 그라데이션 */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#0A0A0A] to-transparent"></div>
    </div>
  );
}