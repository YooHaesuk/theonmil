import { useState } from 'react';
import { motion } from 'framer-motion';
import { pageTransition, fadeIn, staggerContainer } from '@/lib/animations';
import { headingClasses } from '@/lib/fonts';

// Store type definition
interface Store {
  id: string;
  name: string;
  address: string;
  hours: string;
  phone: string;
  image: string;
}

// Sample store data
const stores: Store[] = [
  {
    id: 'gangnam',
    name: '빵답게 강남점',
    address: '서울특별시 강남구 테헤란로 123 1층',
    hours: '오전 8:00 - 오후 9:00 (매일)',
    phone: '02-123-4567',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
  },
  {
    id: 'seongsu',
    name: '빵답게 성수점',
    address: '서울특별시 성동구 성수이로 45 1층',
    hours: '오전 9:00 - 오후 8:00 (월-토)',
    phone: '02-456-7890',
    image: 'https://images.unsplash.com/photo-1573125048085-da970a971225?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
  },
  {
    id: 'hongdae',
    name: '빵답게 홍대점',
    address: '서울특별시 마포구 홍대로 123 1층',
    hours: '오전 10:00 - 오후 10:00 (매일)',
    phone: '02-789-0123',
    image: 'https://images.unsplash.com/photo-1564844536308-50b114a1d946?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1738&q=80'
  },
  {
    id: 'jamsil',
    name: '빵답게 잠실점',
    address: '서울특별시 송파구 올림픽로 256 1층',
    hours: '오전 8:00 - 오후 9:00 (매일)',
    phone: '02-345-6789',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1147&q=80'
  }
];

const Stores = () => {
  const [selectedRegion, setSelectedRegion] = useState<string>('전체');
  
  // Regions for filtering
  const regions = ['전체', '서울', '경기', '인천', '부산'];
  
  // Filter stores based on selected region
  const filteredStores = selectedRegion === '전체' 
    ? stores 
    : stores.filter(store => store.address.includes(selectedRegion));
  
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      className="min-h-screen pt-24 pb-20 bg-[#0A0A0A]"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h1 variants={fadeIn} className="text-4xl font-bold font-montserrat mb-4 text-white">
            <span className="mr-1">오프라인</span> <span className="bg-gradient-to-r from-[#A78BFA] to-[#EC4899] text-transparent bg-clip-text">매장 안내</span>
          </motion.h1>
          <motion.p variants={fadeIn} className="font-pretendard text-lg max-w-3xl mx-auto text-gray-300">
            빵답게를 직접 보고 맛볼 수 있는 오프라인 매장을 소개합니다.
          </motion.p>
        </div>
        
        {/* Region Filter */}
        <motion.div variants={fadeIn} className="flex justify-center mb-12">
          <div className="inline-flex bg-[#111111] rounded-full p-1 border border-[#222222]">
            {regions.map(region => (
              <button
                key={region}
                onClick={() => setSelectedRegion(region)}
                className={`px-6 py-2 rounded-full font-montserrat text-sm transition-colors ${
                  selectedRegion === region 
                    ? 'bg-gradient-to-r from-[#A78BFA] to-[#EC4899] text-white' 
                    : 'text-white hover:bg-[#1A1A2A]'
                }`}
              >
                {region}
              </button>
            ))}
          </div>
        </motion.div>
        
        {/* Stores Grid */}
        <motion.div 
          variants={staggerContainer} 
          initial="hidden" 
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {filteredStores.map(store => (
            <motion.div
              key={store.id}
              variants={fadeIn}
              className="bg-[#111111] rounded-lg overflow-hidden shadow-md border border-[#222222]"
            >
              <div className="h-64 overflow-hidden">
                <img src={store.image} alt={store.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <h3 className="font-montserrat text-xl font-semibold text-white mb-2">{store.name}</h3>
                <p className="font-pretendard text-sm text-gray-400 mb-4">{store.address}</p>
                <div className="flex items-center mb-4">
                  <i className="fa-solid fa-clock text-[#A78BFA] mr-2"></i>
                  <span className="font-pretendard text-sm text-gray-300">{store.hours}</span>
                </div>
                <div className="flex items-center mb-4">
                  <i className="fa-solid fa-phone text-[#A78BFA] mr-2"></i>
                  <span className="font-pretendard text-sm text-gray-300">{store.phone}</span>
                </div>
                <a 
                  href={`https://maps.google.com/search?q=${encodeURIComponent(store.address)}`}
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-block bg-gradient-to-r from-[#A78BFA] to-[#EC4899] text-transparent bg-clip-text hover:opacity-80 transition-all"
                >
                  <i className="fa-solid fa-map-marker-alt mr-1"></i> 지도 보기
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Store Map */}
        <motion.div variants={fadeIn} className="mt-16">
          <h2 className="text-3xl font-bold font-montserrat mb-8 text-center text-white">
            매장 <span className="bg-gradient-to-r from-[#A78BFA] to-[#EC4899] text-transparent bg-clip-text">지도</span>
          </h2>
          <div className="bg-[#111111] border border-[#222222] h-96 rounded-lg flex items-center justify-center">
            <p className="text-gray-400 font-pretendard">
              <i className="fa-solid fa-map-location-dot text-3xl mb-4 block bg-gradient-to-r from-[#A78BFA] to-[#EC4899] text-transparent bg-clip-text"></i>
              지도 API가 연동되어 매장 위치를 표시합니다
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Stores;
