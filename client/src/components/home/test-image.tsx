import croissantImage from '../../assets/images/bakery/croissant-transparent.png';
import baguetteImage from '../../assets/images/bakery/baguette-transparent.png';

// 이미지 import 테스트
export default function TestImage() {
  return (
    <div className="fixed top-0 left-0 z-50 bg-white p-4">
      <p className="text-black">이미지 테스트</p>
      <img 
        src={croissantImage} 
        alt="Croissant" 
        className="w-20 h-20 object-contain mb-2"
      />
      <img 
        src={baguetteImage} 
        alt="Baguette" 
        className="w-20 h-20 object-contain mb-2"
      />
    </div>
  );
}