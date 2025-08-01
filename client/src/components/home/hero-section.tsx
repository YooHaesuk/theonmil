import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { useMediaQuery } from '@/hooks/use-mobile';
import { buttonClasses } from '@/lib/fonts';
import croissantImage from '../../assets/images/bakery/croissant-transparent.png';
import baguetteImage from '../../assets/images/bakery/baguette-transparent.png';

const HeroSection = () => {
  const [scrollY, setScrollY] = useState(0);
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Parallax effect on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative h-screen flex items-center text-white overflow-hidden">
      {/* Background with bakery items */}
      <div className="absolute inset-0 bg-[#0A0A0A]">
        
        {/* 고정 위치 크로와상 이미지들 */}
        <motion.img 
          src={croissantImage} 
          alt="Croissant 1" 
          className="absolute w-24 h-24 object-contain z-10"
          style={{ top: '15%', left: '15%' }}
          animate={{
            y: [0, -10, 0],
            rotate: [0, 5, 0]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        />
        
        <motion.img 
          src={croissantImage} 
          alt="Croissant 2" 
          className="absolute w-16 h-16 object-contain z-10"
          style={{ bottom: '20%', left: '25%' }}
          animate={{
            y: [0, 8, 0],
            rotate: [0, 10, 0]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        />
        
        <motion.img 
          src={croissantImage} 
          alt="Croissant 3" 
          className="absolute w-20 h-20 object-contain z-10"
          style={{ top: '30%', right: '15%' }}
          animate={{
            y: [0, -12, 0],
            rotate: [0, -8, 0]
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        />
        
        {/* 고정 위치 바게트 이미지들 */}
        <motion.img 
          src={baguetteImage} 
          alt="Baguette 1" 
          className="absolute w-28 h-28 object-contain z-10"
          style={{ top: '60%', right: '20%' }}
          animate={{
            y: [0, 15, 0],
            rotate: [0, -8, 0]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        />
        
        <motion.img 
          src={baguetteImage} 
          alt="Baguette 2" 
          className="absolute w-32 h-32 object-contain z-10"
          style={{ top: '40%', left: '60%' }}
          animate={{
            y: [0, 10, 0],
            rotate: [0, 15, 0]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        />
        
        <motion.img 
          src={baguetteImage} 
          alt="Baguette 3" 
          className="absolute w-24 h-24 object-contain z-10"
          style={{ bottom: '15%', right: '35%' }}
          animate={{
            y: [0, -12, 0],
            rotate: [0, -10, 0]
          }}
          transition={{
            duration: 5.5,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        />
        
        {/* Gradients for visual effect */}
        <div className="absolute inset-x-20 top-[40%] bg-gradient-to-r from-transparent via-[#A78BFA] to-transparent h-[2px] w-3/4 blur-sm"></div>
        <div className="absolute inset-x-20 top-[40%] bg-gradient-to-r from-transparent via-[#EC4899] to-transparent h-px w-3/4"></div>
        
        {/* Radial Gradient to prevent sharp edges */}
        <div className="absolute inset-0 w-full h-full bg-[#0A0A0A] [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,black)]"></div>
      </div>
      
      {/* Hero content */}
      <div 
        className="container mx-auto px-4 relative z-30"
        style={{ transform: `translateY(${scrollY * 0.2}px)` }}
      >
        <motion.div 
          className="max-w-2xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-6xl font-montserrat font-bold mb-4">
            <motion.span 
              className="bg-gradient-to-r from-[#A78BFA] to-[#EC4899] text-transparent bg-clip-text block"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              온전한 밀의 맛,
            </motion.span>
            <motion.span 
              className="block text-white"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              더 온밀
            </motion.span>
          </h1>
          <motion.p 
            className="font-pretendard text-base md:text-xl mb-8 text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            수도권 120여 개 지역중형마트에서 이미 검증된 빵을, 소비자에게 직접 전달합니다. 정직한 공정, 현장 기반 신뢰를 만나보세요.
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <Link href="/products" className={buttonClasses.primary}>
              제품 탐색하기
            </Link>
            <Link href="/brand" className={buttonClasses.light}>
              브랜드 이야기
            </Link>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30"
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: 1,
          y: [0, 10, 0]
        }}
        transition={{
          opacity: { duration: 0.6, delay: 1.2 },
          y: { 
            duration: 1.5,
            repeat: Infinity,
            repeatType: "loop"
          }
        }}
        whileHover={{ y: 5 }}
      >
        <i className="fa-solid fa-chevron-down text-white text-2xl"></i>
      </motion.div>
    </section>
  );
};

export default HeroSection;
