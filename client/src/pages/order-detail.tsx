import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useLocation } from 'wouter';
import { ArrowLeft, Package, Truck, MapPin, CreditCard, Clock, CheckCircle } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { pageTransition, fadeIn, slideInFromBottom } from '@/lib/animations';
import { headingClasses } from '@/lib/fonts';

interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

interface Order {
  id: string;
  userId: string;
  status: 'pending' | 'confirmed' | 'shipping' | 'delivered' | 'cancelled';
  totalAmount: number;
  items: OrderItem[];
  createdAt: any;
  deliveredAt?: any;
  shippingAddress?: {
    name: string;
    phone: string;
    address: string;
    detailAddress: string;
    zipCode: string;
  };
  paymentMethod?: string;
  trackingNumber?: string;
}

const OrderDetail = () => {
  const { orderId } = useParams();
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      if (!orderId || !user?.uid) {
        setLoading(false);
        return;
      }

      try {
        console.log('🔍 주문 상세 조회:', orderId);
        
        // 실제 Firebase에서 조회 (현재는 테스트 데이터)
        const testOrder: Order = {
          id: orderId,
          userId: user.uid,
          status: orderId.includes('1') ? 'delivered' : orderId.includes('2') ? 'shipping' : 'delivered',
          totalAmount: orderId.includes('1') ? 25000 : orderId.includes('2') ? 18000 : 32000,
          items: orderId.includes('1') ? [
            { productId: 'bread-1', name: '크루아상', quantity: 2, price: 12500, image: '/images/croissant.jpg' }
          ] : orderId.includes('2') ? [
            { productId: 'bread-2', name: '바게트', quantity: 1, price: 18000, image: '/images/baguette.jpg' }
          ] : [
            { productId: 'bread-3', name: '식빵', quantity: 2, price: 16000, image: '/images/bread.jpg' }
          ],
          createdAt: { toDate: () => new Date(orderId.includes('1') ? '2024-01-15' : orderId.includes('2') ? '2024-01-20' : '2024-01-10') },
          deliveredAt: orderId.includes('1') || orderId.includes('3') ? { toDate: () => new Date() } : undefined,
          shippingAddress: {
            name: user.name || '고객',
            phone: '010-1234-5678',
            address: '서울시 강남구 테헤란로 123',
            detailAddress: '456호',
            zipCode: '12345'
          },
          paymentMethod: '신용카드',
          trackingNumber: orderId.includes('2') ? '1234567890' : undefined
        };

        console.log('📦 주문 상세 데이터:', testOrder);
        setOrder(testOrder);
      } catch (error) {
        console.error('❌ 주문 상세 조회 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [orderId, user?.uid]);

  const handleGoBack = () => {
    setLocation('/mypage/shopping');
  };

  // 사용자 친화적인 주문번호 생성
  const getOrderNumber = (order: Order) => {
    const date = order.createdAt?.toDate?.() || new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const orderNum = order.id.slice(-3).padStart(3, '0');
    return `${year}${month}${day}-${orderNum}`;
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending':
        return { text: '주문접수', color: 'text-yellow-500', bgColor: 'bg-yellow-500/20' };
      case 'confirmed':
        return { text: '주문확인', color: 'text-blue-500', bgColor: 'bg-blue-500/20' };
      case 'shipping':
        return { text: '배송중', color: 'text-[#A78BFA]', bgColor: 'bg-[#A78BFA]/20' };
      case 'delivered':
        return { text: '배송완료', color: 'text-[#10B981]', bgColor: 'bg-[#10B981]/20' };
      case 'cancelled':
        return { text: '주문취소', color: 'text-red-500', bgColor: 'bg-red-500/20' };
      default:
        return { text: '알 수 없음', color: 'text-gray-500', bgColor: 'bg-gray-500/20' };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#A78BFA]"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">주문을 찾을 수 없습니다</h2>
          <p className="text-gray-400 mb-6">요청하신 주문 정보가 존재하지 않습니다.</p>
          <button
            onClick={handleGoBack}
            className="bg-[#A78BFA] hover:bg-[#9333EA] text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            주문 목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(order.status);

  return (
    <motion.div
      className="min-h-screen bg-[#0A0A0A] pt-24 pb-8"
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="container mx-auto px-4 max-w-4xl">
        {/* 헤더 */}
        <motion.div 
          className="mb-8"
          variants={slideInFromBottom}
          initial="hidden"
          animate="visible"
        >
          <button
            onClick={handleGoBack}
            className="group flex items-center gap-3 bg-gradient-to-r from-[#A78BFA]/20 to-[#EC4899]/20 hover:from-[#A78BFA]/30 hover:to-[#EC4899]/30 text-white px-6 py-3 rounded-xl transition-all duration-300 mb-8 border border-[#A78BFA]/50 hover:border-[#A78BFA]"
          >
            <ArrowLeft className="w-5 h-5 text-[#A78BFA] group-hover:text-white transition-colors" />
            <span className="font-medium">주문 목록으로 돌아가기</span>
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`${headingClasses} text-4xl mb-4`}>
                주문 <span className="bg-gradient-to-r from-[#A78BFA] to-[#EC4899] text-transparent bg-clip-text">상세</span> <span className="text-[#A78BFA] font-bold">#{getOrderNumber(order)}</span>
              </h1>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#A78BFA] rounded-full animate-pulse"></div>
                <p className="text-gray-400">
                  주문일: {order.createdAt?.toDate?.()?.toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className={`px-6 py-3 rounded-xl ${statusInfo.bgColor} border border-opacity-30 backdrop-blur-sm`}>
              <span className={`font-semibold text-sm tracking-wide ${statusInfo.color}`}>
                {statusInfo.text}
              </span>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 주문 상품 정보 */}
          <motion.div 
            className="lg:col-span-2 space-y-6"
            variants={slideInFromBottom}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1 }}
          >
            {/* 주문 상품 목록 */}
            <div className="bg-gradient-to-br from-[#111111] to-[#0A0A0A] rounded-2xl border border-[#222222] p-8 shadow-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-gradient-to-r from-[#A78BFA] to-[#EC4899] rounded-xl">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">주문 상품</h3>
              </div>
              
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-6 p-6 bg-gradient-to-r from-[#0A0A0A] to-[#111111] rounded-xl border border-[#333] hover:border-[#A78BFA]/30 transition-all duration-300 group">
                    <div className="w-20 h-20 bg-gradient-to-br from-[#222] to-[#333] rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-[#A78BFA]/20 transition-all duration-300">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-xl" />
                      ) : (
                        <Package className="w-10 h-10 text-[#A78BFA] group-hover:scale-110 transition-transform" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-white text-lg group-hover:text-[#A78BFA] transition-colors">{item.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-1.5 h-1.5 bg-[#EC4899] rounded-full"></div>
                        <p className="text-gray-300 text-sm font-medium">수량: {item.quantity}개</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-xl bg-gradient-to-r from-[#A78BFA] to-[#EC4899] bg-clip-text text-transparent">
                        {(item.price * item.quantity).toLocaleString()}원
                      </p>
                      <p className="text-gray-400 text-sm">개당 {item.price.toLocaleString()}원</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gradient-to-r from-[#333] via-[#A78BFA]/30 to-[#333] mt-8 pt-6">
                <div className="flex justify-between items-center bg-gradient-to-r from-[#A78BFA]/10 to-[#EC4899]/10 p-4 rounded-xl border border-[#A78BFA]/20">
                  <span className="text-xl font-bold text-white">총 주문금액</span>
                  <span className="text-3xl font-bold bg-gradient-to-r from-[#A78BFA] to-[#EC4899] bg-clip-text text-transparent">
                    {order.totalAmount.toLocaleString()}원
                  </span>
                </div>
              </div>
            </div>

            {/* 배송 추적 */}
            {order.status === 'shipping' && order.trackingNumber && (
              <div className="bg-[#111111] rounded-lg border border-[#222222] p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Truck className="w-6 h-6 text-[#A78BFA]" />
                  <h3 className="text-xl font-bold text-white">배송 추적</h3>
                </div>
                
                <div className="bg-[#0A0A0A] rounded-lg border border-[#333] p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400">운송장 번호</span>
                    <span className="text-white font-mono">{order.trackingNumber}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#A78BFA]">
                    <Truck className="w-4 h-4" />
                    <span className="text-sm">배송 중 - 곧 도착 예정입니다</span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* 사이드바 정보 */}
          <motion.div 
            className="space-y-6"
            variants={slideInFromBottom}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            {/* 배송지 정보 */}
            <div className="bg-[#111111] rounded-lg border border-[#222222] p-6">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="w-6 h-6 text-[#10B981]" />
                <h3 className="text-lg font-bold text-white">배송지 정보</h3>
              </div>
              
              {order.shippingAddress && (
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-400">받는 분: </span>
                    <span className="text-white">{order.shippingAddress.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">연락처: </span>
                    <span className="text-white">{order.shippingAddress.phone}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">주소: </span>
                    <span className="text-white">
                      ({order.shippingAddress.zipCode}) {order.shippingAddress.address} {order.shippingAddress.detailAddress}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* 결제 정보 */}
            <div className="bg-[#111111] rounded-lg border border-[#222222] p-6">
              <div className="flex items-center gap-3 mb-4">
                <CreditCard className="w-6 h-6 text-[#EC4899]" />
                <h3 className="text-lg font-bold text-white">결제 정보</h3>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">결제 방법</span>
                  <span className="text-white">{order.paymentMethod || '신용카드'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">상품 금액</span>
                  <span className="text-white">{order.totalAmount.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">배송비</span>
                  <span className="text-white">무료</span>
                </div>
                <div className="border-t border-[#333] pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="font-semibold text-white">총 결제금액</span>
                    <span className="font-bold text-[#EC4899]">{order.totalAmount.toLocaleString()}원</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 주문 상태 */}
            <div className="bg-[#111111] rounded-lg border border-[#222222] p-6">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-6 h-6 text-[#F59E0B]" />
                <h3 className="text-lg font-bold text-white">주문 상태</h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-[#10B981]" />
                  <div>
                    <p className="text-white font-medium">주문 접수</p>
                    <p className="text-gray-400 text-sm">{order.createdAt?.toDate?.()?.toLocaleString()}</p>
                  </div>
                </div>
                
                {order.status !== 'pending' && (
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-[#10B981]" />
                    <div>
                      <p className="text-white font-medium">주문 확인</p>
                      <p className="text-gray-400 text-sm">주문이 확인되었습니다</p>
                    </div>
                  </div>
                )}
                
                {(order.status === 'shipping' || order.status === 'delivered') && (
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-[#A78BFA]" />
                    <div>
                      <p className="text-white font-medium">배송 시작</p>
                      <p className="text-gray-400 text-sm">상품이 배송 중입니다</p>
                    </div>
                  </div>
                )}
                
                {order.status === 'delivered' && order.deliveredAt && (
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-[#10B981]" />
                    <div>
                      <p className="text-white font-medium">배송 완료</p>
                      <p className="text-gray-400 text-sm">{order.deliveredAt?.toDate?.()?.toLocaleString()}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderDetail;
