"use client";
import React, { useRef, useEffect } from "react";
import { useAnimationFrame, useMotionValue } from "framer-motion";

export interface SparklesProps {
  id?: string;
  background?: string;
  minSize?: number;
  maxSize?: number;
  speed?: number;
  particleColor?: string;
  className?: string;
  particleDensity?: number;
}

export const SparklesCore = ({
  id = "tsparticles",
  background = "#000",
  minSize = 0.6,
  maxSize = 1.4,
  speed = 1,
  particleColor = "#fff",
  className = "",
  particleDensity = 100,
}: SparklesProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const context = useRef<CanvasRenderingContext2D | null>(null);
  const particles = useRef<any[]>([]);
  const mousePosition = useMotionValue({ x: 0, y: 0 });
  const mouseIsActive = useRef(false);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    context.current = canvasRef.current.getContext("2d");
  }, []);

  useEffect(() => {
    if (!canvasRef.current || !context.current) return;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        mousePosition.set({ x, y });
      }
    };
    
    const handleMouseOver = () => {
      mouseIsActive.current = true;
    };
    
    const handleMouseOut = () => {
      mouseIsActive.current = false;
    };
    
    const resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        if (canvasRef.current && canvasContainerRef.current) {
          canvasRef.current.width = canvasContainerRef.current.clientWidth;
          canvasRef.current.height = canvasContainerRef.current.clientHeight;
          initParticles(); // Reinitialize particles on resize
        }
      });
    });
    
    if (canvasContainerRef.current) {
      resizeObserver.observe(canvasContainerRef.current);
    }
    
    canvasRef.current.addEventListener("mousemove", handleMouseMove);
    canvasRef.current.addEventListener("mouseover", handleMouseOver);
    canvasRef.current.addEventListener("mouseout", handleMouseOut);
    
    return () => {
      if (canvasContainerRef.current) {
        resizeObserver.unobserve(canvasContainerRef.current);
      }
      canvasRef.current?.removeEventListener("mousemove", handleMouseMove);
      canvasRef.current?.removeEventListener("mouseover", handleMouseOver);
      canvasRef.current?.removeEventListener("mouseout", handleMouseOut);
    };
  }, [mousePosition]);

  const initParticles = () => {
    if (!canvasRef.current || !context.current) return;
    
    particles.current = [];
    const { width, height } = canvasRef.current;
    const particleCount = Math.min(Math.max(Math.floor((width * height) / 8000) * particleDensity, 100), 1000);
    
    for (let i = 0; i < particleCount; i++) {
      particles.current.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * (maxSize - minSize) + minSize,
        speedX: (Math.random() - 0.5) * 0.8 * speed,
        speedY: (Math.random() - 0.5) * 0.8 * speed,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }
  };

  useEffect(() => {
    if (canvasRef.current && canvasContainerRef.current && context.current) {
      canvasRef.current.width = canvasContainerRef.current.clientWidth;
      canvasRef.current.height = canvasContainerRef.current.clientHeight;
      initParticles();
    }
  }, [maxSize, minSize, particleColor, particleDensity, speed]);

  useAnimationFrame(() => {
    if (!context.current || !canvasRef.current) return;
    
    const { width, height } = canvasRef.current;
    
    // Clear canvas
    context.current.clearRect(0, 0, width, height);
    
    // Update and draw particles
    particles.current.forEach((particle) => {
      // Move particles
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      
      // Handle boundary conditions
      if (particle.x < 0 || particle.x > width) {
        particle.speedX = -particle.speedX;
      }
      
      if (particle.y < 0 || particle.y > height) {
        particle.speedY = -particle.speedY;
      }
      
      // Draw particle
      context.current!.beginPath();
      context.current!.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      context.current!.fillStyle = `${particleColor}${Math.floor(particle.opacity * 255).toString(16)}`;
      context.current!.fill();
    });
    
    // Apply mouse interaction if active
    if (mouseIsActive.current) {
      const mousePos = mousePosition.get();
      particles.current.forEach((particle) => {
        const dx = mousePos.x - particle.x;
        const dy = mousePos.y - particle.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 100;
        
        if (dist < maxDist) {
          const forceFactor = (maxDist - dist) / maxDist;
          particle.speedX = particle.speedX - (dx * forceFactor * 0.02);
          particle.speedY = particle.speedY - (dy * forceFactor * 0.02);
        }
      });
    }
  });

  return (
    <div className={className} ref={canvasContainerRef} style={{ width: "100%", height: "100%", background }}>
      <canvas ref={canvasRef} id={id} style={{ display: "block" }} />
    </div>
  );
};