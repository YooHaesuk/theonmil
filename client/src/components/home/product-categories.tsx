import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { headingClasses } from '@/lib/fonts';
import { staggerContainer, fadeIn } from '@/lib/animations';

// 로컬 이미지 임포트
import regularProductImg from '@/assets/images/products/Classical Croissant.webp';
import customProductImg from '@/assets/images/products/a special chocolate cake.webp';
import giftProductImg from '@/assets/images/products/anniversary gift set.webp';

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
    description: '처음 만나는 분들께 가장 추천하는 더 온밀의 시그니처 제품',
    image: regularProductImg
  },
  {
    id: 'custom',
    name: '주문 제작 제품',
    description: '생일·기념일에 맞춰 주문 후 제작되는 맞춤 케이크 & 디저트',
    image: customProductImg
  },
  {
    id: 'gift',
    name: '기념일 이벤트 제품',
    description: '선물 고민 없이 바로 선택하는 기념일 & 이벤트 전용 세트',
    image: giftProductImg
  }
];

const ProductCategories = () => {
  return (
    <section id="categories" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2
            className="text-4xl font-bold font-montserrat mb-4 text-foreground"
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            제품 <span className="bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text">카테고리</span>
          </motion.h2>
          <motion.p
            className="font-pretendard text-lg text-muted-foreground max-w-2xl mx-auto"
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            어떤 빵을 고를지 고민된다면,<br className="hidden sm:block" />
            카테고리별로 가장 잘 어울리는 제품을 만나보세요.
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
              className="bg-secondary rounded-lg overflow-hidden shadow-md group border border-border"
              variants={fadeIn}
              whileHover={{ y: -5, transition: { duration: 0.3 } }}
            >
              <div className="h-64 overflow-hidden relative">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Link
                    href={`/products?category=${category.id}`}
                    className="bg-gradient-to-r from-primary to-accent text-white py-2 px-6 rounded-full font-montserrat font-medium shadow-md hover:shadow-lg hover:shadow-primary/30 hover:scale-105 transition-all duration-300 transform -translate-y-4 group-hover:translate-y-0"
                  >
                    둘러보기
                  </Link>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-montserrat text-xl font-semibold text-foreground mb-2">{category.name}</h3>
                <p className="font-pretendard text-sm text-muted-foreground">{category.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ProductCategories;
