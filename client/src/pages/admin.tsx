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
  createdAt: string;
}

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'users' | 'products'>('users');

  useEffect(() => {
    if (!isAdmin) return;
    fetchUsers();
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

  const toggleAdminStatus = async (userId: string, currentRole: string) => {
    try {
      const newRole = currentRole === 'admin' ? 'user' : 'admin';
      const response = await fetch(`/api/users/${userId}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole })
      });

      if (response.ok) {
        toast({
          title: "성공",
          description: `사용자 권한이 ${newRole}로 변경되었습니다.`,
        });
        fetchUsers();
      } else {
        throw new Error('Failed to update role');
      }
    } catch (error) {
      console.error('Failed to toggle admin status:', error);
      toast({
        title: "오류",
        description: "권한 변경에 실패했습니다.",
        variant: "destructive"
      });
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white pt-20 flex items-center justify-center">
        <h1 className="text-2xl">접근 거부: 관리자 권한이 필요합니다.</h1>
      </div>
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
        <h1 className={`${headingClasses.h1} text-4xl mb-8`}>관리 대시보드</h1>

        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-2 rounded-lg ${activeTab === 'users' ? 'bg-[#A78BFA] text-white' : 'bg-[#222] text-gray-400'}`}
          >
            사용자 관리
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-6 py-2 rounded-lg ${activeTab === 'products' ? 'bg-[#A78BFA] text-white' : 'bg-[#222] text-gray-400'}`}
          >
            상품 관리
          </button>
        </div>

        {activeTab === 'users' ? (
          <div className="bg-[#111] rounded-lg overflow-hidden border border-[#222]">
            <table className="w-full text-left">
              <thead className="bg-[#0A0A0A] text-gray-400">
                <tr>
                  <th className="p-4">이름</th>
                  <th className="p-4">이메일</th>
                  <th className="p-4">역할</th>
                  <th className="p-4">가입일</th>
                  <th className="p-4">관리</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className="border-t border-[#222]">
                    <td className="p-4 flex items-center gap-2">
                      {u.image && <img src={u.image} className="w-8 h-8 rounded-full" />}
                      {u.name}
                    </td>
                    <td className="p-4">{u.email}</td>
                    <td className="p-4">{u.role}</td>
                    <td className="p-4">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="p-4">
                      <button
                        onClick={() => toggleAdminStatus(u.id, u.role)}
                        className="text-xs bg-purple-600 px-3 py-1 rounded"
                      >
                        역할변경
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <ProductManagement />
        )}
      </div>
    </motion.div>
  );
};

export default AdminDashboard;