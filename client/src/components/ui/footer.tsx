import { Link } from 'wouter';

const Footer = () => {
  return (
    <footer className="bg-[#1B1B1B] text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-playfair font-bold mb-6"><span className="text-[#D4AF37]">빵</span>답게</h3>
            <p className="font-pretendard text-gray-400 mb-6">이 사이트의 브래드는, 빵답게.<br/>정직한 공정, 현장 기반 신뢰를 약속합니다.</p>
            <div className="flex space-x-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#D4AF37] transition-colors">
                <i className="fa-brands fa-instagram text-xl"></i>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#D4AF37] transition-colors">
                <i className="fa-brands fa-facebook text-xl"></i>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#D4AF37] transition-colors">
                <i className="fa-brands fa-youtube text-xl"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#D4AF37] transition-colors">
                <i className="fa-brands fa-twitter text-xl"></i>
              </a>
            </div>
          </div>
          
          {/* Links 1 */}
          <div>
            <h4 className="font-montserrat font-semibold text-lg mb-6">빠른 링크</h4>
            <ul className="space-y-3 font-pretendard text-gray-400">
              <li><Link href="/brand" className="hover:text-[#D4AF37] transition-colors">브랜드 소개</Link></li>
              <li><Link href="/products" className="hover:text-[#D4AF37] transition-colors">전체 제품 보기</Link></li>
              <li><Link href="/products?category=regular" className="hover:text-[#D4AF37] transition-colors">상시 운영 제품</Link></li>
              <li><Link href="/products?category=custom" className="hover:text-[#D4AF37] transition-colors">주문 제작 제품</Link></li>
              <li><Link href="/products?category=gift" className="hover:text-[#D4AF37] transition-colors">기념일 선물 세트</Link></li>
              <li><Link href="/stores" className="hover:text-[#D4AF37] transition-colors">오프라인 매장</Link></li>
            </ul>
          </div>
          
          {/* Links 2 */}
          <div>
            <h4 className="font-montserrat font-semibold text-lg mb-6">고객 지원</h4>
            <ul className="space-y-3 font-pretendard text-gray-400">
              <li><Link href="/faq" className="hover:text-[#D4AF37] transition-colors">자주 묻는 질문</Link></li>
              <li><Link href="/shipping" className="hover:text-[#D4AF37] transition-colors">배송 안내</Link></li>
              <li><Link href="/returns" className="hover:text-[#D4AF37] transition-colors">교환 및 환불</Link></li>
              <li><Link href="/privacy" className="hover:text-[#D4AF37] transition-colors">개인정보 처리방침</Link></li>
              <li><Link href="/terms" className="hover:text-[#D4AF37] transition-colors">이용약관</Link></li>
              <li><Link href="/business-info" className="hover:text-[#D4AF37] transition-colors">사업자 정보</Link></li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h4 className="font-montserrat font-semibold text-lg mb-6">연락처</h4>
            <ul className="space-y-3 font-pretendard text-gray-400">
              <li className="flex items-start">
                <i className="fa-solid fa-location-dot mt-1 mr-3 text-[#D4AF37]"></i>
                <span>서울특별시 강남구 테헤란로 123 1층</span>
              </li>
              <li className="flex items-start">
                <i className="fa-solid fa-phone mt-1 mr-3 text-[#D4AF37]"></i>
                <span>02-123-4567</span>
              </li>
              <li className="flex items-start">
                <i className="fa-solid fa-envelope mt-1 mr-3 text-[#D4AF37]"></i>
                <span>hello@bbangdapge.co.kr</span>
              </li>
              <li className="flex items-start">
                <i className="fa-solid fa-clock mt-1 mr-3 text-[#D4AF37]"></i>
                <span>고객센터: 평일 9:00 - 18:00</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom footer */}
        <div className="pt-8 border-t border-gray-800 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="font-pretendard text-sm text-gray-500 mb-4 sm:mb-0">
              &copy; {new Date().getFullYear()} 빵답게 주식회사. 모든 권리 보유.
            </p>
            <div className="flex items-center space-x-4">
              <svg width="40" height="25" viewBox="0 0 40 25" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-6">
                <rect width="40" height="25" rx="4" fill="#333" />
                <path d="M12 12.5H28" stroke="white" strokeWidth="2" />
                <path d="M12 8.5H28" stroke="white" strokeWidth="2" />
                <path d="M12 16.5H28" stroke="white" strokeWidth="2" />
              </svg>
              <svg width="40" height="25" viewBox="0 0 40 25" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-6">
                <rect width="40" height="25" rx="4" fill="#333" />
                <path d="M20 8L15 17H25L20 8Z" fill="white" />
              </svg>
              <svg width="40" height="25" viewBox="0 0 40 25" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-6">
                <rect width="40" height="25" rx="4" fill="#333" />
                <circle cx="20" cy="12.5" r="5" fill="white" />
              </svg>
              <svg width="40" height="25" viewBox="0 0 40 25" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-6">
                <rect width="40" height="25" rx="4" fill="#333" />
                <rect x="12" y="8" width="16" height="9" rx="2" fill="white" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
