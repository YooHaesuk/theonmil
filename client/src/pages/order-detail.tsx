import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useLocation } from 'wouter';
import { ArrowLeft, Package, Truck, MapPin, CreditCard, Clock, CheckCircle } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { pageTransition, fadeIn, slideInFromBottom } from '@/lib/animations';
import { headingClasses } from '@/lib/fonts';

interface OrderItem {
  id: number;
  productId: number;
  quantity: number;
  price: number;
  product: {
    nameKorean: string;
    image: string;
  };
}

interface Order {
  id: number;
  userId: string;
  status: string;
  total: number;
  createdAt: string;
  shippingAddress: string;
  shippingDetailAddress: string;
  shippingZipCode: string;
  recipientName: string;
  recipientPhone: string;
  paymentMethod: string;
  items: OrderItem[];
}

const OrderDetail = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      if (!orderId || !user?.id) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/orders/${orderId}`);
        if (!response.ok) throw new Error("Order not found");
        const data = await response.json();
        setOrder(data);
      } catch (error) {
        console.error('❌ 주문 상세 조회 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [orderId, user?.id]);

  const handleGoBack = () => {
    setLocation('/mypage/shopping');
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending':
        return { text: '주문접수', color: 'text-yellow-500', bgColor: 'bg-yellow-500/20' };
      case 'confirmed':
        return { text: '주문확인', color: 'text-blue-500', bgColor: 'bg-blue-500/20' };
      case 'shipping':
        return { text: '배송중', color: 'text-primary', bgColor: 'bg-primary/20' };
      case 'delivered':
        return { text: '배송완료', color: 'text-green-500', bgColor: 'bg-green-500/20' };
      case 'cancelled':
        return { text: '주문취소', color: 'text-red-500', bgColor: 'bg-red-500/20' };
      default:
        return { text: '알 수 없음', color: 'text-gray-500', bgColor: 'bg-gray-500/20' };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
        <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-[#10B981]"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">주문을 찾을 수 없습니다</h2>
          <button onClick={handleGoBack} className="bg-[#10B981] text-white px-6 py-2 rounded-lg mt-4">목록으로</button>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(order.status);

  return (
    <motion.div
      className="min-h-screen bg-[#0A0A0A] pt-40 pb-12"
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="container mx-auto px-4 max-w-4xl">
        <button onClick={handleGoBack} className="flex items-center gap-2 text-gray-400 hover:text-white mb-8">
          <ArrowLeft className="w-4 h-4" /> 주문 목록으로
        </button>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">주문 상세 <span className="text-[#10B981]">#{order.id}</span></h1>
            <p className="text-gray-400 mt-2">주문일: {new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
          <div className={`px-4 py-2 rounded-full ${statusInfo.bgColor} ${statusInfo.color} font-bold`}>
            {statusInfo.text}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#111] border border-[#333] rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Package className="w-5 h-5 text-[#10B981]" /> 주문 상품
              </h3>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 bg-[#0A0A0A] border border-[#222] rounded-lg">
                    <img src={item.product?.image} alt={item.product?.nameKorean} className="w-16 h-16 object-cover rounded" />
                    <div className="flex-1">
                      <h4 className="text-white font-medium">{item.product?.nameKorean}</h4>
                      <p className="text-gray-400 text-sm">{item.quantity}개 | {item.price.toLocaleString()}원</p>
                    </div>
                    <div className="text-white font-bold">{(item.price * item.quantity).toLocaleString()}원</div>
                  </div>
                ))}
              </div>
              <div className="mt-6 border-t border-[#333] pt-6 flex justify-between items-center">
                <span className="text-gray-400">총 결제금액</span>
                <span className="text-2xl font-bold text-[#10B981]">{order.total.toLocaleString()}원</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-[#111] border border-[#333] rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-500" /> 배송지 정보
              </h3>
              <div className="text-sm space-y-2">
                <p className="text-white">{order.recipientName}</p>
                <p className="text-gray-400">{order.recipientPhone}</p>
                <p className="text-gray-400">({order.shippingZipCode}) {order.shippingAddress} {order.shippingDetailAddress}</p>
              </div>
            </div>

            <div className="bg-[#111] border border-[#333] rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-purple-500" /> 결제 정보
              </h3>
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">결제방법</span>
                  <span className="text-white">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">배송비</span>
                  <span className="text-white">무료</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderDetail;
