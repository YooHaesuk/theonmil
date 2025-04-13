"use client";
import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import croissantImage from '../../assets/images/bakery/croissant-transparent.png';
import baguetteImage from '../../assets/images/bakery/baguette-transparent.png';

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

// 베이커리 아이콘 컴포넌트 - 크기 크게 키움
const BreadIcon = () => (
  <img src={baguetteImage} alt="Bread" className="w-48 h-48 object-contain" />
);

const CroissantIcon = () => (
  <img src={croissantImage} alt="Croissant" className="w-40 h-40 object-contain" />
);

const DonutIcon = () => (
  <img src={croissantImage} alt="Croissant" className="w-32 h-32 object-contain" />
);

const MuffinIcon = () => (
  <img src={baguetteImage} alt="Bread" className="w-56 h-56 object-contain" />
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
    
    // 화면을 3x3 그리드로 나누어 더 균형있는 배치를 만듭니다
    const gridCols = 3;
    const gridRows = 3;
    const colWidth = dimensions.width / gridCols;
    const rowHeight = dimensions.height / gridRows;
    
    const newShapes: Shape[] = Array.from(
      { length: getShapeCount() },
      (_, i) => {
        // 그리드 위치 계산
        const gridCol = i % gridCols;
        const gridRow = Math.floor((i % (gridCols * gridRows)) / gridCols);
        
        // 각 그리드 셀 내에서 랜덤한 위치 (약간의 오프셋 추가)
        const x = (gridCol * colWidth) + (Math.random() * 0.8 + 0.1) * colWidth;
        const y = (gridRow * rowHeight) + (Math.random() * 0.8 + 0.1) * rowHeight;
        
        return {
          id: i,
          x,
          y,
          rotate: Math.random() * 360,
          opacity: 0.95, // 거의 완전 불투명
          scale: Math.random() * 0.3 + 0.7, // 더 일관된 크기
          type: types[Math.floor(Math.random() * types.length)],
          delay: Math.random() * 5, // 더 다양한 시작 시간
        };
      }
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
              opacity: shape.opacity,
            }}
            animate={{
              x: [shape.x, shape.x + Math.random() * 100 - 50, shape.x],
              y: [shape.y, shape.y + Math.random() * 100 - 50, shape.y],
              rotate: shape.rotate + 180,
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

      {/* 하단 그라데이션 */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#0A0A0A] to-transparent"></div>
    </div>
  );
}