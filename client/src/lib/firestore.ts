// Firestore 데이터베이스 유틸리티 함수들
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  query, 
  orderBy, 
  where,
  Timestamp,
  increment
} from 'firebase/firestore';
import { db } from './firebase';

// 사용자 인터페이스
export interface FirestoreUser {
  uid: string;
  email: string;
  name: string;
  provider: string;
  profileImage?: string;
  isAdmin: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastLogin: Timestamp;
  loginCount: number;
}

// 상품 인터페이스
export interface FirestoreProduct {
  id: string;
  name: string;
  nameKorean: string;
  description: string;
  price: number;
  category: 'regular' | 'custom' | 'gift';
  tags: string[];
  image: string;
  images?: string[]; // 추가 상품 이미지들 (썸네일용)
  detailImage?: string; // 상세페이지 이미지 URL
  isBestseller: boolean;
  isNew: boolean;
  isPopular: boolean;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

// 사용자 생성 또는 업데이트
export const createOrUpdateUser = async (
  uid: string,
  userData: {
    email: string;
    name: string;
    provider: string;
    profileImage?: string;
    isAdmin?: boolean;
  }
): Promise<FirestoreUser | null> => {
  try {
    const userRef = doc(db, 'users', uid);

    // 직접 Firestore 접근 (타임아웃 제거)
    console.log('Attempting to get user document from Firestore...');
    const userSnap = await getDoc(userRef);
    console.log('Firestore document fetch result:', userSnap.exists());
    
    if (userSnap.exists()) {
      // 기존 사용자 - 로그인 정보 업데이트
      console.log('Updating existing user in Firestore...');
      const existingData = userSnap.data() as FirestoreUser;
      const updatedData = {
        name: userData.name,
        profileImage: userData.profileImage || '',
        lastLogin: Timestamp.now(),
        loginCount: (existingData.loginCount || 0) + 1,
        updatedAt: Timestamp.now()
      };
      
      await updateDoc(userRef, updatedData);
      console.log('User updated successfully in Firestore');

      return {
        ...existingData,
        ...updatedData,
        uid
      } as FirestoreUser;
    } else {
      // 신규 사용자 생성
      console.log('Creating new user in Firestore...');
      const newUserData: Omit<FirestoreUser, 'uid'> = {
        email: userData.email,
        name: userData.name,
        provider: userData.provider,
        profileImage: userData.profileImage || '',
        isAdmin: userData.isAdmin || false,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        lastLogin: Timestamp.now(),
        loginCount: 1
      };
      
      await setDoc(userRef, newUserData);
      console.log('New user created successfully in Firestore');

      // 저장 후 실제로 문서가 존재하는지 확인
      const verifySnap = await getDoc(userRef);
      if (verifySnap.exists()) {
        console.log('✅ VERIFICATION: Document actually exists in Firestore:', verifySnap.data());
      } else {
        console.error('❌ VERIFICATION FAILED: Document does not exist in Firestore after save!');
      }

      return {
        uid,
        ...newUserData
      };
    }
  } catch (error) {
    console.error('Error creating/updating user:', error);

    // Firestore 연결 실패 시 기본 사용자 객체 반환
    const fallbackUser: FirestoreUser = {
      uid,
      email: userData.email,
      name: userData.name,
      provider: userData.provider,
      profileImage: userData.profileImage || '',
      isAdmin: userData.isAdmin || false,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      lastLogin: Timestamp.now(),
      loginCount: 1
    };

    console.log('Returning fallback user data due to Firestore error');
    return fallbackUser;
  }
};

// 사용자 조회
export const getUser = async (uid: string): Promise<FirestoreUser | null> => {
  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return {
        uid,
        ...userSnap.data()
      } as FirestoreUser;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

// 모든 사용자 조회 (관리자용)
export const getAllUsers = async (): Promise<FirestoreUser[]> => {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      uid: doc.id,
      ...doc.data()
    })) as FirestoreUser[];
  } catch (error) {
    console.error('Error getting all users:', error);
    return [];
  }
};

// 사용자 관리자 권한 변경
export const updateUserAdminStatus = async (uid: string, isAdmin: boolean): Promise<boolean> => {
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      isAdmin,
      updatedAt: Timestamp.now()
    });
    
    return true;
  } catch (error) {
    console.error('Error updating user admin status:', error);
    return false;
  }
};

// 사용자 통계 조회
export const getUserStats = async () => {
  try {
    const usersRef = collection(db, 'users');
    
    // 전체 사용자 수
    const allUsersSnapshot = await getDocs(usersRef);
    const totalUsers = allUsersSnapshot.size;
    
    // 오늘 가입한 사용자 수
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTimestamp = Timestamp.fromDate(today);
    
    const todayUsersQuery = query(
      usersRef, 
      where('createdAt', '>=', todayTimestamp)
    );
    const todayUsersSnapshot = await getDocs(todayUsersQuery);
    const todayUsers = todayUsersSnapshot.size;
    
    // 프로바이더별 통계
    const providerStats: Record<string, number> = {};
    allUsersSnapshot.docs.forEach(doc => {
      const userData = doc.data();
      const provider = userData.provider || 'unknown';
      providerStats[provider] = (providerStats[provider] || 0) + 1;
    });
    
    return {
      totalUsers,
      todayUsers,
      providerStats
    };
  } catch (error) {
    console.error('Error getting user stats:', error);
    return null;
  }
};

// 관리자 활동 로그 저장
export const logAdminActivity = async (
  adminUid: string,
  action: string,
  targetUid?: string,
  details?: any
): Promise<boolean> => {
  try {
    const logsRef = collection(db, 'admin_logs');
    const logData = {
      adminUid,
      action,
      targetUid: targetUid || null,
      details: details || null,
      timestamp: Timestamp.now()
    };
    
    await setDoc(doc(logsRef), logData);
    return true;
  } catch (error) {
    console.error('Error logging admin activity:', error);
    return false;
  }
};

// Firestore 규칙 (Firebase Console에서 설정)
export const firestoreRules = `
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 사용자는 자신의 문서만 읽기/쓰기 가능
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      // 관리자는 모든 사용자 문서 접근 가능
      allow read, write: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
    
    // 관리자 로그는 관리자만 접근 가능
    match /admin_logs/{logId} {
      allow read, write: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
  }
}
`;

// ==========================================
// 상품 관리 함수들
// ==========================================

/**
 * 모든 상품 조회
 */
export async function getAllProducts(): Promise<FirestoreProduct[]> {
  try {
    console.log('🔥 Firestore: 모든 상품 조회 시작');
    const productsRef = collection(db, 'products');
    const q = query(productsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    const products: FirestoreProduct[] = [];
    querySnapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...doc.data()
      } as FirestoreProduct);
    });

    console.log('✅ Firestore: 상품 조회 성공:', products.length, '개');
    return products;
  } catch (error) {
    console.error('❌ Firestore: 상품 조회 실패:', error);
    throw error;
  }
}

/**
 * 상품 등록
 */
export async function createProduct(productData: Omit<FirestoreProduct, 'id' | 'createdAt' | 'updatedAt'>): Promise<FirestoreProduct> {
  try {
    console.log('🔥 Firestore: 상품 등록 시작:', productData);

    // 새 문서 참조 생성 (자동 ID)
    const productsRef = collection(db, 'products');
    const newProductRef = doc(productsRef);

    const now = Timestamp.now();
    const product: FirestoreProduct = {
      id: newProductRef.id,
      ...productData,
      createdAt: now,
      updatedAt: now
    };

    await setDoc(newProductRef, product);

    console.log('✅ Firestore: 상품 등록 성공:', product);
    return product;
  } catch (error) {
    console.error('❌ Firestore: 상품 등록 실패:', error);
    throw error;
  }
}

/**
 * 상품 수정
 */
export async function updateProduct(productId: string, updates: Partial<Omit<FirestoreProduct, 'id' | 'createdAt'>>): Promise<void> {
  try {
    console.log('🔥 Firestore: 상품 수정 시작:', productId, updates);

    const productRef = doc(db, 'products', productId);
    const updateData = {
      ...updates,
      updatedAt: Timestamp.now()
    };

    await updateDoc(productRef, updateData);

    console.log('✅ Firestore: 상품 수정 성공');
  } catch (error) {
    console.error('❌ Firestore: 상품 수정 실패:', error);
    throw error;
  }
}

/**
 * 특정 상품 조회
 */
export async function getProductById(productId: string): Promise<FirestoreProduct | null> {
  try {
    console.log('🔥 Firestore: 상품 조회 시작:', productId);

    const productRef = doc(db, 'products', productId);
    const productSnap = await getDoc(productRef);

    if (productSnap.exists()) {
      const product = {
        id: productSnap.id,
        ...productSnap.data()
      } as FirestoreProduct;

      console.log('✅ Firestore: 상품 조회 성공:', product);
      return product;
    } else {
      console.log('❌ Firestore: 상품을 찾을 수 없음:', productId);
      return null;
    }
  } catch (error) {
    console.error('❌ Firestore: 상품 조회 실패:', error);
    throw error;
  }
}

/**
 * 카테고리별 상품 조회
 */
export async function getProductsByCategory(category: string): Promise<FirestoreProduct[]> {
  try {
    console.log('🔥 Firestore: 카테고리별 상품 조회 시작:', category);

    const productsRef = collection(db, 'products');
    const q = query(
      productsRef,
      where('category', '==', category),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);

    const products: FirestoreProduct[] = [];
    querySnapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...doc.data()
      } as FirestoreProduct);
    });

    console.log('✅ Firestore: 카테고리별 상품 조회 성공:', products.length, '개');
    return products;
  } catch (error) {
    console.error('❌ Firestore: 카테고리별 상품 조회 실패:', error);
    throw error;
  }
}
