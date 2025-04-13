"use client";
import React, { useRef, useEffect, useState } from "react";
import { useMediaQuery } from "@/hooks/use-mobile";
import { motion } from "framer-motion";

interface BakerySparklesProps {
  className?: string;
  background?: string;
  minSize?: number;
  maxSize?: number;
  speed?: number;
  particleCount?: number;
  particleImages: string[];
}

// Particle component using floating images
const FloatingBakeryItem = ({ 
  src, 
  size, 
  position, 
  initialRotation,
  speed 
}: { 
  src: string; 
  size: number; 
  position: { x: number; y: number }; 
  initialRotation: number;
  speed: number;
}) => {
  const rotationVariants = {
    animate: {
      rotate: initialRotation + (Math.random() > 0.5 ? 360 : -360),
      transition: {
        duration: 20 + (Math.random() * 30),
        repeat: Infinity,
        ease: "linear",
      }
    }
  };

  const floatVariants = {
    animate: {
      x: [position.x, position.x + (Math.random() * 100 - 50) * speed],
      y: [position.y, position.y + (Math.random() * 100 - 50) * speed],
      transition: {
        x: {
          duration: 10 + (Math.random() * 20),
          repeat: Infinity,
          repeatType: "reverse" as const,
          ease: "easeInOut",
        },
        y: {
          duration: 15 + (Math.random() * 20),
          repeat: Infinity,
          repeatType: "reverse" as const,
          ease: "easeInOut",
        },
      }
    }
  };

  return (
    <motion.div
      className="absolute opacity-30 filter blur-[1px]"
      style={{ 
        width: size, 
        height: size * 0.6, // Adjust height for natural proportion
      }}
      initial={{ x: position.x, y: position.y }}
      variants={floatVariants}
      animate="animate"
    >
      <motion.div
        className="w-full h-full"
        variants={rotationVariants}
        animate="animate"
      >
        <img 
          src={src} 
          alt="Bakery item" 
          className="w-full h-full object-contain"
        />
      </motion.div>
    </motion.div>
  );
};

export function BakerySparkles({
  className = "",
  background = "transparent",
  minSize = 80,
  maxSize = 180,
  speed = 1,
  particleCount = 12,
  particleImages
}: BakerySparklesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [particles, setParticles] = useState<React.ReactNode[]>([]);
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    // Adjust for mobile
    const actualMinSize = isMobile ? minSize * 0.6 : minSize;
    const actualMaxSize = isMobile ? maxSize * 0.6 : maxSize;
    const actualCount = isMobile ? Math.floor(particleCount * 0.6) : particleCount;
    
    const newParticles = [];
    
    for (let i = 0; i < actualCount; i++) {
      const size = Math.random() * (actualMaxSize - actualMinSize) + actualMinSize;
      const imageIndex = Math.floor(Math.random() * particleImages.length);
      
      newParticles.push(
        <FloatingBakeryItem
          key={i}
          src={particleImages[imageIndex]}
          size={size}
          position={{
            x: Math.random() * width,
            y: Math.random() * height,
          }}
          initialRotation={Math.random() * 360}
          speed={speed}
        />
      );
    }
    
    setParticles(newParticles);
  }, [containerRef, minSize, maxSize, particleCount, particleImages, isMobile, speed]);

  return (
    <div
      ref={containerRef}
      className={`w-full h-full absolute inset-0 overflow-hidden ${className}`}
      style={{ background }}
    >
      {particles}
    </div>
  );
}