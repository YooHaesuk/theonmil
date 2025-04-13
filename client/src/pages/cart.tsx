import { useState } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { pageTransition, fadeIn, staggerContainer } from '@/lib/animations';
import { headingClasses, buttonClasses } from '@/lib/fonts';
import { formatPrice } from '@/lib/products';
import { useToast } from '@/hooks/use-toast';

// CartItem type definition
interface CartItem {
  id: string;
  name: string;
  nameKorean: string;
  price: number;
  quantity: number;
  image: string;
}

// Sample cart data
const initialCartItems: CartItem[] = [
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

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);
  const { toast } = useToast();
  
  // Calculate total price
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shippingFee = subtotal >= 50000 ? 0 : 3000;
  const total = subtotal + shippingFee;
  
  // Update quantity
  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };
  
  // Remove item
  const removeItem = (id: string) => {
    setCartItems(cartItems.filter(item => item.id !== id));
    
    toast({
      title: "상품이 삭제되었습니다",
      description: "장바구니에서 상품이 삭제되었습니다.",
    });
  };
  
  // Empty cart
  const emptyCart = () => {
    if (window.confirm('장바구니를 비우시겠습니까?')) {
      setCartItems([]);
      
      toast({
        title: "장바구니가 비워졌습니다",
        description: "모든 상품이 장바구니에서 삭제되었습니다.",
      });
    }
  };
  
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      className="min-h-screen pt-24 pb-20 bg-[#0A0A0A]"
    >
      <div className="container mx-auto px-4">
        <motion.h1 variants={fadeIn} className="text-4xl font-bold font-montserrat mb-8 text-center text-white">
          <span className="bg-gradient-to-r from-[#A78BFA] to-[#EC4899] text-transparent bg-clip-text">장바구니</span>
        </motion.h1>
        
        {cartItems.length === 0 ? (
          <motion.div variants={fadeIn} className="text-center py-12">
            <div className="text-6xl mb-6 bg-gradient-to-r from-[#A78BFA] to-[#EC4899] text-transparent bg-clip-text">
              <i className="fa-solid fa-shopping-cart"></i>
            </div>
            <p className="text-xl mb-8 font-montserrat text-white">장바구니가 비어있습니다</p>
            <Link href="/products" className="px-6 py-3 rounded-full bg-gradient-to-r from-[#A78BFA] to-[#EC4899] text-white font-medium transition-all hover:opacity-90 hover:shadow-lg hover:shadow-purple-500/20">
              쇼핑 계속하기
            </Link>
          </motion.div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="lg:flex-grow"
            >
              <div className="bg-[#111111] rounded-lg shadow-md overflow-hidden mb-6 border border-[#222222]">
                <div className="p-6 bg-[#0F0F1A] border-b border-[#222222]">
                  <div className="flex justify-between items-center">
                    <h2 className="font-montserrat text-xl font-semibold text-white">
                      상품 목록 <span className="bg-gradient-to-r from-[#A78BFA] to-[#EC4899] text-transparent bg-clip-text">({cartItems.length})</span>
                    </h2>
                    <button 
                      onClick={emptyCart}
                      className="text-sm text-red-400 hover:text-red-300 transition-colors"
                    >
                      장바구니 비우기
                    </button>
                  </div>
                </div>
                
                <div className="divide-y divide-[#222222]">
                  {cartItems.map(item => (
                    <motion.div
                      key={item.id}
                      variants={fadeIn}
                      className="p-6 flex flex-col sm:flex-row items-center gap-4"
                    >
                      <Link href={`/products/${item.id}`} className="sm:w-24 w-full h-24 flex-shrink-0">
                        <img 
                          src={item.image} 
                          alt={item.nameKorean} 
                          className="w-full h-full object-cover rounded-lg border border-[#333333]"
                        />
                      </Link>
                      
                      <div className="flex-grow">
                        <Link href={`/products/${item.id}`} className="font-montserrat text-lg font-semibold text-white hover:bg-gradient-to-r hover:from-[#A78BFA] hover:to-[#EC4899] hover:text-transparent hover:bg-clip-text transition-colors">
                          {item.nameKorean}
                        </Link>
                        <p className="font-montserrat text-sm text-gray-400">{item.name}</p>
                        <p className="font-montserrat font-semibold text-gray-300 mt-1">
                          {formatPrice(item.price)}
                        </p>
                      </div>
                      
                      <div className="flex items-center">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 rounded-full bg-[#0F0F1A] text-white border border-[#333333] flex items-center justify-center hover:bg-[#1A1A2A] transition-colors"
                        >
                          <i className="fa-solid fa-minus text-sm"></i>
                        </button>
                        <span className="w-12 text-center font-montserrat text-white">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 rounded-full bg-[#0F0F1A] text-white border border-[#333333] flex items-center justify-center hover:bg-[#1A1A2A] transition-colors"
                        >
                          <i className="fa-solid fa-plus text-sm"></i>
                        </button>
                      </div>
                      
                      <div className="text-right sm:w-24">
                        <p className="font-montserrat font-semibold text-white">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="text-sm text-red-400 hover:text-red-300 transition-colors mt-1"
                        >
                          삭제
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between">
                <Link href="/products" className="font-montserrat text-sm text-gray-300 hover:text-white transition-colors flex items-center">
                  <i className="fa-solid fa-arrow-left mr-2"></i> 쇼핑 계속하기
                </Link>
              </div>
            </motion.div>
            
            {/* Order Summary */}
            <motion.div 
              variants={fadeIn}
              className="lg:w-96 flex-shrink-0"
            >
              <div className="bg-[#111111] rounded-lg shadow-md overflow-hidden sticky top-24 border border-[#222222]">
                <div className="p-6 bg-[#0F0F1A] border-b border-[#222222]">
                  <h2 className="font-montserrat text-xl font-semibold text-white">
                    주문 <span className="bg-gradient-to-r from-[#A78BFA] to-[#EC4899] text-transparent bg-clip-text">요약</span>
                  </h2>
                </div>
                
                <div className="p-6">
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="font-pretendard text-gray-300">상품 금액</span>
                      <span className="font-montserrat font-semibold text-white">{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-pretendard text-gray-300">배송비</span>
                      <span className="font-montserrat font-semibold text-white">
                        {shippingFee === 0 ? '무료' : formatPrice(shippingFee)}
                      </span>
                    </div>
                    {shippingFee > 0 && (
                      <div className="text-sm text-gray-400">
                        * {formatPrice(50000 - subtotal)}원 추가 구매 시 무료배송
                      </div>
                    )}
                  </div>
                  
                  <div className="border-t border-[#333333] pt-4 mb-6">
                    <div className="flex justify-between">
                      <span className="font-pretendard font-medium text-gray-300">총 결제 금액</span>
                      <span className="font-montserrat font-bold bg-gradient-to-r from-[#A78BFA] to-[#EC4899] text-transparent bg-clip-text text-xl">
                        {formatPrice(total)}
                      </span>
                    </div>
                  </div>
                  
                  <Link href="/checkout" className="w-full bg-gradient-to-r from-[#A78BFA] to-[#EC4899] hover:opacity-90 text-white font-medium py-3 px-4 rounded-full text-center transition-all duration-300 font-montserrat hover:shadow-lg hover:shadow-purple-500/20 flex items-center justify-center">
                    <i className="fa-solid fa-credit-card mr-2"></i>
                    결제하기
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Cart;
