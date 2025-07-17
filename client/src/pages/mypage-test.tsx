import { useAuth } from '@/hooks/use-auth';

const MyPageTest = () => {
  const { user, loading } = useAuth();

  console.log('🧪 MyPageTest 렌더링:', { user, loading });

  if (loading) {
    return <div className="p-8">로딩 중...</div>;
  }

  if (!user) {
    return <div className="p-8">로그인이 필요합니다.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-4">마이페이지 테스트</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-2">사용자 정보</h2>
        <p>이름: {user.name}</p>
        <p>이메일: {user.email}</p>
        <p>UID: {user.uid}</p>
      </div>
    </div>
  );
};

export default MyPageTest;
