import { User, Mail, Phone, MapPin, CreditCard, Bell, Settings, Calendar, Plus, Trash2, Star, Eye, EyeOff } from 'lucide-react';
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
  }, [user]);

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
      toast({ title: "배송지가 추가되었습니다!" });
    } catch (error) {
      toast({ title: "배송지 추가 실패", variant: "destructive" });
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
      toast({ title: "전화번호가 저장되었습니다" });
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
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#10B981]"></div>
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
          <div className="w-20 h-20 bg-gradient-to-r from-[#10B981] to-[#059669] rounded-full flex items-center justify-center overflow-hidden">
            {user?.image ? (
              <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <User className="w-10 h-10 text-white" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white">{user?.name}</h3>
            <p className="text-gray-400">{user?.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="px-2 py-1 bg-[#10B981]/20 text-[#10B981] text-xs rounded-full">
                {user?.provider?.toUpperCase() || '일반'} 계정
              </div>
              <div className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                가입 {membershipDays}일차
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <button onClick={() => setActiveTab('personal')} className="bg-[#0A0A0A] border border-[#333] rounded-lg p-6 text-left hover:border-[#10B981] transition-all group">
          <div className="flex items-center gap-3 mb-2">
            <User className="w-5 h-5 text-[#10B981]" />
            <div className="text-sm text-gray-400">개인정보</div>
          </div>
          <div className="text-2xl font-bold text-white">{user?.name}</div>
        </button>

        <button onClick={() => setActiveTab('address')} className="bg-[#0A0A0A] border border-[#333] rounded-lg p-6 text-left hover:border-blue-500 transition-all group">
          <div className="flex items-center gap-3 mb-2">
            <MapPin className="w-5 h-5 text-blue-500" />
            <div className="text-sm text-gray-400">배송지</div>
          </div>
          <div className="text-2xl font-bold text-white">{totalAddresses}개</div>
        </button>
        {/* ... Other stats as placeholders ... */}
      </div>

      {/* 탭 네비게이션 */}
      <div className="flex gap-2 border-b border-[#333]">
        {['personal', 'address', 'payment', 'notifications'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-4 py-3 font-medium transition-all border-b-2 capitalize ${activeTab === tab
              ? 'text-[#10B981] border-[#10B981]'
              : 'text-gray-400 border-transparent hover:text-white'
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 탭 컨텐츠 */}
      <div className="min-h-[400px]">
        {activeTab === 'personal' && (
          <div className="space-y-6">
            <div className="bg-[#0A0A0A] border border-[#333] rounded-lg p-6">
              <h4 className="text-lg font-semibold text-white mb-4">기본 정보</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">이름</label>
                  <input type="text" value={user?.name || ''} readOnly className="w-full p-3 bg-[#1A1A1A] border border-[#333] rounded-lg text-gray-500 cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">이메일</label>
                  <input type="email" value={user?.email || ''} readOnly className="w-full p-3 bg-[#1A1A1A] border border-[#333] rounded-lg text-gray-500 cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">전화번호</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="전화번호를 입력하세요"
                    className="w-full p-3 bg-[#1A1A1A] border border-[#333] rounded-lg text-white focus:border-[#10B981] focus:outline-none"
                  />
                </div>
              </div>
              <button
                onClick={handleSavePhone}
                className="w-full mt-4 bg-[#10B981] hover:bg-[#059669] text-white py-3 rounded-lg font-medium transition-colors"
              >
                저장하기
              </button>
            </div>
          </div>
        )}

        {activeTab === 'address' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-white font-bold">배송지 관리 ({totalAddresses})</h3>
              <button
                onClick={() => setShowAddressForm(!showAddressForm)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
              >
                {showAddressForm ? '취소' : '+ 새 배송지 추가'}
              </button>
            </div>

            {showAddressForm && (
              <div className="bg-[#0A0A0A] border border-[#333] rounded-lg p-6 space-y-4">
                <input
                  placeholder="배송지명 (예: 집)"
                  value={newAddress.name}
                  onChange={e => setNewAddress({ ...newAddress, name: e.target.value })}
                  className="w-full p-2 bg-[#1A1A1A] border border-[#333] rounded text-white"
                />
                <input
                  placeholder="수령인"
                  value={newAddress.recipient}
                  onChange={e => setNewAddress({ ...newAddress, recipient: e.target.value })}
                  className="w-full p-2 bg-[#1A1A1A] border border-[#333] rounded text-white"
                />
                <div className="flex gap-2">
                  <input placeholder="우편번호" value={newAddress.zipCode} readOnly className="flex-1 p-2 bg-[#1A1A1A] border border-[#333] rounded text-white" />
                  <button onClick={handleAddressSearch} className="bg-gray-600 px-4 rounded">검색</button>
                </div>
                <input placeholder="주소" value={newAddress.address} readOnly className="w-full p-2 bg-[#1A1A1A] border border-[#333] rounded text-white" />
                <input
                  placeholder="상세주소"
                  value={newAddress.detailAddress}
                  onChange={e => setNewAddress({ ...newAddress, detailAddress: e.target.value })}
                  className="w-full p-2 bg-[#1A1A1A] border border-[#333] rounded text-white"
                />
                <button onClick={handleAddNewAddress} className="w-full bg-blue-500 py-2 rounded text-white">등록하기</button>
              </div>
            )}

            <div className="space-y-4">
              {addresses.map(addr => (
                <div key={addr.id} className="bg-[#0A0A0A] border border-[#333] rounded-lg p-4 flex justify-between items-start">
                  <div>
                    <div className="font-bold text-white">{addr.name} {addr.isDefault && <span className="text-xs text-blue-400 border border-blue-400 px-1 rounded ml-2">기본</span>}</div>
                    <div className="text-gray-400 text-sm">{addr.recipient} | {addr.phone}</div>
                    <div className="text-gray-400 text-sm">({addr.zipCode}) {addr.address} {addr.detailAddress}</div>
                  </div>
                  <button onClick={() => handleRemoveAddress(addr.id)} className="text-red-400 hover:text-red-300">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileSection;
