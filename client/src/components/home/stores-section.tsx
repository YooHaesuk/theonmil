import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { headingClasses, buttonClasses } from '@/lib/fonts';
import { staggerContainer, fadeIn } from '@/lib/animations';

// Store type definition
interface Store {
  id: string;
  name: string;
  address: string;
  hours: string;
  phone: string;
  image: string;
}

// Stores data (only show 2 for homepage)
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
    image: 'https://images.unsplash.com/photo-1591688515877-f6d04f417608?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
  }
];

const StoresSection = () => {
  return (
    <section id="stores" className="py-20 bg-[#0F0F1A]">
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
            className="font-maruburi text-lg text-gray-300 max-w-2xl mx-auto"
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            빵답게를 직접 보고 맛볼 수 있는 오프라인 매장을 소개합니다.
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
