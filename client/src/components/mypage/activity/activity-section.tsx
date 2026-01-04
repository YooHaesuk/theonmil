import { Heart, Star, Gift } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';

const ActivitySection = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'wishlist' | 'reviews' | 'coupons'>('wishlist');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 간단한 로딩 시뮬레이션
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <Heart className="w-8 h-8 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">MY 활동</h2>
        </div>
        <div className="bg-white border border-border/50 rounded-3xl p-20 text-center shadow-sm">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-6"></div>
          <p className="text-muted-foreground font-pretendard">활동 내역을 불러오는 중입니다...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 헤더 */}
      <div className="flex items-center gap-3">
        <Heart className="w-8 h-8 text-primary" />
        <h2 className="text-2xl font-bold text-foreground">MY 활동</h2>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          onClick={() => setActiveTab('wishlist')}
          className={`bg-white border rounded-2xl p-6 hover:shadow-md transition-all cursor-pointer group ${activeTab === 'wishlist' ? 'border-primary ring-1 ring-primary/20 bg-primary/5' : 'border-border/50'}`}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary transition-colors">
              <Heart className="w-5 h-5 text-primary group-hover:text-white" />
            </div>
            <h3 className="font-bold text-foreground">찜한 상품</h3>
          </div>
          <div className="flex items-baseline gap-1">
            <p className="text-4xl font-black text-primary">2</p>
            <p className="text-muted-foreground text-sm font-bold font-pretendard">개</p>
          </div>
        </div>

        <div
          onClick={() => setActiveTab('reviews')}
          className={`bg-white border rounded-2xl p-6 hover:shadow-md transition-all cursor-pointer group ${activeTab === 'reviews' ? 'border-primary ring-1 ring-primary/20 bg-primary/5' : 'border-border/50'}`}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center group-hover:bg-accent transition-colors">
              <Star className="w-5 h-5 text-accent group-hover:text-white" />
            </div>
            <h3 className="font-bold text-foreground">작성한 리뷰</h3>
          </div>
          <div className="flex items-baseline gap-1">
            <p className="text-4xl font-black text-accent">2</p>
            <p className="text-muted-foreground text-sm font-bold font-pretendard">개</p>
          </div>
        </div>

        <div
          onClick={() => setActiveTab('coupons')}
          className={`bg-white border rounded-2xl p-6 hover:shadow-md transition-all cursor-pointer group ${activeTab === 'coupons' ? 'border-primary ring-1 ring-primary/20 bg-primary/5' : 'border-border/50'}`}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center group-hover:bg-emerald-500 transition-colors">
              <Gift className="w-5 h-5 text-emerald-600 group-hover:text-white" />
            </div>
            <h3 className="font-bold text-foreground">보유 쿠폰</h3>
          </div>
          <div className="flex items-baseline gap-1">
            <p className="text-4xl font-black text-emerald-600">2</p>
            <p className="text-muted-foreground text-sm font-bold font-pretendard">장</p>
          </div>
        </div>
      </div>

      {/* 탭 컨텐츠 */}
      <div className="bg-white border border-border/50 rounded-3xl p-8 sm:p-12 shadow-sm">
        {activeTab === 'wishlist' && (
          <div className="text-center py-10">
            <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-10 h-10 text-primary/20" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2 font-pretendard">찜한 상품이 없습니다</h3>
            <p className="text-muted-foreground mb-8 font-pretendard">마음에 드는 상품을 하트 버튼으로 찜해보세요!</p>
            <button className="bg-primary hover:bg-primary/90 text-white px-10 py-4 rounded-full font-bold transition-all shadow-lg shadow-primary/20">
              인기 상품 둘러보기
            </button>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="text-center py-10">
            <div className="w-20 h-20 bg-accent/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <Star className="w-10 h-10 text-accent/20" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2 font-pretendard">작성한 리뷰가 없습니다</h3>
            <p className="text-muted-foreground mb-8 font-pretendard">구매하신 상품의 맛과 경험을 다른 분들과 나누어보세요!</p>
            <button className="border-2 border-accent text-accent hover:bg-accent hover:text-white px-10 py-4 rounded-full font-bold transition-all">
              주문 내역에서 리뷰 작성하기
            </button>
          </div>
        )}

        {activeTab === 'coupons' && (
          <div className="text-center py-10">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Gift className="w-10 h-10 text-emerald-200" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2 font-pretendard">보유하신 쿠폰이 없습니다</h3>
            <p className="text-muted-foreground mb-8 font-pretendard">이벤트 참여와 구매를 통해 더 많은 혜택을 받아보세요!</p>
            <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-10 py-4 rounded-full font-bold transition-all shadow-lg shadow-emerald-200">
              진행 중인 이벤트 보기
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivitySection;
