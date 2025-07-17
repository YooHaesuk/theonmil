import { createClient } from '@supabase/supabase-js';

// Supabase 클라이언트 초기화 (환경변수가 없으면 더미 값 사용)
const supabaseUrl = process.env.SUPABASE_URL || 'https://dummy.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'dummy-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

// 사용자 인터페이스
export interface SocialUser {
  id: string;
  email: string;
  name: string;
  provider: 'google' | 'kakao' | 'naver';
  provider_id: string;
  profile_image?: string;
  is_admin?: boolean;
}

export interface DatabaseUser {
  id: string;
  email: string;
  name: string;
  provider: string;
  provider_id: string;
  profile_image?: string;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
  last_login: string;
  login_count: number;
}

// 사용자 저장 또는 업데이트
export const saveUserToDatabase = async (user: SocialUser): Promise<DatabaseUser | null> => {
  try {
    // 기존 사용자 확인
    const { data: existingUser, error: selectError } = await supabase
      .from('users')
      .select('*')
      .eq('email', user.email)
      .single();

    if (selectError && selectError.code !== 'PGRST116') {
      // PGRST116은 "not found" 에러 코드
      console.error('Error checking existing user:', selectError);
      return null;
    }

    if (existingUser) {
      // 기존 사용자 - 로그인 정보 업데이트
      const { data: updatedUser, error: updateError } = await supabase
        .from('users')
        .update({
          last_login: new Date().toISOString(),
          login_count: existingUser.login_count + 1,
          name: user.name, // 이름이 변경될 수 있으므로 업데이트
          profile_image: user.profile_image // 프로필 이미지도 업데이트
        })
        .eq('id', existingUser.id)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating user:', updateError);
        return null;
      }

      return updatedUser;
    } else {
      // 신규 사용자 - 새로 생성
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert({
          email: user.email,
          name: user.name,
          provider: user.provider,
          provider_id: user.provider_id,
          profile_image: user.profile_image,
          is_admin: user.email === process.env.ADMIN_EMAIL // 관리자 이메일 체크
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error creating user:', insertError);
        return null;
      }

      return newUser;
    }
  } catch (error) {
    console.error('Database error:', error);
    return null;
  }
};

// 사용자 조회 (이메일로)
export const getUserByEmail = async (email: string): Promise<DatabaseUser | null> => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      console.error('Error fetching user by email:', error);
      return null;
    }

    return user;
  } catch (error) {
    console.error('Database error:', error);
    return null;
  }
};

// 사용자 조회 (ID로)
export const getUserById = async (id: string): Promise<DatabaseUser | null> => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching user by ID:', error);
      return null;
    }

    return user;
  } catch (error) {
    console.error('Database error:', error);
    return null;
  }
};

// 모든 사용자 조회 (관리자용)
export const getAllUsers = async (): Promise<DatabaseUser[]> => {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all users:', error);
      return [];
    }

    return users || [];
  } catch (error) {
    console.error('Database error:', error);
    return [];
  }
};

// 사용자 관리자 권한 변경
export const updateUserAdminStatus = async (userId: string, isAdmin: boolean): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('users')
      .update({ is_admin: isAdmin })
      .eq('id', userId);

    if (error) {
      console.error('Error updating user admin status:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Database error:', error);
    return false;
  }
};

// 사용자 통계 조회
export const getUserStats = async () => {
  try {
    const { data: totalUsers, error: totalError } = await supabase
      .from('users')
      .select('id', { count: 'exact' });

    const { data: todayUsers, error: todayError } = await supabase
      .from('users')
      .select('id', { count: 'exact' })
      .gte('created_at', new Date().toISOString().split('T')[0]);

    const { data: providerStats, error: providerError } = await supabase
      .from('users')
      .select('provider')
      .order('provider');

    if (totalError || todayError || providerError) {
      console.error('Error fetching user stats');
      return null;
    }

    // 프로바이더별 통계 계산
    const providerCounts = providerStats?.reduce((acc: any, user: any) => {
      acc[user.provider] = (acc[user.provider] || 0) + 1;
      return acc;
    }, {});

    return {
      totalUsers: totalUsers?.length || 0,
      todayUsers: todayUsers?.length || 0,
      providerStats: providerCounts || {}
    };
  } catch (error) {
    console.error('Database error:', error);
    return null;
  }
};

// 관리자 활동 로그 저장
export const logAdminActivity = async (
  adminUserId: string,
  action: string,
  targetId?: string,
  details?: any
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('admin_logs')
      .insert({
        admin_user_id: adminUserId,
        action,
        target_id: targetId,
        details
      });

    if (error) {
      console.error('Error logging admin activity:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Database error:', error);
    return false;
  }
};
