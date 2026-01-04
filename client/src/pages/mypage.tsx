import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useLocation } from 'wouter';
import { pageTransition, fadeIn, slideInFromBottom } from '@/lib/animations';
import { headingClasses } from '@/lib/fonts';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import ShoppingSection from '@/components/mypage/shopping/shopping-section';
import ActivitySection from '@/components/mypage/activity/activity-section';
import ProfileSection from '@/components/mypage/profile/profile-section';
import SupportSection from '@/components/mypage/support/support-section';

const MyPage = () => {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const { section, orderId } = useParams<{ section?: string; orderId?: string }>();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<'shopping' | 'activity' | 'profile' | 'support'>('shopping');

  // URL 파라미터에 따라 활성 탭 설정
  useEffect(() => {
    if (section && ['shopping', 'activity', 'profile', 'support'].includes(section)) {
      setActiveTab(section as any);
    }
  }, [section]);

  // 인증되지 않은 사용자 리다이렉트
  useEffect(() => {
    if (!loading && !user) {
      toast({
        title: "로그인이 필요합니다",
        description: "마이페이지를 이용하려면 로그인해주세요.",
        variant: "destructive",
      });
      setLocation('/login');
    }
  }, [user, loading, setLocation, toast]);

  // 탭 변경 핸들러
  const handleTabChange = (newTab: 'shopping' | 'activity' | 'profile' | 'support') => {
    setActiveTab(newTab);
    setLocation(`/mypage/${newTab}`);
  };

  // 로딩 중이거나 사용자가 없으면 로딩 표시
  if (loading) {
    console.log('🔄 로딩 중...');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!user) {
    console.log('❌ 사용자 없음, 로그인 페이지로 리다이렉트');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">로그인이 필요합니다.</p>
          <button
            onClick={() => setLocation('/login')}
            className="bg-purple-500 text-white px-4 py-2 rounded"
          >
            로그인하러 가기
          </button>
        </div>
      </div>
    );
  }

  // 현재 탭에 따른 컴포넌트 렌더링
  const renderTabContent = () => {
    console.log('🎯 renderTabContent 호출됨! activeTab:', activeTab);

    // MY 쇼핑 - 원래 컴포넌트 복구
    if (activeTab === 'shopping') {
      try {
        return <ShoppingSection />;
      } catch (error) {
        console.error('🛒 ShoppingSection 에러:', error);
        return (
          <div className="min-h-[400px] bg-red-500 p-8 text-white">
            <h1 className="text-4xl font-bold mb-4">🛒 MY 쇼핑 에러</h1>
            <p className="text-xl">ShoppingSection에서 에러 발생!</p>
            <div className="mt-4 bg-white text-black p-4 rounded">
              <p>에러: {error?.toString()}</p>
            </div>
          </div>
        );
      }
    }

    if (activeTab === 'activity') {
      try {
        return <ActivitySection />;
      } catch (error) {
        console.error('❤️ ActivitySection 에러:', error);
        return (
          <div className="min-h-[400px] bg-red-500 p-8 text-white">
            <h1 className="text-4xl font-bold mb-4">❤️ MY 활동 에러</h1>
            <p className="text-xl">ActivitySection에서 에러 발생!</p>
            <div className="mt-4 bg-white text-black p-4 rounded">
              <p>에러: {error?.toString()}</p>
            </div>
          </div>
        );
      }
    }

    if (activeTab === 'profile') {
      try {
        return <ProfileSection />;
      } catch (error) {
        console.error('👤 ProfileSection 에러:', error);
        return (
          <div className="min-h-[400px] bg-red-500 p-8 text-white">
            <h1 className="text-4xl font-bold mb-4">👤 MY 정보 에러</h1>
            <p className="text-xl">ProfileSection에서 에러 발생!</p>
            <div className="mt-4 bg-white text-black p-4 rounded">
              <p>에러: {error?.toString()}</p>
            </div>
          </div>
        );
      }
    }

    if (activeTab === 'support') {
      try {
        return <SupportSection />;
      } catch (error) {
        console.error('🎧 SupportSection 에러:', error);
        return (
          <div className="min-h-[400px] bg-red-500 p-8 text-white">
            <h1 className="text-4xl font-bold mb-4">🎧 고객지원 에러</h1>
            <p className="text-xl">SupportSection에서 에러 발생!</p>
            <div className="mt-4 bg-white text-black p-4 rounded">
              <p>에러: {error?.toString()}</p>
            </div>
          </div>
        );
      }
    }

    // 기본값
    return (
      <div className="min-h-[400px] bg-yellow-500 p-8 text-black">
        <h1 className="text-4xl font-bold">⚠️ 기본 테스트</h1>
        <p>노란 박스 - 기본 상태</p>
      </div>
    );
  };

  console.log('🎨 마이페이지 렌더링 시작');
  console.log('🔍 사용자 정보:', user);
  console.log('🔍 활성 탭:', activeTab);

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      className="min-h-screen bg-background text-foreground pt-20"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <motion.div variants={fadeIn} className="mb-8">
          <h1 className={`${headingClasses} text-4xl mb-4 text-foreground`}>
            마이<span className="bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text">페이지</span>
          </h1>
          <p className="text-muted-foreground">
            안녕하세요, <span className="font-semibold text-primary">{user?.name || '사용자'}</span>님!
            더 온밀에서 따뜻한 하루 보내세요 🍞
          </p>

          {/* 탭 네비게이션 */}
          <div className="mt-6">
            {/* 데스크톱 탭 네비게이션 */}
            <div className="hidden md:flex flex-wrap gap-4">
              <button
                onClick={() => handleTabChange('shopping')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${activeTab === 'shopping'
                  ? 'bg-gradient-to-r from-primary to-accent text-white'
                  : 'bg-secondary text-muted-foreground hover:text-foreground hover:bg-muted/10'
                  }`}
              >
                <i className="fa-solid fa-shopping-bag mr-2"></i>
                MY 쇼핑
              </button>
              <button
                onClick={() => handleTabChange('activity')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${activeTab === 'activity'
                  ? 'bg-gradient-to-r from-primary to-accent text-white'
                  : 'bg-secondary text-muted-foreground hover:text-foreground hover:bg-muted/10'
                  }`}
              >
                <i className="fa-solid fa-heart mr-2"></i>
                MY 활동
              </button>
              <button
                onClick={() => handleTabChange('profile')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${activeTab === 'profile'
                  ? 'bg-gradient-to-r from-primary to-accent text-white'
                  : 'bg-secondary text-muted-foreground hover:text-foreground hover:bg-muted/10'
                  }`}
              >
                <i className="fa-solid fa-user mr-2"></i>
                MY 정보
              </button>
              <button
                onClick={() => handleTabChange('support')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${activeTab === 'support'
                  ? 'bg-gradient-to-r from-primary to-accent text-white'
                  : 'bg-secondary text-muted-foreground hover:text-foreground hover:bg-muted/10'
                  }`}
              >
                <i className="fa-solid fa-headset mr-2"></i>
                고객지원
              </button>
            </div>

            {/* 모바일 탭 네비게이션 */}
            <div className="md:hidden grid grid-cols-2 gap-3">
              <button
                onClick={() => handleTabChange('shopping')}
                className={`px-4 py-3 rounded-lg font-medium transition-all text-sm ${activeTab === 'shopping'
                  ? 'bg-gradient-to-r from-primary to-accent text-white'
                  : 'bg-secondary text-muted-foreground hover:text-foreground hover:bg-muted/10'
                  }`}
              >
                <i className="fa-solid fa-shopping-bag mr-1"></i>
                MY 쇼핑
              </button>
              <button
                onClick={() => handleTabChange('activity')}
                className={`px-4 py-3 rounded-lg font-medium transition-all text-sm ${activeTab === 'activity'
                  ? 'bg-gradient-to-r from-primary to-accent text-white'
                  : 'bg-secondary text-muted-foreground hover:text-foreground hover:bg-muted/10'
                  }`}
              >
                <i className="fa-solid fa-heart mr-1"></i>
                MY 활동
              </button>
              <button
                onClick={() => handleTabChange('profile')}
                className={`px-4 py-3 rounded-lg font-medium transition-all text-sm ${activeTab === 'profile'
                  ? 'bg-gradient-to-r from-primary to-accent text-white'
                  : 'bg-secondary text-muted-foreground hover:text-foreground hover:bg-muted/10'
                  }`}
              >
                <i className="fa-solid fa-user mr-1"></i>
                MY 정보
              </button>
              <button
                onClick={() => handleTabChange('support')}
                className={`px-4 py-3 rounded-lg font-medium transition-all text-sm ${activeTab === 'support'
                  ? 'bg-gradient-to-r from-primary to-accent text-white'
                  : 'bg-secondary text-muted-foreground hover:text-foreground hover:bg-muted/10'
                  }`}
              >
                <i className="fa-solid fa-headset mr-1"></i>
                고객지원
              </button>
            </div>
          </div>
        </motion.div>

        {/* 탭 컨텐츠 */}
        <motion.div variants={slideInFromBottom} className="bg-secondary rounded-lg border border-border p-4 sm:p-6 md:p-8">
          {renderTabContent()}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MyPage;
