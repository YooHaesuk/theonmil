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
    <section id="stores" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2 
            className={headingClasses.h2 + " text-[#1B1B1B] mb-4"}
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            오프라인 매장 안내
          </motion.h2>
          <motion.p 
            className="font-maruburi text-lg text-[#333333] max-w-2xl mx-auto"
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
              className="bg-[#F5F3EF] rounded-lg overflow-hidden shadow-md"
              variants={fadeIn}
              whileHover={{ y: -5, transition: { duration: 0.3 } }}
            >
              <div className="h-64 overflow-hidden">
                <img src={store.image} alt={store.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <h3 className="font-playfair text-xl font-semibold text-[#1B1B1B] mb-2">{store.name}</h3>
                <p className="font-pretendard text-sm text-gray-600 mb-4">{store.address}</p>
                <div className="flex items-center mb-4">
                  <i className="fa-solid fa-clock text-[#D4AF37] mr-2"></i>
                  <span className="font-pretendard text-sm text-gray-600">{store.hours}</span>
                </div>
                <div className="flex items-center mb-4">
                  <i className="fa-solid fa-phone text-[#D4AF37] mr-2"></i>
                  <span className="font-pretendard text-sm text-gray-600">{store.phone}</span>
                </div>
                <a 
                  href={`https://maps.google.com/search?q=${encodeURIComponent(store.address)}`}
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-block text-[#D4AF37] hover:text-[#1B1B1B] transition-colors duration-300"
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
          <Link href="/stores" className={buttonClasses.secondary}>
            모든 매장 보기
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default StoresSection;
