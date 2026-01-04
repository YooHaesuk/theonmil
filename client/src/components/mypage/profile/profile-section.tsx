import { User, Mail, Phone, MapPin, CreditCard, Bell, Settings, Calendar, Plus, Trash2, Star, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { getAddresses, addAddress, deleteAddress, updateProfile } from '@/lib/profile';
import { UserAddress } from '@shared/schema';

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
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
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
  const [phone, setPhone] = useState('');

  useEffect(() => {
    const loadData = async () => {
      if (!user?.id) return;
      setLoading(true);
      try {
        const addrList = await getAddresses(user.id);
        setAddresses(addrList);
        setPhone(user.phone || '');
      } catch (error) {
        console.error('Failed to load profile data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user?.id]);

  // 통계 계산
  const totalAddresses = addresses.length;
  const membershipDays = user?.createdAt
    ? Math.floor((new Date().getTime() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  // 배송지 추가 함수
  const handleAddNewAddress = async () => {
    try {
      if (!user?.id) throw new Error('로그인이 필요합니다');

      const added = await addAddress({
        ...newAddress,
        userId: user.id
      });

      setAddresses(prev => [...prev, added]);
      setNewAddress({
        name: '', recipient: '', phone: '', zipCode: '', address: '', detailAddress: '', isDefault: false
      });
      setShowAddressForm(false);
      toast({ title: "새로운 배송지가 등록되었습니다! ✨" });
    } catch (error) {
      toast({ title: "배송지 등록 실패", variant: "destructive" });
    }
  };

  const handleRemoveAddress = async (id: number) => {
    try {
      await deleteAddress(id);
      setAddresses(prev => prev.filter(a => a.id !== id));
      toast({ title: "배송지가 삭제되었습니다" });
    } catch (error) {
      toast({ title: "삭제 실패", variant: "destructive" });
    }
  };

  const handleSavePhone = async () => {
    try {
      if (!user?.id) return;
      await updateProfile(user.id, { phone });
      toast({ title: "연락처 정보가 수정되었습니다 👍" });
    } catch (error) {
      toast({ title: "저장 실패", variant: "destructive" });
    }
  };

  const handleAddressSearch = () => {
    new window.daum.Postcode({
      oncomplete: (data: any) => {
        setNewAddress(prev => ({
          ...prev,
          zipCode: data.zonecode,
          address: data.address,
        }));
      },
      width: '100%',
      height: '100%',
    }).open();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 bg-background/50 rounded-3xl border border-dashed border-border/50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        <p className="mt-4 text-muted-foreground font-pretendard">회원님 정보를 확인하고 있어요...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* 헤더 */}
      <div className="flex items-center gap-3">
        <User className="w-8 h-8 text-primary" />
        <h2 className="text-2xl font-bold text-foreground">MY 정보</h2>
      </div>

      {/* 프로필 요약 카드 */}
      <div className="bg-white border border-border/50 rounded-3xl p-8 shadow-sm overflow-hidden relative group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500"></div>
        <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
          <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-full p-1 shadow-lg shadow-primary/20">
            <div className="w-full h-full bg-white rounded-full flex items-center justify-center overflow-hidden">
              {user?.image ? (
                <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <User className="w-12 h-12 text-primary/30" />
              )}
            </div>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-2xl font-bold text-foreground mb-1 font-pretendard">{user?.name}님</h3>
            <p className="text-muted-foreground font-pretendard">{user?.email}</p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-4">
              <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full font-pretendard uppercase">
                {user?.provider || 'GENERAL'} 회원
              </span>
              <span className="px-3 py-1 bg-accent/10 text-accent text-xs font-bold rounded-full font-pretendard">
                더 온밀 가입 {membershipDays}일차 ✨
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 실적 요약 카드 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <button
          onClick={() => setActiveTab('personal')}
          className={`bg-white border rounded-2xl p-5 sm:p-6 text-left transition-all duration-300 shadow-sm hover:shadow-md ${activeTab === 'personal' ? 'border-primary ring-1 ring-primary/20 bg-primary/5' : 'border-border/50 hover:border-primary/30'}`}
        >
          <div className="flex items-center gap-3 mb-3">
            <User className="w-5 h-5 text-primary" />
            <div className="text-[10px] text-primary/70 font-pretendard uppercase tracking-wider font-bold">INFO</div>
          </div>
          <div className={`text-lg sm:text-xl font-bold font-pretendard transition-colors ${activeTab === 'personal' ? 'text-primary' : 'text-foreground'}`}>내 정보 수정</div>
        </button>

        <button
          onClick={() => setActiveTab('address')}
          className={`bg-white border rounded-2xl p-5 sm:p-6 text-left transition-all duration-300 shadow-sm hover:shadow-md ${activeTab === 'address' ? 'border-primary ring-1 ring-primary/20 bg-primary/5' : 'border-border/50 hover:border-primary/30'}`}
        >
          <div className="flex items-center gap-3 mb-3">
            <MapPin className="w-5 h-5 text-primary" />
            <div className="text-[10px] text-primary/70 font-pretendard uppercase tracking-wider font-bold">LOCATION</div>
          </div>
          <div className={`text-lg sm:text-xl font-bold font-pretendard transition-colors ${activeTab === 'address' ? 'text-primary' : 'text-foreground'}`}>
            배송지 설정 <span className="text-primary/70 ml-1">({totalAddresses})</span>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('payment')}
          className={`bg-white border rounded-2xl p-5 sm:p-6 text-left transition-all duration-300 shadow-sm hover:shadow-md ${activeTab === 'payment' ? 'border-primary ring-1 ring-primary/20 bg-primary/5' : 'border-border/50 hover:border-primary/30'}`}
        >
          <div className="flex items-center gap-3 mb-3">
            <CreditCard className="w-5 h-5 text-primary" />
            <div className="text-[10px] text-primary/70 font-pretendard uppercase tracking-wider font-bold">PAY</div>
          </div>
          <div className={`text-lg sm:text-xl font-bold font-pretendard transition-colors ${activeTab === 'payment' ? 'text-primary' : 'text-foreground'}`}>결제수단</div>
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`bg-white border rounded-2xl p-5 sm:p-6 text-left transition-all duration-300 shadow-sm hover:shadow-md ${activeTab === 'notifications' ? 'border-primary ring-1 ring-primary/20 bg-primary/5' : 'border-border/50 hover:border-primary/30'}`}
        >
          <div className="flex items-center gap-3 mb-3">
            <Bell className="w-5 h-5 text-primary" />
            <div className="text-[10px] text-primary/70 font-pretendard uppercase tracking-wider font-bold">ALARM</div>
          </div>
          <div className={`text-lg sm:text-xl font-bold font-pretendard transition-colors ${activeTab === 'notifications' ? 'text-primary' : 'text-foreground'}`}>알림 설정</div>
        </button>
      </div>

      {/* 탭 컨텐츠 */}
      <div className="bg-white border border-border/50 rounded-3xl p-6 sm:p-10 shadow-sm">
        {activeTab === 'personal' && (
          <div className="max-w-xl space-y-8 font-pretendard">
            <h4 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <div className="w-2 h-6 bg-primary rounded-full shadow-sm shadow-primary/20"></div>
              기본 정보 설정
            </h4>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground ml-1">성함</label>
                <input
                  type="text"
                  value={user?.name || ''}
                  readOnly
                  className="w-full p-4 bg-secondary/30 border border-border/50 rounded-2xl text-muted-foreground cursor-not-allowed font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground ml-1">이메일 계정</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  readOnly
                  className="w-full p-4 bg-secondary/30 border border-border/50 rounded-2xl text-muted-foreground cursor-not-allowed font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground ml-1">휴대폰 번호</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="010-0000-0000"
                  className="w-full p-4 bg-white border border-border-primary/20 rounded-2xl text-foreground focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-medium placeholder:text-muted-foreground/30 shadow-inner"
                />
              </div>
            </div>
            <button
              onClick={handleSavePhone}
              className="w-full bg-primary hover:bg-primary/90 text-white py-5 rounded-2xl font-bold transition-all shadow-lg shadow-primary/20 transform active:scale-[0.98] mt-4"
            >
              회원 정보 수정하기
            </button>
          </div>
        )}

        {activeTab === 'address' && (
          <div className="space-y-8 font-pretendard">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h4 className="text-xl font-bold text-foreground flex items-center gap-2">
                <div className="w-2 h-6 bg-primary rounded-full"></div>
                배송지 관리 <span className="text-primary ml-1">({totalAddresses})</span>
              </h4>
              <button
                onClick={() => setShowAddressForm(!showAddressForm)}
                className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold transition-all ${showAddressForm ? 'bg-secondary text-foreground' : 'bg-primary text-white shadow-lg shadow-primary/10'}`}
              >
                {showAddressForm ? '취소하기' : '+ 새 배송지 추가'}
              </button>
            </div>

            {showAddressForm && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-secondary/20 border border-primary/20 rounded-3xl p-6 sm:p-8 space-y-5"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    placeholder="배송지 별명 (예: 우리집)"
                    value={newAddress.name}
                    onChange={e => setNewAddress({ ...newAddress, name: e.target.value })}
                    className="w-full p-4 bg-white border border-border/50 rounded-2xl outline-none focus:border-primary transition-all font-medium"
                  />
                  <input
                    placeholder="수령인 성함"
                    value={newAddress.recipient}
                    onChange={e => setNewAddress({ ...newAddress, recipient: e.target.value })}
                    className="w-full p-4 bg-white border border-border/50 rounded-2xl outline-none focus:border-primary transition-all font-medium"
                  />
                </div>
                <div className="flex gap-2">
                  <input
                    placeholder="우편번호"
                    value={newAddress.zipCode}
                    readOnly
                    className="flex-1 p-4 bg-white border border-border/50 rounded-2xl outline-none font-medium"
                  />
                  <button
                    onClick={handleAddressSearch}
                    className="bg-accent hover:bg-accent/90 text-white px-6 rounded-2xl font-bold transition-all shadow-md shadow-accent/10"
                  >
                    주소 검색
                  </button>
                </div>
                <input
                  placeholder="기본 주소"
                  value={newAddress.address}
                  readOnly
                  className="w-full p-4 bg-white border border-border/50 rounded-2xl outline-none font-medium"
                />
                <input
                  placeholder="상세 주소를 입력해주세요"
                  value={newAddress.detailAddress}
                  onChange={e => setNewAddress({ ...newAddress, detailAddress: e.target.value })}
                  className="w-full p-4 bg-white border border-border/50 rounded-2xl outline-none focus:border-primary transition-all font-medium"
                />
                <button
                  onClick={handleAddNewAddress}
                  className="w-full bg-primary hover:bg-primary/90 text-white py-5 rounded-2xl font-bold transition-all shadow-lg shadow-primary/20"
                >
                  기본 배송지로 등록
                </button>
              </motion.div>
            )}

            <div className="grid gap-4">
              {addresses.length === 0 ? (
                <div className="py-20 text-center bg-secondary/10 rounded-3xl border border-dashed border-border/50">
                  <MapPin className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
                  <p className="text-muted-foreground font-pretendard">등록된 배송지가 없습니다.</p>
                </div>
              ) : (
                addresses.map(addr => (
                  <div key={addr.id} className="group bg-white border border-border/50 rounded-2xl p-6 flex justify-between items-center hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-bold text-lg text-foreground">{addr.name}</span>
                        {addr.isDefault && (
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-primary/10 text-primary rounded-full uppercase">기본 배송지</span>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground font-medium mb-1">
                        {addr.recipient} <span className="mx-1 text-border">|</span> {addr.phone}
                      </div>
                      <div className="text-sm text-foreground/70">
                        <span className="text-xs text-muted-foreground mr-1 font-mono">[{addr.zipCode}]</span> {addr.address} {addr.detailAddress}
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveAddress(addr.id)}
                      className="w-10 h-10 flex items-center justify-center rounded-xl text-muted-foreground/30 hover:text-red-500 hover:bg-red-50 transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileSection;
