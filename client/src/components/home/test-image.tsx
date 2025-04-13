import React from 'react';

// 직접 이미지 경로 테스트
export default function TestImage() {
  return (
    <div className="fixed top-0 left-0 z-50 bg-white p-4">
      <p className="text-black">이미지 테스트</p>
      <img 
        src="/client/src/assets/images/bakery/croissant-transparent.png" 
        alt="Test 1 - absolute" 
        className="w-20 h-20 object-contain mb-2"
      />
      <img 
        src="client/src/assets/images/bakery/croissant-transparent.png" 
        alt="Test 2 - relative" 
        className="w-20 h-20 object-contain mb-2"
      />
      <img 
        src="../../assets/images/bakery/croissant-transparent.png" 
        alt="Test 3 - relative dots" 
        className="w-20 h-20 object-contain mb-2"
      />
      <img 
        src="@/assets/images/bakery/croissant-transparent.png" 
        alt="Test 4 - alias" 
        className="w-20 h-20 object-contain mb-2"
      />
    </div>
  );
}