import { User, Mail, Phone, MapPin, CreditCard, Bell, Settings, Calendar, Plus, Trash2, Star, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { getUserProfile, updateUserProfile, addAddress, removeAddress, Address, UserProfile, Timestamp } from '@/lib/mypage-firebase';

// 카카오 우편번호 서비스 타입 선언
declare global {
  interface Window {
    daum: {
      Postcode: new (options: {
        oncomplete: (data: any) => void;
        width?: string;
        height?: string;
      }) => {
        open: () => void;
      };
    };
  }
}



const ProfileSection = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<'personal' | 'address' | 'payment' | 'notifications'>('personal');
  const [loading, setLoading] = useState(true);

  // 배송지 관리 상태
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [newAddress, setNewAddress] = useState({
    name: '',
    recipient: '',
    phone: '',
    zipCode: '',
    address: '',
    detailAddress: '',
    isDefault: false
  });

  // 프로필 상태
  const [profile, setProfile] = useState<UserProfile>({
    uid: '',
    name: '',
    email: '',
    phone: '',
    addresses: [],
    wishlist: [],
    recentViews: [],
    settings: {
      notifications: true,
      marketing: false,
      sms: true,
      email: true
    },
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    lastLoginAt: Timestamp.now()
  });

  useEffect(() => {
    // 실제 사용자 정보로 프로필 초기화
    const loadProfile = async () => {
      if (!user) return;

      setLoading(true);
      console.log('📋 사용자 정보로 프로필 초기화:', user);

      try {
        // 기본 사용자 정보 설정 (Firebase Auth 기반)
        const baseProfile: UserProfile = {
          uid: user.uid,
          name: user.name || '',
          email: user.email || '',
          phone: '', // Firebase에서 로딩
          addresses: [], // Firebase에서 로딩
          wishlist: [],
          recentViews: [],
          settings: {
            notifications: true,
            marketing: false,
            sms: true,
            email: true
          },
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
          lastLoginAt: Timestamp.now()
        };

        // 기존 mypage-firebase 함수 사용해서 user_profiles에서 데이터 로딩
        console.log('🔍 user_profiles에서 사용자 프로필 로딩:', user.uid);
        const userProfile = await getUserProfile(user.uid);

        if (userProfile) {
          console.log('📋 user_profiles에서 불러온 데이터:', userProfile);

          // user_profiles 데이터와 기본 프로필 병합
          const mergedProfile = {
            ...baseProfile,
            phone: userProfile.phone || '',
            addresses: userProfile.addresses || [],
            settings: {
              notifications: userProfile.settings?.notifications ?? true,
              marketing: userProfile.settings?.marketing ?? false,
              sms: userProfile.settings?.sms ?? true,
              email: true, // 추가 필드
            },
            wishlist: userProfile.wishlist || [],
            recentViews: userProfile.recentViews || [],
            createdAt: userProfile.createdAt || baseProfile.createdAt,
            updatedAt: userProfile.updatedAt || baseProfile.updatedAt,
            lastLoginAt: Timestamp.now() // 현재 시간으로 설정
          };

          setProfile(mergedProfile);
          console.log('✅ user_profiles 데이터 병합 완료:', mergedProfile);
        } else {
          console.log('📝 user_profiles에 데이터 없음, 기본 프로필로 새로 생성됨');
          setProfile(baseProfile);
        }

      } catch (error) {
        console.error('❌ 프로필 로딩 실패:', error);
        toast({
          title: "프로필 로딩 실패",
          description: "사용자 정보를 불러오는데 실패했습니다.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user, toast]);

  // 통계 계산
  const totalAddresses = profile.addresses.length;
  const defaultAddress = profile.addresses.find(addr => addr.isDefault);
  const membershipDays = Math.floor((new Date().getTime() - profile.createdAt.toDate().getTime()) / (1000 * 60 * 60 * 24));
  const lastLoginDays = profile.lastLoginAt ? Math.floor((new Date().getTime() - profile.lastLoginAt.toDate().getTime()) / (1000 * 60 * 60 * 24)) : 0;

  // 클릭 핸들러
  const handleShowPersonal = () => {
    console.log('👤 개인정보 관리 클릭!');
    setActiveTab('personal');
  };

  const handleShowAddress = () => {
    console.log('📍 배송지 관리 클릭!');
    setActiveTab('address');
  };

  // 배송지 추가 함수
  const handleAddAddress = async () => {
    try {
      if (!user?.uid) {
        throw new Error('사용자 ID가 없습니다');
      }

      console.log('📍 새 배송지 추가:', newAddress);

      // Firebase에 배송지 추가
      const success = await addAddress(user.uid, {
        name: newAddress.name,
        recipient: newAddress.recipient,
        phone: newAddress.phone,
        address: newAddress.address,
        detailAddress: newAddress.detailAddress,
        zipCode: newAddress.zipCode,
        isDefault: newAddress.isDefault
      });

      if (success) {
        console.log('✅ 배송지 추가 성공');

        // 프로필 다시 로딩
        const updatedProfile = await getUserProfile(user.uid);
        if (updatedProfile) {
          setProfile(prev => ({
            ...prev,
            addresses: updatedProfile.addresses
          }));
        }

        // 폼 초기화
        setNewAddress({
          name: '',
          recipient: '',
          phone: '',
          zipCode: '',
          address: '',
          detailAddress: '',
          isDefault: false
        });
        setShowAddressForm(false);

        toast({
          title: "배송지가 추가되었습니다! ✅",
          description: "새로운 배송지가 성공적으로 저장되었습니다.",
          variant: "default",
        });
      } else {
        throw new Error('배송지 추가 실패');
      }
    } catch (error) {
      console.error('❌ 배송지 추가 실패:', error);
      toast({
        title: "배송지 추가 실패",
        description: `배송지 추가 중 오류가 발생했습니다: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  // 주소 검색 함수 (카카오 우편번호 서비스)
  const handleAddressSearch = () => {
    new (window as any).daum.Postcode({
      oncomplete: function (data: any) {
        console.log('🏠 주소 검색 결과:', data);

        // 선택된 주소 정보를 폼에 자동 입력
        setNewAddress(prev => ({
          ...prev,
          zipCode: data.zonecode, // 우편번호
          address: data.address,  // 기본 주소
          // 상세주소는 사용자가 직접 입력
        }));

        console.log('✅ 주소 정보 자동 입력 완료');
      },
      // 팝업 크기 설정
      width: '100%',
      height: '100%',
    }).open();
  };

  // 배송지 삭제 함수
  const handleDeleteAddress = async (addressId: string) => {
    try {
      if (!user?.uid) {
        throw new Error('사용자 ID가 없습니다');
      }

      console.log('🗑️ 배송지 삭제:', addressId);

      const success = await removeAddress(user.uid, addressId);

      if (success) {
        console.log('✅ 배송지 삭제 성공');

        // 프로필 다시 로딩
        const updatedProfile = await getUserProfile(user.uid);
        if (updatedProfile) {
          setProfile(prev => ({
            ...prev,
            addresses: updatedProfile.addresses
          }));
        }

        toast({
          title: "배송지가 삭제되었습니다! ✅",
          description: "배송지가 성공적으로 삭제되었습니다.",
          variant: "default",
        });
      } else {
        throw new Error('배송지 삭제 실패');
      }
    } catch (error) {
      console.error('❌ 배송지 삭제 실패:', error);
      toast({
        title: "배송지 삭제 실패",
        description: `배송지 삭제 중 오류가 발생했습니다: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const handleShowPayment = () => {
    console.log('💳 결제정보 관리 클릭!');
    setActiveTab('payment');
  };

  const handleShowNotifications = () => {
    console.log('🔔 알림 설정 클릭!');
    setActiveTab('notifications');
  };

  // 프로필 수정 핸들러
  const handleProfileUpdate = (field: keyof UserProfile, value: any) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 프로필 저장 (전화번호만 저장) - 기존 mypage-firebase 함수 사용
  const handleSaveProfile = async () => {
    try {
      console.log('💾 전화번호 저장 시작:', profile.phone);

      if (!user?.uid) {
        throw new Error('사용자 ID가 없습니다');
      }

      // 기존 updateUserProfile 함수 사용해서 user_profiles에 저장
      const updateData = {
        phone: profile.phone
      };

      console.log('📝 저장할 데이터:', updateData);
      console.log('🎯 저장 위치: user_profiles/' + user.uid);

      // mypage-firebase의 updateUserProfile 함수 사용
      const success = await updateUserProfile(user.uid, updateData);

      if (success) {
        console.log('✅ user_profiles 업데이트 완료');
        toast({
          title: "전화번호가 저장되었습니다! ✅",
          description: "연락처 정보가 user_profiles에 성공적으로 저장되었습니다.",
          variant: "default",
        });
      } else {
        throw new Error('updateUserProfile 함수에서 false 반환');
      }
    } catch (error) {
      console.error('❌ 전화번호 저장 실패:', error);
      toast({
        title: "저장 실패",
        description: `전화번호 저장 중 오류가 발생했습니다: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <User className="w-8 h-8 text-[#10B981]" />
          <h2 className="text-2xl font-bold text-white">MY 정보</h2>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#10B981]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 헤더 */}
      <div className="flex items-center gap-3">
        <User className="w-8 h-8 text-[#10B981]" />
        <h2 className="text-2xl font-bold text-white">MY 정보</h2>
      </div>

      {/* 프로필 요약 카드 */}
      <div className="bg-[#0A0A0A] border border-[#333] rounded-lg p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 bg-gradient-to-r from-[#10B981] to-[#059669] rounded-full flex items-center justify-center">
            {user?.image ? (
              <img
                src={user.image}
                alt={user.name}
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <User className="w-10 h-10 text-white" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white">{profile.name}</h3>
            <p className="text-gray-400">{profile.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="px-2 py-1 bg-[#10B981]/20 text-[#10B981] text-xs rounded-full">
                {user?.provider === 'google' ? 'Google' :
                  user?.provider === 'kakao' ? 'Kakao' :
                    user?.provider === 'naver' ? 'Naver' : '일반'} 계정
              </div>
              <div className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                가입 {membershipDays}일차
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 클릭 가능한 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* 개인정보 관리 */}
        <button
          onClick={handleShowPersonal}
          className="bg-[#0A0A0A] border border-[#333] rounded-lg p-6 text-left hover:border-[#10B981] transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-3 mb-2">
            <User className="w-5 h-5 text-[#10B981] group-hover:scale-110 transition-transform" />
            <div className="text-sm text-gray-400 group-hover:text-white">개인정보</div>
          </div>
          <div className="text-2xl font-bold text-white">{profile.name}</div>
          <div className="text-xs text-[#10B981] mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
            클릭하여 개인정보 관리 →
          </div>
        </button>

        {/* 배송지 관리 */}
        <button
          onClick={handleShowAddress}
          className="bg-[#0A0A0A] border border-[#333] rounded-lg p-6 text-left hover:border-blue-500 transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-3 mb-2">
            <MapPin className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform" />
            <div className="text-sm text-gray-400 group-hover:text-white">배송지</div>
          </div>
          <div className="text-2xl font-bold text-white">{totalAddresses}개</div>
          <div className="text-xs text-blue-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
            클릭하여 배송지 관리 →
          </div>
        </button>

        {/* 결제정보 관리 */}
        <button
          onClick={handleShowPayment}
          className="bg-[#0A0A0A] border border-[#333] rounded-lg p-6 text-left hover:border-green-500 transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-3 mb-2">
            <CreditCard className="w-5 h-5 text-green-500 group-hover:scale-110 transition-transform" />
            <div className="text-sm text-gray-400 group-hover:text-white">결제정보</div>
          </div>
          <div className="text-2xl font-bold text-white">0개</div>
          <div className="text-xs text-green-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
            클릭하여 결제정보 관리 →
          </div>
        </button>

        {/* 알림 설정 */}
        <button
          onClick={handleShowNotifications}
          className="bg-[#0A0A0A] border border-[#333] rounded-lg p-6 text-left hover:border-yellow-500 transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-3 mb-2">
            <Bell className="w-5 h-5 text-yellow-500 group-hover:scale-110 transition-transform" />
            <div className="text-sm text-gray-400 group-hover:text-white">알림</div>
          </div>
          <div className="text-2xl font-bold text-white">{Object.values(profile.settings).filter(Boolean).length}개</div>
          <div className="text-xs text-yellow-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
            클릭하여 알림 설정 →
          </div>
        </button>
      </div>

      {/* 탭 네비게이션 */}
      <div className="flex gap-2 border-b border-[#333]">
        <button
          onClick={() => setActiveTab('personal')}
          className={`px-4 py-3 font-medium transition-all border-b-2 ${activeTab === 'personal'
            ? 'text-[#10B981] border-[#10B981]'
            : 'text-gray-400 border-transparent hover:text-white hover:border-gray-600'
            }`}
        >
          <User className="w-4 h-4 inline mr-2" />
          개인정보
        </button>
        <button
          onClick={() => setActiveTab('address')}
          className={`px-4 py-3 font-medium transition-all border-b-2 ${activeTab === 'address'
            ? 'text-blue-500 border-blue-500'
            : 'text-gray-400 border-transparent hover:text-white hover:border-gray-600'
            }`}
        >
          <MapPin className="w-4 h-4 inline mr-2" />
          배송지
        </button>
        <button
          onClick={() => setActiveTab('payment')}
          className={`px-4 py-3 font-medium transition-all border-b-2 ${activeTab === 'payment'
            ? 'text-green-500 border-green-500'
            : 'text-gray-400 border-transparent hover:text-white hover:border-gray-600'
            }`}
        >
          <CreditCard className="w-4 h-4 inline mr-2" />
          결제정보
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          className={`px-4 py-3 font-medium transition-all border-b-2 ${activeTab === 'notifications'
            ? 'text-yellow-500 border-yellow-500'
            : 'text-gray-400 border-transparent hover:text-white hover:border-gray-600'
            }`}
        >
          <Bell className="w-4 h-4 inline mr-2" />
          알림
        </button>
      </div>

      {/* 탭 컨텐츠 */}
      <div className="min-h-[400px]">
        {/* 개인정보 탭 */}
        {activeTab === 'personal' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">개인정보 관리</h3>
              <p className="text-sm text-gray-400">개인정보를 안전하게 관리하세요</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 기본 정보 */}
              <div className="bg-[#0A0A0A] border border-[#333] rounded-lg p-6">
                <h4 className="text-lg font-semibold text-white mb-4">기본 정보</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">이름</label>
                    <input
                      type="text"
                      value={profile.name}
                      className="w-full p-3 bg-[#1A1A1A] border border-[#333] rounded-lg text-gray-400 cursor-not-allowed"
                      readOnly
                      title="소셜 로그인 계정의 이름은 변경할 수 없습니다"
                    />
                    <p className="text-xs text-gray-500 mt-1">소셜 로그인 계정의 이름은 변경할 수 없습니다</p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">이메일</label>
                    <input
                      type="email"
                      value={profile.email}
                      className="w-full p-3 bg-[#1A1A1A] border border-[#333] rounded-lg text-gray-400 cursor-not-allowed"
                      readOnly
                      title="소셜 로그인 계정의 이메일은 변경할 수 없습니다"
                    />
                    <p className="text-xs text-gray-500 mt-1">소셜 로그인 계정의 이메일은 변경할 수 없습니다</p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">전화번호</label>
                    <input
                      type="tel"
                      value={profile.phone || ''}
                      onChange={(e) => handleProfileUpdate('phone', e.target.value)}
                      placeholder="전화번호를 입력하세요"
                      className="w-full p-3 bg-[#1A1A1A] border border-[#333] rounded-lg text-white focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/20"
                    />
                  </div>
                </div>
                <button
                  onClick={handleSaveProfile}
                  className="w-full mt-4 bg-[#10B981] hover:bg-[#059669] text-white py-3 rounded-lg font-medium transition-colors"
                >
                  📞 전화번호 저장
                </button>
              </div>

              {/* 계정 정보 */}
              <div className="bg-[#0A0A0A] border border-[#333] rounded-lg p-6">
                <h4 className="text-lg font-semibold text-white mb-4">계정 정보</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-[#333]">
                    <span className="text-gray-400">가입일</span>
                    <span className="text-white">{profile.createdAt.toDate().toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-[#333]">
                    <span className="text-gray-400">최근 로그인</span>
                    <span className="text-white">
                      {lastLoginDays === 0 ? '오늘' : `${lastLoginDays}일 전`}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-[#333]">
                    <span className="text-gray-400">계정 유형</span>
                    <span className="text-[#10B981]">
                      {user?.provider === 'google' ? 'Google' :
                        user?.provider === 'kakao' ? 'Kakao' :
                          user?.provider === 'naver' ? 'Naver' : '일반'} 계정
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-gray-400">회원 등급</span>
                    <span className="text-yellow-500">일반 회원</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 배송지 탭 */}
        {activeTab === 'address' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">배송지 관리 ({totalAddresses}개)</h3>
              <button
                onClick={() => setShowAddressForm(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                + 새 배송지 추가
              </button>
            </div>

            {/* 배송지 추가 폼 */}
            {showAddressForm && (
              <div className="bg-[#0A0A0A] border border-[#333] rounded-lg p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-white">새 배송지 추가</h4>
                  <button
                    onClick={() => setShowAddressForm(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* 배송지명 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">배송지명</label>
                    <input
                      type="text"
                      value={newAddress.name}
                      onChange={(e) => setNewAddress(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="예: 집, 회사"
                      className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#333] rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  {/* 수령인 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">수령인</label>
                    <input
                      type="text"
                      value={newAddress.recipient}
                      onChange={(e) => setNewAddress(prev => ({ ...prev, recipient: e.target.value }))}
                      placeholder="받으실 분 성함"
                      className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#333] rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  {/* 연락처 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">연락처</label>
                    <input
                      type="tel"
                      value={newAddress.phone}
                      onChange={(e) => setNewAddress(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="010-0000-0000"
                      className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#333] rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  {/* 우편번호 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">우편번호</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newAddress.zipCode}
                        onChange={(e) => setNewAddress(prev => ({ ...prev, zipCode: e.target.value }))}
                        placeholder="우편번호"
                        readOnly
                        className="flex-1 px-3 py-2 bg-[#1A1A1A] border border-[#333] rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none cursor-pointer"
                        onClick={handleAddressSearch}
                      />
                      <button
                        onClick={handleAddressSearch}
                        type="button"
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium"
                      >
                        주소검색
                      </button>
                    </div>
                  </div>

                  {/* 주소 */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">주소</label>
                    <input
                      type="text"
                      value={newAddress.address}
                      onChange={(e) => setNewAddress(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="주소검색 버튼을 클릭하여 주소를 선택하세요"
                      readOnly
                      className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#333] rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none cursor-pointer"
                      onClick={handleAddressSearch}
                    />
                  </div>

                  {/* 상세주소 */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">상세주소</label>
                    <input
                      type="text"
                      value={newAddress.detailAddress}
                      onChange={(e) => setNewAddress(prev => ({ ...prev, detailAddress: e.target.value }))}
                      placeholder="동, 호수 등 상세주소"
                      className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#333] rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  {/* 기본 배송지 설정 */}
                  <div className="md:col-span-2">
                    <label className="flex items-center gap-2 text-sm text-gray-300">
                      <input
                        type="checkbox"
                        checked={newAddress.isDefault}
                        onChange={(e) => setNewAddress(prev => ({ ...prev, isDefault: e.target.checked }))}
                        className="rounded border-[#333] bg-[#1A1A1A] text-blue-500 focus:ring-blue-500"
                      />
                      기본 배송지로 설정
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleAddAddress}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-medium transition-colors"
                  >
                    배송지 추가
                  </button>
                  <button
                    onClick={() => setShowAddressForm(false)}
                    className="px-6 bg-gray-600 hover:bg-gray-500 text-white py-2 rounded-lg font-medium transition-colors"
                  >
                    취소
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {profile.addresses.map(address => (
                <div key={address.id} className="bg-[#0A0A0A] border border-[#333] rounded-lg p-6 hover:border-blue-500 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-white">{address.name}</h4>
                        {address.isDefault && (
                          <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">기본 배송지</span>
                        )}
                      </div>
                      <p className="text-gray-400 mb-1">
                        <span className="text-white font-medium">{address.recipient}</span> | {address.phone}
                      </p>
                      <p className="text-gray-400 mb-1">({address.zipCode}) {address.address}</p>
                      <p className="text-gray-400">{address.detailAddress}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg text-sm font-medium transition-colors">
                        수정
                      </button>
                      {!address.isDefault && (
                        <button
                          onClick={() => handleDeleteAddress(address.id)}
                          className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm font-medium transition-colors"
                        >
                          삭제
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {profile.addresses.length === 0 && !showAddressForm && (
                <div className="text-center py-12 text-gray-400">
                  <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>등록된 배송지가 없습니다.</p>
                  <p className="text-sm mt-1">새 배송지를 추가해보세요.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 결제정보 탭 */}
        {activeTab === 'payment' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">결제정보 관리</h3>
              <p className="text-sm text-gray-400">안전한 결제를 위한 정보 관리</p>
            </div>

            {/* 등록된 카드 */}
            <div className="bg-[#0A0A0A] border border-[#333] rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-6 h-6 text-green-500" />
                  <h4 className="text-lg font-semibold text-white">등록된 카드</h4>
                </div>
                <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  카드 추가
                </button>
              </div>

              {/* 카드 목록 */}
              <div className="space-y-3">
                {/* 예시 카드 1 */}
                <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-4 hover:border-green-500 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded flex items-center justify-center text-white text-xs font-bold">
                        VISA
                      </div>
                      <div>
                        <div className="text-white font-medium">**** **** **** 1234</div>
                        <div className="text-gray-400 text-sm">홍길동 | 12/26</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-xs text-yellow-500">기본</span>
                      <button className="text-red-400 hover:text-red-300 p-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* 예시 카드 2 */}
                <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-4 hover:border-green-500 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-6 bg-gradient-to-r from-red-500 to-orange-500 rounded flex items-center justify-center text-white text-xs font-bold">
                        MC
                      </div>
                      <div>
                        <div className="text-white font-medium">**** **** **** 5678</div>
                        <div className="text-gray-400 text-sm">홍길동 | 08/25</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="text-gray-400 hover:text-yellow-500 p-1">
                        <Star className="w-4 h-4" />
                      </button>
                      <button className="text-red-400 hover:text-red-300 p-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* 빈 상태 */}
                {false && (
                  <div className="text-center py-8 text-gray-400">
                    <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>등록된 카드가 없습니다.</p>
                    <p className="text-sm mt-1">새 카드를 추가해보세요.</p>
                  </div>
                )}
              </div>
            </div>

            {/* 간편결제 */}
            <div className="bg-[#0A0A0A] border border-[#333] rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Phone className="w-6 h-6 text-blue-500" />
                <h4 className="text-lg font-semibold text-white">간편결제</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 카카오페이 */}
                <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-4 text-center hover:border-yellow-500 transition-colors">
                  <div className="w-12 h-12 bg-yellow-500 rounded-lg mx-auto mb-3 flex items-center justify-center">
                    <span className="text-black font-bold text-sm">K</span>
                  </div>
                  <div className="text-white font-medium mb-1">카카오페이</div>
                  <div className="text-green-400 text-sm">연결됨</div>
                </div>

                {/* 네이버페이 */}
                <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-4 text-center hover:border-green-500 transition-colors">
                  <div className="w-12 h-12 bg-green-500 rounded-lg mx-auto mb-3 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">N</span>
                  </div>
                  <div className="text-white font-medium mb-1">네이버페이</div>
                  <div className="text-gray-400 text-sm">연결 안됨</div>
                </div>

                {/* 토스페이 */}
                <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-4 text-center hover:border-blue-500 transition-colors">
                  <div className="w-12 h-12 bg-blue-500 rounded-lg mx-auto mb-3 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">T</span>
                  </div>
                  <div className="text-white font-medium mb-1">토스페이</div>
                  <div className="text-gray-400 text-sm">연결 안됨</div>
                </div>
              </div>
            </div>

            {/* 최근 결제 내역 */}
            <div className="bg-[#0A0A0A] border border-[#333] rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-6 h-6 text-purple-500" />
                  <h4 className="text-lg font-semibold text-white">최근 결제 내역</h4>
                </div>
                <button className="text-purple-400 hover:text-purple-300 text-sm">
                  전체보기 →
                </button>
              </div>

              <div className="space-y-3">
                {/* 결제 내역 예시 */}
                <div className="flex items-center justify-between py-3 border-b border-[#333] last:border-b-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <div className="text-white font-medium">크루아상 세트</div>
                      <div className="text-gray-400 text-sm">2024.07.13 14:30</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-medium">15,000원</div>
                    <div className="text-green-400 text-sm">결제완료</div>
                  </div>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-[#333] last:border-b-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <div className="text-white font-medium">식빵 + 잼 세트</div>
                      <div className="text-gray-400 text-sm">2024.07.12 10:15</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-medium">12,000원</div>
                    <div className="text-green-400 text-sm">결제완료</div>
                  </div>
                </div>

                {/* 빈 상태 */}
                {false && (
                  <div className="text-center py-8 text-gray-400">
                    <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>결제 내역이 없습니다.</p>
                    <p className="text-sm mt-1">첫 주문을 해보세요!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 알림 탭 */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">알림 설정</h3>
              <p className="text-sm text-gray-400">원하는 알림만 받아보세요</p>
            </div>

            <div className="space-y-4">
              {/* 주문 알림 */}
              <div className="bg-[#0A0A0A] border border-[#333] rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Bell className="w-6 h-6 text-yellow-500" />
                    <div>
                      <h4 className="text-lg font-semibold text-white">주문 알림</h4>
                      <p className="text-gray-400 text-sm">주문, 배송, 취소 관련 알림</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={profile.settings.notifications}
                      className="sr-only peer"
                      onChange={(e) => setProfile(prev => ({
                        ...prev,
                        settings: { ...prev.settings, notifications: e.target.checked }
                      }))}
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
                  </label>
                </div>

                <div className="space-y-3 ml-9">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">이메일 알림</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={profile.settings.email}
                        className="sr-only peer"
                        onChange={(e) => setProfile(prev => ({
                          ...prev,
                          settings: { ...prev.settings, email: e.target.checked }
                        }))}
                      />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">SMS 알림</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={profile.settings.sms}
                        className="sr-only peer"
                        onChange={(e) => setProfile(prev => ({
                          ...prev,
                          settings: { ...prev.settings, sms: e.target.checked }
                        }))}
                      />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* 마케팅 알림 */}
              <div className="bg-[#0A0A0A] border border-[#333] rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Mail className="w-6 h-6 text-purple-500" />
                    <div>
                      <h4 className="text-lg font-semibold text-white">마케팅 알림</h4>
                      <p className="text-gray-400 text-sm">이벤트, 할인, 신상품 소식</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={profile.settings.marketing}
                      className="sr-only peer"
                      onChange={(e) => setProfile(prev => ({
                        ...prev,
                        settings: { ...prev.settings, marketing: e.target.checked }
                      }))}
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* 저장 버튼 */}
            <div className="flex justify-end">
              <button
                onClick={() => {
                  toast({
                    title: "알림 설정이 저장되었습니다! 🔔",
                    description: "변경된 알림 설정이 적용되었습니다.",
                    variant: "default",
                  });
                }}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                설정 저장
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileSection;


