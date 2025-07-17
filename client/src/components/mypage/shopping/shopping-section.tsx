import { Package, Truck, CreditCard, Clock } from 'lucide-react';
import { useLocation } from 'wouter';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Order {
  id: string;
  userId: string;
  status: 'pending' | 'confirmed' | 'shipping' | 'delivered' | 'cancelled';
  totalAmount: number;
  items: any[];
  createdAt: any;
  deliveredAt?: any;
  hasReview?: boolean; // 리뷰 작성 여부
}

const ShoppingSection = () => {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'shipping' | 'delivered'>('all');
  const [showReviewGuide, setShowReviewGuide] = useState(false);

  // Firebase에서 주문 데이터 가져오기
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.uid) {
        setLoading(false);
        return;
      }

      try {
        console.log('🔍 주문 데이터 조회 시작:', user.uid);
        const ordersRef = collection(db, 'orders');
        const q = query(
          ordersRef,
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );

        const querySnapshot = await getDocs(q);
        const ordersData: Order[] = [];

        querySnapshot.forEach((doc) => {
          ordersData.push({
            id: doc.id,
            ...doc.data()
          } as Order);
        });

        console.log('📦 조회된 주문 데이터:', ordersData);

        // 실제 주문이 없으면 테스트 데이터 추가 (개발용)
        if (ordersData.length === 0) {
          const testOrders: Order[] = [
            {
              id: 'test-order-1',
              userId: user.uid,
              status: 'delivered',
              totalAmount: 25000,
              items: [
                { productId: 'bread-1', name: '크루아상', quantity: 2, price: 12500 }
              ],
              createdAt: { toDate: () => new Date('2024-01-15') },
              hasReview: false // 리뷰 미작성
            },
            {
              id: 'test-order-2',
              userId: user.uid,
              status: 'shipping',
              totalAmount: 18000,
              items: [
                { productId: 'bread-2', name: '바게트', quantity: 1, price: 18000 }
              ],
              createdAt: { toDate: () => new Date('2024-01-20') },
              hasReview: false
            },
            {
              id: 'test-order-3',
              userId: user.uid,
              status: 'delivered',
              totalAmount: 32000,
              items: [
                { productId: 'bread-3', name: '식빵', quantity: 2, price: 16000 }
              ],
              createdAt: { toDate: () => new Date('2024-01-10') },
              hasReview: true // 리뷰 작성 완료
            }
          ];

          console.log('🧪 테스트 주문 데이터 추가:', testOrders);

          // localStorage에서 완료된 리뷰 목록 확인
          const completedReviews = JSON.parse(localStorage.getItem('completedReviews') || '[]');
          console.log('📋 완료된 리뷰 목록:', completedReviews);

          // 주문 데이터에 리뷰 완료 상태 반영
          const updatedOrders = testOrders.map(order => ({
            ...order,
            hasReview: completedReviews.includes(order.id) || order.hasReview
          }));

          console.log('🔄 리뷰 상태 반영된 주문 데이터:', updatedOrders);
          setOrders(updatedOrders);
        } else {
          setOrders(ordersData);
        }
      } catch (error) {
        console.error('❌ 주문 데이터 조회 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user?.uid]);

  // 통계 계산
  const totalOrders = orders.length;
  const shippingOrders = orders.filter(order => order.status === 'shipping').length;
  const totalAmount = orders
    .filter(order => order.status === 'delivered')
    .reduce((sum, order) => sum + order.totalAmount, 0);

  const handleGoToProducts = () => {
    console.log('🛒 상품 둘러보기 클릭!');
    setLocation('/products');
  };

  const handleShowOrders = (filter: 'all' | 'shipping' | 'delivered') => {
    console.log(`📊 ${filter} 주문 보기 클릭!`);
    setSelectedFilter(filter);
    // 여기서 주문 리스트를 보여주거나 모달을 열 수 있음
  };

  const handleShowPurchaseHistory = () => {
    console.log('💰 구매 내역 상세 보기 클릭!');
    setSelectedFilter('delivered');
  };

  const handleOrderClick = (orderId: string) => {
    console.log(`📋 주문 상세보기 클릭: ${orderId}`);
    setLocation(`/mypage/order/${orderId}`);
  };

  // 리뷰 작성 가능 여부 확인
  const canWriteReview = (order: Order) => {
    return order.status === 'delivered' && !order.hasReview;
  };

  // 리뷰 작성하기 클릭
  const handleWriteReview = (order: Order) => {
    console.log(`📝 리뷰 작성: ${order.id}`);
    // 주문 정보와 함께 리뷰 작성 페이지로 이동
    const productName = order.items?.[0]?.name || '상품';
    setLocation(`/mypage/activity?tab=reviews&write=true&orderId=${order.id}&productName=${encodeURIComponent(productName)}`);
  };

  // 페이지 진입 시 리뷰 가이드 표시 (URL 파라미터로 확인)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('from') === 'review') {
      setShowReviewGuide(true);
      // 수동으로만 닫기 (자동 사라짐 제거)
    }
  }, []);

  // 컴포넌트 마운트/포커스 시 localStorage 확인
  useEffect(() => {
    console.log('🔄 MY 쇼핑 탭 활성화 - localStorage 확인');

    const checkCompletedReviews = () => {
      const completedReviews = JSON.parse(localStorage.getItem('completedReviews') || '[]');
      console.log('📋 현재 완료된 리뷰 목록:', completedReviews);

      if (completedReviews.length > 0) {
        setOrders(prev => {
          const updated = prev.map(order => ({
            ...order,
            hasReview: completedReviews.includes(order.id) || order.hasReview
          }));
          console.log('🔄 주문 상태 업데이트:', updated);
          return updated;
        });
      }
    };

    // 탭이 활성화될 때마다 확인
    checkCompletedReviews();

    // 윈도우 포커스 시에도 확인 (다른 탭에서 돌아올 때)
    const handleFocus = () => {
      console.log('🔍 윈도우 포커스 - localStorage 재확인');
      checkCompletedReviews();
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []); // 컴포넌트 마운트 시에만

  // 사용자 친화적인 주문번호 생성
  const getOrderNumber = (order: Order) => {
    const date = order.createdAt?.toDate?.() || new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const orderNum = order.id.slice(-3).padStart(3, '0');
    return `${year}${month}${day}-${orderNum}`;
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center gap-3">
        <Package className="w-8 h-8 text-[#A78BFA]" />
        <h2 className="text-2xl font-bold text-white">MY 쇼핑</h2>
      </div>

      {/* 리뷰 작성 가이드 */}
      {showReviewGuide && (
        <div className="bg-gradient-to-r from-[#A78BFA]/20 to-[#EC4899]/20 border border-[#A78BFA]/50 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-gradient-to-r from-[#A78BFA] to-[#EC4899] rounded-full flex items-center justify-center">
              <span className="text-white text-sm">📝</span>
            </div>
            <h3 className="text-lg font-bold text-white">리뷰 작성 안내</h3>
            <button
              onClick={() => setShowReviewGuide(false)}
              className="ml-auto text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
          <p className="text-gray-300 mb-2">
            <strong className="text-[#A78BFA]">구매완료된 상품에 한해서 리뷰를 작성할 수 있습니다!</strong>
          </p>
          <p className="text-gray-400 text-sm">
            • 배송완료된 주문에서 "리뷰 작성" 버튼을 확인하세요<br />
            • 리뷰는 언제든지 작성 가능하며, 작성 후 14일 이내 수정 가능합니다
          </p>
        </div>
      )}

      {/* 클릭 가능한 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 총 주문 */}
        <button
          onClick={() => handleShowOrders('all')}
          className="bg-[#1A1A1A] border border-[#333] rounded-lg p-6 text-left hover:border-[#A78BFA] hover:bg-[#1A1A1A]/80 transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-4 h-4 text-gray-400 group-hover:text-[#A78BFA]" />
            <div className="text-sm text-gray-400 group-hover:text-white">총 주문</div>
          </div>
          <div className="text-2xl font-bold text-white">{loading ? '...' : `${totalOrders}건`}</div>
          <div className="text-xs text-[#A78BFA] mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
            클릭하여 전체 주문 보기 →
          </div>
        </button>

        {/* 배송 중 */}
        <button
          onClick={() => handleShowOrders('shipping')}
          className="bg-[#1A1A1A] border border-[#333] rounded-lg p-6 text-left hover:border-[#A78BFA] hover:bg-[#1A1A1A]/80 transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-2 mb-2">
            <Truck className="w-4 h-4 text-gray-400 group-hover:text-[#A78BFA]" />
            <div className="text-sm text-gray-400 group-hover:text-white">배송 중</div>
          </div>
          <div className="text-2xl font-bold text-[#A78BFA]">{loading ? '...' : `${shippingOrders}건`}</div>
          <div className="text-xs text-[#A78BFA] mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
            클릭하여 배송 중 주문 보기 →
          </div>
        </button>

        {/* 총 구매금액 */}
        <button
          onClick={handleShowPurchaseHistory}
          className="bg-[#1A1A1A] border border-[#333] rounded-lg p-6 text-left hover:border-[#10B981] hover:bg-[#1A1A1A]/80 transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-2 mb-2">
            <CreditCard className="w-4 h-4 text-gray-400 group-hover:text-[#10B981]" />
            <div className="text-sm text-gray-400 group-hover:text-white">총 구매금액</div>
          </div>
          <div className="text-2xl font-bold text-[#10B981]">
            {loading ? '...' : `${totalAmount.toLocaleString()}원`}
          </div>
          <div className="text-xs text-[#10B981] mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
            클릭하여 구매 내역 보기 →
          </div>
        </button>
      </div>

      {/* 주문 리스트 또는 빈 상태 */}
      {loading ? (
        <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A78BFA] mx-auto mb-4"></div>
          <p className="text-gray-400">주문 내역을 불러오는 중...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-12 text-center">
          <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">주문 내역이 없습니다</h3>
          <p className="text-gray-400 mb-6">
            아직 주문하신 상품이 없습니다.<br />
            더 온밀의 신선한 빵을 주문해보세요!
          </p>
          <button
            onClick={handleGoToProducts}
            className="bg-[#A78BFA] hover:bg-[#9333EA] text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            상품 둘러보기
          </button>
        </div>
      ) : (
        <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">
              {selectedFilter === 'all' && '전체 주문 내역'}
              {selectedFilter === 'shipping' && '배송 중인 주문'}
              {selectedFilter === 'delivered' && '구매 완료 내역'}
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedFilter('all')}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  selectedFilter === 'all'
                    ? 'bg-[#A78BFA] text-white'
                    : 'bg-[#333] text-gray-400 hover:text-white'
                }`}
              >
                전체
              </button>
              <button
                onClick={() => setSelectedFilter('shipping')}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  selectedFilter === 'shipping'
                    ? 'bg-[#A78BFA] text-white'
                    : 'bg-[#333] text-gray-400 hover:text-white'
                }`}
              >
                배송중
              </button>
              <button
                onClick={() => setSelectedFilter('delivered')}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  selectedFilter === 'delivered'
                    ? 'bg-[#10B981] text-white'
                    : 'bg-[#333] text-gray-400 hover:text-white'
                }`}
              >
                완료
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {orders
              .filter(order => {
                if (selectedFilter === 'all') return true;
                if (selectedFilter === 'shipping') return order.status === 'shipping';
                if (selectedFilter === 'delivered') return order.status === 'delivered';
                return true;
              })
              .map(order => (
                <div
                  key={order.id}
                  onClick={() => handleOrderClick(order.id)}
                  className="bg-[#0A0A0A] border border-[#333] rounded-lg p-4 hover:border-[#A78BFA] transition-colors cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium">주문 #{getOrderNumber(order)}</span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        order.status === 'shipping' ? 'bg-[#A78BFA]/20 text-[#A78BFA]' :
                        order.status === 'delivered' ? 'bg-[#10B981]/20 text-[#10B981]' :
                        order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                        'bg-gray-500/20 text-gray-500'
                      }`}>
                        {order.status === 'shipping' && '배송중'}
                        {order.status === 'delivered' && '배송완료'}
                        {order.status === 'pending' && '주문접수'}
                        {order.status === 'confirmed' && '주문확인'}
                        {order.status === 'cancelled' && '주문취소'}
                      </span>
                    </div>
                    <span className="text-white font-bold">{order.totalAmount.toLocaleString()}원</span>
                  </div>
                  <div className="text-sm text-gray-400">
                    주문일: {order.createdAt?.toDate?.()?.toLocaleDateString() || '날짜 정보 없음'}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-400">
                      상품 {order.items?.length || 0}개
                    </div>
                    <div className="flex items-center gap-2">
                      {/* 리뷰 작성 버튼 (구매완료 + 리뷰 미작성) */}
                      {canWriteReview(order) && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleWriteReview(order);
                          }}
                          className="bg-gradient-to-r from-[#F59E0B] to-[#D97706] hover:from-[#D97706] hover:to-[#B45309] text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all transform hover:scale-105"
                        >
                          📝 리뷰 작성
                        </button>
                      )}

                      {/* 리뷰 작성 완료 표시 */}
                      {order.status === 'delivered' && order.hasReview && (
                        <span className="bg-[#10B981]/20 text-[#10B981] px-3 py-1.5 rounded-lg text-xs font-medium">
                          ✅ 리뷰 완료
                        </span>
                      )}


                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingSection;


