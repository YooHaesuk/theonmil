import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { useMediaQuery } from '@/hooks/use-mobile';
import { buttonClasses } from '@/lib/fonts';

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
    <section className="relative h-screen flex items-center bg-gradient-to-br from-[#1B1B1B] to-[#2D2D2D] text-white overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[#1B1B1B]">
          {/* Decorative gold accents */}
          <div className="absolute top-[20%] right-[10%] w-32 h-32 rounded-full bg-[#D4AF37] opacity-10 blur-xl"></div>
          <div className="absolute bottom-[30%] left-[5%] w-40 h-40 rounded-full bg-[#D4AF37] opacity-5 blur-xl"></div>
          
          {/* Pattern overlay */}
          <div className="absolute inset-0 opacity-10" 
               style={{ 
                 backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(255,255,255,0.1) 2px, transparent 0)', 
                 backgroundSize: '50px 50px' 
               }}>
          </div>
        </div>
      </div>
      
      {/* Hero content */}
      <div 
        className="container mx-auto px-4 relative z-20"
        style={{ transform: `translateY(${scrollY * 0.2}px)` }}
      >
        <motion.div 
          className="max-w-2xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-6xl font-playfair font-bold mb-4">
            <motion.span 
              className="text-[#D4AF37] block"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              이 사이트의 브래드는,
            </motion.span>
            <motion.span 
              className="block"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              빵답게
            </motion.span>
          </h1>
          <motion.p 
            className="font-maruburi text-base md:text-xl mb-8 text-[#F5F3EF]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            수도권 200여 개 대형마트에서 이미 검증된 빵을, 소비자에게 직접 전달합니다. 정직한 공정, 현장 기반 신뢰를 만나보세요.
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
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
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
