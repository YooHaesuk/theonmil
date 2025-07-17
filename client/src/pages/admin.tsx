import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { pageTransition, fadeIn, slideInFromBottom } from '@/lib/animations';
import { headingClasses } from '@/lib/fonts';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { getAllUsers, getUserStats, updateUserAdminStatus, logAdminActivity, type FirestoreUser } from '@/lib/firestore';
import ProductManagement from '@/components/admin/product-management';

// FirestoreUser 타입을 사용
interface UserStats {
  totalUsers: number;
  todayUsers: number;
  providerStats: Record<string, number>;
}

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<FirestoreUser[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<FirestoreUser | null>(null);
  const [activeTab, setActiveTab] = useState<'users' | 'products'>('users');

  useEffect(() => {
    if (!isAdmin) {
      return;
    }

    fetchUsers();
    fetchStats();
  }, [isAdmin]);

  const fetchUsers = async () => {
    try {
      const userData = await getAllUsers();
      setUsers(userData);
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

  const fetchStats = async () => {
    try {
      const statsData = await getUserStats();
      setStats(statsData);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      toast({
        title: "오류",
        description: "통계 데이터를 불러오는데 실패했습니다.",
        variant: "destructive"
      });
    }
  };

  const toggleAdminStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const success = await updateUserAdminStatus(userId, !currentStatus);

      if (success) {
        // 관리자 활동 로그 저장
        if (user?.uid) {
          await logAdminActivity(
            user.uid,
            !currentStatus ? 'user_promoted' : 'user_demoted',
            userId,
            { action: !currentStatus ? 'promoted to admin' : 'demoted from admin' }
          );
        }

        toast({
          title: "성공",
          description: `관리자 권한이 ${!currentStatus ? '부여' : '해제'}되었습니다.`,
        });
        fetchUsers(); // 목록 새로고침
      } else {
        throw new Error('Failed to update admin status');
      }
    } catch (error) {
      console.error('Failed to toggle admin status:', error);
      toast({
        title: "오류",
        description: "관리자 권한 변경에 실패했습니다.",
        variant: "destructive"
      });
    }
  };

  // 관리자가 아닌 경우 접근 거부
  if (!isAdmin) {
    return (
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageTransition}
        className="min-h-screen bg-[#0A0A0A] text-white pt-20 flex items-center justify-center"
      >
        <div className="text-center">
          <h1 className={`${headingClasses} text-4xl mb-4`}>
            접근 <span className="bg-gradient-to-r from-[#A78BFA] to-[#EC4899] text-transparent bg-clip-text">거부</span>
          </h1>
          <p className="text-gray-400">관리자 권한이 필요합니다.</p>
        </div>
      </motion.div>
    );
  }

  // 로딩 중
  if (loading) {
    return (
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageTransition}
        className="min-h-screen bg-[#0A0A0A] text-white pt-20 flex items-center justify-center"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#A78BFA] mx-auto mb-4"></div>
          <p className="text-gray-400">데이터를 불러오는 중...</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      className="min-h-screen bg-[#0A0A0A] text-white pt-20"
    >
      <div className="container mx-auto px-4 py-8">
        <motion.div variants={fadeIn} className="mb-8">
          <h1 className={`${headingClasses} text-4xl mb-4`}>
            관리자 <span className="bg-gradient-to-r from-[#A78BFA] to-[#EC4899] text-transparent bg-clip-text">대시보드</span>
          </h1>
          <p className="text-gray-400">더 온밀 관리 시스템</p>

          {/* 탭 네비게이션 */}
          <div className="flex space-x-4 mt-6">
            <button
              onClick={() => setActiveTab('users')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'users'
                  ? 'bg-gradient-to-r from-[#A78BFA] to-[#EC4899] text-white'
                  : 'bg-[#222222] text-gray-400 hover:text-white'
              }`}
            >
              <i className="fa-solid fa-users mr-2"></i>
              회원 관리
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'products'
                  ? 'bg-gradient-to-r from-[#A78BFA] to-[#EC4899] text-white'
                  : 'bg-[#222222] text-gray-400 hover:text-white'
              }`}
            >
              <i className="fa-solid fa-box mr-2"></i>
              상품 관리
            </button>
          </div>
        </motion.div>

        {/* 탭 컨텐츠 */}
        {activeTab === 'users' && (
          <>
            {/* 통계 카드 */}
            {stats && (
              <motion.div variants={slideInFromBottom} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-[#111111] rounded-lg p-6 border border-[#222222]">
                  <h3 className="text-lg font-semibold mb-2">총 회원 수</h3>
                  <p className="text-3xl font-bold text-[#A78BFA]">{stats.totalUsers}</p>
                </div>
                <div className="bg-[#111111] rounded-lg p-6 border border-[#222222]">
                  <h3 className="text-lg font-semibold mb-2">오늘 가입</h3>
                  <p className="text-3xl font-bold text-[#EC4899]">{stats.todayUsers}</p>
                </div>
                <div className="bg-[#111111] rounded-lg p-6 border border-[#222222]">
                  <h3 className="text-lg font-semibold mb-2">로그인 방식</h3>
                  <div className="space-y-1">
                    {Object.entries(stats.providerStats).map(([provider, count]) => (
                      <div key={provider} className="flex justify-between text-sm">
                        <span className="capitalize">{provider.replace('.com', '')}</span>
                        <span>{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* 회원 목록 */}
            <motion.div variants={slideInFromBottom} className="bg-[#111111] rounded-lg border border-[#222222] overflow-hidden">
              <div className="p-6 border-b border-[#222222]">
                <h2 className="text-xl font-semibold">회원 목록</h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#0A0A0A]">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">사용자</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">이메일</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">가입일</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">로그인 방식</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">로그인 횟수</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">권한</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">관리</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#222222]">
                    {users.map((userData) => (
                      <tr key={userData.uid} className="hover:bg-[#1A1A1A] transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {userData.profileImage ? (
                              <img
                                src={userData.profileImage}
                                alt={userData.name}
                                className="w-8 h-8 rounded-full mr-3"
                              />
                            ) : (
                              <div className="w-8 h-8 bg-[#333333] rounded-full mr-3 flex items-center justify-center">
                                <i className="fa-solid fa-user text-gray-400 text-sm"></i>
                              </div>
                            )}
                            <span className="font-medium">{userData.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-300">{userData.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                          {userData.createdAt?.toDate().toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            userData.provider === 'google.com' ? 'bg-red-900 text-red-200' :
                            userData.provider === 'kakao.com' ? 'bg-yellow-900 text-yellow-200' :
                            'bg-green-900 text-green-200'
                          }`}>
                            {userData.provider.replace('.com', '')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-300">{userData.loginCount}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            userData.isAdmin ? 'bg-purple-900 text-purple-200' : 'bg-gray-900 text-gray-200'
                          }`}>
                            {userData.isAdmin ? '관리자' : '일반 회원'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => toggleAdminStatus(userData.uid, userData.isAdmin)}
                            className={`px-3 py-1 text-xs rounded-full transition-colors ${
                              userData.isAdmin
                                ? 'bg-red-600 hover:bg-red-700 text-white'
                                : 'bg-purple-600 hover:bg-purple-700 text-white'
                            }`}
                          >
                            {userData.isAdmin ? '관리자 해제' : '관리자 지정'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </>
        )}

        {/* 상품 관리 탭 */}
        {activeTab === 'products' && (
          <ProductManagement />
        )}
      </div>
    </motion.div>
  );
};

export default AdminDashboard;