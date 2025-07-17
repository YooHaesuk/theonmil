import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { headingClasses } from '@/lib/fonts';
import { staggerContainer, fadeIn } from '@/lib/animations';

// 로컬 이미지 임포트
import regularProductImg from '@/assets/images/products/Classical Croissant.png';
import customProductImg from '@/assets/images/products/a special chocolate cake.png';
import giftProductImg from '@/assets/images/products/anniversary gift set.png';

// Category type definition
interface Category {
  id: string;
  name: string;
  description: string;
  image: any; // 이미지 타입을 any로 변경
}

// Categories data
const categories: Category[] = [
  {
    id: 'regular',
    name: '상시 운영 제품',
    description: '언제나 만나볼 수 있는 더 온밀의 시그니처 제품들',
    image: regularProductImg
  },
  {
    id: 'custom',
    name: '주문 제작 제품',
    description: '특별한 날을 위한 맞춤형 케이크와 디저트',
    image: customProductImg
  },
  {
    id: 'gift',
    name: '기념일 이벤트 제품',
    description: '꽃과 메시지 카드로 특별함을 더한 선물용 세트',
    image: giftProductImg
  }
];

const ProductCategories = () => {
  return (
    <section id="categories" className="py-20 bg-[#0F0F1A]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2 
            className="text-4xl font-bold font-montserrat mb-4 text-white"
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            제품 <span className="bg-gradient-to-r from-[#A78BFA] to-[#EC4899] text-transparent bg-clip-text">카테고리</span>
          </motion.h2>
          <motion.p 
            className="font-pretendard text-lg text-gray-300 max-w-2xl mx-auto"
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            더 온밀이 만드는 다양한 종류의 빵을 카테고리별로 살펴보세요.
          </motion.p>
        </div>
        
        {/* Categories grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {categories.map((category) => (
            <motion.div
              key={category.id}
              className="bg-[#111111] rounded-lg overflow-hidden shadow-md group border border-[#222222]"
              variants={fadeIn}
              whileHover={{ y: -5, transition: { duration: 0.3 } }}
            >
              <div className="h-64 overflow-hidden relative">
                <img 
                  src={category.image} 
                  alt={category.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Link 
                    href={`/products?category=${category.id}`}
                    className="bg-gradient-to-r from-[#A78BFA] to-[#EC4899] text-white py-2 px-6 rounded-full font-montserrat font-medium transform -translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                  >
                    둘러보기
                  </Link>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-montserrat text-xl font-semibold text-white mb-2">{category.name}</h3>
                <p className="font-pretendard text-sm text-gray-400">{category.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ProductCategories;
