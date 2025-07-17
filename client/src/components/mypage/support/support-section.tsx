import { Headphones, MessageCircle, Phone, Mail, Clock, FileText, HelpCircle, Send, MapPin, User, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

const SupportSection = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  // 탭 상태 관리
  const [activeTab, setActiveTab] = useState<'contact' | 'inquiry' | 'faq'>('contact');

  // 문의 폼 상태
  const [inquiryForm, setInquiryForm] = useState({
    category: '',
    subject: '',
    message: '',
    email: user?.email || '',
    phone: '',
    platform: 'naver' // 기본값: 네이버
  });

  // 실제 연락처 정보 (푸터에서 수집)
  const contactInfo = {
    address: '경기도 고양시 일산동구 장진천길 46번길 22-45, 1동 (설문동)',
    phone: '031-938-2590',
    fax: '031-932-2590',
    email: 'yhs85844@gmail.com',
    hours: '평일 9:00 - 18:00'
  };

  // 메신저 채널 정보 (나중에 실제 URL로 교체)
  const messengerChannels = {
    kakao: 'http://pf.kakao.com/_your_channel_id/chat', // TODO: 실제 카카오톡 채널 URL로 교체
    naver: 'https://talk.naver.com/your_business_id'    // TODO: 실제 네이버 톡톡 URL로 교체
  };

  // 카카오톡 채널 연결
  const openKakaoChannel = () => {
    console.log('💛 카카오톡 채널 연결');
    // TODO: 실제 채널 생성 후 URL 교체
    if (messengerChannels.kakao.includes('your_channel_id')) {
      toast({
        title: "카카오톡 채널 준비중",
        description: "곧 서비스 예정입니다. 전화나 이메일로 문의해주세요.",
        variant: "default",
      });
    } else {
      window.open(messengerChannels.kakao, '_blank');
    }
  };

  // 네이버 톡톡 연결
  const openNaverTalk = () => {
    console.log('💚 네이버 톡톡 연결');
    // TODO: 실제 계정 생성 후 URL 교체
    if (messengerChannels.naver.includes('your_business_id')) {
      toast({
        title: "네이버 톡톡 준비중",
        description: "곧 서비스 예정입니다. 전화나 이메일로 문의해주세요.",
        variant: "default",
      });
    } else {
      window.open(messengerChannels.naver, '_blank');
    }
  };

  // 전화 걸기 함수
  const handleCall = () => {
    window.open(`tel:${contactInfo.phone}`);
  };

  // 각 플랫폼별 메일 전송 함수
  const handleEmailPlatform = (platform: 'naver' | 'gmail' | 'kakao') => {
    const subject = encodeURIComponent('더 온밀 문의사항');
    const body = encodeURIComponent(`
안녕하세요, 더 온밀입니다.

문의사항을 아래에 작성해주세요:

---
문의 내용:


---
연락처:
이메일: ${user?.email || ''}
전화번호:

감사합니다.
    `);

    const mailUrls = {
      naver: `https://mail.naver.com/write?to=${contactInfo.email}&subject=${subject}&body=${body}`,
      gmail: `https://mail.google.com/mail/?view=cm&to=${contactInfo.email}&subject=${subject}&body=${body}`,
      kakao: `https://mail.kakao.com/compose?to=${contactInfo.email}&subject=${subject}&body=${body}`
    };

    const platformNames = {
      naver: '네이버 메일',
      gmail: '구글 메일',
      kakao: '카카오 메일'
    };

    console.log(`📧 ${platformNames[platform]}로 전송`);
    window.open(mailUrls[platform], '_blank');
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Headphones className="w-8 h-8 text-[#8B5CF6]" />
          <h2 className="text-2xl font-bold text-white">고객지원</h2>
        </div>
        <p className="text-sm text-gray-400">언제든지 문의해주세요</p>
      </div>

      {/* 탭 네비게이션 */}
      <div className="flex space-x-1 bg-[#0A0A0A] p-1 rounded-lg border border-[#333] mb-6">
        <button
          onClick={() => setActiveTab('contact')}
          className={`flex-1 px-4 py-3 font-medium transition-all rounded-md ${
            activeTab === 'contact'
              ? 'bg-[#8B5CF6] text-white'
              : 'text-gray-400 hover:text-white hover:bg-[#1A1A1A]'
          }`}
        >
          <Phone className="w-4 h-4 inline mr-2" />
          연락처
        </button>
        <button
          onClick={() => setActiveTab('inquiry')}
          className={`flex-1 px-4 py-3 font-medium transition-all rounded-md ${
            activeTab === 'inquiry'
              ? 'bg-[#8B5CF6] text-white'
              : 'text-gray-400 hover:text-white hover:bg-[#1A1A1A]'
          }`}
        >
          <MessageSquare className="w-4 h-4 inline mr-2" />
          문의하기
        </button>
        <button
          onClick={() => setActiveTab('faq')}
          className={`flex-1 px-4 py-3 font-medium transition-all rounded-md ${
            activeTab === 'faq'
              ? 'bg-[#8B5CF6] text-white'
              : 'text-gray-400 hover:text-white hover:bg-[#1A1A1A]'
          }`}
        >
          <HelpCircle className="w-4 h-4 inline mr-2" />
          FAQ
        </button>
      </div>

      {/* 연락처 탭 */}
      {activeTab === 'contact' && (
        <div className="space-y-6">
          {/* 주요 연락처 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              onClick={handleCall}
              className="bg-[#1A1A1A] border border-[#333] rounded-lg p-6 hover:border-[#8B5CF6] transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3 mb-3">
                <Phone className="w-6 h-6 text-[#8B5CF6] group-hover:scale-110 transition-transform" />
                <h4 className="text-lg font-semibold text-white">전화 상담</h4>
              </div>
              <p className="text-gray-400 text-sm mb-2">{contactInfo.phone}</p>
              <p className="text-gray-500 text-xs mb-2">{contactInfo.hours}</p>
              <p className="text-gray-500 text-xs mb-2">(점심시간 : 12:00 부터 13:00)</p>
              <p className="text-orange-400 text-xs">
                ⚠️ 생산일정 상 연락이 안될 수 있으니 이메일 또는 문의하기로 문의 부탁드립니다.
              </p>
            </div>

            <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-6 hover:border-[#8B5CF6] transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <Mail className="w-6 h-6 text-[#8B5CF6]" />
                <h4 className="text-lg font-semibold text-white">이메일 문의</h4>
              </div>
              <p className="text-gray-400 text-sm mb-4">{contactInfo.email}</p>

              {/* 메일 플랫폼 선택 버튼들 */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleEmailPlatform('naver')}
                  className="px-3 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-1"
                >
                  <span className="w-4 h-4 bg-white rounded-sm flex items-center justify-center text-green-500 text-xs font-bold">N</span>
                  네이버
                </button>

                <button
                  onClick={() => handleEmailPlatform('gmail')}
                  className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-1"
                >
                  <span className="w-4 h-4 bg-white rounded-sm flex items-center justify-center text-red-500 text-xs font-bold">G</span>
                  구글
                </button>

                <button
                  onClick={() => handleEmailPlatform('kakao')}
                  className="px-3 py-2 bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-1"
                >
                  <span className="w-4 h-4 bg-white rounded-sm flex items-center justify-center text-yellow-500 text-xs font-bold">K</span>
                  카카오
                </button>
              </div>
            </div>
          </div>

          {/* 상세 정보 */}
          <div className="bg-[#0A0A0A] border border-[#333] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#8B5CF6]" />
              오시는 길
            </h3>
            <div className="space-y-3 text-gray-400">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#8B5CF6] mt-1 flex-shrink-0" />
                <span>{contactInfo.address}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 문의하기 탭 */}
      {activeTab === 'inquiry' && (
        <div className="bg-[#0A0A0A] border border-[#333] rounded-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <MessageSquare className="w-6 h-6 text-[#8B5CF6]" />
            <h3 className="text-lg font-semibold text-white">1:1 문의하기</h3>
          </div>

          {/* 메신저 문의 옵션 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* 카카오톡 채널 */}
            <div
              onClick={openKakaoChannel}
              className="bg-[#1A1A1A] border border-[#333] rounded-lg p-6 hover:border-yellow-500 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-black" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white">카카오톡 채널</h4>
                  <p className="text-gray-400 text-sm">실시간 상담</p>
                </div>
              </div>
              <div className="space-y-2 text-sm text-gray-400">
                <p>• 즉시 답변 가능</p>
                <p>• 이미지 전송 가능</p>
                <p>• 상담 내역 보관</p>
              </div>
              <div className="mt-4 text-xs text-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity">
                클릭하여 카카오톡 상담 시작 →
              </div>
            </div>

            {/* 네이버 톡톡 */}
            <div
              onClick={openNaverTalk}
              className="bg-[#1A1A1A] border border-[#333] rounded-lg p-6 hover:border-green-500 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white">네이버 톡톡</h4>
                  <p className="text-gray-400 text-sm">실시간 상담</p>
                </div>
              </div>
              <div className="space-y-2 text-sm text-gray-400">
                <p>• 즉시 답변 가능</p>
                <p>• 이미지 전송 가능</p>
                <p>• 상담 내역 보관</p>
              </div>
              <div className="mt-4 text-xs text-green-500 opacity-0 group-hover:opacity-100 transition-opacity">
                클릭하여 네이버 톡톡 상담 시작 →
              </div>
            </div>
          </div>

          {/* 안내 메시지 */}
          <div className="p-4 bg-[#1A1A1A] border border-[#333] rounded-lg">
            <p className="text-gray-400 text-sm text-center">
              💡 24시간 내에 답변드리고자 최대한 노력하고 있으나 생산 일정으로 늦어질 수 있으니 양해 바라겠습니다.
            </p>
          </div>


        </div>
      )}

      {/* FAQ 탭 */}
      {activeTab === 'faq' && (
        <div className="space-y-4">
          <div className="bg-[#0A0A0A] border border-[#333] rounded-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <HelpCircle className="w-6 h-6 text-[#8B5CF6]" />
              <h3 className="text-lg font-semibold text-white">자주 묻는 질문</h3>
            </div>

            <div className="space-y-3">
              <div className="p-4 bg-[#1A1A1A] rounded-lg border border-[#333] hover:border-[#8B5CF6] transition-colors">
                <h5 className="font-medium text-white mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 bg-[#8B5CF6] rounded-full flex items-center justify-center text-xs font-bold">Q</span>
                  주문 취소는 어떻게 하나요?
                </h5>
                <p className="text-gray-400 text-sm ml-8">주문 후 30분 이내에 MY 쇼핑 → 주문관리에서 취소 가능합니다. 제조 시작 후에는 취소가 어려울 수 있습니다.</p>
              </div>

              <div className="p-4 bg-[#1A1A1A] rounded-lg border border-[#333] hover:border-[#8B5CF6] transition-colors">
                <h5 className="font-medium text-white mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 bg-[#8B5CF6] rounded-full flex items-center justify-center text-xs font-bold">Q</span>
                  배송비는 얼마인가요?
                </h5>
                <p className="text-gray-400 text-sm ml-8">3만원 이상 주문 시 무료배송, 미만 시 3,000원입니다. 제주/도서산간 지역은 추가 배송비가 발생할 수 있습니다.</p>
              </div>

              <div className="p-4 bg-[#1A1A1A] rounded-lg border border-[#333] hover:border-[#8B5CF6] transition-colors">
                <h5 className="font-medium text-white mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 bg-[#8B5CF6] rounded-full flex items-center justify-center text-xs font-bold">Q</span>
                  환불은 언제 처리되나요?
                </h5>
                <p className="text-gray-400 text-sm ml-8">환불 신청 후 3-5영업일 내에 처리됩니다. 카드 결제의 경우 카드사 정책에 따라 1-2일 추가 소요될 수 있습니다.</p>
              </div>

              <div className="p-4 bg-[#1A1A1A] rounded-lg border border-[#333] hover:border-[#8B5CF6] transition-colors">
                <h5 className="font-medium text-white mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 bg-[#8B5CF6] rounded-full flex items-center justify-center text-xs font-bold">Q</span>
                  상품 보관 방법이 궁금해요
                </h5>
                <p className="text-gray-400 text-sm ml-8">빵류는 실온에서 2-3일, 냉동 보관 시 1개월까지 가능합니다. 해동 후에는 당일 드시는 것을 권장합니다.</p>
              </div>

              <div className="p-4 bg-[#1A1A1A] rounded-lg border border-[#333] hover:border-[#8B5CF6] transition-colors">
                <h5 className="font-medium text-white mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 bg-[#8B5CF6] rounded-full flex items-center justify-center text-xs font-bold">Q</span>
                  알레르기 정보를 알고 싶어요
                </h5>
                <p className="text-gray-400 text-sm ml-8">모든 상품에는 밀, 계란, 우유가 포함되어 있으며, 견과류 사용 제품은 상품 상세페이지에 표기되어 있습니다.</p>
              </div>
            </div>
          </div>
        </div>
      )}


    </div>
  );
};

export default SupportSection;


