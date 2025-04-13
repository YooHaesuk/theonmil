import { useState } from 'react';
import { useRoute, Link } from 'wouter';
import { motion } from 'framer-motion';
import { pageTransition, fadeIn, slideInFromBottom } from '@/lib/animations';
import { getProductById, formatPrice, getProductsByCategory } from '@/lib/products';
import { headingClasses, buttonClasses } from '@/lib/fonts';
import ProductCard from '@/components/products/product-card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

const ProductDetail = () => {
  const [, params] = useRoute('/products/:id');
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  const productId = params?.id || '';
  const product = getProductById(productId);
  
  // Get related products
  const relatedProducts = product 
    ? getProductsByCategory(product.category).filter(p => p.id !== product.id).slice(0, 3)
    : [];
  
  // Handle quantity change
  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  const handleIncreaseQuantity = () => {
    setQuantity(quantity + 1);
  };
  
  // Add to cart
  const handleAddToCart = () => {
    if (!product) return;
    
    toast({
      title: "장바구니에 추가되었습니다",
      description: `${product.nameKorean} ${quantity}개가 장바구니에 추가되었습니다.`,
    });
  };
  
  if (!product) {
    return (
      <div className="min-h-screen pt-24 pb-20 flex items-center justify-center bg-[#0A0A0A]">
        <div className="text-center">
          <h1 className={headingClasses.h2 + " text-white font-montserrat"}>제품을 찾을 수 없습니다</h1>
          <p className="mt-4 mb-6 text-gray-300 font-pretendard">요청하신 제품이 존재하지 않거나 삭제되었을 수 있습니다.</p>
          <Link href="/products" className="px-6 py-3 rounded-full bg-gradient-to-r from-[#A78BFA] to-[#EC4899] text-white font-medium transition-all hover:opacity-90">
            제품 목록으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }
  
  // Mock images for gallery - in real app these would come from the backend
  const productImages = [
    product.image,
    'https://images.unsplash.com/photo-1555507036-ab1f4038808a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1026&q=80',
    'https://images.unsplash.com/photo-1613278831678-c371b89abf47?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
  ];

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      className="min-h-screen pt-24 pb-20 bg-[#0A0A0A]"
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Product Images */}
          <motion.div variants={fadeIn} className="lg:w-1/2">
            <div className="relative h-96 md:h-[500px] rounded-lg overflow-hidden mb-4 border border-[#222222]">
              <img 
                src={productImages[selectedImageIndex]} 
                alt={product.nameKorean} 
                className="w-full h-full object-cover"
              />
              {product.isBestseller && (
                <span className="absolute top-4 left-4 bg-gradient-to-r from-[#A78BFA] to-[#EC4899] text-white text-xs font-bold uppercase px-3 py-1 rounded-full">
                  베스트셀러
                </span>
              )}
              {product.isNew && (
                <span className="absolute top-4 left-4 bg-gradient-to-r from-[#A78BFA] to-[#EC4899] text-white text-xs font-bold uppercase px-3 py-1 rounded-full">
                  신제품
                </span>
              )}
              {product.isPopular && (
                <span className="absolute top-4 left-4 bg-gradient-to-r from-[#A78BFA] to-[#EC4899] text-white text-xs font-bold uppercase px-3 py-1 rounded-full">
                  인기
                </span>
              )}
            </div>
            <div className="flex gap-3">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`w-24 h-24 rounded-md overflow-hidden border ${selectedImageIndex === index ? 'border-[#A78BFA]' : 'border-[#222222]'}`}
                >
                  <img 
                    src={image} 
                    alt={`${product.nameKorean} 이미지 ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </motion.div>
          
          {/* Product Details */}
          <motion.div variants={slideInFromBottom} className="lg:w-1/2">
            <h1 className={headingClasses.h2 + " text-white mb-2 font-montserrat"}>
              {product.nameKorean}
            </h1>
            <p className="font-montserrat text-lg mb-6 text-gray-300">
              {product.name}
            </p>
            <p className="font-pretendard text-lg mb-6 text-gray-300">
              {product.description}
            </p>
            <p className="font-montserrat text-2xl font-bold text-white mb-6">
              {formatPrice(product.price)}
            </p>
            
            <div className="mb-8">
              <h3 className="font-montserrat font-semibold mb-2 text-white">태그</h3>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, index) => (
                  <span 
                    key={index} 
                    className="bg-[#111111] text-gray-300 border border-[#333333] text-sm px-3 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="mb-8">
              <h3 className="font-montserrat font-semibold mb-2 text-white">수량</h3>
              <div className="flex items-center">
                <button 
                  onClick={handleDecreaseQuantity} 
                  className="w-10 h-10 rounded-md bg-[#111111] border border-[#333333] text-white flex items-center justify-center"
                >
                  <i className="fa-solid fa-minus"></i>
                </button>
                <span className="w-16 text-center font-montserrat text-white">{quantity}</span>
                <button 
                  onClick={handleIncreaseQuantity} 
                  className="w-10 h-10 rounded-md bg-[#111111] border border-[#333333] text-white flex items-center justify-center"
                >
                  <i className="fa-solid fa-plus"></i>
                </button>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button 
                onClick={handleAddToCart} 
                className="px-6 py-3 rounded-full bg-gradient-to-r from-[#A78BFA] to-[#EC4899] text-white font-medium transition-all hover:opacity-90 flex-1 flex items-center justify-center"
              >
                <i className="fa-solid fa-shopping-bag mr-2"></i>
                장바구니에 추가
              </button>
              <button className="px-6 py-3 rounded-full bg-[#111111] border border-[#333333] text-white hover:bg-[#1A1A2A] transition-colors flex-1 flex items-center justify-center">
                <i className="fa-solid fa-heart mr-2"></i>
                찜하기
              </button>
            </div>
            
            <Separator className="my-8 bg-[#333333]" />
            
            <div>
              <div className="flex items-center mb-4">
                <i className="fa-solid fa-truck text-[#A78BFA] mr-3"></i>
                <span className="font-pretendard text-gray-300">오늘 주문 시 <strong className="text-white">이틀 후</strong> 출고됩니다.</span>
              </div>
              <div className="flex items-center">
                <i className="fa-solid fa-shield-halved text-[#A78BFA] mr-3"></i>
                <span className="font-pretendard text-gray-300">신선 식품으로 <strong className="text-white">교환 및 환불</strong>이 제한될 수 있습니다.</span>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Related Products */}
        <div className="mt-16">
          <h2 className={headingClasses.h3 + " text-white mb-8 font-montserrat"}>
            함께 구매하시면 좋은 제품
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductDetail;
