import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { getFeaturedProducts } from '@/lib/products';
import { headingClasses, buttonClasses } from '@/lib/fonts';
import ProductCard from '@/components/products/product-card';
import { staggerContainer } from '@/lib/animations';

const FeaturedProducts = () => {
  const featuredProducts = getFeaturedProducts();

  return (
    <section id="featured" className="py-20 bg-[#F5F3EF]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2 
            className={headingClasses.h2 + " text-[#1B1B1B] mb-4"}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            대표 제품
          </motion.h2>
          <motion.p 
            className="font-maruburi text-lg text-[#333333] max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            지금 가장 사랑받는 빵답게의 대표 제품들을 만나보세요.
          </motion.p>
        </div>
        
        {/* Featured products grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </motion.div>
        
        {/* View all button */}
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Link href="/products" className={buttonClasses.dark}>
            모든 제품 보기
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
