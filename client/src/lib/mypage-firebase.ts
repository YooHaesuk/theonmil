// 마이페이지 전용 Firebase 유틸리티 함수들
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  orderBy, 
  getDocs,
  addDoc,
  deleteDoc,
  Timestamp,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { db } from './firebase';

// 사용자 프로필 확장 인터페이스
export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone?: string;
  birthDate?: string;
  profileImage?: string;
  
  // 배송지 정보
  addresses: Address[];
  
  // 활동 정보
  wishlist: string[];           // 상품 ID 배열
  recentViews: RecentView[];    // 최근 본 상품
  
  // 설정
  settings: {
    notifications: boolean;
    marketing: boolean;
    sms: boolean;
  };
  
  // 메타데이터
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Address {
  id: string;
  name: string;              // 배송지 별칭 (집, 회사 등)
  recipient: string;         // 수령인
  phone: string;
  address: string;
  detailAddress: string;
  zipCode: string;
  isDefault: boolean;
}

export interface RecentView {
  productId: string;
  viewedAt: Timestamp;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'shipping' | 'delivered' | 'cancelled';
  shippingAddress: Address;
  paymentInfo?: any;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Inquiry {
  id: string;
  userId: string;
  title: string;
  content: string;
  status: 'pending' | 'answered';
  answer?: string;
  answeredAt?: Timestamp;
  createdAt: Timestamp;
}

export interface Coupon {
  id: string;
  name: string;
  discount: string;
  minAmount: number;
  expiryDate: string;
  isUsed: boolean;
  usedAt?: Timestamp;
}

// 사용자 프로필 조회
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const userRef = doc(db, 'user_profiles', uid);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      return userDoc.data() as UserProfile;
    }
    
    // 프로필이 없으면 기본 프로필 생성
    const defaultProfile: UserProfile = {
      uid,
      name: '',
      email: '',
      addresses: [],
      wishlist: [],
      recentViews: [],
      settings: {
        notifications: true,
        marketing: false,
        sms: true
      },
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    
    await setDoc(userRef, defaultProfile);
    return defaultProfile;
  } catch (error) {
    console.error('❌ 사용자 프로필 조회 실패:', error);
    return null;
  }
};

// 사용자 프로필 업데이트
export const updateUserProfile = async (uid: string, updates: Partial<UserProfile>): Promise<boolean> => {
  try {
    const userRef = doc(db, 'user_profiles', uid);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: Timestamp.now()
    });
    return true;
  } catch (error) {
    console.error('❌ 사용자 프로필 업데이트 실패:', error);
    return false;
  }
};

// 배송지 추가
export const addAddress = async (uid: string, address: Omit<Address, 'id'>): Promise<boolean> => {
  try {
    const userRef = doc(db, 'user_profiles', uid);
    const newAddress: Address = {
      ...address,
      id: `addr_${Date.now()}`
    };
    
    await updateDoc(userRef, {
      addresses: arrayUnion(newAddress),
      updatedAt: Timestamp.now()
    });
    return true;
  } catch (error) {
    console.error('❌ 배송지 추가 실패:', error);
    return false;
  }
};

// 배송지 삭제
export const removeAddress = async (uid: string, addressId: string): Promise<boolean> => {
  try {
    const profile = await getUserProfile(uid);
    if (!profile) return false;
    
    const updatedAddresses = profile.addresses.filter(addr => addr.id !== addressId);
    
    const userRef = doc(db, 'user_profiles', uid);
    await updateDoc(userRef, {
      addresses: updatedAddresses,
      updatedAt: Timestamp.now()
    });
    return true;
  } catch (error) {
    console.error('❌ 배송지 삭제 실패:', error);
    return false;
  }
};

// 찜 목록에 상품 추가
export const addToWishlist = async (uid: string, productId: string): Promise<boolean> => {
  try {
    const userRef = doc(db, 'user_profiles', uid);
    await updateDoc(userRef, {
      wishlist: arrayUnion(productId),
      updatedAt: Timestamp.now()
    });
    return true;
  } catch (error) {
    console.error('❌ 찜 목록 추가 실패:', error);
    return false;
  }
};

// 찜 목록에서 상품 제거
export const removeFromWishlist = async (uid: string, productId: string): Promise<boolean> => {
  try {
    const userRef = doc(db, 'user_profiles', uid);
    await updateDoc(userRef, {
      wishlist: arrayRemove(productId),
      updatedAt: Timestamp.now()
    });
    return true;
  } catch (error) {
    console.error('❌ 찜 목록 제거 실패:', error);
    return false;
  }
};

// 최근 본 상품 추가
export const addToRecentViews = async (uid: string, productId: string): Promise<boolean> => {
  try {
    const profile = await getUserProfile(uid);
    if (!profile) return false;
    
    // 기존에 본 상품이면 제거하고 최신으로 추가
    const filteredViews = profile.recentViews.filter(view => view.productId !== productId);
    const newRecentViews = [
      { productId, viewedAt: Timestamp.now() },
      ...filteredViews.slice(0, 9) // 최대 10개까지만 유지
    ];
    
    const userRef = doc(db, 'user_profiles', uid);
    await updateDoc(userRef, {
      recentViews: newRecentViews,
      updatedAt: Timestamp.now()
    });
    return true;
  } catch (error) {
    console.error('❌ 최근 본 상품 추가 실패:', error);
    return false;
  }
};

// 사용자 주문 내역 조회
export const getUserOrders = async (uid: string): Promise<Order[]> => {
  try {
    const ordersRef = collection(db, 'orders');
    const q = query(
      ordersRef,
      where('userId', '==', uid),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Order[];
  } catch (error) {
    console.error('❌ 주문 내역 조회 실패:', error);
    return [];
  }
};

// 문의 등록
export const createInquiry = async (uid: string, title: string, content: string): Promise<boolean> => {
  try {
    const inquiriesRef = collection(db, 'inquiries');
    await addDoc(inquiriesRef, {
      userId: uid,
      title,
      content,
      status: 'pending',
      createdAt: Timestamp.now()
    });
    return true;
  } catch (error) {
    console.error('❌ 문의 등록 실패:', error);
    return false;
  }
};

// 사용자 문의 내역 조회
export const getUserInquiries = async (uid: string): Promise<Inquiry[]> => {
  try {
    const inquiriesRef = collection(db, 'inquiries');
    const q = query(
      inquiriesRef,
      where('userId', '==', uid),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Inquiry[];
  } catch (error) {
    console.error('❌ 문의 내역 조회 실패:', error);
    return [];
  }
};

// 사용자 쿠폰 조회
export const getUserCoupons = async (uid: string): Promise<Coupon[]> => {
  try {
    const couponsRef = collection(db, 'user_coupons');
    const q = query(
      couponsRef,
      where('userId', '==', uid),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Coupon[];
  } catch (error) {
    console.error('❌ 쿠폰 조회 실패:', error);
    return [];
  }
};
