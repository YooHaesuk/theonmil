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
      callbackURL: "/welcome" // We will refine this to only go to welcome for new users if possible, 
      // but user specifically asked for "signup completion" to go there.
      // For now, let's follow the user's request for the signup/login flow.
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
