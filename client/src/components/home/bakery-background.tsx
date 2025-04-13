import { useEffect, useState, useMemo } from 'react';
import croissantImage from '../../assets/images/bakery/croissant-transparent.png';
import baguetteImage from '../../assets/images/bakery/baguette-transparent.png';
import { useMobile } from '@/hooks/use-mobile';
import { motion } from 'framer-motion';

// 떠다니는 빵 아이템 타입 정의
interface BakeryItem {
  id: number;
  x: number;
  y: number;
  size: number;
  rotate: number;
  opacity: number;
  image: string;
}

export function BakeryBackground() {
  const isMobile = useMobile();
  const [items, setItems] = useState<BakeryItem[]>([]);
  
  // 화면 크기에 맞게 아이템 개수 조정
  const itemCount = useMemo(() => isMobile ? 8 : 15, [isMobile]);
  
  // 컴포넌트 마운트 시 떠다니는 아이템 초기화
  useEffect(() => {
    const newItems: BakeryItem[] = [];
    
    // 랜덤 아이템 생성
    for (let i = 0; i < itemCount; i++) {
      newItems.push({
        id: i,
        x: Math.random() * 100,  // 화면의 x 위치 (%)
        y: Math.random() * 100,  // 화면의 y 위치 (%)
        size: Math.random() * 60 + 40,  // 아이템 크기 (40~100px)
        rotate: Math.random() * 360,  // 회전 각도
        opacity: Math.random() * 0.3 + 0.6,  // 투명도 (0.6~0.9)
        image: Math.random() > 0.5 ? croissantImage : baguetteImage  // 빵 이미지 랜덤 선택
      });
    }
    
    setItems(newItems);
  }, [itemCount]);
  
  return (
    <div className="absolute inset-0 overflow-hidden">
      {items.map((item) => (
        <motion.div
          key={item.id}
          className="absolute"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            opacity: item.opacity,
          }}
          animate={{
            x: [0, Math.random() * 100 - 50, 0],
            y: [0, Math.random() * 100 - 50, 0],
            rotate: [item.rotate, item.rotate + 20, item.rotate - 20, item.rotate],
          }}
          transition={{
            duration: Math.random() * 25 + 15, // 15~40초 동안 움직임
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        >
          <img
            src={item.image}
            alt="Bakery Item"
            style={{
              width: `${item.size}px`,
              height: `${item.size}px`,
              objectFit: 'contain',
              filter: 'brightness(1.5) contrast(1.2)',
            }}
            className="select-none pointer-events-none"
          />
        </motion.div>
      ))}
    </div>
  );
}

export default BakeryBackground;