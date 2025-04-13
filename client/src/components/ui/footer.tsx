import { Link } from 'wouter';

const Footer = () => {
  return (
    <footer className="bg-[#0A0A0A] text-white border-t border-[#222222] pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold font-montserrat mb-6">
              <span className="bg-gradient-to-r from-[#A78BFA] to-[#EC4899] text-transparent bg-clip-text">빵답게</span>
            </h3>
            <p className="font-pretendard text-gray-400 mb-6">이 사이트의 브래드는, 빵답게.<br/>정직한 공정, 현장 기반 신뢰를 약속합니다.</p>
            <div className="flex space-x-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <i className="fa-brands fa-instagram text-xl"></i>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <i className="fa-brands fa-facebook text-xl"></i>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <i className="fa-brands fa-youtube text-xl"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <i className="fa-brands fa-twitter text-xl"></i>
              </a>
            </div>
          </div>
          
          {/* Links 2 */}
          <div>
            <h4 className="font-montserrat font-semibold text-lg mb-6 text-white">고객 지원</h4>
            <ul className="space-y-3 font-pretendard text-gray-400">
              <li><Link href="/faq" className="hover:text-white hover:pl-1 transition-all duration-200">자주 묻는 질문</Link></li>
              <li><Link href="/shipping" className="hover:text-white hover:pl-1 transition-all duration-200">배송 안내</Link></li>
              <li><Link href="/returns" className="hover:text-white hover:pl-1 transition-all duration-200">교환 및 환불</Link></li>
              <li><Link href="/privacy" className="hover:text-white hover:pl-1 transition-all duration-200">개인정보 처리방침</Link></li>
              <li><Link href="/terms" className="hover:text-white hover:pl-1 transition-all duration-200">이용약관</Link></li>
              <li><Link href="/business-info" className="hover:text-white hover:pl-1 transition-all duration-200">사업자 정보</Link></li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h4 className="font-montserrat font-semibold text-lg mb-6 text-white">연락처</h4>
            <ul className="space-y-3 font-pretendard text-gray-400">
              <li className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#A78BFA] to-[#EC4899] flex items-center justify-center text-white mt-0.5 mr-3 flex-shrink-0">
                  <i className="fa-solid fa-location-dot text-xs"></i>
                </div>
                <span>서울특별시 강남구 테헤란로 123 1층</span>
              </li>
              <li className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#A78BFA] to-[#EC4899] flex items-center justify-center text-white mt-0.5 mr-3 flex-shrink-0">
                  <i className="fa-solid fa-phone text-xs"></i>
                </div>
                <span>02-123-4567</span>
              </li>
              <li className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#A78BFA] to-[#EC4899] flex items-center justify-center text-white mt-0.5 mr-3 flex-shrink-0">
                  <i className="fa-solid fa-envelope text-xs"></i>
                </div>
                <span>hello@bbangdapge.co.kr</span>
              </li>
              <li className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#A78BFA] to-[#EC4899] flex items-center justify-center text-white mt-0.5 mr-3 flex-shrink-0">
                  <i className="fa-solid fa-clock text-xs"></i>
                </div>
                <span>고객센터: 평일 9:00 - 18:00</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom footer */}
        <div className="pt-8 border-t border-[#222222] text-center sm:text-left">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="font-pretendard text-sm text-gray-500 mb-4 sm:mb-0">
              &copy; {new Date().getFullYear()} 빵답게 주식회사. 모든 권리 보유.
            </p>
            <div className="flex items-center space-x-4">
              <svg width="40" height="25" viewBox="0 0 40 25" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-6">
                <rect width="40" height="25" rx="4" fill="#222222" />
                <path d="M12 12.5H28" stroke="#ffffff" strokeWidth="2" />
                <path d="M12 8.5H28" stroke="#ffffff" strokeWidth="2" />
                <path d="M12 16.5H28" stroke="#ffffff" strokeWidth="2" />
              </svg>
              <svg width="40" height="25" viewBox="0 0 40 25" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-6">
                <rect width="40" height="25" rx="4" fill="#222222" />
                <path d="M20 8L15 17H25L20 8Z" fill="#ffffff" />
              </svg>
              <svg width="40" height="25" viewBox="0 0 40 25" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-6">
                <rect width="40" height="25" rx="4" fill="#222222" />
                <circle cx="20" cy="12.5" r="5" fill="#ffffff" />
              </svg>
              <svg width="40" height="25" viewBox="0 0 40 25" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-6">
                <rect width="40" height="25" rx="4" fill="#222222" />
                <rect x="12" y="8" width="16" height="9" rx="2" fill="#ffffff" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
