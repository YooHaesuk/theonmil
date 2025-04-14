import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { Product, formatPrice } from '@/lib/products';
import { fadeIn } from '@/lib/animations';
import { useToast } from '@/hooks/use-toast';
import ImageLoader from '@/components/ui/image-loader';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { toast } = useToast();
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    toast({
      title: "장바구니에 추가되었습니다",
      description: `${product.nameKorean}이(가) 장바구니에 추가되었습니다.`,
    });
  };
  
  return (
    <motion.div
      className="product-card bg-[#111111] rounded-lg overflow-hidden shadow-md hover:shadow-lg border border-[#222222] transition-all duration-300"
      variants={fadeIn}
      whileHover={{ y: -5, transition: { duration: 0.3 } }}
    >
      <Link href={`/products/${product.id}`}>
        <div className="relative h-64 overflow-hidden">
          <ImageLoader 
            src={product.image} 
            alt={product.nameKorean} 
            className="w-full h-full"
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
        <div className="p-6">
          <h3 className="font-montserrat text-xl font-semibold text-white mb-2">{product.nameKorean}</h3>
          <p className="font-pretendard text-sm text-gray-400 mb-4">{product.description}</p>
          <div className="flex justify-between items-center">
            <span className="font-montserrat font-semibold text-white">{formatPrice(product.price)}</span>
            <button 
              className="w-10 h-10 rounded-full bg-gradient-to-r from-[#A78BFA] to-[#EC4899] flex items-center justify-center text-white hover:shadow-lg hover:shadow-purple-500/20 transition-all"
              onClick={handleAddToCart}
              aria-label="장바구니에 추가"
            >
              <i className="fa-solid fa-cart-plus text-lg"></i>
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
