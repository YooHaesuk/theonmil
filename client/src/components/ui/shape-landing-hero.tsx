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
      
      {/* 움직이는 빵 이미지들 */}
      {shapes.map((shape) => {
        // 이미지 소스 결정 - 크로와상 또는 바게트
        const imageSrc = shape.type === "croissant" || shape.type === "donut" 
          ? croissantImage 
          : baguetteImage;
        
        // 이미지 크기 계산 - 유형에 따라 다르게 설정
        const imageSize = shape.type === "croissant" || shape.type === "donut"
          ? 60 * shape.scale  // 크로와상은 작게
          : 100 * shape.scale;  // 바게트는 좀 더 크게
        
        return (
          <motion.div
            key={shape.id}
            className="absolute z-10"
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
            <img 
              src={imageSrc} 
              alt="Bakery item" 
              style={{ 
                width: `${imageSize}px`,
                height: `${imageSize}px`,
                objectFit: 'contain',
              }}
              className="select-none"
            />
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