// Firestore 저장 테스트 함수
import { doc, setDoc, getDoc, collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from './firebase';

// 간단한 테스트 문서 저장
export const testFirestoreWrite = async () => {
  try {
    console.log('🧪 Starting Firestore write test...');
    
    const testData = {
      message: 'Hello Firestore!',
      timestamp: Timestamp.now(),
      testId: Math.random().toString(36).substring(7)
    };
    
    // 1. 고정 ID로 문서 저장 테스트
    const testDocRef = doc(db, 'test', 'write-test');
    await setDoc(testDocRef, testData);
    console.log('✅ Test document saved with fixed ID');
    
    // 2. 저장 직후 읽기 테스트
    const readBack = await getDoc(testDocRef);
    if (readBack.exists()) {
      console.log('✅ Test document read back successfully:', readBack.data());
    } else {
      console.error('❌ Test document not found after save!');
    }
    
    // 3. 자동 ID로 문서 저장 테스트
    const testCollectionRef = collection(db, 'test');
    const autoDocRef = await addDoc(testCollectionRef, {
      ...testData,
      type: 'auto-id'
    });
    console.log('✅ Auto-ID document saved:', autoDocRef.id);
    
    // 4. 자동 ID 문서 읽기 테스트
    const autoReadBack = await getDoc(autoDocRef);
    if (autoReadBack.exists()) {
      console.log('✅ Auto-ID document read back successfully:', autoReadBack.data());
    } else {
      console.error('❌ Auto-ID document not found after save!');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Firestore test failed:', error);
    return false;
  }
};

// 사용자 컬렉션 직접 테스트
export const testUserCollection = async () => {
  try {
    console.log('👤 Testing user collection write...');
    
    const testUser = {
      email: 'test@example.com',
      name: 'Test User',
      provider: 'test',
      profileImage: '',
      isAdmin: false,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      lastLogin: Timestamp.now(),
      loginCount: 1
    };
    
    const userDocRef = doc(db, 'users', 'test-user-123');
    await setDoc(userDocRef, testUser);
    console.log('✅ Test user document saved');
    
    const userReadBack = await getDoc(userDocRef);
    if (userReadBack.exists()) {
      console.log('✅ Test user document read back successfully:', userReadBack.data());
    } else {
      console.error('❌ Test user document not found after save!');
    }
    
    return true;
  } catch (error) {
    console.error('❌ User collection test failed:', error);
    return false;
  }
};
