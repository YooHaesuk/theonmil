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
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Heart className="w-8 h-8 text-[#EC4899]" />
          <h2 className="text-2xl font-bold text-white">MY 활동</h2>
        </div>
        <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#EC4899] mx-auto mb-4"></div>
          <p className="text-gray-400">활동 내역을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center gap-3">
        <Heart className="w-8 h-8 text-[#EC4899]" />
        <h2 className="text-2xl font-bold text-white">MY 활동</h2>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-6 hover:border-[#EC4899] transition-colors cursor-pointer">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="w-6 h-6 text-[#EC4899]" />
            <h3 className="font-semibold text-white">찜한 상품</h3>
          </div>
          <p className="text-2xl font-bold text-[#EC4899]">2</p>
          <p className="text-gray-400 text-sm">개</p>
        </div>

        <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-6 hover:border-[#F59E0B] transition-colors cursor-pointer">
          <div className="flex items-center gap-3 mb-2">
            <Star className="w-6 h-6 text-[#F59E0B]" />
            <h3 className="font-semibold text-white">작성한 리뷰</h3>
          </div>
          <p className="text-2xl font-bold text-[#F59E0B]">2</p>
          <p className="text-gray-400 text-sm">개</p>
        </div>

        <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-6 hover:border-[#10B981] transition-colors cursor-pointer">
          <div className="flex items-center gap-3 mb-2">
            <Gift className="w-6 h-6 text-[#10B981]" />
            <h3 className="font-semibold text-white">보유 쿠폰</h3>
          </div>
          <p className="text-2xl font-bold text-[#10B981]">2</p>
          <p className="text-gray-400 text-sm">장</p>
        </div>
      </div>

      {/* 탭 메뉴 */}
      <div className="flex gap-2 border-b border-[#333]">
        <button
          onClick={() => setActiveTab('wishlist')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'wishlist'
              ? 'text-[#EC4899] border-b-2 border-[#EC4899]'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          찜한 상품
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'reviews'
              ? 'text-[#F59E0B] border-b-2 border-[#F59E0B]'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          작성한 리뷰
        </button>
        <button
          onClick={() => setActiveTab('coupons')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'coupons'
              ? 'text-[#10B981] border-b-2 border-[#10B981]'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          보유 쿠폰
        </button>
      </div>

      {/* 탭 컨텐츠 */}
      <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-6">
        {activeTab === 'wishlist' && (
          <div className="text-center py-8">
            <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">찜한 상품이 없습니다</h3>
            <p className="text-gray-400 mb-6">마음에 드는 상품을 찜해보세요!</p>
            <button className="bg-[#EC4899] hover:bg-[#DB2777] text-white px-6 py-3 rounded-lg font-medium transition-colors">
              상품 둘러보기
            </button>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="text-center py-8">
            <Star className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">작성한 리뷰가 없습니다</h3>
            <p className="text-gray-400 mb-6">구매한 상품에 대한 리뷰를 작성해보세요!</p>
            <button className="bg-[#F59E0B] hover:bg-[#D97706] text-white px-6 py-3 rounded-lg font-medium transition-colors">
              주문 내역 보기
            </button>
          </div>
        )}

        {activeTab === 'coupons' && (
          <div className="text-center py-8">
            <Gift className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">사용 가능한 쿠폰이 없습니다</h3>
            <p className="text-gray-400 mb-6">이벤트나 구매를 통해 쿠폰을 받아보세요!</p>
            <button className="bg-[#10B981] hover:bg-[#059669] text-white px-6 py-3 rounded-lg font-medium transition-colors">
              상품 둘러보기
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivitySection;
