import { motion } from 'framer-motion';
import { Product } from '@/lib/products';
import ProductCard from './product-card';
import { fadeIn } from '@/lib/animations';

interface ProductGridProps {
  products: Product[];
}

const ProductGrid = ({ products }: ProductGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.length > 0 ? (
        products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))
      ) : (
        <motion.div 
          variants={fadeIn}
          className="col-span-full text-center py-12"
        >
          <div className="text-6xl mb-6 bg-gradient-to-r from-[#A78BFA] to-[#EC4899] text-transparent bg-clip-text">
            <i className="fa-solid fa-search"></i>
          </div>
          <p className="text-xl mb-4 font-montserrat text-white">검색 결과가 없습니다</p>
          <p className="text-gray-400 font-pretendard">
            다른 검색어나 필터를 사용해 보세요
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default ProductGrid;
