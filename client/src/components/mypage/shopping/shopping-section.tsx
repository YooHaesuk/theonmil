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
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <Package className="w-8 h-8 text-primary" />
        <h2 className="text-2xl font-bold text-foreground">MY 쇼핑</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button
          onClick={() => setSelectedFilter('all')}
          className={`bg-white border rounded-2xl p-6 text-left transition-all duration-300 shadow-sm hover:shadow-md ${selectedFilter === 'all' ? 'border-primary ring-2 ring-primary/10 bg-primary/5' : 'border-border/50 hover:border-primary/30'}`}
        >
          <div className="text-xs text-primary/70 mb-2 font-bold font-pretendard uppercase tracking-tighter">TOTAL ORDERS</div>
          <div className={`text-4xl font-black transition-colors ${selectedFilter === 'all' ? 'text-primary' : 'text-foreground'}`}>{loading ? '...' : `${totalOrders}건`}</div>
        </button>

        <button
          onClick={() => setSelectedFilter('shipping')}
          className={`bg-white border rounded-2xl p-6 text-left transition-all duration-300 shadow-sm hover:shadow-md ${selectedFilter === 'shipping' ? 'border-amber-500 ring-2 ring-amber-500/10 bg-amber-50/30' : 'border-border/50 hover:border-amber-500/30'}`}
        >
          <div className="text-xs text-amber-600 mb-2 font-bold font-pretendard uppercase tracking-tighter">SHIPPING</div>
          <div className={`text-4xl font-black transition-colors ${selectedFilter === 'shipping' ? 'text-amber-600' : 'text-foreground'}`}>{loading ? '...' : `${shippingOrders}건`}</div>
        </button>

        <button
          onClick={() => setSelectedFilter('delivered')}
          className={`bg-white border rounded-2xl p-6 text-left transition-all duration-300 shadow-sm hover:shadow-md ${selectedFilter === 'delivered' ? 'border-accent ring-2 ring-accent/10 bg-accent/5' : 'border-border/50 hover:border-accent/30'}`}
        >
          <div className="text-xs text-accent mb-2 font-bold font-pretendard uppercase tracking-tighter">TOTAL AMOUNT</div>
          <div className={`text-4xl font-black transition-colors ${selectedFilter === 'delivered' ? 'text-accent' : 'text-foreground'}`}>{loading ? '...' : `${totalAmount.toLocaleString()}원`}</div>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 bg-background/50 rounded-3xl border border-dashed border-border/50">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground font-pretendard">주문 내역을 불러오고 있어요...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white border border-border/50 rounded-3xl p-16 text-center shadow-sm">
          <div className="w-20 h-20 bg-secondary/50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-10 h-10 text-muted-foreground/30" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">아직 주문 내역이 없어요</h3>
          <p className="text-muted-foreground mb-8 font-pretendard">맛있고 따뜻한 빵들을 구경하러 가보실까요?</p>
          <button
            onClick={handleGoToProducts}
            className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-full font-bold transition-all shadow-lg shadow-primary/20"
          >
            인기 상품 구경하기
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          <h4 className="font-bold text-foreground mb-2 px-2">최근 주문 내역</h4>
          {orders
            .filter(order => {
              if (selectedFilter === 'all') return true;
              return order.status === selectedFilter;
            })
            .map(order => (
              <div
                key={order.id}
                onClick={() => handleOrderClick(order.id)}
                className="group bg-white border border-border/50 rounded-2xl p-5 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all cursor-pointer flex justify-between items-center"
              >
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-sm font-bold text-primary font-pretendard">주문번호 #{order.id}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${order.status === 'delivered' ? 'bg-accent/10 text-accent' : 'bg-primary/10 text-primary'}`}>
                      {order.status === 'delivered' ? '배송 완료' : '배송 준비중'}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground font-pretendard">
                    {new Date(order.createdAt).toLocaleDateString()} 주문
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-foreground mb-1">{order.total.toLocaleString()}원</div>
                  <div className="text-[10px] text-primary font-bold group-hover:underline">상세보기 &gt;</div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default ShoppingSection;
