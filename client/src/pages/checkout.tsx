import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { pageTransition, fadeIn, staggerContainer } from '@/lib/animations';
import { headingClasses, buttonClasses } from '@/lib/fonts';
import { formatPrice } from '@/lib/products';
import { useToast } from '@/hooks/use-toast';

// Sample cart data for checkout
const cartItems = [
  {
    id: 'classic-croissant',
    name: 'Classic Croissant',
    nameKorean: '클래식 크로와상',
    price: 4800,
    quantity: 2,
    image: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2232&q=80'
  },
  {
    id: 'french-baguette',
    name: 'French Baguette',
    nameKorean: '프렌치 바게트',
    price: 5200,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
  }
];

const Checkout = () => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    recipientName: '',
    phone: '',
    email: '',
    address: '',
    detailAddress: '',
    zipCode: '',
    message: '',
    paymentMethod: 'card',
    isGift: false
  });
  
  // Calculated prices
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shippingFee = subtotal >= 50000 ? 0 : 3000;
  const total = subtotal + shippingFee;
  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate payment processing
    setTimeout(() => {
      toast({
        title: "주문이 완료되었습니다",
        description: "빠른 시일 내에 배송이 시작됩니다.",
      });
      
      setIsSubmitting(false);
      setLocation('/', { replace: true });
    }, 2000);
  };
  
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      className="min-h-screen pt-24 pb-20"
    >
      <div className="container mx-auto px-4">
        <motion.h1 variants={fadeIn} className={headingClasses.h1 + " text-[#1B1B1B] mb-8 text-center"}>
          주문 결제
        </motion.h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Checkout form */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="lg:flex-grow"
          >
            <form onSubmit={handleSubmit}>
              {/* Shipping information */}
              <motion.div 
                variants={fadeIn} 
                className="bg-white rounded-lg shadow-md overflow-hidden mb-8"
              >
                <div className="p-6 bg-[#F5F3EF] border-b border-gray-200">
                  <h2 className="font-playfair text-xl font-semibold text-[#1B1B1B]">
                    배송 정보
                  </h2>
                </div>
                
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="recipientName" className="block text-sm font-medium text-gray-700 mb-1">
                        받는 분 이름
                      </label>
                      <input
                        type="text"
                        id="recipientName"
                        name="recipientName"
                        value={formData.recipientName}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        연락처
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      이메일
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-1">
                      <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                        우편번호
                      </label>
                      <div className="flex">
                        <input
                          type="text"
                          id="zipCode"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                        />
                        <button
                          type="button"
                          className="bg-[#F5F3EF] text-[#1B1B1B] px-4 py-2 rounded-r-md border border-gray-300 border-l-0 hover:bg-[#E5E3DF]"
                        >
                          검색
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                      주소
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="detailAddress" className="block text-sm font-medium text-gray-700 mb-1">
                      상세주소
                    </label>
                    <input
                      type="text"
                      id="detailAddress"
                      name="detailAddress"
                      value={formData.detailAddress}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      배송 메시지
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    ></textarea>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isGift"
                      name="isGift"
                      checked={formData.isGift}
                      onChange={handleChange}
                      className="h-4 w-4 text-[#D4AF37] focus:ring-[#D4AF37] border-gray-300 rounded"
                    />
                    <label htmlFor="isGift" className="ml-2 block text-sm text-gray-700">
                      선물용으로 포장해 주세요 (+ ₩3,000)
                    </label>
                  </div>
                </div>
              </motion.div>
              
              {/* Payment information */}
              <motion.div 
                variants={fadeIn} 
                className="bg-white rounded-lg shadow-md overflow-hidden mb-8"
              >
                <div className="p-6 bg-[#F5F3EF] border-b border-gray-200">
                  <h2 className="font-playfair text-xl font-semibold text-[#1B1B1B]">
                    결제 정보
                  </h2>
                </div>
                
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      결제 수단
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div>
                        <input
                          type="radio"
                          id="card"
                          name="paymentMethod"
                          value="card"
                          checked={formData.paymentMethod === 'card'}
                          onChange={handleChange}
                          className="hidden peer"
                        />
                        <label
                          htmlFor="card"
                          className="flex items-center justify-center p-3 border rounded-md peer-checked:border-[#D4AF37] peer-checked:bg-[#F5F3EF] cursor-pointer"
                        >
                          <i className="fa-solid fa-credit-card mr-2"></i>
                          신용카드
                        </label>
                      </div>
                      <div>
                        <input
                          type="radio"
                          id="bank"
                          name="paymentMethod"
                          value="bank"
                          checked={formData.paymentMethod === 'bank'}
                          onChange={handleChange}
                          className="hidden peer"
                        />
                        <label
                          htmlFor="bank"
                          className="flex items-center justify-center p-3 border rounded-md peer-checked:border-[#D4AF37] peer-checked:bg-[#F5F3EF] cursor-pointer"
                        >
                          <i className="fa-solid fa-building-columns mr-2"></i>
                          무통장입금
                        </label>
                      </div>
                      <div>
                        <input
                          type="radio"
                          id="phone"
                          name="paymentMethod"
                          value="phone"
                          checked={formData.paymentMethod === 'phone'}
                          onChange={handleChange}
                          className="hidden peer"
                        />
                        <label
                          htmlFor="phone"
                          className="flex items-center justify-center p-3 border rounded-md peer-checked:border-[#D4AF37] peer-checked:bg-[#F5F3EF] cursor-pointer"
                        >
                          <i className="fa-solid fa-mobile-screen mr-2"></i>
                          휴대폰결제
                        </label>
                      </div>
                      <div>
                        <input
                          type="radio"
                          id="kakao"
                          name="paymentMethod"
                          value="kakao"
                          checked={formData.paymentMethod === 'kakao'}
                          onChange={handleChange}
                          className="hidden peer"
                        />
                        <label
                          htmlFor="kakao"
                          className="flex items-center justify-center p-3 border rounded-md peer-checked:border-[#D4AF37] peer-checked:bg-[#F5F3EF] cursor-pointer"
                        >
                          <i className="fa-solid fa-comment mr-2"></i>
                          카카오페이
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  {/* Payment gateway related UI */}
                  <div className="border border-gray-200 rounded-md p-4 mt-4 bg-[#F9F7F4]">
                    <div className="flex items-center mb-4">
                      <img src="https://static.toss.im/icons/svg/logo-tosspayments-blue.svg" alt="TossPayments Logo" className="h-6 mr-2" />
                      <span className="text-gray-500 text-sm">
                        결제는 토스페이먼츠를 통해 안전하게 처리됩니다.
                      </span>
                    </div>
                    
                    {formData.paymentMethod === 'card' && (
                      <div className="p-4 bg-white border border-gray-200 rounded-md">
                        <p className="text-center text-gray-500">
                          <i className="fa-solid fa-lock mr-2"></i>
                          결제 진행 시 안전한 결제창으로 이동합니다
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
              
              {/* Terms agreement */}
              <motion.div 
                variants={fadeIn}
                className="bg-white rounded-lg shadow-md overflow-hidden mb-8"
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <input
                      type="checkbox"
                      id="agreement"
                      required
                      className="h-4 w-4 text-[#D4AF37] focus:ring-[#D4AF37] border-gray-300 rounded"
                    />
                    <label htmlFor="agreement" className="ml-2 block text-sm text-gray-700">
                      주문 내용을 확인하였으며, 개인정보 수집 및 이용 약관에 동의합니다.
                    </label>
                  </div>
                </div>
              </motion.div>
            </form>
          </motion.div>
          
          {/* Order summary */}
          <motion.div 
            variants={fadeIn}
            className="lg:w-96 flex-shrink-0"
          >
            <div className="bg-white rounded-lg shadow-md overflow-hidden sticky top-24">
              <div className="p-6 bg-[#F5F3EF] border-b border-gray-200">
                <h2 className="font-playfair text-xl font-semibold text-[#1B1B1B]">
                  주문 요약
                </h2>
              </div>
              
              <div className="p-6">
                {/* Order items */}
                <div className="mb-6">
                  <h3 className="font-montserrat font-semibold mb-3">주문 상품</h3>
                  <div className="space-y-4">
                    {cartItems.map(item => (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="w-16 h-16 flex-shrink-0">
                          <img 
                            src={item.image} 
                            alt={item.nameKorean} 
                            className="w-full h-full object-cover rounded"
                          />
                        </div>
                        <div className="flex-grow">
                          <p className="font-pretendard font-medium">{item.nameKorean}</p>
                          <p className="text-sm text-gray-500">{item.quantity}개</p>
                        </div>
                        <div className="text-right">
                          <p className="font-montserrat font-semibold">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Price calculation */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="font-pretendard text-gray-600">상품 금액</span>
                    <span className="font-montserrat font-semibold">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-pretendard text-gray-600">배송비</span>
                    <span className="font-montserrat font-semibold">
                      {shippingFee === 0 ? '무료' : formatPrice(shippingFee)}
                    </span>
                  </div>
                  {formData.isGift && (
                    <div className="flex justify-between">
                      <span className="font-pretendard text-gray-600">선물 포장</span>
                      <span className="font-montserrat font-semibold">+ ₩3,000</span>
                    </div>
                  )}
                </div>
                
                <div className="border-t border-gray-200 pt-4 mb-6">
                  <div className="flex justify-between">
                    <span className="font-pretendard font-medium">총 결제 금액</span>
                    <span className="font-montserrat font-bold text-[#D4AF37] text-xl">
                      {formatPrice(total + (formData.isGift ? 3000 : 0))}
                    </span>
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  onClick={handleSubmit}
                  className={buttonClasses.primary + " w-full flex items-center justify-center"}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                      결제 처리 중...
                    </span>
                  ) : (
                    <>
                      <i className="fa-solid fa-lock mr-2"></i>
                      결제하기
                    </>
                  )}
                </button>
                
                <div className="text-center mt-4">
                  <Link href="/cart" className="text-sm text-gray-500 hover:text-[#D4AF37]">
                    <i className="fa-solid fa-arrow-left mr-1"></i> 장바구니로 돌아가기
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Checkout;
