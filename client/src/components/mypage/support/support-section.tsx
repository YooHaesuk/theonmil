import { Headphones, MessageCircle, Phone, Mail, Clock, FileText, HelpCircle, Send, MapPin, User, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

const SupportSection = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  // 탭 상태 관리
  const [activeTab, setActiveTab] = useState<'contact' | 'inquiry' | 'faq'>('contact');

  // 실제 연락처 정보 (푸터에서 수집)
  const contactInfo = {
    address: '경기도 고양시 일산동구 장진천길 46번길 22-45, 1동 (설문동)',
    phone: '031-938-2590',
    fax: '031-932-2590',
    email: 'yhs85844@gmail.com',
    hours: '평일 9:00 - 18:00 (점심시간: 12:00 - 13:00)'
  };

  // 메신저 채널 정보
  const messengerChannels = {
    kakao: 'http://pf.kakao.com/_your_channel_id/chat',
    naver: 'https://talk.naver.com/your_business_id'
  };

  // 카카오톡 채널 연결
  const openKakaoChannel = () => {
    toast({
      title: "카카오톡 채널 준비중 ✨",
      description: "곧 더 편리한 상담으로 찾아오겠습니다. 조금만 기다려주세요!",
    });
  };

  // 네이버 톡톡 연결
  const openNaverTalk = () => {
    toast({
      title: "네이버 톡톡 준비중 ✨",
      description: "더 온밀은 최상의 상담 경험을 위해 준비 중입니다.",
    });
  };

  // 전화 걸기 함수
  const handleCall = () => {
    window.open(`tel:${contactInfo.phone}`);
  };

  // 각 플랫폼별 메일 전송 함수
  const handleEmailPlatform = (platform: 'naver' | 'gmail' | 'kakao') => {
    const subject = encodeURIComponent('더 온밀 문의사항');
    const body = encodeURIComponent(`안녕하세요, 더 온밀입니다.\n\n문의사항을 아래에 작성해주세요:\n---\n문의 내용:\n\n\n---\n연락처:\n이메일: ${user?.email || ''}\n전화번호:\n\n감사합니다.`);

    const mailUrls = {
      naver: `https://mail.naver.com/write?to=${contactInfo.email}&subject=${subject}&body=${body}`,
      gmail: `https://mail.google.com/mail/?view=cm&to=${contactInfo.email}&subject=${subject}&body=${body}`,
      kakao: `https://mail.kakao.com/compose?to=${contactInfo.email}&subject=${subject}&body=${body}`
    };

    window.open(mailUrls[platform], '_blank');
  };

  return (
    <div className="space-y-10 font-pretendard">
      {/* 헤더 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
            <Headphones className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">고객지원</h2>
            <p className="text-sm text-muted-foreground mt-0.5 font-medium">더 온밀은 언제나 회원님의 목소리에 귀 기울입니다.</p>
          </div>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="flex p-1.5 bg-secondary/30 rounded-2xl border border-border/50 max-w-2xl">
        <button
          onClick={() => setActiveTab('contact')}
          className={`flex-1 flex items-center justify-center gap-2 py-3.5 font-bold transition-all rounded-xl ${activeTab === 'contact' ? 'bg-white text-primary shadow-md transform scale-[1.02]' : 'text-muted-foreground hover:text-foreground'}`}
        >
          <Phone className="w-4 h-4" />
          연락처
        </button>
        <button
          onClick={() => setActiveTab('inquiry')}
          className={`flex-1 flex items-center justify-center gap-2 py-3.5 font-bold transition-all rounded-xl ${activeTab === 'inquiry' ? 'bg-white text-primary shadow-md transform scale-[1.02]' : 'text-muted-foreground hover:text-foreground'}`}
        >
          <MessageSquare className="w-4 h-4" />
          1:1 문의
        </button>
        <button
          onClick={() => setActiveTab('faq')}
          className={`flex-1 flex items-center justify-center gap-2 py-3.5 font-bold transition-all rounded-xl ${activeTab === 'faq' ? 'bg-white text-primary shadow-md transform scale-[1.02]' : 'text-muted-foreground hover:text-foreground'}`}
        >
          <HelpCircle className="w-4 h-4" />
          FAQ
        </button>
      </div>

      {/* 컨텐츠 구역 */}
      <div className="min-h-[500px]">
        {/* 연락처 탭 */}
        {activeTab === 'contact' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 전화 상담 카드 */}
              <div
                onClick={handleCall}
                className="bg-white border border-border/50 rounded-3xl p-8 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary transition-colors">
                    <Phone className="w-6 h-6 text-primary group-hover:text-white" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-foreground">전화 상담</h4>
                    <p className="text-sm font-bold text-primary mt-0.5">{contactInfo.phone}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p className="flex items-center gap-2 font-medium">
                    <Clock className="w-4 h-4" />
                    {contactInfo.hours}
                  </p>
                  <p className="text-accent/80 text-xs font-bold bg-accent/5 p-3 rounded-xl border border-accent/10 mt-4 leading-relaxed italic">
                    💡 생산 일정 중에는 통화가 어려울 수 있으니 메신저나 이메일 문의를 추천드립니다.
                  </p>
                </div>
              </div>

              {/* 이메일 상담 카드 */}
              <div className="bg-white border border-border/50 rounded-3xl p-8 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-foreground">이메일 문의</h4>
                    <p className="text-sm font-medium text-muted-foreground mt-0.5">{contactInfo.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <button onClick={() => handleEmailPlatform('naver')} className="flex flex-col items-center gap-2 p-3 bg-emerald-50 rounded-2xl hover:bg-emerald-500 hover:text-white transition-all group">
                    <div className="w-8 h-8 font-bold text-emerald-600 group-hover:text-white flex items-center justify-center">N</div>
                    <span className="text-[10px] font-bold">네이버</span>
                  </button>
                  <button onClick={() => handleEmailPlatform('gmail')} className="flex flex-col items-center gap-2 p-3 bg-red-50 rounded-2xl hover:bg-red-500 hover:text-white transition-all group">
                    <div className="w-8 h-8 font-bold text-red-600 group-hover:text-white flex items-center justify-center">G</div>
                    <span className="text-[10px] font-bold">구글</span>
                  </button>
                  <button onClick={() => handleEmailPlatform('kakao')} className="flex flex-col items-center gap-2 p-3 bg-yellow-50 rounded-2xl hover:bg-yellow-500 hover:text-black transition-all group">
                    <div className="w-8 h-8 font-bold text-yellow-600 group-hover:text-black flex items-center justify-center">K</div>
                    <span className="text-[10px] font-bold">카카오</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 위치 정보 카드 */}
            <div className="bg-white border border-border/50 rounded-3xl p-8 shadow-sm">
              <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
                <MapPin className="w-6 h-6 text-primary" />
                오시는 길
              </h3>
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="flex-1 space-y-2">
                  <p className="text-lg font-bold text-foreground font-pretendard">더 온밀 베이커리 팩토리</p>
                  <p className="text-muted-foreground font-medium">{contactInfo.address}</p>
                  <div className="mt-6 p-4 bg-secondary/30 rounded-2xl border border-border/50 inline-block font-mono text-sm">
                    FAX: {contactInfo.fax}
                  </div>
                </div>
                {/* 지도 플레이스홀더 */}
                <div className="w-full md:w-64 h-40 bg-secondary/50 rounded-3xl border border-border border-dashed flex items-center justify-center text-muted-foreground/30 font-bold">MAP AREA</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* 1:1 문의하기 탭 */}
        {activeTab === 'inquiry' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h3 className="text-2xl font-bold text-foreground mb-3">더 빠르고 정확한 상담을 원하시나요?</h3>
              <p className="text-muted-foreground font-medium">채널톡과 네이버 톡톡으로 실시간 답변을 받아보세요.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {/* 카카오톡 */}
              <div
                onClick={openKakaoChannel}
                className="group relative overflow-hidden bg-[#FEE500] rounded-3xl p-10 cursor-pointer shadow-lg shadow-yellow-100 hover:translate-y-[-5px] transition-all duration-300"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-black/5 rounded-full -mr-10 -mt-10 group-hover:scale-125 transition-transform duration-500"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mb-6 shadow-xl">
                    <MessageCircle className="w-10 h-10 text-white" />
                  </div>
                  <h4 className="text-2xl font-black text-black mb-2 font-pretendard">카카오 플러스친구</h4>
                  <p className="text-black/60 font-bold mb-8">오전 9시 - 오후 6시 상담 가능</p>
                  <div className="flex items-center gap-2 font-black text-black group-hover:gap-4 transition-all uppercase tracking-tighter">
                    채널 연결하기 <span className="text-xl">→</span>
                  </div>
                </div>
              </div>

              {/* 네이버 톡톡 */}
              <div
                onClick={openNaverTalk}
                className="group relative overflow-hidden bg-[#03C75A] rounded-3xl p-10 cursor-pointer shadow-lg shadow-emerald-100 hover:translate-y-[-5px] transition-all duration-300"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-black/5 rounded-full -mr-10 -mt-10 group-hover:scale-125 transition-transform duration-500"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-xl">
                    <MessageCircle className="w-10 h-10 text-[#03C75A]" />
                  </div>
                  <h4 className="text-2xl font-black text-white mb-2 font-pretendard">네이버 톡톡</h4>
                  <p className="text-white/60 font-bold mb-8">언제든 메시지를 남겨주세요</p>
                  <div className="flex items-center gap-2 font-black text-white group-hover:gap-4 transition-all uppercase tracking-tighter">
                    톡톡 시작하기 <span className="text-xl">→</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-secondary/20 border border-border/50 rounded-3xl p-6 text-center">
              <p className="text-muted-foreground text-sm font-medium">
                💡 문의량이 많을 경우 순차적으로 답변드리고 있습니다. 잠시만 기다려주시면 감사하겠습니다.
              </p>
            </div>
          </motion.div>
        )}

        {/* FAQ 탭 */}
        {activeTab === 'faq' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-4xl mx-auto">
            <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2 px-2">
              <div className="w-2 h-6 bg-primary rounded-full"></div>
              자주 묻는 질문 베스트
            </h3>

            <div className="grid gap-3 font-pretendard">
              {[
                { q: "주문 취소는 어떻게 하나요?", a: "주문 후 30분 이내에 [MY 쇼핑 → 주문관리]에서 직접 취소가 가능합니다. 그 이후에는 이미 빵을 굽는 중일 수 있으니 고객센터로 전화 부탁드립니다!" },
                { q: "배송비 기준이 궁금해요.", a: "3만원 이상 구매 시 무료배송 혜택을 드리고 있습니다. 그 미만은 3,000원의 배송비가 발생하며, 제주/도서산간 지역은 별도의 비용이 추가될 수 있습니다." },
                { q: "방금 받은 빵, 어떻게 보관할까요?", a: "모든 빵은 방부제를 쓰지 않습니다. 받으신 당일 드시는 게 가장 좋고, 보관하실 때는 지퍼백에 넣어 실온 2일, 냉동 1개월까지 권장 드립니다." },
                { q: "환불 처리 기간은 얼마나 걸리나요?", a: "카드 결제 취소 승인 후 영업일 기준 3-5일 정도 소요됩니다. 무통장 입금은 신청하신 당일 바로 입금해 드리려 노력하고 있습니다." }
              ].map((item, idx) => (
                <div key={idx} className="group bg-white border border-border/50 rounded-2xl p-6 hover:border-primary/30 transition-all shadow-sm hover:shadow-md">
                  <h5 className="font-bold text-foreground text-lg mb-4 flex items-center gap-4">
                    <span className="w-8 h-8 bg-primary/10 text-primary rounded-xl flex items-center justify-center text-xs font-black flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">Q</span>
                    {item.q}
                  </h5>
                  <div className="pl-12 text-muted-foreground font-medium leading-relaxed font-pretendard">
                    {item.a}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SupportSection;
