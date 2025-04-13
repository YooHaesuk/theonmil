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
      className="min-h-screen pt-24 pb-20"
    >
      <div className="container mx-auto px-4">
        <motion.h1 variants={fadeIn} className={headingClasses.h1 + " text-[#1B1B1B] mb-8 text-center"}>
          장바구니
        </motion.h1>
        
        {cartItems.length === 0 ? (
          <motion.div variants={fadeIn} className="text-center py-12">
            <div className="text-6xl mb-6 text-gray-300">
              <i className="fa-solid fa-shopping-cart"></i>
            </div>
            <p className="text-xl mb-8">장바구니가 비어있습니다</p>
            <Link href="/products" className={buttonClasses.primary}>
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
              <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                <div className="p-6 bg-[#F5F3EF] border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h2 className="font-playfair text-xl font-semibold text-[#1B1B1B]">
                      상품 목록 ({cartItems.length})
                    </h2>
                    <button 
                      onClick={emptyCart}
                      className="text-sm text-red-500 hover:text-red-700 transition-colors"
                    >
                      장바구니 비우기
                    </button>
                  </div>
                </div>
                
                <div className="divide-y divide-gray-100">
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
                          className="w-full h-full object-cover rounded"
                        />
                      </Link>
                      
                      <div className="flex-grow">
                        <Link href={`/products/${item.id}`} className="font-playfair text-lg font-semibold text-[#1B1B1B] hover:text-[#D4AF37] transition-colors">
                          {item.nameKorean}
                        </Link>
                        <p className="font-montserrat text-sm text-gray-500">{item.name}</p>
                        <p className="font-montserrat font-semibold text-[#1B1B1B] mt-1">
                          {formatPrice(item.price)}
                        </p>
                      </div>
                      
                      <div className="flex items-center">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 rounded-md bg-[#F5F3EF] flex items-center justify-center"
                        >
                          <i className="fa-solid fa-minus text-sm"></i>
                        </button>
                        <span className="w-12 text-center font-montserrat">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 rounded-md bg-[#F5F3EF] flex items-center justify-center"
                        >
                          <i className="fa-solid fa-plus text-sm"></i>
                        </button>
                      </div>
                      
                      <div className="text-right sm:w-24">
                        <p className="font-montserrat font-semibold text-[#1B1B1B]">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="text-sm text-red-500 hover:text-red-700 transition-colors mt-1"
                        >
                          삭제
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between">
                <Link href="/products" className="font-montserrat text-sm text-[#1B1B1B] hover:text-[#D4AF37] transition-colors flex items-center">
                  <i className="fa-solid fa-arrow-left mr-2"></i> 쇼핑 계속하기
                </Link>
              </div>
            </motion.div>
            
            {/* Order Summary */}
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
                    {shippingFee > 0 && (
                      <div className="text-sm text-gray-500">
                        * {formatPrice(50000 - subtotal)}원 추가 구매 시 무료배송
                      </div>
                    )}
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4 mb-6">
                    <div className="flex justify-between">
                      <span className="font-pretendard font-medium">총 결제 금액</span>
                      <span className="font-montserrat font-bold text-[#D4AF37] text-xl">
                        {formatPrice(total)}
                      </span>
                    </div>
                  </div>
                  
                  <Link href="/checkout" className={buttonClasses.primary + " w-full flex items-center justify-center"}>
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
