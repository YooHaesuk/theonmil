import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { getFeaturedProducts } from '@/lib/products';
import { headingClasses, buttonClasses } from '@/lib/fonts';
import ProductCard from '@/components/products/product-card';
import { staggerContainer } from '@/lib/animations';

const FeaturedProducts = () => {
  const featuredProducts = getFeaturedProducts();

  return (
    <section id="featured" className="py-20 bg-[#0F0F1A]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2 
            className="text-4xl font-bold font-montserrat mb-4 text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            대표 <span className="bg-gradient-to-r from-[#A78BFA] to-[#EC4899] text-transparent bg-clip-text">제품</span>
          </motion.h2>
          <motion.p 
            className="font-pretendard text-lg text-gray-300 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            지금 가장 사랑받는 더 온밀의 대표 제품들을 만나보세요.
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
          <Link 
            href="/products" 
            className="px-6 py-3 rounded-full bg-gradient-to-r from-[#A78BFA] to-[#EC4899] text-white text-sm font-medium hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
          >
            모든 제품 보기
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
