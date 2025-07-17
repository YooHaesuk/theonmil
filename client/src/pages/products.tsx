import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { pageTransition, staggerContainer } from '@/lib/animations';
import { ProductCategory, categoryDisplayNames } from '@/lib/products';
import ProductFilter from '@/components/products/product-filter';
import ProductGrid from '@/components/products/product-grid';
import { headingClasses } from '@/lib/fonts';

const Products = () => {
  const [location] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | ''>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from Firestore directly
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('📦 상품 목록 가져오는 중...');
        const { getAllProducts } = await import('@/lib/firestore');
        const data = await getAllProducts();

        // Firestore 데이터를 클라이언트 형식으로 변환
        const formattedProducts = data.map(product => ({
          ...product,
          createdAt: product.createdAt?.toDate?.()?.toISOString() || product.createdAt,
          updatedAt: product.updatedAt?.toDate?.()?.toISOString() || product.updatedAt
        }));

        console.log('✅ 상품 목록 가져오기 성공:', formattedProducts.length, '개');
        setProducts(formattedProducts);
        setFilteredProducts(formattedProducts);
      } catch (error) {
        console.error('❌ 상품 목록 가져오기 오류:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

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
  }, [selectedCategory, searchQuery, products]);

  if (loading) {
    return (
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageTransition}
        className="min-h-screen pt-24 pb-20 bg-[#0A0A0A] flex items-center justify-center"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#A78BFA] mx-auto mb-4"></div>
          <p className="text-gray-400">상품을 불러오는 중...</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      className="min-h-screen pt-24 pb-20 bg-[#0A0A0A]"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold font-montserrat mb-4">
            <span className="bg-gradient-to-r from-[#A78BFA] to-[#EC4899] text-transparent bg-clip-text">{selectedCategory ? categoryDisplayNames[selectedCategory] : '모든 제품'}</span>
          </h1>
          <p className="font-pretendard text-lg text-gray-300 max-w-2xl mx-auto">
            {selectedCategory === 'regular' && '언제나 만나볼 수 있는 더 온밀의 시그니처 제품들입니다.'}
            {selectedCategory === 'custom' && '특별한 날을 위한 맞춤형 케이크와 디저트를 제공합니다.'}
            {selectedCategory === 'gift' && '소중한 분께 감사의 마음을 전할 수 있는 선물 세트입니다.'}
            {!selectedCategory && '더 온밀의 모든 제품을 둘러보세요. 품질과 맛으로 정직하게 다가갑니다.'}
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
