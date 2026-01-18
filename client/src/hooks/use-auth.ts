import { signIn, signOut, useSession } from "@/lib/auth-client";
import { useMemo } from "react";

export const useAuth = () => {
  const { data: session, isPending, error } = useSession();

  const user = useMemo(() => session?.user ? {
    ...session.user,
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
    image: session.user.image,
    phone: (session.user as any).phone,
    createdAt: (session.user as any).createdAt,
    provider: (session.user as any).provider || 'social',
    banned: (session.user as any).banned,
    isAdmin: ['yhs85844@gmail.com', 'psyjs1@gmail.com'].includes(session.user.email) || (session.user as any).role === 'admin'
  } : null, [session?.user]);

  const loginWithSocial = async (provider: 'google' | 'naver' | 'kakao') => {
    await signIn.social({
      provider,
      callbackURL: "/",              // 기존 회원 → 홈으로
      newUserCallbackURL: "/welcome" // 신규 회원 → 환영 페이지로
    });
  };

  const logout = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = "/login";
        }
      }
    });
  };

  return {
    user,
    loading: isPending,
    isAuthenticated: !!session,
    isAdmin: user?.isAdmin || false,
    signInWithGoogle: () => loginWithSocial('google'),
    signInWithNaver: () => loginWithSocial('naver'),
    signInWithKakao: () => loginWithSocial('kakao'),
    logout
  };
};
