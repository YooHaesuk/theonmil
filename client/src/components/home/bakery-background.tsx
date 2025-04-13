import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useMediaQuery } from '@/hooks/use-mobile';

// Import bakery images
import croissantImage from '@/assets/images/bakery/croissant-transparent.png';
import baguetteImage from '@/assets/images/bakery/baguette-transparent.png';

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
  const containerRef = useRef<HTMLDivElement>(null);
  const [bakeryItems, setBakeryItems] = useState<BakeryItem[]>([]);
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    const itemCount = isMobile ? 8 : 14;
    const newItems: BakeryItem[] = [];
    
    for (let i = 0; i < itemCount; i++) {
      // Alternate between croissant and baguette
      const image = i % 2 === 0 ? croissantImage : baguetteImage;
      const size = Math.random() * (180 - 80) + 80;
      
      // Create a new bakery item with random position, size, rotation
      newItems.push({
        id: i,
        x: Math.random() * width,
        y: Math.random() * height,
        size,
        rotate: Math.random() * 360,
        opacity: 0.3 + Math.random() * 0.2,
        image
      });
    }
    
    setBakeryItems(newItems);
  }, [isMobile]);
  
  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 overflow-hidden"
      style={{ zIndex: 1 }}
    >
      {bakeryItems.map((item) => (
        <motion.div
          key={item.id}
          className="absolute"
          style={{
            left: item.x,
            top: item.y,
            width: item.size,
            height: item.size,
            opacity: item.opacity,
          }}
          animate={{
            x: [0, Math.random() * 50 - 25, 0],
            y: [0, Math.random() * 50 - 25, 0],
            rotate: [0, item.id % 2 === 0 ? 360 : -360]
          }}
          transition={{
            x: {
              repeat: Infinity,
              duration: 10 + Math.random() * 10,
              ease: "easeInOut"
            },
            y: {
              repeat: Infinity,
              duration: 15 + Math.random() * 10,
              ease: "easeInOut"
            },
            rotate: {
              repeat: Infinity,
              duration: 20 + Math.random() * 20,
              ease: "linear"
            }
          }}
        >
          <img 
            src={item.image} 
            alt="Bakery item" 
            className="w-full h-full object-contain" 
          />
        </motion.div>
      ))}
    </div>
  );
}