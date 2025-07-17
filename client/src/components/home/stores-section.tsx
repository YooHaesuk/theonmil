import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { headingClasses, buttonClasses } from '@/lib/fonts';
import { staggerContainer, fadeIn } from '@/lib/animations';

// 로컬 이미지 임포트
import gangnamImg from '@/assets/images/stores/gangnam-store.png';
import seongsuImg from '@/assets/images/stores/seongsu-store.png';

// Store type definition
interface Store {
  id: string;
  name: string;
  address: string;
  hours: string;
  phone: string;
  image: any; // 이미지 타입을 any로 변경
}

// Stores data (only show 2 for homepage)
const stores: Store[] = [
  {
    id: 'gangnam',
    name: '더 온밀 강남점',
    address: '서울특별시 강남구 테헤란로 123 1층',
    hours: '오전 8:00 - 오후 9:00 (매일)',
    phone: '02-123-4567',
    image: gangnamImg
  },
  {
    id: 'seongsu',
    name: '더 온밀 성수점',
    address: '서울특별시 성동구 성수이로 45 1층',
    hours: '오전 9:00 - 오후 8:00 (월-토)',
    phone: '02-456-7890',
    image: seongsuImg
  }
];

const StoresSection = () => {
  return (
    <section id="stores" className="py-20 bg-[#0A0A0A]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2 
            className="text-4xl font-bold font-montserrat mb-4 text-white"
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            오프라인 <span className="bg-gradient-to-r from-[#A78BFA] to-[#EC4899] text-transparent bg-clip-text">매장 안내</span>
          </motion.h2>
          <motion.p 
            className="font-pretendard text-lg text-gray-300 max-w-2xl mx-auto"
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            더 온밀을 직접 보고 맛볼 수 있는 오프라인 매장을 소개합니다.
          </motion.p>
        </div>
        
        {/* Stores grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {stores.map((store) => (
            <motion.div
              key={store.id}
              className="bg-[#111111] rounded-lg overflow-hidden shadow-md border border-[#222222]"
              variants={fadeIn}
              whileHover={{ y: -5, transition: { duration: 0.3 } }}
            >
              <div className="h-64 overflow-hidden relative">
                <img src={store.image} alt={store.name} className="w-full h-full object-cover" />
                <div className="absolute bottom-0 left-0 p-4">
                  <h3 className="font-montserrat text-xl font-semibold text-white mb-1">{store.name}</h3>
                  <p className="font-pretendard text-sm text-gray-300">{store.address}</p>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#A78BFA] to-[#EC4899] flex items-center justify-center text-white mr-3">
                    <i className="fa-solid fa-clock"></i>
                  </div>
                  <span className="font-pretendard text-sm text-gray-300">{store.hours}</span>
                </div>
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#A78BFA] to-[#EC4899] flex items-center justify-center text-white mr-3">
                    <i className="fa-solid fa-phone"></i>
                  </div>
                  <span className="font-pretendard text-sm text-gray-300">{store.phone}</span>
                </div>
                <a 
                  href={`https://maps.google.com/search?q=${encodeURIComponent(store.address)}`}
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-block bg-gradient-to-r from-[#A78BFA] to-[#EC4899] text-transparent bg-clip-text hover:opacity-80 transition-opacity duration-300"
                >
                  <i className="fa-solid fa-map-marker-alt mr-1"></i> 지도 보기
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        {/* All stores link */}
        <motion.div 
          className="text-center mt-12"
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
        >
          <Link 
            href="/stores" 
            className="px-6 py-3 rounded-full bg-[#11111A] border border-[#ffffff20] text-white text-sm font-medium hover:bg-[#1A1A2A] transition-all duration-300"
          >
            모든 매장 보기
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default StoresSection;
