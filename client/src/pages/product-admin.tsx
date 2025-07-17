import { motion } from 'framer-motion';
import { pageTransition, fadeIn } from '@/lib/animations';
import { headingClasses } from '@/lib/fonts';
import ProductManagement from '@/components/admin/product-management';

const ProductAdminPage = () => {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      className="min-h-screen bg-[#0A0A0A] text-white pt-20"
    >
      <div className="container mx-auto px-4 py-8">
        <motion.div variants={fadeIn} className="mb-8">
          <h1 className={`${headingClasses} text-4xl mb-4`}>
            상품 <span className="bg-gradient-to-r from-[#A78BFA] to-[#EC4899] text-transparent bg-clip-text">관리</span>
          </h1>
          <p className="text-gray-400">더 온밀 상품 등록 및 관리</p>
        </motion.div>

        <ProductManagement />
      </div>
    </motion.div>
  );
};

export default ProductAdminPage;
