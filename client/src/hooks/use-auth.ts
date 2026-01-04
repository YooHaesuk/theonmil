import { signIn, signOut, useSession } from "@/lib/auth-client";

export const useAuth = () => {
  const { data: session, isPending, error } = useSession();

  const user = session?.user ? {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
    image: session.user.image,
    isAdmin: session.user.email === 'yhs85844@gmail.com' || (session.user as any).role === 'admin'
  } : null;

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
