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
    <section className="relative h-screen flex items-center bg-[#1B1B1B] text-white overflow-hidden">
      {/* Background video (desktop only) */}
      {!isMobile && (
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black bg-opacity-40 z-10"></div>
          <div className="w-full h-full object-cover">
            <video 
              className="w-full h-full object-cover" 
              autoPlay 
              loop 
              muted 
              playsInline
            >
              <source src="https://assets.mixkit.co/videos/preview/mixkit-baking-bread-in-an-oven-9913-large.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      )}
      
      {/* Background image (mobile) */}
      {isMobile && (
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black bg-opacity-50 z-10"></div>
          <img 
            src="https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1172&q=80" 
            alt="Fresh baked bread" 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
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
