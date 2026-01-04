import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { pageTransition, fadeIn, slideInFromBottom } from '@/lib/animations';
import { headingClasses } from '@/lib/fonts';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import ProductManagement from '@/components/admin/product-management';

interface User {
  id: string;
  name: string;
  email: string;
  image: string;
  role: string;
  banned: boolean;
  bannedReason?: string;
  createdAt: string;
}

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'users' | 'products'>('users');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: 'role' | 'ban' | 'unban' | 'delete' | null;
    userId: string | null;
    userEmail: string | null;
    userName: string | null;
    currentRole: string | null;
    isBanned: boolean | null;
  }>({
    isOpen: false,
    type: null,
    userId: null,
    userEmail: null,
    userName: null,
    currentRole: null,
    isBanned: null,
  });
  const [emailConfirmInput, setEmailConfirmInput] = useState('');

  useEffect(() => {
    if (!isAdmin) return;
    fetchUsers();

    // 메뉴 외부 클릭 시 닫기
    const handleClickOutside = () => setOpenMenuId(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isAdmin]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast({
        title: "오류",
        description: "회원 목록을 불러오는데 실패했습니다.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async () => {
    if (emailConfirmInput !== confirmModal.userEmail) {
      toast({
        title: "확인 실패",
        description: "이메일 주소가 일치하지 않습니다.",
        variant: "destructive"
      });
      return;
    }

    try {
      let endpoint = '';
      let method = 'PATCH';
      let body = {};

      if (confirmModal.type === 'role') {
        const newRole = confirmModal.currentRole === 'admin' ? 'user' : 'admin';
        endpoint = `/api/users/${confirmModal.userId}/role`;
        body = { role: newRole };
      } else if (confirmModal.type === 'ban') {
        endpoint = `/api/users/${confirmModal.userId}/ban`;
        body = { banned: true, reason: '관리자에 의한 활동 정지' };
      } else if (confirmModal.type === 'unban') {
        endpoint = `/api/users/${confirmModal.userId}/ban`;
        body = { banned: false };
      } else if (confirmModal.type === 'delete') {
        endpoint = `/api/users/${confirmModal.userId}`;
        method = 'DELETE';
      }

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: method !== 'DELETE' ? JSON.stringify(body) : undefined
      });

      if (response.ok) {
        toast({
          title: "처리 완료",
          description: "요청하신 작업이 성공적으로 반영되었습니다.",
        });
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
        setEmailConfirmInput('');
        fetchUsers();
      } else {
        throw new Error('Action failed');
      }
    } catch (error) {
      console.error('Admin action error:', error);
      toast({
        title: "오류",
        description: "작업 처리에 실패했습니다.",
        variant: "destructive"
      });
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background text-foreground pt-20 flex items-center justify-center font-pretendard">
        <div className="bg-card p-10 rounded-3xl border border-border shadow-2xl text-center">
          <h1 className="text-2xl font-bold mb-4">접근 거부</h1>
          <p className="text-muted-foreground">관리자 권한이 필요합니다.</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      className="min-h-screen bg-background text-foreground pt-24 pb-20 font-pretendard"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <h1 className={`${headingClasses.h1} text-lg text-foreground font-black tracking-tighter`}>
            관리자 <span className="bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text">대시보드</span>
          </h1>

          <div className="flex p-1.5 bg-secondary/30 rounded-2xl border border-border/50">
            <button
              onClick={() => setActiveTab('users')}
              className={`px-8 py-3 rounded-xl font-bold transition-all duration-300 ${activeTab === 'users' ? 'bg-primary text-white shadow-lg transform scale-[1.02]' : 'text-muted-foreground hover:text-foreground hover:bg-primary/5'}`}
            >
              사용자 관리
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`px-8 py-3 rounded-xl font-bold transition-all duration-300 ${activeTab === 'products' ? 'bg-primary text-white shadow-lg transform scale-[1.02]' : 'text-muted-foreground hover:text-foreground hover:bg-primary/5'}`}
            >
              상품 관리
            </button>
          </div>
        </div>

        {activeTab === 'users' ? (
          <div className="bg-white rounded-3xl border border-border/50 shadow-xl shadow-primary/5 min-h-[400px]">
            <div className="overflow-x-visible">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-secondary/20 text-muted-foreground border-b border-border/50">
                    <th className="p-5 font-bold text-sm tracking-wider">사용자 정보</th>
                    <th className="p-5 font-bold text-sm tracking-wider">이메일</th>
                    <th className="p-5 font-bold text-sm tracking-wider">권한</th>
                    <th className="p-5 font-bold text-sm tracking-wider text-center">관리 액션</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {users.map(u => (
                    <tr key={u.id} className={`hover:bg-primary/5 transition-colors group ${openMenuId === u.id ? 'relative z-[100]' : ''}`}>
                      <td className="p-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border-2 border-primary/20">
                            {u.image ? (
                              <img src={u.image} alt={u.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-primary font-bold">{u.name.charAt(0)}</span>
                            )}
                          </div>
                          <span className="font-bold text-foreground group-hover:text-primary transition-colors">{u.name}</span>
                        </div>
                      </td>
                      <td className="p-5 text-muted-foreground font-medium">{u.email}</td>
                      <td className="p-5">
                        <div className="flex gap-2">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${u.role === 'admin' ? 'bg-primary/10 text-primary' : 'bg-secondary text-muted-foreground'}`}>
                            {u.role === 'admin' ? '관리자' : '일반회원'}
                          </span>
                          {u.banned && (
                            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-red-100 text-red-600 border border-red-200">
                              정지됨
                            </span>
                          )}
                        </div>
                      </td>
                      <td className={`px-4 py-2.5 text-center relative ${openMenuId === u.id ? 'z-[110]' : 'z-10'}`}>
                        <div className="flex justify-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // 문서 클릭 이벤트 전파 차단
                              setOpenMenuId(openMenuId === u.id ? null : u.id);
                            }}
                            className={`px-4 py-1.5 rounded-lg text-[11px] font-black flex items-center gap-2 transition-all ${openMenuId === u.id ? 'bg-primary text-white shadow-lg' : 'bg-secondary/50 text-muted-foreground hover:bg-primary/10 hover:text-primary'}`}
                          >
                            <span>관리</span>
                            <i className={`fa-solid fa-chevron-down text-[8px] transition-transform ${openMenuId === u.id ? 'rotate-180' : ''}`}></i>
                          </button>
                        </div>

                        {/* 드롭다운 메뉴 (스크린샷 스타일 반영) */}
                        {openMenuId === u.id && (
                          <div className="absolute right-1/2 translate-x-1/2 top-full mt-2 w-64 bg-white rounded-[1.5rem] border border-border shadow-[0_20px_50px_rgba(0,0,0,0.3)] z-[120] overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top">
                            {/* 헤더 섹션 (이름 & 이메일) */}
                            <div className="px-5 py-4 bg-secondary/10 border-b border-border/50 text-left">
                              <p className="text-sm font-black text-foreground truncate">{u.name}</p>
                              <p className="text-[10px] text-muted-foreground truncate mt-0.5">{u.email}</p>
                            </div>

                            <div className="p-1.5 py-2">
                              {/* 권한 관리 */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setConfirmModal({
                                    isOpen: true,
                                    type: 'role',
                                    userId: u.id,
                                    userEmail: u.email,
                                    userName: u.name,
                                    currentRole: u.role,
                                    isBanned: u.banned
                                  });
                                  setOpenMenuId(null);
                                }}
                                className="w-full px-4 py-3 text-left text-[11px] font-black hover:bg-primary/5 rounded-xl transition-colors flex items-center justify-between group"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                    <i className="fa-solid fa-user-shield"></i>
                                  </div>
                                  <span className="text-foreground/80">{u.role === 'admin' ? '관리자 권한 해제' : '관리자 권한 부여'}</span>
                                </div>
                                <i className="fa-solid fa-chevron-right text-[8px] text-muted-foreground/30"></i>
                              </button>

                              {/* 활동 정지 / 해제 */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setConfirmModal({
                                    isOpen: true,
                                    type: u.banned ? 'unban' : 'ban',
                                    userId: u.id,
                                    userEmail: u.email,
                                    userName: u.name,
                                    currentRole: u.role,
                                    isBanned: u.banned
                                  });
                                  setOpenMenuId(null);
                                }}
                                className={`w-full px-4 py-3 text-left text-[11px] font-black hover:bg-primary/5 rounded-xl transition-colors flex items-center justify-between group`}
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${u.banned ? 'bg-green-100 text-green-600 group-hover:bg-green-500' : 'bg-primary/10 text-primary group-hover:bg-primary'} group-hover:text-white`}>
                                    <i className={`fa-solid ${u.banned ? 'fa-check-circle' : 'fa-ban'}`}></i>
                                  </div>
                                  <span className="text-foreground/80">{u.banned ? '계정 활동 정지 해제' : '계정 활동 일시 정지'}</span>
                                </div>
                                <i className="fa-solid fa-chevron-right text-[8px] text-muted-foreground/30"></i>
                              </button>

                              <div className="h-[1px] bg-border/30 my-2 mx-2"></div>

                              {/* 강제 탈퇴 (Red Zone) */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setConfirmModal({
                                    isOpen: true,
                                    type: 'delete',
                                    userId: u.id,
                                    userEmail: u.email,
                                    userName: u.name,
                                    currentRole: u.role,
                                    isBanned: u.banned
                                  });
                                  setOpenMenuId(null);
                                }}
                                className="w-full px-4 py-3 text-left text-[11px] font-black hover:bg-red-50 rounded-xl transition-colors flex items-center justify-between group"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 group-hover:bg-red-500 group-hover:text-white transition-all">
                                    <i className="fa-solid fa-user-xmark"></i>
                                  </div>
                                  <span className="text-red-600">회원 강제 탈퇴</span>
                                </div>
                              </button>
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <ProductManagement />
        )}
      </div>

      {/* GitHub 스타일 확인 모달 */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-[2rem] border border-border shadow-2xl max-w-md w-full overflow-hidden"
          >
            <div className={`h-2 ${confirmModal.type === 'delete' ? 'bg-red-500' : 'bg-primary'}`}></div>
            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${confirmModal.type === 'delete' ? 'bg-red-50 text-red-500' : 'bg-primary/10 text-primary'}`}>
                  <i className={`fa-solid ${confirmModal.type === 'delete' ? 'fa-triangle-exclamation' : 'fa-shield-halved'} text-xl`}></i>
                </div>
                <div>
                  <h3 className="text-lg font-black text-foreground">중요한 확인이 필요합니다</h3>
                  <p className="text-xs text-muted-foreground font-medium">관리자 보안 인증 절차</p>
                </div>
              </div>

              <div className="bg-secondary/20 p-5 rounded-2xl mb-8 border border-border/30">
                <p className="text-sm font-medium text-foreground leading-relaxed">
                  사용자 <span className="font-black text-primary">[{confirmModal.userName}]</span>님의
                  {confirmModal.type === 'role' ? ' 권한을 변경하려 합니다.' :
                    confirmModal.type === 'ban' ? ' 계정을 활동 정지 처리하려 합니다.' :
                      confirmModal.type === 'unban' ? ' 계정 정지를 해제하려 합니다.' :
                        ' 계정을 영구 탈퇴시키려 합니다.'}
                  <br />
                  <span className={`${confirmModal.type === 'unban' ? 'text-green-600' : 'text-red-500'} text-xs font-black mt-2 inline-block`}>
                    {confirmModal.type === 'unban' ? '정지 해제 즉시 다시 활동이 가능해집니다.' : '이 작업은 시스템에 즉시 반영됩니다.'}
                  </span>
                </p>
              </div>

              <div className="space-y-4">
                <p className="text-[11px] font-black text-muted-foreground uppercase tracking-wider ml-1">
                  확인을 위해 아래 이메일 주소를 입력하세요:
                  <br />
                  <span className="text-primary select-all cursor-pointer hover:underline">{confirmModal.userEmail}</span>
                </p>
                <input
                  type="text"
                  value={emailConfirmInput}
                  onChange={(e) => setEmailConfirmInput(e.target.value)}
                  placeholder="사용자의 전체 이메일 주소 입력"
                  className="w-full bg-secondary/10 border border-border/50 rounded-xl px-5 py-4 text-sm font-black focus:border-primary focus:ring-4 focus:ring-primary/5 focus:outline-none transition-all"
                  autoFocus
                />
              </div>

              <div className="flex gap-3 mt-10">
                <button
                  onClick={() => {
                    setConfirmModal(prev => ({ ...prev, isOpen: false }));
                    setEmailConfirmInput('');
                  }}
                  className="flex-1 px-4 py-4 bg-secondary text-muted-foreground rounded-2xl font-black text-sm hover:bg-secondary/80 transition-all"
                >
                  취소
                </button>
                <button
                  onClick={handleAction}
                  disabled={emailConfirmInput !== confirmModal.userEmail}
                  className={`flex-1 px-4 py-4 rounded-2xl font-black text-sm transition-all shadow-xl ${emailConfirmInput === confirmModal.userEmail ? (confirmModal.type === 'delete' ? 'bg-red-500 text-white shadow-red-500/20' : 'bg-primary text-white shadow-primary/20') : 'bg-muted text-muted-foreground shadow-none cursor-not-allowed'}`}
                >
                  최종 승인 및 실행
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default AdminDashboard;