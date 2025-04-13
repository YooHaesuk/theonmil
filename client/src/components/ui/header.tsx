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
    <header className={`fixed top-0 left-0 right-0 bg-[#F5F3EF] z-50 transition-shadow duration-300 ${isScrolled ? 'shadow-md' : 'shadow-sm'}`}>
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <div className="text-2xl md:text-3xl font-bold font-playfair text-[#1B1B1B]">
            <span className="text-[#D4AF37]">빵</span>답게
          </div>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8 items-center">
          <Link href="/brand" className="font-montserrat text-sm font-medium hover:text-[#D4AF37] transition-colors duration-300 gold-underline">브랜드 소개</Link>
          <Link href="/products" className="font-montserrat text-sm font-medium hover:text-[#D4AF37] transition-colors duration-300 gold-underline">제품 보기</Link>
          <Link href="/stores" className="font-montserrat text-sm font-medium hover:text-[#D4AF37] transition-colors duration-300 gold-underline">매장 안내</Link>
          <Link href="/reviews" className="font-montserrat text-sm font-medium hover:text-[#D4AF37] transition-colors duration-300 gold-underline">후기</Link>
          <Link href="/b2b" className="font-montserrat text-sm font-medium hover:text-[#D4AF37] transition-colors duration-300 gold-underline">기업 제휴</Link>
          <div className="flex items-center space-x-4 ml-4">
            <button aria-label="검색" className="text-[#1B1B1B] hover:text-[#D4AF37] transition-colors duration-300">
              <i className="fa-solid fa-search text-lg"></i>
            </button>
            <Link href="/cart" className="text-[#1B1B1B] hover:text-[#D4AF37] transition-colors duration-300 relative">
              <i className="fa-solid fa-shopping-bag text-lg"></i>
              <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">2</span>
            </Link>
            <Link href="/login" className="text-[#1B1B1B] hover:text-[#D4AF37] transition-colors duration-300">
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
          <span className={`block w-6 h-0.5 bg-[#1B1B1B] mb-1.5 transition-transform duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-[#1B1B1B] mb-1.5 transition-opacity duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-[#1B1B1B] transition-transform duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
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
            className="fixed inset-0 bg-[#1B1B1B] bg-opacity-50 z-30 md:hidden"
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
            className="fixed top-0 right-0 bottom-0 w-4/5 bg-[#F5F3EF] shadow-lg z-40 p-8 flex flex-col justify-start pt-20 md:hidden"
          >
            <nav className="flex flex-col space-y-6">
              <Link href="/brand" className="font-montserrat text-lg font-medium hover:text-[#D4AF37] transition-colors duration-300">브랜드 소개</Link>
              <Link href="/products" className="font-montserrat text-lg font-medium hover:text-[#D4AF37] transition-colors duration-300">제품 보기</Link>
              <Link href="/stores" className="font-montserrat text-lg font-medium hover:text-[#D4AF37] transition-colors duration-300">매장 안내</Link>
              <Link href="/reviews" className="font-montserrat text-lg font-medium hover:text-[#D4AF37] transition-colors duration-300">후기</Link>
              <Link href="/b2b" className="font-montserrat text-lg font-medium hover:text-[#D4AF37] transition-colors duration-300">기업 제휴</Link>
              <div className="pt-6 border-t border-gray-200 flex items-center space-x-8">
                <button aria-label="검색" className="text-[#1B1B1B] hover:text-[#D4AF37] transition-colors duration-300">
                  <i className="fa-solid fa-search text-xl"></i>
                </button>
                <Link href="/cart" className="text-[#1B1B1B] hover:text-[#D4AF37] transition-colors duration-300 relative">
                  <i className="fa-solid fa-shopping-bag text-xl"></i>
                  <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">2</span>
                </Link>
                <Link href="/login" className="text-[#1B1B1B] hover:text-[#D4AF37] transition-colors duration-300">
                  <i className="fa-solid fa-user text-xl"></i>
                </Link>
              </div>
              <div className="mt-auto pt-8">
                <Link href="/login" className="block w-full bg-[#1B1B1B] text-white font-medium py-2.5 px-4 rounded-md text-center hover:bg-opacity-90 transition-all duration-300">로그인</Link>
                <Link href="/register" className="block w-full border border-[#1B1B1B] text-[#1B1B1B] font-medium py-2.5 px-4 rounded-md text-center mt-3 hover:bg-[#1B1B1B] hover:text-white transition-all duration-300">회원가입</Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
