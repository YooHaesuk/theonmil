import React from 'react';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { useMediaQuery } from '@/hooks/use-mobile';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [location] = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    // Prevent scrolling when menu is open
    if (!isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  };

  // Close menu on location change
  useEffect(() => {
    setIsMenuOpen(false);
    document.body.style.overflow = 'auto';
  }, [location]);

  // Add scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle resizing
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMenuOpen) {
        setIsMenuOpen(false);
        document.body.style.overflow = 'auto';
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMenuOpen]);

  return (
    <header className={`fixed top-0 left-0 right-0 bg-[#0A0A0A] z-50 transition-shadow duration-300 ${isScrolled ? 'shadow-md' : 'shadow-sm'} backdrop-blur-sm bg-opacity-90`}>
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <div className="text-2xl md:text-3xl font-bold font-montserrat">
            <span className="bg-gradient-to-r from-[#A78BFA] to-[#EC4899] text-transparent bg-clip-text">ube75ub2f5uac8c</span>
          </div>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8 items-center">
          <Link href="/brand" className="font-montserrat text-sm font-medium text-gray-300 hover:text-white transition-colors duration-300 relative group">
            <span>브랜드 소개</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#A78BFA] to-[#EC4899] transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link href="/products" className="font-montserrat text-sm font-medium text-gray-300 hover:text-white transition-colors duration-300 relative group">
            <span>제품 보기</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#A78BFA] to-[#EC4899] transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link href="/stores" className="font-montserrat text-sm font-medium text-gray-300 hover:text-white transition-colors duration-300 relative group">
            <span>매장 안내</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#A78BFA] to-[#EC4899] transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link href="/reviews" className="font-montserrat text-sm font-medium text-gray-300 hover:text-white transition-colors duration-300 relative group">
            <span>후기</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#A78BFA] to-[#EC4899] transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link href="/b2b" className="font-montserrat text-sm font-medium text-gray-300 hover:text-white transition-colors duration-300 relative group">
            <span>기업 제휴</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#A78BFA] to-[#EC4899] transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <div className="flex items-center space-x-4 ml-4">
            <button aria-label="검색" className="text-gray-300 hover:text-white transition-colors duration-300">
              <i className="fa-solid fa-search text-lg"></i>
            </button>
            <Link href="/cart" className="text-gray-300 hover:text-white transition-colors duration-300 relative">
              <i className="fa-solid fa-shopping-bag text-lg"></i>
              {/* <span className="absolute -top-1 -right-1 bg-gradient-to-r from-[#A78BFA] to-[#EC4899] text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">2</span> */}
            </Link>
            <Link href="/login" className="text-gray-300 hover:text-white transition-colors duration-300">
              <i className="fa-solid fa-user text-lg"></i>
            </Link>
          </div>
        </nav>
        
        {/* Mobile Menu Button */}
        <button 
          aria-label={isMenuOpen ? "메뉴 닫기" : "메뉴 열기"} 
          onClick={toggleMenu} 
          className="md:hidden flex flex-col justify-center items-center w-6 h-6 relative z-50"
        >
          <span className={`block w-6 h-0.5 bg-white mb-1.5 transition-transform duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-white mb-1.5 transition-opacity duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-white transition-transform duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden backdrop-blur-sm"
            onClick={toggleMenu}
          />
        )}
      </AnimatePresence>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.4 }}
            className="fixed top-0 right-0 bottom-0 w-4/5 bg-[#0F0F1A] shadow-lg z-40 p-8 flex flex-col justify-start pt-20 md:hidden"
          >
            <nav className="flex flex-col space-y-6">
              <Link href="/brand" className="font-montserrat text-lg font-medium text-gray-300 hover:text-white transition-colors duration-300">브랜드 소개</Link>
              <Link href="/products" className="font-montserrat text-lg font-medium text-gray-300 hover:text-white transition-colors duration-300">제품 보기</Link>
              <Link href="/stores" className="font-montserrat text-lg font-medium text-gray-300 hover:text-white transition-colors duration-300">매장 안내</Link>
              <Link href="/reviews" className="font-montserrat text-lg font-medium text-gray-300 hover:text-white transition-colors duration-300">후기</Link>
              <Link href="/b2b" className="font-montserrat text-lg font-medium text-gray-300 hover:text-white transition-colors duration-300">기업 제휴</Link>
              <div className="pt-6 border-t border-[#222222] flex items-center space-x-8">
                <button aria-label="검색" className="text-gray-300 hover:text-white transition-colors duration-300">
                  <i className="fa-solid fa-search text-xl"></i>
                </button>
                <Link href="/cart" className="text-gray-300 hover:text-white transition-colors duration-300 relative">
                  <i className="fa-solid fa-shopping-bag text-xl"></i>
                  {/* <span className="absolute -top-1 -right-1 bg-gradient-to-r from-[#A78BFA] to-[#EC4899] text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">2</span> */}
                </Link>
                <Link href="/login" className="text-gray-300 hover:text-white transition-colors duration-300">
                  <i className="fa-solid fa-user text-xl"></i>
                </Link>
              </div>
              <div className="mt-auto pt-8">
                <Link 
                  href="/login" 
                  className="block w-full bg-gradient-to-r from-[#A78BFA] to-[#EC4899] text-white font-medium py-2.5 px-4 rounded-full text-center hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
                >
                  로그인
                </Link>
                <Link 
                  href="/register" 
                  className="block w-full border border-[#333333] text-white font-medium py-2.5 px-4 rounded-full text-center mt-3 hover:bg-[#222222] transition-all duration-300"
                >
                  회원가입
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
