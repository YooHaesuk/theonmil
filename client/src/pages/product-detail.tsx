import React, { useState, useEffect } from 'react';
import { useRoute, Link } from 'wouter';
import { motion } from 'framer-motion';
import { pageTransition, fadeIn, slideInFromBottom } from '@/lib/animations';
import { formatPrice } from '@/lib/products';
import { headingClasses, buttonClasses } from '@/lib/fonts';
import ProductCard from '@/components/products/product-card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import HtmlContentRenderer from '@/components/ui/html-content-renderer';

const ProductDetail = () => {
  const [, params] = useRoute('/products/:id');
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const productId = (params as any)?.id || '';

  // Fetch product and related products from Firestore directly
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        console.log('📦 상품 상세 정보 가져오는 중...', productId);

        // API를 통해 상품 목록 가져오기
        const response = await fetch('/api/products');
        if (!response.ok) throw new Error('Failed to fetch products');
        const allProducts = await response.json();

        // Find the specific product
        const foundProduct = allProducts.find((p: any) => p.id.toString() === productId);
        setProduct(foundProduct);

        // Get related products (same category, excluding current product)
        if (foundProduct) {
          const related = allProducts
            .filter((p: any) => p.category === foundProduct.category && p.id !== foundProduct.id)
            .slice(0, 3);
          setRelatedProducts(related);
        }

        console.log('✅ 상품 상세 정보 가져오기 성공:', foundProduct ? '찾음' : '없음');
      } catch (error) {
        console.error('❌ 상품 상세 정보 가져오기 오류:', error);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProductData();
    }
  }, [productId]);

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

  if (loading) {
    return (
      <div className="min-h-screen pt-40 pb-20 flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">상품 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-40 pb-20 flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className={headingClasses.h2 + " text-foreground font-montserrat"}>제품을 찾을 수 없습니다</h1>
          <p className="mt-4 mb-6 text-muted-foreground font-pretendard">요청하신 제품이 존재하지 않거나 삭제되었을 수 있습니다.</p>
          <Link href="/products" className={buttonClasses.primary}>
            제품 목록으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  // 상품 이미지 갤러리 구성 (대표 이미지 + 상품 이미지들)
  const productImages = [
    product.image, // 대표 이미지
    ...(product.images || []) // 상품 이미지들 (없으면 빈 배열)
  ].filter(Boolean); // null/undefined 제거

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      className="min-h-screen pt-40 pb-20 bg-background"
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Product Images */}
          <motion.div variants={fadeIn} className="lg:w-1/2">
            <div className="relative h-96 md:h-[500px] rounded-lg overflow-hidden mb-4 border border-border bg-secondary/10">
              <img
                src={productImages[selectedImageIndex]}
                alt={product.nameKorean}
                className="w-full h-full object-contain"
              />
              {product.isBestseller && (
                <span className="absolute top-4 left-4 bg-gradient-to-r from-primary to-accent text-white text-xs font-bold uppercase px-3 py-1 rounded-full">
                  베스트셀러
                </span>
              )}
              {product.isNew && (
                <span className="absolute top-4 left-4 bg-gradient-to-r from-primary to-accent text-white text-xs font-bold uppercase px-3 py-1 rounded-full">
                  신제품
                </span>
              )}
              {product.isPopular && (
                <span className="absolute top-4 left-4 bg-gradient-to-r from-primary to-accent text-white text-xs font-bold uppercase px-3 py-1 rounded-full">
                  인기
                </span>
              )}
            </div>
            <div className="flex gap-3">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`w-24 h-24 rounded-md overflow-hidden border bg-secondary/10 ${selectedImageIndex === index ? 'border-primary' : 'border-border'}`}
                >
                  <img
                    src={image}
                    alt={`${product.nameKorean} 이미지 ${index + 1}`}
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Product Details */}
          <motion.div variants={slideInFromBottom} className="lg:w-1/2">
            <h1 className={headingClasses.h2 + " text-foreground mb-2 font-montserrat"}>
              {product.nameKorean}
            </h1>
            <p className="font-montserrat text-lg mb-6 text-muted-foreground">
              {product.name}
            </p>
            <p className="font-pretendard text-lg mb-6 text-muted-foreground">
              {product.description}
            </p>
            <p className="font-montserrat text-2xl font-bold text-foreground mb-6">
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
              <h3 className="font-montserrat font-semibold mb-2 text-foreground">수량</h3>
              <div className="flex items-center">
                <button
                  onClick={handleDecreaseQuantity}
                  className="w-10 h-10 rounded-md bg-secondary border border-border text-foreground flex items-center justify-center"
                >
                  <i className="fa-solid fa-minus"></i>
                </button>
                <span className="w-16 text-center font-montserrat text-foreground">{quantity}</span>
                <button
                  onClick={handleIncreaseQuantity}
                  className="w-10 h-10 rounded-md bg-secondary border border-border text-foreground flex items-center justify-center"
                >
                  <i className="fa-solid fa-plus"></i>
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button
                onClick={handleAddToCart}
                className={buttonClasses.primary + " flex-1 flex items-center justify-center"}
              >
                <i className="fa-solid fa-shopping-bag mr-2"></i>
                장바구니에 추가
              </button>
              <button className="px-6 py-3 rounded-full bg-secondary border border-border text-foreground hover:bg-muted/10 transition-colors flex-1 flex items-center justify-center">
                <i className="fa-solid fa-heart mr-2"></i>
                찜하기
              </button>
            </div>

            <Separator className="my-8 bg-border" />

            <div>
              <div className="flex items-center mb-4">
                <i className="fa-solid fa-truck text-primary mr-3"></i>
                <span className="font-pretendard text-muted-foreground">오늘 주문 시 <strong className="text-foreground">이틀 후</strong> 출고됩니다.</span>
              </div>
              <div className="flex items-center">
                <i className="fa-solid fa-shield-halved text-primary mr-3"></i>
                <span className="font-pretendard text-muted-foreground">신선 식품으로 <strong className="text-foreground">교환 및 환불</strong>이 제한될 수 있습니다.</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* 📄 상세페이지 콘텐츠 - 리치 에디터 */}
        {(product.detailContent || product.detailImage) && (
          <motion.div variants={slideInFromBottom} className="mt-16">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">상품 상세 정보</h2>
              <p className="text-muted-foreground">더 자세한 상품 정보를 확인해보세요</p>
            </div>

            {/* 박스 스타일 제거하여 전체 너비로 표시 */}
            <div className="w-full">
              {/* 🆕 리치 에디터 콘텐츠 우선 표시 */}
              {product.detailContent ? (
                <HtmlContentRenderer
                  content={product.detailContent}
                  className="prose prose-invert max-w-none"
                />
              ) : product.detailImage ? (
                /* 🔄 기존 이미지 호환성 (마이그레이션용) */
                <img
                  src={product.detailImage.includes('cloudinary.com')
                    ? product.detailImage.replace('/upload/', '/upload/q_auto:best,f_auto,w_auto,dpr_3.0,c_scale/')
                    : product.detailImage
                  }
                  alt={`${product.nameKorean} 상세 정보`}
                  className="w-full h-auto block mx-auto rounded-lg"
                  style={{
                    maxWidth: '100%',
                    height: 'auto',
                    display: 'block',
                    margin: '0 auto',
                    imageRendering: 'crisp-edges',
                    minHeight: '400px'
                  }}
                  loading="lazy"
                  onError={(e) => {
                    console.error('이미지 로드 실패:', product.detailImage);
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : null}
            </div>
          </motion.div>
        )}

        {/* Related Products */}
        <div className="mt-16">
          <h2 className={headingClasses.h3 + " text-foreground mb-8 font-montserrat"}>
            함께 구매하시면 좋은 제품
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedProducts.map(product => (
              <div key={product.id}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductDetail;
