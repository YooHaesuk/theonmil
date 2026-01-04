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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    console.log('❌ 사용자 없음, 로그인 페이지로 리다이렉트');
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="text-center p-8 bg-card rounded-2xl border border-border/50 shadow-xl">
          <p className="text-muted-foreground mb-6 font-pretendard">로그인이 필요합니다.</p>
          <button
            onClick={() => setLocation('/login')}
            className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-full font-medium transition-all shadow-lg shadow-primary/20"
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

    if (activeTab === 'shopping') {
      try {
        return <ShoppingSection />;
      } catch (error) {
        console.error('🛒 ShoppingSection 에러:', error);
        return (
          <div className="min-h-[400px] bg-red-50 p-8 rounded-xl border border-red-100 text-red-600">
            <h1 className="text-2xl font-bold mb-4">🛒 MY 쇼핑 에러</h1>
            <p>데이터를 불러오는 중 문제가 발생했습니다.</p>
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
          <div className="min-h-[400px] bg-red-50 p-8 rounded-xl border border-red-100 text-red-600">
            <h1 className="text-2xl font-bold mb-4">❤️ MY 활동 에러</h1>
            <p>데이터를 불러오는 중 문제가 발생했습니다.</p>
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
          <div className="min-h-[400px] bg-red-50 p-8 rounded-xl border border-red-100 text-red-600">
            <h1 className="text-2xl font-bold mb-4">👤 MY 정보 에러</h1>
            <p>데이터를 불러오는 중 문제가 발생했습니다.</p>
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
          <div className="min-h-[400px] bg-red-50 p-8 rounded-xl border border-red-100 text-red-600">
            <h1 className="text-2xl font-bold mb-4">🎧 고객지원 에러</h1>
            <p>데이터를 불러오는 중 문제가 발생했습니다.</p>
          </div>
        );
      }
    }

    return (
      <div className="min-h-[400px] bg-background p-8 text-muted-foreground flex items-center justify-center">
        <p>선택된 탭이 없습니다.</p>
      </div>
    );
  };

  console.log('🎨 마이페이지 렌더링 시작');

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      className="min-h-screen bg-background text-foreground pt-24 pb-20"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div variants={fadeIn} className="mb-10 text-center md:text-left">
          <h1 className={`${headingClasses} text-4xl mb-4 text-foreground`}>
            마이<span className="bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text">페이지</span>
          </h1>
          <p className="text-muted-foreground font-pretendard">
            안녕하세요, <span className="font-semibold text-primary">{user?.name || '사용자'}</span>님!
            오늘도 더 온밀과 함께 기분 좋은 하루 보내세요 ✨
          </p>

          {/* 탭 네비게이션 */}
          <div className="mt-8">
            {/* 데스크톱 상단 탭 */}
            <div className="hidden md:flex flex-wrap gap-2 p-1 bg-secondary/30 rounded-2xl w-fit">
              <button
                onClick={() => handleTabChange('shopping')}
                className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-sm ${activeTab === 'shopping'
                  ? 'bg-white text-primary shadow-md transform scale-[1.02]'
                  : 'text-muted-foreground hover:text-foreground hover:bg-white/50'
                  }`}
              >
                <i className="fa-solid fa-shopping-bag mr-2"></i>
                MY 쇼핑
              </button>
              <button
                onClick={() => handleTabChange('activity')}
                className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-sm ${activeTab === 'activity'
                  ? 'bg-white text-primary shadow-md transform scale-[1.02]'
                  : 'text-muted-foreground hover:text-foreground hover:bg-white/50'
                  }`}
              >
                <i className="fa-solid fa-heart mr-2"></i>
                MY 활동
              </button>
              <button
                onClick={() => handleTabChange('profile')}
                className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-sm ${activeTab === 'profile'
                  ? 'bg-white text-primary shadow-md transform scale-[1.02]'
                  : 'text-muted-foreground hover:text-foreground hover:bg-white/50'
                  }`}
              >
                <i className="fa-solid fa-user mr-2"></i>
                MY 정보
              </button>
              <button
                onClick={() => handleTabChange('support')}
                className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-sm ${activeTab === 'support'
                  ? 'bg-white text-primary shadow-md transform scale-[1.02]'
                  : 'text-muted-foreground hover:text-foreground hover:bg-white/50'
                  }`}
              >
                <i className="fa-solid fa-headset mr-2"></i>
                고객지원
              </button>
            </div>

            {/* 모바일 하단 탭 느낌의 그리드 */}
            <div className="md:hidden grid grid-cols-2 gap-3 mt-4">
              <button
                onClick={() => handleTabChange('shopping')}
                className={`px-4 py-4 rounded-2xl font-bold transition-all text-sm shadow-sm flex flex-col items-center gap-2 ${activeTab === 'shopping'
                  ? 'bg-white text-primary ring-1 ring-primary/20'
                  : 'bg-card text-muted-foreground'
                  }`}
              >
                <i className="fa-solid fa-shopping-bag text-lg"></i>
                MY 쇼핑
              </button>
              <button
                onClick={() => handleTabChange('activity')}
                className={`px-4 py-4 rounded-2xl font-bold transition-all text-sm shadow-sm flex flex-col items-center gap-2 ${activeTab === 'activity'
                  ? 'bg-white text-primary ring-1 ring-primary/20'
                  : 'bg-card text-muted-foreground'
                  }`}
              >
                <i className="fa-solid fa-heart text-lg"></i>
                MY 활동
              </button>
              <button
                onClick={() => handleTabChange('profile')}
                className={`px-4 py-4 rounded-2xl font-bold transition-all text-sm shadow-sm flex flex-col items-center gap-2 ${activeTab === 'profile'
                  ? 'bg-white text-primary ring-1 ring-primary/20'
                  : 'bg-card text-muted-foreground'
                  }`}
              >
                <i className="fa-solid fa-user text-lg"></i>
                MY 정보
              </button>
              <button
                onClick={() => handleTabChange('support')}
                className={`px-4 py-4 rounded-2xl font-bold transition-all text-sm shadow-sm flex flex-col items-center gap-2 ${activeTab === 'support'
                  ? 'bg-white text-primary ring-1 ring-primary/20'
                  : 'bg-card text-muted-foreground'
                  }`}
              >
                <i className="fa-solid fa-headset text-lg"></i>
                고객지원
              </button>
            </div>
          </div>
        </motion.div>

        {/* 탭 컨텐츠 */}
        <motion.div variants={slideInFromBottom} className="bg-card rounded-3xl border border-border/50 p-4 sm:p-6 md:p-10 shadow-2xl shadow-primary/5">
          {renderTabContent()}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MyPage;
