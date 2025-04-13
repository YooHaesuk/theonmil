import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { pageTransition, staggerContainer } from '@/lib/animations';
import { products, ProductCategory, categoryDisplayNames } from '@/lib/products';
import ProductFilter from '@/components/products/product-filter';
import ProductGrid from '@/components/products/product-grid';
import { headingClasses } from '@/lib/fonts';

const Products = () => {
  const [location] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | ''>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(products);

  // Parse URL query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.split('?')[1]);
    const category = params.get('category') as ProductCategory | null;
    if (category && ['regular', 'custom', 'gift'].includes(category)) {
      setSelectedCategory(category);
    } else {
      setSelectedCategory('');
    }
  }, [location]);

  // Filter products based on category and search query
  useEffect(() => {
    let filtered = [...products];
    
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(query) || 
        product.nameKorean.toLowerCase().includes(query) || 
        product.description.toLowerCase().includes(query) ||
        product.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    setFilteredProducts(filtered);
  }, [selectedCategory, searchQuery]);

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      className="min-h-screen pt-24 pb-20"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className={headingClasses.h2 + " text-[#1B1B1B] mb-4"}>
            {selectedCategory ? categoryDisplayNames[selectedCategory] : '모든 제품'}
          </h1>
          <p className="font-maruburi text-lg text-[#333333] max-w-2xl mx-auto">
            {selectedCategory === 'regular' && '언제나 만나볼 수 있는 빵답게의 시그니처 제품들입니다.'}
            {selectedCategory === 'custom' && '특별한 날을 위한 맞춤형 케이크와 디저트를 제공합니다.'}
            {selectedCategory === 'gift' && '소중한 분께 감사의 마음을 전할 수 있는 선물 세트입니다.'}
            {!selectedCategory && '빵답게의 모든 제품을 둘러보세요. 품질과 맛으로 정직하게 다가갑니다.'}
          </p>
        </div>
        
        <ProductFilter 
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        
        <motion.div variants={staggerContainer} initial="hidden" animate="visible">
          <ProductGrid products={filteredProducts} />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Products;
