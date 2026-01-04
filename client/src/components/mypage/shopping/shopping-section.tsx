import { Package, Truck, CreditCard, Clock } from 'lucide-react';
import { useLocation } from 'wouter';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

interface Order {
  id: number;
  userId: string;
  status: string;
  total: number;
  createdAt: string;
  items: any[];
}

const ShoppingSection = () => {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'shipping' | 'delivered'>('all');

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/orders/user/${user.id}`);
        if (!response.ok) throw new Error("Failed to fetch orders");
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error('❌ 주문 데이터 조회 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user?.id]);

  const totalOrders = orders.length;
  const shippingOrders = orders.filter(order => order.status === 'shipping').length;
  const totalAmount = orders
    .filter(order => order.status === 'delivered')
    .reduce((sum, order) => sum + order.total, 0);

  const handleGoToProducts = () => {
    setLocation('/products');
  };

  const handleOrderClick = (orderId: number) => {
    setLocation(`/mypage/order/${orderId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Package className="w-8 h-8 text-[#A78BFA]" />
        <h2 className="text-2xl font-bold text-white">MY 쇼핑</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button onClick={() => setSelectedFilter('all')} className="bg-[#1A1A1A] border border-[#333] rounded-lg p-6 text-left hover:border-[#A78BFA] transition-all">
          <div className="text-sm text-gray-400 mb-2">총 주문</div>
          <div className="text-2xl font-bold text-white">{loading ? '...' : `${totalOrders}건`}</div>
        </button>
        <button onClick={() => setSelectedFilter('shipping')} className="bg-[#1A1A1A] border border-[#333] rounded-lg p-6 text-left hover:border-[#A78BFA] transition-all">
          <div className="text-sm text-gray-400 mb-2">배송 중</div>
          <div className="text-2xl font-bold text-[#A78BFA]">{loading ? '...' : `${shippingOrders}건`}</div>
        </button>
        <button onClick={() => setSelectedFilter('delivered')} className="bg-[#1A1A1A] border border-[#333] rounded-lg p-6 text-left hover:border-[#10B981] transition-all">
          <div className="text-sm text-gray-400 mb-2">총 구매금액</div>
          <div className="text-2xl font-bold text-[#10B981]">{loading ? '...' : `${totalAmount.toLocaleString()}원`}</div>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A78BFA] mx-auto"></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-12 text-center">
          <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-4">주문 내역이 없습니다</h3>
          <button onClick={handleGoToProducts} className="bg-[#A78BFA] text-white px-6 py-3 rounded-lg">상품 둘러보기</button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders
            .filter(order => {
              if (selectedFilter === 'all') return true;
              return order.status === selectedFilter;
            })
            .map(order => (
              <div key={order.id} onClick={() => handleOrderClick(order.id)} className="bg-[#1A1A1A] border border-[#333] rounded-lg p-4 hover:border-[#A78BFA] cursor-pointer">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white font-medium">주문 #{order.id}</span>
                  <span className="text-white font-bold">{order.total.toLocaleString()}원</span>
                </div>
                <div className="text-sm text-gray-400">
                  {new Date(order.createdAt).toLocaleDateString()} | {order.status}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default ShoppingSection;
