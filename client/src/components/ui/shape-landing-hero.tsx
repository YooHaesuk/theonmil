"use client";
import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

interface Shape {
  id: number;
  x: number;
  y: number;
  scale: number;
  rotate: number;
  opacity: number;
  type: "bread" | "croissant" | "donut" | "pretzel" | "muffin";
}

// SVG 빵 모양들 - 단순화된 아이콘
const BreadIcon = ({ className = "" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="#D4AF37"
    className={className}
  >
    <path d="M12 2C6.5 2 2 5.5 2 9.5c0 3 2.5 5.5 6 6.5v4c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2v-4c3.5-1 6-3.5 6-6.5C22 5.5 17.5 2 12 2zm0 2c4.4 0 8 2.5 8 5.5S16.4 15 12 15s-8-2.5-8-5.5S7.6 4 12 4z" />
  </svg>
);

const CroissantIcon = ({ className = "" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="#D4AF37"
    className={className}
  >
    <path d="M22 19l-3-2v-2l-9-5V8L5 4 2 5v3l3 2v2l10 5v2l3 2z" />
  </svg>
);

const DonutIcon = ({ className = "" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="#D4AF37"
    className={className}
  >
    <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 4c2.76 0 5 2.24 5 5s-2.24 5-5 5-5-2.24-5-5 2.24-5 5-5z" />
  </svg>
);

const PretzelIcon = ({ className = "" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="#D4AF37"
    className={className}
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 13l-4-4 4-4 4 4-4 4z" />
  </svg>
);

const MuffinIcon = ({ className = "" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="#D4AF37"
    className={className}
  >
    <path d="M18.38 6.24C17.79 3.24 15.14 1 12 1S6.21 3.24 5.62 6.24C4.08 6.67 3 8.09 3 9.75c0 2.07 1.68 3.75 3.75 3.75l.43-.03L7 23h10l-.18-9.54.43.03c2.07 0 3.75-1.68 3.75-3.75 0-1.66-1.08-3.08-2.62-3.5z" />
  </svg>
);

// 빵 아이콘 매핑
const BreadIcons: Record<
  string,
  React.FC<{ className?: string }>
> = {
  bread: BreadIcon,
  croissant: CroissantIcon,
  donut: DonutIcon,
  pretzel: PretzelIcon,
  muffin: MuffinIcon,
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
    if (dimensions.width < 640) return 6;
    if (dimensions.width < 1024) return 10;
    return 15;
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

    const types: ("bread" | "croissant" | "donut" | "pretzel" | "muffin")[] = [
      "bread", 
      "croissant", 
      "donut", 
      "pretzel", 
      "muffin"
    ];

    const newShapes: Shape[] = Array.from(
      { length: getShapeCount() },
      (_, i) => ({
        id: i,
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height,
        scale: Math.random() * 0.5 + 0.5,
        rotate: Math.random() * 360,
        opacity: Math.random() * 0.4 + 0.1,
        type: types[Math.floor(Math.random() * types.length)],
      })
    );

    setShapes(newShapes);
  }, [dimensions]);

  return (
    <div 
      ref={containerRef}
      className="relative flex min-h-[70vh] w-full items-center justify-center overflow-hidden rounded-md bg-[#0D0D0D]"
    >
      {/* 배경 도형들 */}
      {shapes.map((shape) => {
        const Icon = BreadIcons[shape.type];
        
        return (
          <motion.div
            key={shape.id}
            className="absolute"
            initial={{
              x: shape.x,
              y: shape.y,
              scale: shape.scale,
              rotate: shape.rotate,
              opacity: shape.opacity,
            }}
            animate={{
              x: [shape.x, shape.x + Math.random() * 100 - 50, shape.x],
              y: [shape.y, shape.y + Math.random() * 100 - 50, shape.y],
              rotate: shape.rotate + 360,
            }}
            transition={{
              duration: Math.random() * 10 + 20,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <Icon className="h-16 w-16" />
          </motion.div>
        );
      })}

      {/* 컨텐츠 */}
      <div className="relative z-10 m-8 max-w-[800px] rounded-lg p-8 sm:mx-auto md:p-16">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4 inline-block rounded-full bg-gradient-to-r from-[#D4AF37] to-[#E5C76B] px-4 py-1.5 text-xs font-medium text-black"
        >
          {badge}
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-gradient-gold mb-4 mt-4 max-w-3xl text-5xl font-bold md:text-6xl lg:text-7xl"
        >
          {title1} <br />
          {title2}
        </motion.h1>
      </div>
    </div>
  );
}

// CSS 스타일 추가를 위한 클래스
const addGradientStyles = () => {
  if (typeof document !== "undefined") {
    const style = document.createElement("style");
    style.textContent = `
      .text-gradient-gold {
        background: linear-gradient(to right, #FFFFFF, #D4AF37);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-fill-color: transparent;
      }
    `;
    document.head.appendChild(style);
  }
};

// 페이지 로딩 시 스타일 추가
if (typeof window !== "undefined") {
  addGradientStyles();
}