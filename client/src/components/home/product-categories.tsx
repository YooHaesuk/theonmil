import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { headingClasses } from '@/lib/fonts';
import { staggerContainer, fadeIn } from '@/lib/animations';

// Category type definition
interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
}

// Categories data
const categories: Category[] = [
  {
    id: 'regular',
    name: '상시 운영 제품',
    description: '언제나 만나볼 수 있는 빵답게의 시그니처 제품들',
    image: 'https://images.unsplash.com/photo-1608198396039-1d45d29c817e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
  },
  {
    id: 'custom',
    name: '주문 제작 제품',
    description: '특별한 날을 위한 맞춤형 케이크와 디저트',
    image: 'https://images.unsplash.com/photo-1552689486-f6773047d19f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
  },
  {
    id: 'gift',
    name: '기념일 이벤트 제품',
    description: '꽃과 메시지 카드로 특별함을 더한 선물용 세트',
    image: 'https://images.unsplash.com/photo-1583217874534-581393fd5325?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
  }
];

const ProductCategories = () => {
  return (
    <section id="categories" className="py-20 bg-[#F5F3EF]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2 
            className={headingClasses.h2 + " text-[#1B1B1B] mb-4"}
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            제품 카테고리
          </motion.h2>
          <motion.p 
            className="font-maruburi text-lg text-[#333333] max-w-2xl mx-auto"
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            빵답게가 만드는 다양한 종류의 빵을 카테고리별로 살펴보세요.
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
              className="bg-white rounded-lg overflow-hidden shadow-md group"
              variants={fadeIn}
              whileHover={{ y: -5, transition: { duration: 0.3 } }}
            >
              <div className="h-64 overflow-hidden relative">
                <img 
                  src={category.image} 
                  alt={category.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-[#1B1B1B] bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Link 
                    href={`/products?category=${category.id}`}
                    className="bg-white text-[#1B1B1B] py-2 px-6 rounded-md font-montserrat font-medium transform -translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                  >
                    둘러보기
                  </Link>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-playfair text-xl font-semibold text-[#1B1B1B] mb-2">{category.name}</h3>
                <p className="font-pretendard text-sm text-gray-600">{category.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ProductCategories;
